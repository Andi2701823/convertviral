#!/usr/bin/env ts-node

import { runMaintenance } from '../lib/worker';
import { cleanupExpiredCDNFiles } from '../lib/cdn';
import { closeRedisConnection } from '../lib/redis';
import { exec } from 'child_process';
import { promisify } from 'util';

console.log('Running maintenance tasks...');

const execAsync = promisify(exec);

// Run maintenance tasks
async function main() {
  try {
    // Run worker maintenance
    await runMaintenance();
    
    // Clean up expired CDN files
    await cleanupExpiredCDNFiles();
    
    // Update sitemaps
    console.log('Updating sitemaps...');
    await execAsync('ts-node scripts/update-sitemaps.ts');
    
    console.log('Maintenance tasks completed successfully');
  } catch (error) {
    console.error('Error running maintenance tasks:', error);
  } finally {
    // Close Redis connection
    await closeRedisConnection();
  }
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});