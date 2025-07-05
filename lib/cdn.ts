import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from './redis';
import { formatFileSize } from './fileTypes';

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

// Interface for CDN file information
export interface CDNFile {
  url: string;
  cdnUrl: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  formattedSize: string;
  mimeType: string;
  expiresAt: number; // Unix timestamp
}

// Base URL for local development
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// In production, this would be your actual CDN URL
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || LOCAL_BASE_URL;

// CDN directory (in a real implementation, this would be configured differently)
const CDN_DIR = path.join(process.cwd(), 'public', 'cdn');

/**
 * Ensure the CDN directory exists
 */
export async function ensureCDNDir(): Promise<void> {
  try {
    await mkdir(CDN_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating CDN directory:', error);
    throw new Error('Failed to create CDN directory');
  }
}

/**
 * Upload a file to the CDN
 * In a real implementation, this would upload to an actual CDN service
 * @param sourcePath Source file path
 * @param fileName Original file name
 * @param mimeType File MIME type
 * @param ttlHours Time to live in hours (default: 24)
 * @returns CDN file information
 */
export async function uploadToCDN(
  sourcePath: string,
  fileName: string,
  mimeType: string,
  ttlHours = 24
): Promise<CDNFile> {
  try {
    // Ensure CDN directory exists
    await ensureCDNDir();
    
    // Generate a unique ID for the file
    const fileId = uuidv4();
    const safeFileName = encodeURIComponent(path.basename(fileName));
    const cdnFileName = `${fileId}-${safeFileName}`;
    const cdnFilePath = path.join(CDN_DIR, cdnFileName);
    
    // Copy the file to the CDN directory
    await copyFile(sourcePath, cdnFilePath);
    
    // Get file size
    const stats = fs.statSync(cdnFilePath);
    const fileSize = stats.size;
    const formattedSize = formatFileSize(fileSize);
    
    // Calculate expiry time
    const expiresAt = Date.now() + ttlHours * 60 * 60 * 1000;
    
    // Create CDN file information
    const cdnFile: CDNFile = {
      url: `${LOCAL_BASE_URL}/api/download?file=${cdnFileName}`,
      cdnUrl: `${CDN_BASE_URL}/cdn/${cdnFileName}`,
      fileName: safeFileName,
      filePath: cdnFilePath,
      fileSize,
      formattedSize,
      mimeType,
      expiresAt,
    };
    
    // Store CDN file information in Redis
    const redis = await getRedisClient();
    await redis.set(`cdn:${cdnFileName}`, JSON.stringify(cdnFile), {
      EX: ttlHours * 60 * 60,
    });
    
    return cdnFile;
  } catch (error) {
    console.error('Error uploading to CDN:', error);
    throw new Error('Failed to upload file to CDN');
  }
}

/**
 * Get CDN file information
 * @param cdnFileName CDN file name
 * @returns CDN file information or null if not found
 */
export async function getCDNFile(cdnFileName: string): Promise<CDNFile | null> {
  try {
    const redis = await getRedisClient();
    const cdnFileJson = await redis.get(`cdn:${cdnFileName}`);
    
    if (!cdnFileJson) {
      return null;
    }
    
    const cdnFile: CDNFile = JSON.parse(cdnFileJson);
    
    // Check if file has expired
    if (cdnFile.expiresAt < Date.now()) {
      // Delete expired file information from Redis
      await redis.del(`cdn:${cdnFileName}`);
      
      // Delete expired file from disk
      if (fs.existsSync(cdnFile.filePath)) {
        fs.unlinkSync(cdnFile.filePath);
      }
      
      return null;
    }
    
    return cdnFile;
  } catch (error) {
    console.error('Error getting CDN file:', error);
    return null;
  }
}

/**
 * Delete a file from the CDN
 * @param cdnFileName CDN file name
 * @returns Promise<boolean> indicating success
 */
export async function deleteFromCDN(cdnFileName: string): Promise<boolean> {
  try {
    const cdnFile = await getCDNFile(cdnFileName);
    
    if (!cdnFile) {
      return false;
    }
    
    // Delete file from disk
    if (fs.existsSync(cdnFile.filePath)) {
      fs.unlinkSync(cdnFile.filePath);
    }
    
    // Delete file information from Redis
    const redis = await getRedisClient();
    await redis.del(`cdn:${cdnFileName}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting from CDN:', error);
    return false;
  }
}

/**
 * Clean up expired CDN files
 * This should be run periodically (e.g., via a cron job)
 */
export async function cleanupExpiredCDNFiles(): Promise<void> {
  try {
    const redis = await getRedisClient();
    const now = Date.now();
    
    // Get all CDN file keys
    const keys = await redis.keys('cdn:*');
    
    for (const key of keys) {
      const cdnFileJson = await redis.get(key);
      
      if (cdnFileJson) {
        const cdnFile: CDNFile = JSON.parse(cdnFileJson);
        
        // Check if file has expired
        if (cdnFile.expiresAt < now) {
          // Delete expired file from disk
          if (fs.existsSync(cdnFile.filePath)) {
            fs.unlinkSync(cdnFile.filePath);
          }
          
          // Delete expired file information from Redis
          await redis.del(key);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up expired CDN files:', error);
  }
}

/**
 * Generate a pre-signed URL for direct CDN access
 * In a real implementation, this would generate a signed URL for a cloud CDN
 * @param cdnFileName CDN file name
 * @param expiryMinutes Expiry time in minutes (default: 15)
 * @returns Pre-signed URL or null if file not found
 */
export async function generatePresignedURL(cdnFileName: string, expiryMinutes = 15): Promise<string | null> {
  try {
    const cdnFile = await getCDNFile(cdnFileName);
    
    if (!cdnFile) {
      return null;
    }
    
    // In a real implementation, this would generate a signed URL for a cloud CDN
    // For now, we'll just add a token parameter to the URL
    const token = uuidv4();
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
    
    // Store the token in Redis
    const redis = await getRedisClient();
    await redis.set(`cdn:token:${token}`, cdnFileName, {
      EX: expiryMinutes * 60,
    });
    
    return `${CDN_BASE_URL}/cdn/${cdnFileName}?token=${token}&expires=${expiryTime}`;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return null;
  }
}

/**
 * Validate a pre-signed URL token
 * @param token Token from the URL
 * @param expiryTime Expiry time from the URL
 * @returns CDN file name or null if invalid
 */
export async function validatePresignedURL(token: string, expiryTime: number): Promise<string | null> {
  try {
    // Check if the URL has expired
    if (expiryTime < Date.now()) {
      return null;
    }
    
    // Check if the token is valid
    const redis = await getRedisClient();
    const cdnFileName = await redis.get(`cdn:token:${token}`);
    
    return cdnFileName;
  } catch (error) {
    console.error('Error validating pre-signed URL:', error);
    return null;
  }
}