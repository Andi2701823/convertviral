"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCDNDir = ensureCDNDir;
exports.uploadToCDN = uploadToCDN;
exports.getCDNFile = getCDNFile;
exports.deleteFromCDN = deleteFromCDN;
exports.cleanupExpiredCDNFiles = cleanupExpiredCDNFiles;
exports.generatePresignedURL = generatePresignedURL;
exports.validatePresignedURL = validatePresignedURL;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const uuid_1 = require("uuid");
const redis_1 = require("./redis");
const fileTypes_1 = require("./fileTypes");
const copyFile = (0, util_1.promisify)(fs_1.default.copyFile);
const mkdir = (0, util_1.promisify)(fs_1.default.mkdir);
// Base URL for local development
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
// In production, this would be your actual CDN URL
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || LOCAL_BASE_URL;
// CDN directory (in a real implementation, this would be configured differently)
const CDN_DIR = path_1.default.join(process.cwd(), 'public', 'cdn');
/**
 * Ensure the CDN directory exists
 */
async function ensureCDNDir() {
    try {
        await mkdir(CDN_DIR, { recursive: true });
    }
    catch (error) {
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
async function uploadToCDN(sourcePath, fileName, mimeType, ttlHours = 24) {
    try {
        // Ensure CDN directory exists
        await ensureCDNDir();
        // Generate a unique ID for the file
        const fileId = (0, uuid_1.v4)();
        const safeFileName = encodeURIComponent(path_1.default.basename(fileName));
        const cdnFileName = `${fileId}-${safeFileName}`;
        const cdnFilePath = path_1.default.join(CDN_DIR, cdnFileName);
        // Copy the file to the CDN directory
        await copyFile(sourcePath, cdnFilePath);
        // Get file size
        const stats = fs_1.default.statSync(cdnFilePath);
        const fileSize = stats.size;
        const formattedSize = (0, fileTypes_1.formatFileSize)(fileSize);
        // Calculate expiry time
        const expiresAt = Date.now() + ttlHours * 60 * 60 * 1000;
        // Create CDN file information
        const cdnFile = {
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
        const redis = await (0, redis_1.getRedisClient)();
        await redis.set(`cdn:${cdnFileName}`, JSON.stringify(cdnFile), {
            EX: ttlHours * 60 * 60,
        });
        return cdnFile;
    }
    catch (error) {
        console.error('Error uploading to CDN:', error);
        throw new Error('Failed to upload file to CDN');
    }
}
/**
 * Get CDN file information
 * @param cdnFileName CDN file name
 * @returns CDN file information or null if not found
 */
async function getCDNFile(cdnFileName) {
    try {
        const redis = await (0, redis_1.getRedisClient)();
        const cdnFileJson = await redis.get(`cdn:${cdnFileName}`);
        if (!cdnFileJson) {
            return null;
        }
        const cdnFile = JSON.parse(cdnFileJson);
        // Check if file has expired
        if (cdnFile.expiresAt < Date.now()) {
            // Delete expired file information from Redis
            await redis.del(`cdn:${cdnFileName}`);
            // Delete expired file from disk
            if (fs_1.default.existsSync(cdnFile.filePath)) {
                fs_1.default.unlinkSync(cdnFile.filePath);
            }
            return null;
        }
        return cdnFile;
    }
    catch (error) {
        console.error('Error getting CDN file:', error);
        return null;
    }
}
/**
 * Delete a file from the CDN
 * @param cdnFileName CDN file name
 * @returns Promise<boolean> indicating success
 */
async function deleteFromCDN(cdnFileName) {
    try {
        const cdnFile = await getCDNFile(cdnFileName);
        if (!cdnFile) {
            return false;
        }
        // Delete file from disk
        if (fs_1.default.existsSync(cdnFile.filePath)) {
            fs_1.default.unlinkSync(cdnFile.filePath);
        }
        // Delete file information from Redis
        const redis = await (0, redis_1.getRedisClient)();
        await redis.del(`cdn:${cdnFileName}`);
        return true;
    }
    catch (error) {
        console.error('Error deleting from CDN:', error);
        return false;
    }
}
/**
 * Clean up expired CDN files
 * This should be run periodically (e.g., via a cron job)
 */
async function cleanupExpiredCDNFiles() {
    try {
        const redis = await (0, redis_1.getRedisClient)();
        const now = Date.now();
        // Get all CDN file keys
        const keys = await redis.keys('cdn:*');
        for (const key of keys) {
            const cdnFileJson = await redis.get(key);
            if (cdnFileJson) {
                const cdnFile = JSON.parse(cdnFileJson);
                // Check if file has expired
                if (cdnFile.expiresAt < now) {
                    // Delete expired file from disk
                    if (fs_1.default.existsSync(cdnFile.filePath)) {
                        fs_1.default.unlinkSync(cdnFile.filePath);
                    }
                    // Delete expired file information from Redis
                    await redis.del(key);
                }
            }
        }
    }
    catch (error) {
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
async function generatePresignedURL(cdnFileName, expiryMinutes = 15) {
    try {
        const cdnFile = await getCDNFile(cdnFileName);
        if (!cdnFile) {
            return null;
        }
        // In a real implementation, this would generate a signed URL for a cloud CDN
        // For now, we'll just add a token parameter to the URL
        const token = (0, uuid_1.v4)();
        const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
        // Store the token in Redis
        const redis = await (0, redis_1.getRedisClient)();
        await redis.set(`cdn:token:${token}`, cdnFileName, {
            EX: expiryMinutes * 60,
        });
        return `${CDN_BASE_URL}/cdn/${cdnFileName}?token=${token}&expires=${expiryTime}`;
    }
    catch (error) {
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
async function validatePresignedURL(token, expiryTime) {
    try {
        // Check if the URL has expired
        if (expiryTime < Date.now()) {
            return null;
        }
        // Check if the token is valid
        const redis = await (0, redis_1.getRedisClient)();
        const cdnFileName = await redis.get(`cdn:token:${token}`);
        return cdnFileName;
    }
    catch (error) {
        console.error('Error validating pre-signed URL:', error);
        return null;
    }
}
