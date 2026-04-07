import { NextRequest, NextResponse } from 'next/server';
import { setCache, getCache } from '@/lib/redis';
import { getOutputFileUrl } from '@/lib/cloudConvert';

/**
 * CloudConvert Webhook Handler
 * Receives notifications when CloudConvert jobs complete
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // CloudConvert sends events array
    const events = body.events || [];
    const event = events[0];

    if (!event) {
      return NextResponse.json({ error: 'No event data' }, { status: 400 });
    }

    const jobId = event.job_id;
    const eventType = event.event; // 'finished', 'error'

    console.log(`CloudConvert webhook: job=${jobId}, event=${eventType}`);

    // Find our internal job by CloudConvert job ID
    // We stored the mapping in Redis when creating the job
    // Note: We need to iterate or store reverse mapping
    // For now, we'll use the job ID format we created

    // The CloudConvert job ID is stored in our conversion cache
    // Let's find it by checking all conversion jobs
    // In production, you'd want a more efficient lookup

    if (eventType === 'finished') {
      // Job completed successfully
      // The result URL will be in the job data
      const jobData = event.payload;

      if (jobData) {
        const outputFile = getOutputFileUrl(jobData);

        if (outputFile) {
          console.log(`Conversion completed: ${outputFile.filename}`);

          // Update Redis with result
          // Note: We'd need the internal jobId to update
          // In a real implementation, store CloudConvert job ID -> internal jobId mapping
        }
      }
    }

    if (eventType === 'error') {
      console.error(`CloudConvert job error: ${jobId}`, event.payload);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('CloudConvert webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'cloudconvert-webhook',
  });
}
