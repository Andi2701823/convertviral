"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const redis_1 = require("./lib/redis");
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
// Initialize Next.js app
const app = (0, next_1.default)({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    // Create HTTP server
    const server = (0, http_1.createServer)(async (req, res) => {
        try {
            const parsedUrl = (0, url_1.parse)(req.url, true);
            await handle(req, res, parsedUrl);
        }
        catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal server error');
        }
    });
    // Initialize Socket.IO with CORS configuration
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    // Socket.IO connection handler
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Handle subscription to job progress
        socket.on('subscribe', async (data) => {
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
                        const job = await (0, redis_1.getCache)(`conversion:job:${jobId}`);
                        const progress = await (0, redis_1.getCache)(`progress:${jobId}`) || 0;
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
                            const result = await (0, redis_1.getCache)(`conversion:result:${jobId}`);
                            if (job.status === 'COMPLETED' && result) {
                                socket.emit('completed', {
                                    jobId,
                                    result,
                                });
                            }
                            else if (job.status === 'FAILED') {
                                socket.emit('failed', {
                                    jobId,
                                    error: job.error || 'Conversion failed',
                                });
                            }
                            clearInterval(interval);
                            socket.leave(`job:${jobId}`);
                        }
                    }
                    catch (error) {
                        console.error('WebSocket error:', error);
                        socket.emit('error', { message: 'Internal server error' });
                        clearInterval(interval);
                    }
                }, 1000); // Send updates every second
                // Clean up interval when connection is closed
                socket.on('disconnect', () => {
                    clearInterval(interval);
                });
            }
            catch (error) {
                console.error('WebSocket subscription error:', error);
                socket.emit('error', { message: 'Failed to subscribe to job updates' });
            }
        });
        // Handle unsubscribe
        socket.on('unsubscribe', (data) => {
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
