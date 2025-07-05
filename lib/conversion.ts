import { setCache, getCache, deleteCache } from './redis';
import { getFileFormatByExtension, getCompatibleTargetFormats } from './fileTypes';
import { ensureUploadDir, deleteFile } from './upload';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as util from 'util';
import ConversionService from './conversionService';

// Convert exec to Promise-based
const execPromise = util.promisify(exec);

// Define conversion job status types
export type ConversionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// Define conversion job type
export interface ConversionJob {
  jobId: string;
  userId: string;
  sourceFile: string;
  sourceFormat: string;
  sourceSize: number;
  targetFormat: string;
  status: ConversionStatus;
  createdAt: number;
  priority: 'normal' | 'high';
  isPremium: boolean;
}

// Define conversion result type
export interface ConversionResult {
  jobId: string;
  status: ConversionStatus;
  resultUrl?: string;
  resultSize?: number;
  error?: string;
  completedAt?: number;
  pointsEarned?: number;
  badgesEarned?: string[];
}

// Define conversion options type
export interface ConversionOptions {
  quality?: 'low' | 'medium' | 'high';
  preserveMetadata?: boolean;
  pageRange?: string; // For PDF conversions
  customOptions?: Record<string, any>;
}

/**
 * Convert a file from one format to another
 * @param job The conversion job
 * @param options Conversion options
 * @returns Promise with conversion result
 */
export async function convertFile(
  job: ConversionJob,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const conversionService = new ConversionService(job, options);
  return conversionService.run();
}

/**
 * Perform the actual conversion using appropriate tools
 * This is where we would integrate with libraries like FFmpeg, ImageMagick, etc.
 */
async function performConversion(
  sourceFile: string,
  outputFile: string,
  sourceFormat: string,
  targetFormat: string,
  options: ConversionOptions,
  jobId: string
): Promise<void> {
  // Determine conversion type
  const conversionType = getConversionType(sourceFormat, targetFormat);
  
  // Set up progress tracking
  const updateProgress = async (progress: number) => {
    await setCache(`progress:${jobId}`, progress, 60 * 60 * 24);
  };
  
  // Perform conversion based on type
  switch (conversionType) {
    case 'image':
      await convertImage(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress);
      break;
    case 'document':
      await convertDocument(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress);
      break;
    case 'audio':
      await convertAudio(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress);
      break;
    case 'video':
      await convertVideo(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress);
      break;
    default:
      throw new Error(`Unsupported conversion: ${sourceFormat} to ${targetFormat}`);
  }
}

/**
 * Determine the type of conversion based on source and target formats
 */
function getConversionType(sourceFormat: string, targetFormat: string): string {
  const sourceFormatObj = getFileFormatByExtension(sourceFormat);
  const targetFormatObj = getFileFormatByExtension(targetFormat);
  
  if (!sourceFormatObj || !targetFormatObj) {
    throw new Error(`Invalid format: ${!sourceFormatObj ? sourceFormat : targetFormat}`);
  }
  
  // If both formats are in the same category, return that category
  if (sourceFormatObj.category.id === targetFormatObj.category.id) {
    return sourceFormatObj.category.id;
  }
  
  // Special case for PDF conversions
  if (
    (sourceFormatObj.extension === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(targetFormatObj.extension)) ||
    (targetFormatObj.extension === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(sourceFormatObj.extension))
  ) {
    return 'document';
  }
  
  // Special case for image to PDF
  if (
    (sourceFormatObj.category.id === 'image' && targetFormatObj.extension === 'pdf') ||
    (targetFormatObj.category.id === 'image' && sourceFormatObj.extension === 'pdf')
  ) {
    return 'document';
  }
  
  throw new Error(`Unsupported conversion between ${sourceFormat} and ${targetFormat}`);
}

/**
 * Convert image files using ImageMagick
 */
async function convertImage(
  sourceFile: string,
  outputFile: string,
  sourceFormat: string,
  targetFormat: string,
  options: ConversionOptions,
  updateProgress: (progress: number) => Promise<void>
): Promise<void> {
  // In a real implementation, we would use ImageMagick or similar
  // For now, we'll simulate the conversion with progress updates
  
  // Example of how we might use ImageMagick
  const quality = options.quality === 'high' ? 100 : options.quality === 'medium' ? 80 : 60;
  
  try {
    // Update progress to 10%
    await updateProgress(10);
    
    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update progress to 50%
    await updateProgress(50);
    
    // Example command for ImageMagick (commented out for simulation)
    // const command = `convert ${sourceFile} -quality ${quality} ${outputFile}`;
    // await execPromise(command);
    
    // For simulation, just copy the file
    fs.copyFileSync(sourceFile, outputFile);
    
    // Update progress to 100%
    await updateProgress(100);
  } catch (error) {
    console.error('Image conversion error:', error);
    throw error;
  }
}

/**
 * Convert document files using appropriate libraries
 */
async function convertDocument(
  sourceFile: string,
  outputFile: string,
  sourceFormat: string,
  targetFormat: string,
  options: ConversionOptions,
  updateProgress: (progress: number) => Promise<void>
): Promise<void> {
  // In a real implementation, we would use libraries like LibreOffice, pdf.js, etc.
  // For now, we'll simulate the conversion with progress updates
  
  try {
    // Update progress to 10%
    await updateProgress(10);
    
    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update progress to 30%
    await updateProgress(30);
    
    // Simulate more processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update progress to 70%
    await updateProgress(70);
    
    // For simulation, just copy the file
    fs.copyFileSync(sourceFile, outputFile);
    
    // Update progress to 100%
    await updateProgress(100);
  } catch (error) {
    console.error('Document conversion error:', error);
    throw error;
  }
}

/**
 * Convert audio files using FFmpeg
 */
async function convertAudio(
  sourceFile: string,
  outputFile: string,
  sourceFormat: string,
  targetFormat: string,
  options: ConversionOptions,
  updateProgress: (progress: number) => Promise<void>
): Promise<void> {
  // In a real implementation, we would use FFmpeg
  // For now, we'll simulate the conversion with progress updates
  
  try {
    // Update progress to 10%
    await updateProgress(10);
    
    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update progress to 40%
    await updateProgress(40);
    
    // Example command for FFmpeg (commented out for simulation)
    // const bitrate = options.quality === 'high' ? '320k' : options.quality === 'medium' ? '192k' : '128k';
    // const command = `ffmpeg -i ${sourceFile} -b:a ${bitrate} ${outputFile}`;
    // await execPromise(command);
    
    // Simulate more processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update progress to 80%
    await updateProgress(80);
    
    // For simulation, just copy the file
    fs.copyFileSync(sourceFile, outputFile);
    
    // Update progress to 100%
    await updateProgress(100);
  } catch (error) {
    console.error('Audio conversion error:', error);
    throw error;
  }
}

/**
 * Convert video files using FFmpeg
 */
async function convertVideo(
  sourceFile: string,
  outputFile: string,
  sourceFormat: string,
  targetFormat: string,
  options: ConversionOptions,
  updateProgress: (progress: number) => Promise<void>
): Promise<void> {
  // In a real implementation, we would use FFmpeg
  // For now, we'll simulate the conversion with progress updates
  
  try {
    // Update progress to 5%
    await updateProgress(5);
    
    // Simulate conversion delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update progress to 20%
    await updateProgress(20);
    
    // Example command for FFmpeg (commented out for simulation)
    // const preset = options.quality === 'high' ? 'slow' : options.quality === 'medium' ? 'medium' : 'fast';
    // const command = `ffmpeg -i ${sourceFile} -c:v libx264 -preset ${preset} -c:a aac ${outputFile}`;
    // await execPromise(command);
    
    // Simulate more processing with multiple progress updates
    for (let progress = 30; progress <= 90; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 800));
      await updateProgress(progress);
    }
    
    // For simulation, just copy the file
    fs.copyFileSync(sourceFile, outputFile);
    
    // Update progress to 100%
    await updateProgress(100);
  } catch (error) {
    console.error('Video conversion error:', error);
    throw error;
  }
}

/**
 * Get supported formats for conversion
 * @returns Object with supported formats
 */
export function getSupportedFormats() {
  return {
    document: {
      from: ['pdf', 'docx', 'xlsx', 'pptx'],
      to: ['pdf', 'docx', 'xlsx', 'pptx'],
    },
    image: {
      from: ['jpg', 'png', 'heic', 'webp', 'raw'],
      to: ['jpg', 'png', 'webp'],
    },
    audio: {
      from: ['mp4', 'wav', 'flac', 'm4a'],
      to: ['mp3'],
    },
    video: {
      from: ['mov', 'avi', 'mkv', 'webm'],
      to: ['mp4'],
    },
  };
}

/**
 * Calculate points earned for a conversion
 * @param fileSize File size in bytes
 * @param targetFormat Target format
 * @returns Points earned
 */
export function calculateConversionPoints(fileSize: number, targetFormat: string): number {
  // Base points for any conversion
  let points = 10;
  
  // Add points based on file size (1 point per MB, max 50)
  const fileSizeMB = fileSize / (1024 * 1024);
  points += Math.min(Math.floor(fileSizeMB), 50);
  
  // Add points based on target format complexity
  const complexFormats = ['pdf', 'mp4', 'webp'];
  if (complexFormats.includes(targetFormat.toLowerCase())) {
    points += 15;
  }
  
  return points;
}

/**
 * Check if user earned any badges from this conversion
 * @param userId User ID
 * @param sourceFormat Source format
 * @param targetFormat Target format
 * @returns Array of badge IDs earned
 */
export async function checkForBadgeEarning(
  userId: string,
  sourceFormat: string,
  targetFormat: string
): Promise<string[]> {
  try {
    // Get user's conversion stats from Redis
    const stats = await getCache<{
      totalConversions: number;
      totalPoints: number;
      uniqueFormats: string[];
    }>(`user:${userId}:stats`) || {
      totalConversions: 0,
      totalPoints: 0,
      uniqueFormats: [],
    };
    
    // Update stats
    stats.totalConversions += 1;
    stats.totalPoints += calculateConversionPoints(0, targetFormat); // We don't have file size here
    
    // Add unique formats
    const formatPair = `${sourceFormat}-${targetFormat}`;
    if (!stats.uniqueFormats.includes(formatPair)) {
      stats.uniqueFormats.push(formatPair);
    }
    
    // Save updated stats
    await setCache(`user:${userId}:stats`, stats, 0); // No expiration
    
    // Check for badges
    const earnedBadges: string[] = [];
    
    // Conversion count badges
    if (stats.totalConversions >= 100) earnedBadges.push('conversion-master');
    else if (stats.totalConversions >= 50) earnedBadges.push('conversion-pro');
    else if (stats.totalConversions >= 10) earnedBadges.push('conversion-enthusiast');
    else if (stats.totalConversions >= 1) earnedBadges.push('first-conversion');
    
    // Points badges
    if (stats.totalPoints >= 1000) earnedBadges.push('points-legend');
    else if (stats.totalPoints >= 500) earnedBadges.push('points-master');
    else if (stats.totalPoints >= 100) earnedBadges.push('points-collector');
    
    // Format variety badges
    if (stats.uniqueFormats.length >= 15) earnedBadges.push('format-explorer');
    else if (stats.uniqueFormats.length >= 8) earnedBadges.push('format-adventurer');
    else if (stats.uniqueFormats.length >= 3) earnedBadges.push('format-curious');
    
    // Special badges for specific conversions
    if (sourceFormat === 'heic' && targetFormat === 'jpg') earnedBadges.push('iphone-liberator');
    if (sourceFormat === 'raw' && targetFormat === 'jpg') earnedBadges.push('photographer');
    if (sourceFormat === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(targetFormat)) earnedBadges.push('pdf-hacker');
    if (['mov', 'avi', 'mkv'].includes(sourceFormat) && targetFormat === 'mp4') earnedBadges.push('video-wizard');
    
    return earnedBadges;
  } catch (error) {
    console.error('Badge earning check error:', error);
    return [];
  }
}

/**
 * Clean up old conversion jobs and files
 * @param olderThan Time in milliseconds (default: 24 hours)
 */
export async function cleanupOldConversions(olderThan: number = 24 * 60 * 60 * 1000): Promise<void> {
  try {
    // This would be implemented as a scheduled job
    // For now, we'll just provide the implementation
    
    // Get all conversion jobs from Redis
    // In a real implementation, we would use Redis scan or a database query
    
    // For each job older than the specified time
    const cutoffTime = Date.now() - olderThan;
    
    // Example cleanup logic (commented out as we don't have actual Redis scanning)
    /*
    const jobs = await getAllConversionJobs();
    
    for (const job of jobs) {
      if (job.createdAt < cutoffTime) {
        // Delete source file
        if (job.sourceFile && fs.existsSync(job.sourceFile)) {
          await deleteFile(job.sourceFile);
        }
        
        // Delete result file if exists
        const result = await getCache<ConversionResult>(`result:${job.jobId}`);
        if (result?.resultUrl) {
          const resultFile = path.join(process.cwd(), 'uploads', 'output', path.basename(result.resultUrl));
          if (fs.existsSync(resultFile)) {
            await deleteFile(resultFile);
          }
        }
        
        // Delete Redis keys
        await deleteCache(`conversion:${job.jobId}`);
        await deleteCache(`progress:${job.jobId}`);
        await deleteCache(`result:${job.jobId}`);
      }
    }
    */
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}