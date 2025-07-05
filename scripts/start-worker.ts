#!/usr/bin/env ts-node

import { v4 as uuidv4 } from 'uuid';
import { startWorker } from '../lib/worker';
import { closeRedisConnection } from '../lib/redis';

// Generate a unique worker ID
const workerId = uuidv4();

console.log(`Starting worker with ID: ${workerId}`);

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Worker shutting down...');
  await closeRedisConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Worker shutting down...');
  await closeRedisConnection();
  process.exit(0);
});

// Start the worker
startWorker(workerId).catch(async (error) => {
  console.error('Worker error:', error);
  await closeRedisConnection();
  process.exit(1);
});