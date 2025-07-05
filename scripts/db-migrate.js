#!/usr/bin/env node

/**
 * Database Migration Script for ConvertViral
 * 
 * This script handles database migrations for different environments
 * and includes safety checks and rollback capabilities.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get environment from command line arguments or default to development
const environment = process.argv[2] || 'development';
const validEnvironments = ['development', 'staging', 'production'];

if (!validEnvironments.includes(environment)) {
  console.error(`❌ Invalid environment: ${environment}`);
  console.error(`Valid environments are: ${validEnvironments.join(', ')}`);
  process.exit(1);
}

// Load environment variables based on environment
require('dotenv').config({
  path: environment === 'production' 
    ? '.env.production' 
    : environment === 'staging' 
      ? '.env.staging' 
      : '.env'
});

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, '../prisma/backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Function to create database backup
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-${environment}-${timestamp}.sql`);
  
  console.log(`📦 Creating database backup: ${backupFile}`);
  
  try {
    // Extract database URL components
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Parse database URL
    const dbUrlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)/);
    if (!dbUrlMatch) {
      throw new Error('Invalid DATABASE_URL format');
    }
    
    const [, user, password, host, port, dbNameWithParams] = dbUrlMatch;
    const dbName = dbNameWithParams.split('?')[0];
    
    // Create backup using pg_dump
    execSync(
      `PGPASSWORD=${password} pg_dump -h ${host} -p ${port} -U ${user} -d ${dbName} -F p -f ${backupFile}`,
      { stdio: 'inherit' }
    );
    
    console.log(`✅ Backup created successfully: ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
    throw error;
  }
}

// Function to run migrations
async function runMigrations() {
  console.log(`🔄 Running database migrations for ${environment} environment...`);
  
  try {
    // Run Prisma migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error(`❌ Migration failed: ${error.message}`);
    throw error;
  }
}

// Function to restore backup
async function restoreBackup(backupFile) {
  console.log(`🔄 Restoring database from backup: ${backupFile}`);
  
  try {
    // Extract database URL components
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Parse database URL
    const dbUrlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)/);
    if (!dbUrlMatch) {
      throw new Error('Invalid DATABASE_URL format');
    }
    
    const [, user, password, host, port, dbNameWithParams] = dbUrlMatch;
    const dbName = dbNameWithParams.split('?')[0];
    
    // Restore backup using psql
    execSync(
      `PGPASSWORD=${password} psql -h ${host} -p ${port} -U ${user} -d ${dbName} -f ${backupFile}`,
      { stdio: 'inherit' }
    );
    
    console.log('✅ Backup restored successfully');
  } catch (error) {
    console.error(`❌ Restore failed: ${error.message}`);
    throw error;
  }
}

// Main function
async function main() {
  let backupFile;
  
  try {
    // Confirm before proceeding with production migrations
    if (environment === 'production') {
      await new Promise((resolve) => {
        rl.question('⚠️ You are about to run migrations on PRODUCTION. Are you sure? (yes/no): ', (answer) => {
          if (answer.toLowerCase() !== 'yes') {
            console.log('Migration cancelled.');
            process.exit(0);
          }
          resolve();
        });
      });
    }
    
    // Create backup before migrations
    backupFile = await createBackup();
    
    // Run migrations
    await runMigrations();
    
    console.log(`✅ Database migration completed successfully for ${environment} environment`);
  } catch (error) {
    console.error('❌ Migration process failed');
    
    // Ask if user wants to restore backup
    if (backupFile) {
      await new Promise((resolve) => {
        rl.question('Would you like to restore the database from backup? (yes/no): ', async (answer) => {
          if (answer.toLowerCase() === 'yes') {
            try {
              await restoreBackup(backupFile);
            } catch (restoreError) {
              console.error('Failed to restore backup');
            }
          }
          resolve();
        });
      });
    }
    
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the main function
main();