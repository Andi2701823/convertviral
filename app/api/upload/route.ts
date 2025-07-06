import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { saveUploadedFile, validateFileType, validateFileSize } from '@/lib/upload';
import { getFileFormatByExtension } from '@/lib/fileTypes';
import { setCache } from '@/lib/redis';
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // Use type assertion with FormData to access get method
    const file = (formData as any).get('file') as File;
    const userId = (formData as any).get('userId') as string | undefined;
    
    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Extract file information
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileFormat = getFileFormatByExtension(fileExtension);
    
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
      await validateFileType(file.type, fileExtension);
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

    // Save the uploaded file
    const uploadedFile = await saveUploadedFile(file);
    
    // Store file info in Redis for 24 hours
    const fileId = uploadedFile.id;
    await setCache(`file:${fileId}`, uploadedFile, 86400); // 24 hours TTL
    
    // Return file information
    return NextResponse.json({
      fileId,
      filename: uploadedFile.fileName,
      size: uploadedFile.fileSize,
      mimetype: uploadedFile.mimeType,
      extension: uploadedFile.extension,
      url: `/api/files/${fileId}`, // Generate a URL since it doesn't exist in UploadedFile
      compatibleTargetFormats: getCompatibleTargetFormats(fileExtension),
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get compatible target formats
function getCompatibleTargetFormats(sourceFormat: string): string[] {
  const formatMap: Record<string, string[]> = {
    // PDF conversions
    'pdf': ['docx', 'xlsx', 'pptx', 'jpg'],
    'docx': ['pdf'],
    'xlsx': ['pdf'],
    'pptx': ['pdf'],
    
    // Image conversions
    'jpg': ['png', 'pdf'],
    'jpeg': ['png', 'pdf'],
    'png': ['jpg', 'pdf'],
    'heic': ['jpg'],
    'webp': ['png'],
    'raw': ['jpg'],
    
    // Audio conversions
    'mp4': ['mp3'],
    'wav': ['mp3'],
    'flac': ['mp3'],
    'm4a': ['mp3'],
    
    // Video conversions
    'mov': ['mp4'],
    'avi': ['mp4'],
    'mkv': ['mp4'],
    'webm': ['mp4'],
  };
  
  return formatMap[sourceFormat.toLowerCase()] || [];
}