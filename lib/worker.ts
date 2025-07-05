import { getRedisClient } from './redis';
import { convertFile, ConversionJob, ConversionResult, cleanupOldConversions, ConversionStatus } from './conversion';

// Extended ConversionJob interface with additional properties used in worker
interface ExtendedConversionJob extends ConversionJob {
  startedAt?: number;
  completedAt?: number;
  error?: string;
  sourceFilePath?: string;
}
import { scanFileForViruses } from './security';
import { uploadToCDN } from './cdn';

// Extended ConversionResult interface with additional properties used in worker
interface ExtendedConversionResult extends ConversionResult {
  outputFilePath?: string;
  outputFileName?: string;
  outputMimeType?: string;
  cdnUrl?: string;
  downloadUrl?: string;
}

// Worker status types
export type WorkerStatus = 'idle' | 'busy' | 'error';

// Worker interface
export interface Worker {
  id: string;
  status: WorkerStatus;
  currentJobId: string | null;
  lastActive: number; // Unix timestamp
}

// Queue item interface
export interface QueueItem {
  id: string;
  jobId: string;
  priority: number;
  addedAt: number; // Unix timestamp
}

/**
 * Register a worker
 * @param workerId Worker ID
 * @returns Promise<Worker>
 */
export async function registerWorker(workerId: string): Promise<Worker> {
  try {
    const redis = await getRedisClient();
    const now = Date.now();
    
    const worker: Worker = {
      id: workerId,
      status: 'idle',
      currentJobId: null,
      lastActive: now,
    };
    
    await redis.set(`worker:${workerId}`, JSON.stringify(worker), {
      EX: 60 * 60, // 1 hour expiry
    });
    
    return worker;
  } catch (error) {
    console.error('Error registering worker:', error);
    throw new Error('Failed to register worker');
  }
}

/**
 * Update worker status
 * @param workerId Worker ID
 * @param status Worker status
 * @param currentJobId Current job ID (null if idle)
 * @returns Promise<Worker>
 */
export async function updateWorkerStatus(
  workerId: string,
  status: WorkerStatus,
  currentJobId: string | null = null
): Promise<Worker> {
  try {
    const redis = await getRedisClient();
    const now = Date.now();
    
    const worker: Worker = {
      id: workerId,
      status,
      currentJobId,
      lastActive: now,
    };
    
    await redis.set(`worker:${workerId}`, JSON.stringify(worker), {
      EX: 60 * 60, // 1 hour expiry
    });
    
    return worker;
  } catch (error) {
    console.error('Error updating worker status:', error);
    throw new Error('Failed to update worker status');
  }
}

/**
 * Get worker status
 * @param workerId Worker ID
 * @returns Promise<Worker | null>
 */
export async function getWorkerStatus(workerId: string): Promise<Worker | null> {
  try {
    const redis = await getRedisClient();
    const workerJson = await redis.get(`worker:${workerId}`);
    
    if (!workerJson) {
      return null;
    }
    
    return JSON.parse(workerJson);
  } catch (error) {
    console.error('Error getting worker status:', error);
    return null;
  }
}

/**
 * Add a job to the queue
 * @param jobId Job ID
 * @param priority Priority (higher number = higher priority)
 * @returns Promise<QueueItem>
 */
export async function addToQueue(jobId: string, priority = 1): Promise<QueueItem> {
  try {
    const redis = await getRedisClient();
    const now = Date.now();
    const queueItemId = `queue:item:${jobId}`;
    
    const queueItem: QueueItem = {
      id: queueItemId,
      jobId,
      priority,
      addedAt: now,
    };
    
    // Add to queue sorted set (score = priority)
    await redis.zAdd('conversion:queue', { score: priority, value: queueItemId });
    
    // Store queue item details
    await redis.set(queueItemId, JSON.stringify(queueItem), {
      EX: 24 * 60 * 60, // 24 hour expiry
    });
    
    return queueItem;
  } catch (error) {
    console.error('Error adding to queue:', error);
    throw new Error('Failed to add job to queue');
  }
}

/**
 * Get the next job from the queue
 * @returns Promise<string | null> Job ID or null if queue is empty
 */
export async function getNextJob(): Promise<string | null> {
  try {
    const redis = await getRedisClient();
    
    // Get the highest priority item from the queue
    const result = await redis.zRange('conversion:queue', 0, 0, { REV: true });
    
    if (!result || result.length === 0) {
      return null;
    }
    
    const queueItemId = result[0];
    
    // Remove from queue
    await redis.zRem('conversion:queue', queueItemId);
    
    // Get queue item details
    const queueItemJson = await redis.get(queueItemId);
    
    if (!queueItemJson) {
      return null;
    }
    
    const queueItem: QueueItem = JSON.parse(queueItemJson);
    
    return queueItem.jobId;
  } catch (error) {
    console.error('Error getting next job:', error);
    return null;
  }
}

/**
 * Process a conversion job
 * @param workerId Worker ID
 * @param jobId Job ID
 * @returns Promise<ConversionResult | null>
 */
export async function processJob(workerId: string, jobId: string): Promise<ExtendedConversionResult | null> {
  try {
    // Update worker status to busy
    await updateWorkerStatus(workerId, 'busy', jobId);
    
    // Get job details
    const redis = await getRedisClient();
    const jobJson = await redis.get(`conversion:job:${jobId}`);
    
    if (!jobJson) {
      await updateWorkerStatus(workerId, 'idle');
      return null;
    }
    
    const job: ExtendedConversionJob = JSON.parse(jobJson);
    
    // Update job status to processing
    job.status = 'PROCESSING';
    job.startedAt = Date.now();
    await redis.set(`conversion:job:${jobId}`, JSON.stringify(job), {
      EX: 24 * 60 * 60, // 24 hour expiry
    });
    
    // Scan file for viruses
    const scanResult = await scanFileForViruses(job.sourceFile);
    
    if (!scanResult.isClean) {
      // Update job status to failed
      job.status = 'FAILED';
      job.error = 'File contains malware';
      job.completedAt = Date.now();
      await redis.set(`conversion:job:${jobId}`, JSON.stringify(job), {
        EX: 24 * 60 * 60, // 24 hour expiry
      });
      
      await updateWorkerStatus(workerId, 'idle');
      return null;
    }
    
    // Convert the file
    const result = await convertFile(job) as ExtendedConversionResult;
    
    // Upload the converted file to CDN
    if (result.status === 'COMPLETED' && 
        result.outputFilePath && 
        result.outputFileName && 
        result.outputMimeType) {
      const cdnFile = await uploadToCDN(
        result.outputFilePath,
        result.outputFileName,
        result.outputMimeType,
        24 // 24 hour TTL
      );
      
      result.cdnUrl = cdnFile.cdnUrl;
      result.downloadUrl = cdnFile.url;
    }
    
    // Update job status
    await redis.set(`conversion:result:${jobId}`, JSON.stringify(result), {
      EX: 24 * 60 * 60, // 24 hour expiry
    });
    
    // Update worker status to idle
    await updateWorkerStatus(workerId, 'idle');
    
    return result;
  } catch (error) {
    console.error('Error processing job:', error);
    
    // Update worker status to error
    await updateWorkerStatus(workerId, 'error');
    
    // Update job status to failed
    try {
      const redis = await getRedisClient();
      const jobJson = await redis.get(`conversion:job:${jobId}`);
      
      if (jobJson) {
        const job: ExtendedConversionJob = JSON.parse(jobJson);
        job.status = 'FAILED';
        job.error = 'Internal server error';
        job.completedAt = Date.now();
        await redis.set(`conversion:job:${jobId}`, JSON.stringify(job), {
          EX: 24 * 60 * 60, // 24 hour expiry
        });
      }
    } catch (redisError) {
      console.error('Error updating job status:', redisError);
    }
    
    return null;
  }
}

/**
 * Start the worker process
 * This function should be called by a background process or cron job
 * @param workerId Worker ID
 */
export async function startWorker(workerId: string): Promise<void> {
  try {
    // Register worker
    await registerWorker(workerId);
    
    // Process jobs in a loop
    while (true) {
      // Get worker status
      const worker = await getWorkerStatus(workerId);
      
      if (!worker || worker.status === 'error') {
        console.error('Worker is in error state or not registered');
        break;
      }
      
      // If worker is busy, wait and continue
      if (worker.status === 'busy') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Get next job from queue
      const jobId = await getNextJob();
      
      if (!jobId) {
        // No jobs in queue, wait and continue
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Process the job
      await processJob(workerId, jobId);
    }
  } catch (error) {
    console.error('Error in worker process:', error);
  }
}

/**
 * Run maintenance tasks
 * This function should be called periodically (e.g., via a cron job)
 */
export async function runMaintenance(): Promise<void> {
  try {
    // Clean up old conversions
    await cleanupOldConversions();
    
    // Clean up expired workers
    const redis = await getRedisClient();
    const now = Date.now();
    const workerKeys = await redis.keys('worker:*');
    
    for (const key of workerKeys) {
      const workerJson = await redis.get(key);
      
      if (workerJson) {
        const worker: Worker = JSON.parse(workerJson);
        
        // If worker hasn't been active for more than 1 hour, remove it
        if (now - worker.lastActive > 60 * 60 * 1000) {
          await redis.del(key);
        }
      }
    }
  } catch (error) {
    console.error('Error running maintenance:', error);
  }
}