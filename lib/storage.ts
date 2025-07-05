/**
 * Storage Service for ConvertViral
 * Handles file uploads, downloads, and management using AWS S3
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || '';

// Default expiration time for signed URLs (24 hours)
const DEFAULT_EXPIRATION = 60 * 60 * 24;

/**
 * Generate a unique file key for S3
 * @param fileName Original file name
 * @param userId Optional user ID to associate with the file
 * @returns Unique file key
 */
export function generateFileKey(fileName: string, userId?: string): string {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return userId
    ? `uploads/${userId}/${timestamp}-${uuid}-${sanitizedFileName}`
    : `uploads/anonymous/${timestamp}-${uuid}-${sanitizedFileName}`;
}

/**
 * Upload a file to S3
 * @param fileBuffer File buffer to upload
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param userId Optional user ID to associate with the file
 * @returns Object containing the file key and public URL
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  userId?: string
): Promise<{ key: string; url: string }> {
  const fileKey = generateFileKey(fileName, userId);
  
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: {
      originalName: fileName,
      uploadedBy: userId || 'anonymous',
      uploadedAt: new Date().toISOString()
    }
  };
  
  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Generate public URL
    const publicUrl = CLOUDFRONT_DOMAIN
      ? `https://${CLOUDFRONT_DOMAIN}/${fileKey}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    
    return {
      key: fileKey,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Generate a signed URL for downloading a file
 * @param fileKey S3 file key
 * @param expiresIn Expiration time in seconds (default: 24 hours)
 * @returns Signed URL for downloading the file
 */
export async function getSignedDownloadUrl(
  fileKey: string,
  expiresIn: number = DEFAULT_EXPIRATION
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey
  });
  
  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Generate a signed URL for uploading a file directly to S3
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param userId Optional user ID to associate with the file
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 * @returns Object containing the file key and signed upload URL
 */
export async function getSignedUploadUrl(
  fileName: string,
  contentType: string,
  userId?: string,
  expiresIn: number = 3600
): Promise<{ key: string; url: string }> {
  const fileKey = generateFileKey(fileName, userId);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
    Metadata: {
      originalName: fileName,
      uploadedBy: userId || 'anonymous',
      uploadedAt: new Date().toISOString()
    }
  });
  
  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return {
      key: fileKey,
      url: signedUrl
    };
  } catch (error) {
    console.error('Error generating signed upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Delete a file from S3
 * @param fileKey S3 file key
 * @returns True if deletion was successful
 */
export async function deleteFile(fileKey: string): Promise<boolean> {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  };
  
  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Schedule a file for deletion after a specified time
 * @param fileKey S3 file key
 * @param delayHours Number of hours before deletion (default: 24)
 */
export function scheduleFileDeletion(fileKey: string, delayHours: number = 24): void {
  const delayMs = delayHours * 60 * 60 * 1000;
  
  setTimeout(async () => {
    try {
      await deleteFile(fileKey);
      console.log(`File ${fileKey} deleted after ${delayHours} hours`);
    } catch (error) {
      console.error(`Failed to delete file ${fileKey}:`, error);
    }
  }, delayMs);
}