import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getFileFormatByExtension, getCompatibleTargetFormats } from '@/lib/fileTypes';
import { setCache, getCache } from '@/lib/redis';
import { validateFileSize, validateFileType } from '@/lib/upload';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import {
  createConversionJob,
  getJobStatus,
  waitForJobCompletion,
  getOutputFileUrl,
} from '@/lib/cloudConvert';
import { getSignedUploadUrl } from '@/lib/storage';

// Size limits in bytes
const FREE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
const PREMIUM_SIZE_LIMIT = 500 * 1024 * 1024; // 500MB

// Allowed MIME types by category
const ALLOWED_MIMETYPES: Record<string, string[]> = {
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
    const file = (formData as any).get('file') as File;
    const targetFormat = (formData as any).get('targetFormat') as string;
    const userId = (formData as any).get('userId') as string | undefined;
    const fileUrl = (formData as any).get('fileUrl') as string | undefined;

    // Either file or fileUrl must be provided
    if (!file && !fileUrl) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    let sourceFormat: string;
    let fileSize: number;
    let sourceFileUrl: string;

    if (file) {
      // Handle file upload
      sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';
      fileSize = file.size;

      // Upload file to storage first
      const fileId = uuidv4();
      const buffer = Buffer.from(await file.arrayBuffer());

      // Get signed upload URL from storage
      const { key: fileKey, url: uploadUrl } = await getSignedUploadUrl(
        `${fileId}.${sourceFormat}`,
        file.type,
        userId
      );

      // Upload to storage
      await fetch(uploadUrl, {
        method: 'PUT',
        body: buffer,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Source URL is the public URL (CloudFront or S3)
      sourceFileUrl = uploadUrl.split('?')[0]; // Remove query params for CloudConvert
    } else {
      sourceFileUrl = fileUrl!;
      // Extract format from URL or file extension in URL
      const urlParts = sourceFileUrl.split('.');
      sourceFormat = urlParts[urlParts.length - 1].split('?')[0].toLowerCase();
      fileSize = 0; // Unknown when using URL
    }

    const fileFormat = getFileFormatByExtension(sourceFormat);

    // Validate file format
    if (!fileFormat) {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Validate file type if file is provided
    if (file) {
      const allowedTypes = ALLOWED_MIMETYPES[fileFormat.category.id] || [];
      try {
        await validateFileType(file.type, sourceFormat);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }
    }

    // Validate file size
    if (FEATURE_FLAGS.fileSizeLimits && fileSize > 0) {
      const isPremium = !!userId;
      const limit = isPremium ? PREMIUM_SIZE_LIMIT : FREE_SIZE_LIMIT;
      if (fileSize > limit) {
        return NextResponse.json(
          {
            error: 'File size exceeds limit',
            limit: isPremium ? '500MB' : '50MB',
            upgrade: FEATURE_FLAGS.upgradePrompts ? !userId : false,
          },
          { status: 400 }
        );
      }
    }

    // Validate target format
    const compatibleFormats = getCompatibleTargetFormats(sourceFormat);
    const isValidTarget = compatibleFormats.some(format => format.extension === targetFormat);

    if (!isValidTarget) {
      return NextResponse.json(
        {
          error: 'Invalid target format',
          compatibleFormats: compatibleFormats.map(f => f.extension),
        },
        { status: 400 }
      );
    }

    // Generate job ID
    const jobId = uuidv4();

    // Create CloudConvert job
    const webhookUrl = `${process.env.NEXTAUTH_URL || 'https://convertviral.netlify.app'}/api/cloudconvert/webhook`;
    const cloudConvertJob = await createConversionJob(
      sourceFileUrl,
      sourceFormat,
      targetFormat,
      webhookUrl
    );

    // Store job mapping in Redis
    await setCache(`conversion:${jobId}`, {
      jobId,
      cloudConvertJobId: cloudConvertJob.id,
      userId: userId || '',
      sourceFormat,
      targetFormat,
      sourceSize: fileSize,
      status: 'processing',
      createdAt: Date.now(),
    }, 86400);

    // Wait for completion (with timeout)
    // For long-running conversions, return job ID and let client poll
    const waitResult = await Promise.race([
      waitForJobCompletion(cloudConvertJob.id, 300000), // 5 min timeout
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 30000) // 30s for response
      ),
    ]).catch((e) => {
      if (e.message === 'timeout') return null;
      throw e;
    });

    if (waitResult) {
      const outputFile = getOutputFileUrl(waitResult);

      if (outputFile) {
        // Update job status
        await setCache(`conversion:${jobId}`, {
          jobId,
          cloudConvertJobId: cloudConvertJob.id,
          userId: userId || '',
          sourceFormat,
          targetFormat,
          sourceSize: fileSize,
          status: 'completed',
          resultUrl: outputFile.url,
          resultFilename: outputFile.filename,
          resultSize: outputFile.size,
          createdAt: Date.now(),
          completedAt: Date.now(),
        }, 86400);

        return NextResponse.json({
          jobId,
          status: 'completed',
          result: {
            url: outputFile.url,
            filename: outputFile.filename,
            size: outputFile.size,
          },
        });
      }
    }

    // Return pending status if still processing
    return NextResponse.json({
      jobId,
      status: 'processing',
      cloudConvertJobId: cloudConvertJob.id,
      message: 'Conversion is being processed',
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${(error as Error).message}` },
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

    const job = await getCache<any>(`conversion:${jobId}`);

    if (!job) {
      return NextResponse.json(
        { error: 'Conversion job not found' },
        { status: 404 }
      );
    }

    // If completed, return result
    if (job.status === 'completed') {
      return NextResponse.json({
        jobId: job.jobId,
        status: 'completed',
        result: {
          url: job.resultUrl,
          filename: job.resultFilename,
          size: job.resultSize,
        },
      });
    }

    // Check CloudConvert status if still processing
    if (job.cloudConvertJobId && job.status === 'processing') {
      try {
        const cloudJob = await getJobStatus(job.cloudConvertJobId);

        if (cloudJob.status === 'finished') {
          const outputFile = getOutputFileUrl(cloudJob);

          if (outputFile) {
            // Update job
            await setCache(`conversion:${jobId}`, {
              ...job,
              status: 'completed',
              resultUrl: outputFile.url,
              resultFilename: outputFile.filename,
              resultSize: outputFile.size,
              completedAt: Date.now(),
            }, 86400);

            return NextResponse.json({
              jobId: job.jobId,
              status: 'completed',
              result: {
                url: outputFile.url,
                filename: outputFile.filename,
                size: outputFile.size,
              },
            });
          }
        }

        if (cloudJob.status === 'error') {
          await setCache(`conversion:${jobId}`, {
            ...job,
            status: 'failed',
            error: 'Conversion failed',
          }, 86400);

          return NextResponse.json({
            jobId: job.jobId,
            status: 'failed',
            error: 'Conversion failed',
          });
        }
      } catch (e) {
        // CloudConvert API error, continue with pending status
        console.error('CloudConvert status check error:', e);
      }
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
