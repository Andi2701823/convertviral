import { NextRequest, NextResponse } from 'next/server';
import { createConversionJob, getJobStatus, getOutputFileUrl } from '@/lib/cloudConvert';

const CLOUDCONVERT_API_URL = 'https://api.cloudconvert.com/v2';

/**
 * Get a presigned upload URL from CloudConvert
 */
async function getCloudConvertUploadUrl(apiKey: string) {
  const response = await fetch(`${CLOUDCONVERT_API_URL}/files/upload/presigned`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get upload URL: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Simple file conversion using CloudConvert direct API
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = (formData as any).get('file') as File;
    const targetFormat = (formData as any).get('targetFormat') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!targetFormat) {
      return NextResponse.json({ error: 'No target format specified' }, { status: 400 });
    }

    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'CloudConvert API not configured' }, { status: 500 });
    }

    const sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';

    // Upload file to CloudConvert
    const uploadInfo = await getCloudConvertUploadUrl(apiKey);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to CloudConvert presigned URL
    await fetch(uploadInfo.upload_url, {
      method: 'PUT',
      body: fileBuffer,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    // Create conversion job
    const webhookUrl = `${process.env.NEXTAUTH_URL || 'https://convertviral.netlify.app'}/api/cloudconvert/webhook`;

    const jobPayload = {
      tasks: {
        'import-file': {
          operation: 'import/upload',
          file: uploadInfo.file,
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          input_format: sourceFormat,
          output_format: targetFormat,
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file',
        },
      },
      webhook_url: webhookUrl,
    };

    const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create job: ${JSON.stringify(error)}`);
    }

    const jobData = await response.json();
    const job = jobData.data;

    // Poll for completion (max 2 minutes for small files)
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch(`${CLOUDCONVERT_API_URL}/jobs/${job.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to get job status');
      }

      const statusData = await statusResponse.json();
      const currentJob = statusData.data;

      if (currentJob.status === 'finished') {
        const outputFile = getOutputFileUrl(currentJob);
        if (outputFile) {
          return NextResponse.json({
            success: true,
            jobId: job.id,
            status: 'completed',
            result: {
              url: outputFile.url,
              filename: outputFile.filename,
              size: outputFile.size,
            },
          });
        }
      }

      if (currentJob.status === 'error' || currentJob.status === 'cancelled') {
        throw new Error('Conversion failed');
      }

      attempts++;
    }

    // Return job info for polling if still processing
    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: 'processing',
      message: 'Conversion in progress',
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: `Conversion failed: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
