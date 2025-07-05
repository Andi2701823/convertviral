import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { getCache, setCache } from './lib/redis';
import { ConversionJob, ConversionResult, ConversionStatus } from './lib/conversion';

// Extend ConversionJob interface to include error property
interface ExtendedConversionJob extends ConversionJob {
  error?: string;
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  // Initialize Socket.IO with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Handle subscription to job progress
    socket.on('subscribe', async (data: { jobId: string }) => {
      try {
        const { jobId } = data;
        
        if (!jobId) {
          socket.emit('error', { message: 'Job ID is required' });
          return;
        }

        console.log(`Client ${socket.id} subscribed to job ${jobId}`);
        
        // Join a room specific to this job
        socket.join(`job:${jobId}`);
        
        // Set up interval to send progress updates
        const interval = setInterval(async () => {
          try {
            const job = await getCache<ExtendedConversionJob>(`conversion:job:${jobId}`);
            const progress = await getCache<number>(`progress:${jobId}`) || 0;
            
            if (!job) {
              socket.emit('error', { message: 'Job not found' });
              clearInterval(interval);
              return;
            }
            
            // Send progress update
            socket.emit('progress', {
              jobId,
              status: job.status,
              progress,
            });
            
            // If job is completed or failed, stop sending updates
            if (job.status === 'COMPLETED' || job.status === 'FAILED') {
                const result = await getCache<ConversionResult>(`conversion:result:${jobId}`);
                
                if (job.status === 'COMPLETED' && result) {
                  socket.emit('completed', {
                    jobId,
                    result,
                  });
                } else if (job.status === 'FAILED') {
                  socket.emit('failed', {
                    jobId,
                    error: job.error || 'Conversion failed',
                  });
              }
              
              clearInterval(interval);
              socket.leave(`job:${jobId}`);
            }
          } catch (error) {
            console.error('WebSocket error:', error);
            socket.emit('error', { message: 'Internal server error' });
            clearInterval(interval);
          }
        }, 1000); // Send updates every second
        
        // Clean up interval when connection is closed
        socket.on('disconnect', () => {
          clearInterval(interval);
        });
      } catch (error) {
        console.error('WebSocket subscription error:', error);
        socket.emit('error', { message: 'Failed to subscribe to job updates' });
      }
    });

    // Handle unsubscribe
    socket.on('unsubscribe', (data: { jobId: string }) => {
      const { jobId } = data;
      if (jobId) {
        socket.leave(`job:${jobId}`);
        console.log(`Client ${socket.id} unsubscribed from job ${jobId}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Start the server
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});