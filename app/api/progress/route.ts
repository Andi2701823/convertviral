import { NextRequest, NextResponse } from 'next/server';
import { getCache } from '@/lib/redis';
import { ConversionJob } from '@/lib/conversion';

// Force dynamic rendering to prevent static optimization warnings
export const dynamic = 'force-dynamic';

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
    
    // Get progress from Redis
    const progress = await getCache<number>(`progress:${jobId}`) || 0;
    
    // Return progress information
    return NextResponse.json({
      jobId,
      status: job.status,
      progress,
      sourceFormat: job.sourceFormat,
      targetFormat: job.targetFormat,
      estimatedTimeRemaining: calculateEstimatedTime(progress, job.sourceSize),
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate estimated time remaining
function calculateEstimatedTime(progress: number, fileSize: number): string {
  if (progress >= 100) return '0 seconds';
  if (progress <= 0) return 'Calculating...';
  
  // This is a simplified calculation
  // In a real implementation, we would use more sophisticated estimation
  const sizeFactor = Math.min(fileSize / (1024 * 1024), 100) / 10; // Adjust based on file size (MB)
  const remainingProgress = 100 - progress;
  const secondsPerProgressPoint = 0.5 + sizeFactor; // Base time plus size factor
  
  const secondsRemaining = Math.ceil(remainingProgress * secondsPerProgressPoint);
  
  if (secondsRemaining < 60) {
    return `${secondsRemaining} seconds`;
  } else if (secondsRemaining < 3600) {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds > 0 ? `${seconds} seconds` : ''}`;
  } else {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`;
  }
}