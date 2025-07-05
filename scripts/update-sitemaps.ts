#!/usr/bin/env ts-node

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { closeRedisConnection } from '../lib/redis';

const execAsync = promisify(exec);

console.log('Starting sitemap update process...');

/**
 * This script updates all sitemaps to ensure they reflect the latest content.
 * It can be run manually or scheduled as a cron job.
 */
async function updateSitemaps() {
  try {
    console.log('Generating dynamic conversion sitemaps...');
    await execAsync('npm run generate-dynamic-sitemaps');
    
    console.log('Generating main sitemap...');
    await execAsync('npm run generate-sitemap');
    
    // Update lastmod dates in existing sitemaps
    await updateLastModDates();
    
    console.log('Sitemap update completed successfully');
  } catch (error) {
    console.error('Error updating sitemaps:', error);
  } finally {
    // Close any open connections
    await closeRedisConnection();
  }
}

/**
 * Updates the lastmod dates in existing sitemaps to the current date
 * This ensures search engines know the content has been recently verified
 */
async function updateLastModDates() {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const sitemapFiles = [
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    path.join(process.cwd(), 'public', 'sitemaps', 'conversion-sitemaps.xml'),
    path.join(process.cwd(), 'public', 'sitemaps', 'format-sitemaps.xml')
  ];
  
  for (const sitemapFile of sitemapFiles) {
    if (fs.existsSync(sitemapFile)) {
      try {
        let content = fs.readFileSync(sitemapFile, 'utf8');
        
        // Replace all lastmod dates with today's date
        // This regex matches the lastmod tag and its content
        const lastmodRegex = /<lastmod>([^<]+)<\/lastmod>/g;
        content = content.replace(lastmodRegex, `<lastmod>${today}</lastmod>`);
        
        fs.writeFileSync(sitemapFile, content);
        console.log(`Updated lastmod dates in ${path.basename(sitemapFile)}`);
      } catch (error) {
        console.error(`Error updating lastmod dates in ${sitemapFile}:`, error);
      }
    } else {
      console.warn(`Sitemap file not found: ${sitemapFile}`);
    }
  }
}

// Run the update function
updateSitemaps().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});