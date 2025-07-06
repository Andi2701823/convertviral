import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getFileFormatByExtension, getCompatibleTargetFormats, FileCategory } from '@/lib/fileTypes';
import { convertFile, ConversionJob, ConversionStatus } from '@/lib/conversion';
import { setCache, getCache } from '@/lib/redis';
import { validateFileSize, validateFileType } from '@/lib/upload';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

// Size limits in bytes
const FREE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
const PREMIUM_SIZE_LIMIT = 500 * 1024 * 1024; // 500MB

// Allowed MIME types by category
const ALLOWED_MIMETYPES = {
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/heic',
    'image/raw',
  ],
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'audio/x-m4a',
  ],
  video: [
    'video/mp4',
    'video/x-msvideo',
    'video/quicktime',
    'video/webm',
    'video/x-matroska',
  ],
};

// Main conversion endpoint
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Use type assertion with FormData to access get method
    const file = (formData as any).get('file') as File;
    const targetFormat = (formData as any).get('targetFormat') as string;
    const userId = (formData as any).get('userId') as string | undefined;
    
    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Extract file information
    const sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';
    const fileFormat = getFileFormatByExtension(sourceFormat);
    
    // Validate file format
    if (!fileFormat) {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Validate file type
const allowedTypes = ALLOWED_MIMETYPES[fileFormat.category.id as keyof typeof ALLOWED_MIMETYPES] || [];
try {
  await validateFileType(file.type, sourceFormat);
} catch (error) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size only if file size limits are enabled
    if (FEATURE_FLAGS.fileSizeLimits) {
      const isPremium = !!userId;
      try {
        await validateFileSize(file.size, isPremium);
      } catch (error) {
        return NextResponse.json(
          { 
            error: 'File size exceeds limit', 
            limit: userId ? '500MB' : '50MB',
            upgrade: FEATURE_FLAGS.upgradePrompts ? !userId : false
          },
          { status: 400 }
        );
      }
    }
    // When file size limits are disabled, all files are allowed

    // Validate target format
    const compatibleFormats = getCompatibleTargetFormats(sourceFormat);
    const isValidTarget = compatibleFormats.some(format => format.extension === targetFormat);
    
    if (!isValidTarget) {
      return NextResponse.json(
        { 
          error: 'Invalid target format', 
          compatibleFormats: compatibleFormats.map(f => f.extension)
        },
        { status: 400 }
      );
    }

    // Generate a unique job ID
    const jobId = uuidv4();
    
    // Create a conversion job
const conversionJob: Partial<ConversionJob> = {
  jobId,
  userId: userId || '',
  sourceFormat,
  targetFormat,
  sourceSize: file.size,
  sourceFile: '', // This would be set after uploading the file
  status: 'PENDING' as ConversionStatus,
  createdAt: Date.now(),
  priority: 'normal',
  isPremium: !!userId
};
    
    // Store job in Redis
    await setCache(`conversion:${jobId}`, conversionJob, 86400); // 24 hours TTL
    
    // In a real implementation, we would add the job to a queue for processing
    // For now, we'll just return the job ID
    return NextResponse.json({
      jobId,
      status: 'pending',
      message: 'Conversion job created successfully',
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get conversion status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Get job from Redis
const job = await getCache<ConversionJob>(`conversion:${jobId}`);

if (!job) {
  return NextResponse.json(
    { error: 'Conversion job not found' },
    { status: 404 }
  );
}

return NextResponse.json({
  jobId: job.jobId,
  status: job.status,
  sourceFormat: job.sourceFormat,
  targetFormat: job.targetFormat,
  createdAt: job.createdAt,
});
  } catch (error) {
    console.error('Get conversion status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}