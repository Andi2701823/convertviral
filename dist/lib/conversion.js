"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFile = convertFile;
exports.getSupportedFormats = getSupportedFormats;
exports.calculateConversionPoints = calculateConversionPoints;
exports.checkForBadgeEarning = checkForBadgeEarning;
exports.cleanupOldConversions = cleanupOldConversions;
const redis_1 = require("./redis");
const fileTypes_1 = require("./fileTypes");
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const util = __importStar(require("util"));
const conversionService_1 = __importDefault(require("./conversionService"));
// Convert exec to Promise-based
const execPromise = util.promisify(child_process_1.exec);
/**
 * Convert a file from one format to another
 * @param job The conversion job
 * @param options Conversion options
 * @returns Promise with conversion result
 */
async function convertFile(job, options = {}) {
    const conversionService = new conversionService_1.default(job, options);
    return conversionService.run();
}
/**
 * Perform the actual conversion using appropriate tools
 * This is where we would integrate with libraries like FFmpeg, ImageMagick, etc.
 */
async function performConversion(sourceFile, outputFile, sourceFormat, targetFormat, options, jobId) {
    // Determine conversion type
    const conversionType = getConversionType(sourceFormat, targetFormat);
    // Set up progress tracking
    const updateProgress = async (progress) => {
        await (0, redis_1.setCache)(`progress:${jobId}`, progress, 60 * 60 * 24);
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
function getConversionType(sourceFormat, targetFormat) {
    const sourceFormatObj = (0, fileTypes_1.getFileFormatByExtension)(sourceFormat);
    const targetFormatObj = (0, fileTypes_1.getFileFormatByExtension)(targetFormat);
    if (!sourceFormatObj || !targetFormatObj) {
        throw new Error(`Invalid format: ${!sourceFormatObj ? sourceFormat : targetFormat}`);
    }
    // If both formats are in the same category, return that category
    if (sourceFormatObj.category.id === targetFormatObj.category.id) {
        return sourceFormatObj.category.id;
    }
    // Special case for PDF conversions
    if ((sourceFormatObj.extension === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(targetFormatObj.extension)) ||
        (targetFormatObj.extension === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(sourceFormatObj.extension))) {
        return 'document';
    }
    // Special case for image to PDF
    if ((sourceFormatObj.category.id === 'image' && targetFormatObj.extension === 'pdf') ||
        (targetFormatObj.category.id === 'image' && sourceFormatObj.extension === 'pdf')) {
        return 'document';
    }
    throw new Error(`Unsupported conversion between ${sourceFormat} and ${targetFormat}`);
}
/**
 * Convert image files using ImageMagick
 */
async function convertImage(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
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
    }
    catch (error) {
        console.error('Image conversion error:', error);
        throw error;
    }
}
/**
 * Convert document files using appropriate libraries
 */
async function convertDocument(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
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
    }
    catch (error) {
        console.error('Document conversion error:', error);
        throw error;
    }
}
/**
 * Convert audio files using FFmpeg
 */
async function convertAudio(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
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
    }
    catch (error) {
        console.error('Audio conversion error:', error);
        throw error;
    }
}
/**
 * Convert video files using FFmpeg
 */
async function convertVideo(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
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
    }
    catch (error) {
        console.error('Video conversion error:', error);
        throw error;
    }
}
/**
 * Get supported formats for conversion
 * @returns Object with supported formats
 */
function getSupportedFormats() {
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
function calculateConversionPoints(fileSize, targetFormat) {
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
async function checkForBadgeEarning(userId, sourceFormat, targetFormat) {
    try {
        // Get user's conversion stats from Redis
        const stats = await (0, redis_1.getCache)(`user:${userId}:stats`) || {
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
        await (0, redis_1.setCache)(`user:${userId}:stats`, stats, 0); // No expiration
        // Check for badges
        const earnedBadges = [];
        // Conversion count badges
        if (stats.totalConversions >= 100)
            earnedBadges.push('conversion-master');
        else if (stats.totalConversions >= 50)
            earnedBadges.push('conversion-pro');
        else if (stats.totalConversions >= 10)
            earnedBadges.push('conversion-enthusiast');
        else if (stats.totalConversions >= 1)
            earnedBadges.push('first-conversion');
        // Points badges
        if (stats.totalPoints >= 1000)
            earnedBadges.push('points-legend');
        else if (stats.totalPoints >= 500)
            earnedBadges.push('points-master');
        else if (stats.totalPoints >= 100)
            earnedBadges.push('points-collector');
        // Format variety badges
        if (stats.uniqueFormats.length >= 15)
            earnedBadges.push('format-explorer');
        else if (stats.uniqueFormats.length >= 8)
            earnedBadges.push('format-adventurer');
        else if (stats.uniqueFormats.length >= 3)
            earnedBadges.push('format-curious');
        // Special badges for specific conversions
        if (sourceFormat === 'heic' && targetFormat === 'jpg')
            earnedBadges.push('iphone-liberator');
        if (sourceFormat === 'raw' && targetFormat === 'jpg')
            earnedBadges.push('photographer');
        if (sourceFormat === 'pdf' && ['docx', 'xlsx', 'pptx'].includes(targetFormat))
            earnedBadges.push('pdf-hacker');
        if (['mov', 'avi', 'mkv'].includes(sourceFormat) && targetFormat === 'mp4')
            earnedBadges.push('video-wizard');
        return earnedBadges;
    }
    catch (error) {
        console.error('Badge earning check error:', error);
        return [];
    }
}
/**
 * Clean up old conversion jobs and files
 * @param olderThan Time in milliseconds (default: 24 hours)
 */
async function cleanupOldConversions(olderThan = 24 * 60 * 60 * 1000) {
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
    }
    catch (error) {
        console.error('Cleanup error:', error);
    }
}
