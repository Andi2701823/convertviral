import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateFileType as validateFileTypeInternal, validateFileSize as validateFileSizeInternal } from './fileTypes';

// Re-export the validation functions
export const validateFileType = validateFileTypeInternal;
export const validateFileSize = validateFileSizeInternal;
import { setCache } from './redis';
import * as crypto from 'crypto';

// Define uploaded file type
export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  extension: string;
  uploadedAt: number;
  userId?: string;
  isPremium: boolean;
}

/**
 * Ensure upload directory exists
 * @param customDir Optional custom directory path
 * @returns Path to upload directory
 */
export function ensureUploadDir(customDir?: string): string {
  const uploadDir = customDir || path.join(process.cwd(), 'uploads', 'temp');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  return uploadDir;
}

/**
 * Save uploaded file to disk
 * @param file File from request
 * @param userId Optional user ID
 * @param isPremium Whether user is premium
 * @returns UploadedFile object
 */
export async function saveUploadedFile(
  file: any,
  userId?: string,
  isPremium: boolean = false
): Promise<UploadedFile> {
  try {
    // Ensure upload directory exists
    const uploadDir = ensureUploadDir();
    
    // Generate unique filename
    const originalName = file.name || 'unknown';
    const extension = path.extname(originalName).toLowerCase();
    const mimeType = file.type || 'application/octet-stream';
    const fileSize = file.size || 0;
    
    // Validate file type and size
    await validateFileType(mimeType, extension.substring(1));
    await validateFileSize(fileSize, isPremium);
    
    // Generate a unique filename with UUID
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}${extension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Create a write stream and pipe the file to it
    const writeStream = fs.createWriteStream(filePath);
    
    // In a real implementation, we would pipe the file to the write stream
    // For now, we'll simulate writing the file
    // file.stream.pipe(writeStream);
    
    // For simulation, we'll just write some dummy data
    if (file.buffer) {
      // If we have a buffer (e.g., from multer), write it directly
      fs.writeFileSync(filePath, file.buffer);
    } else {
      // Otherwise, create a dummy file
      fs.writeFileSync(filePath, 'Simulated file content');
    }
    
    // Create uploaded file object
    const uploadedFile: UploadedFile = {
      id: uniqueId,
      originalName,
      fileName,
      filePath,
      fileSize,
      mimeType,
      extension: extension.substring(1),
      uploadedAt: Date.now(),
      userId,
      isPremium,
    };
    
    // Store file info in Redis with 24-hour TTL
    await setCache(`file:${uniqueId}`, uploadedFile, 60 * 60 * 24);
    
    return uploadedFile;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Delete a file from disk
 * @param filePath Path to file
 * @returns Promise<void>
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
}

/**
 * Get file extension from MIME type
 * @param mimeType MIME type
 * @returns File extension
 */
export function getExtensionFromMimetype(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/tiff': 'tiff',
    'image/bmp': 'bmp',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'js',
    'application/json': 'json',
    'application/xml': 'xml',
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-7z-compressed': '7z',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/flac': 'flac',
    'audio/aac': 'aac',
    'audio/mp4': 'm4a',
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/webm': 'webm',
    'video/x-matroska': 'mkv',
  };
  
  return mimeMap[mimeType] || '';
}

/**
 * Calculate file hash (for virus scanning and deduplication)
 * @param filePath Path to file
 * @returns SHA-256 hash of file
 */
export async function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => {
        hash.update(data);
      });
      
      stream.on('end', () => {
        resolve(hash.digest('hex'));
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Scan file for viruses (mock implementation)
 * @param filePath Path to file
 * @returns Promise<boolean> True if file is safe
 */
export async function scanFileForViruses(filePath: string): Promise<boolean> {
  // In a real implementation, we would integrate with a virus scanning service
  // For now, we'll just return true (file is safe)
  return true;
}

/**
 * Check if user has exceeded rate limits
 * @param userId User ID
 * @param isPremium Whether user is premium
 * @returns Promise<boolean> True if rate limit exceeded
 */
export async function checkRateLimits(userId: string, isPremium: boolean): Promise<boolean> {
  // In a real implementation, we would check Redis for rate limits
  // For now, we'll just return false (not exceeded)
  return false;
}