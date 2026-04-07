/**
 * CloudConvert API Integration
 * Handles all file conversions via CloudConvert's cloud-based conversion service
 */

const CLOUDCONVERT_API_URL = 'https://api.cloudconvert.com/v2';
const CLOUDCONVERT_WEBHOOK_URL = process.env.CLOUDCONVERT_WEBHOOK_URL || '';

/**
 * CloudConvert job status types
 */
export type CloudConvertJobStatus = 'queued' | 'processing' | 'finished' | 'error' | 'cancelled';

/**
 * CloudConvert task types we use
 */
export type CloudConvertTaskType =
  | 'import/upload'
  | 'import/web'
  | 'convert'
  | 'export/url'
  | 'webhook';

/**
 * CloudConvert job response
 */
export interface CloudConvertJob {
  id: string;
  status: CloudConvertJobStatus;
  tasks: CloudConvertTask[];
  created_at: string;
  ended_at?: string;
}

/**
 * CloudConvert task
 */
export interface CloudConvertTask {
  id: string;
  name: string;
  status: CloudConvertJobStatus;
  type: CloudConvertTaskType;
  result?: {
    files?: Array<{
      filename: string;
      url: string;
      size: number;
    }>;
  };
  error?: string;
}

/**
 * Create a CloudConvert conversion job
 * @param sourceUrl URL of the source file (already uploaded)
 * @param sourceFormat Original format
 * @param targetFormat Target format
 * @param webhookUrl URL to receive job completion webhook
 */
export async function createConversionJob(
  sourceUrl: string,
  sourceFormat: string,
  targetFormat: string,
  webhookUrl?: string
): Promise<CloudConvertJob> {
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  if (!apiKey) {
    throw new Error('CLOUDCONVERT_API_KEY is not set');
  }

  // Normalize format names for CloudConvert
  const inputFormat = normalizeFormat(sourceFormat);
  const outputFormat = normalizeFormat(targetFormat);

  const jobPayload: any = {
    tasks: {
      'import-file': {
        operation: 'import/url',
        url: sourceUrl,
      },
      'convert-file': {
        operation: 'convert',
        input: 'import-file',
        input_format: inputFormat,
        output_format: outputFormat,
      },
      'export-file': {
        operation: 'export/url',
        input: 'convert-file',
        inline: false,
        archive: false,
      },
    },
  };

  // Add webhook if provided
  if (webhookUrl) {
    jobPayload.tasks['notify-webhook'] = {
      operation: 'webhook',
      url: webhookUrl,
      events: ['finished', 'error'],
    };
  }

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
    console.error('CloudConvert API error:', error);
    throw new Error(`CloudConvert API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get the status of a CloudConvert job
 */
export async function getJobStatus(jobId: string): Promise<CloudConvertJob> {
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  if (!apiKey) {
    throw new Error('CLOUDCONVERT_API_KEY is not set');
  }

  const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs/${jobId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`CloudConvert API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Cancel a CloudConvert job
 */
export async function cancelJob(jobId: string): Promise<void> {
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  if (!apiKey) {
    throw new Error('CLOUDCONVERT_API_KEY is not set');
  }

  const response = await fetch(`${CLOUDCONVERT_API_URL}/jobs/${jobId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operation: 'cancel' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`CloudConvert API error: ${error.message || response.statusText}`);
  }
}

/**
 * Wait for a job to complete (polling)
 * @param jobId Job ID
 * @param maxWaitMs Maximum time to wait in milliseconds
 * @param pollIntervalMs Interval between polls
 */
export async function waitForJobCompletion(
  jobId: string,
  maxWaitMs: number = 300000, // 5 minutes
  pollIntervalMs: number = 2000
): Promise<CloudConvertJob> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const job = await getJobStatus(jobId);

    if (job.status === 'finished') {
      return job;
    }

    if (job.status === 'error' || job.status === 'cancelled') {
      const errorTask = job.tasks.find(t => t.status === 'error');
      throw new Error(`Conversion failed: ${errorTask?.error || 'Unknown error'}`);
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error('Conversion timed out');
}

/**
 * Get the output file URL from a completed job
 */
export function getOutputFileUrl(job: CloudConvertJob): { url: string; filename: string; size: number } | null {
  const exportTask = job.tasks.find(t => t.name === 'export-file');

  if (!exportTask?.result?.files?.length) {
    return null;
  }

  const file = exportTask.result.files[0];
  return {
    url: file.url,
    filename: file.filename,
    size: file.size,
  };
}

/**
 * Normalize format names for CloudConvert
 */
function normalizeFormat(format: string): string {
  const formatMap: Record<string, string> = {
    'jpeg': 'jpg',
    'heic': 'heic',
    'docx': 'docx',
    'xlsx': 'xlsx',
    'pptx': 'pptx',
    'mp4': 'mp4',
    'mov': 'mov',
    'avi': 'avi',
    'mkv': 'mkv',
    'webm': 'webm',
    'mp3': 'mp3',
    'wav': 'wav',
    'flac': 'flac',
    'm4a': 'm4a',
    'ogg': 'ogg',
  };

  return formatMap[format.toLowerCase()] || format.toLowerCase();
}

/**
 * Get supported conversion formats from CloudConvert
 */
export function getSupportedConversions(): Record<string, string[]> {
  return {
    // Documents
    'pdf': ['docx', 'jpg', 'png'],
    'docx': ['pdf'],
    'xlsx': ['pdf'],
    'pptx': ['pdf'],

    // Images
    'jpg': ['png', 'webp', 'pdf'],
    'jpeg': ['png', 'webp', 'pdf'],
    'png': ['jpg', 'webp', 'pdf'],
    'webp': ['jpg', 'png', 'pdf'],
    'heic': ['jpg', 'png'],

    // Audio
    'mp4': ['mp3'],
    'wav': ['mp3'],
    'flac': ['mp3'],
    'm4a': ['mp3'],

    // Video
    'mov': ['mp4'],
    'avi': ['mp4'],
    'mkv': ['mp4'],
    'webm': ['mp4'],
  };
}
