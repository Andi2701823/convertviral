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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileSize = exports.validateFileType = void 0;
exports.ensureUploadDir = ensureUploadDir;
exports.saveUploadedFile = saveUploadedFile;
exports.deleteFile = deleteFile;
exports.getExtensionFromMimetype = getExtensionFromMimetype;
exports.calculateFileHash = calculateFileHash;
exports.scanFileForViruses = scanFileForViruses;
exports.checkRateLimits = checkRateLimits;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const fileTypes_1 = require("./fileTypes");
// Re-export the validation functions
exports.validateFileType = fileTypes_1.validateFileType;
exports.validateFileSize = fileTypes_1.validateFileSize;
const redis_1 = require("./redis");
const crypto = __importStar(require("crypto"));
/**
 * Ensure upload directory exists
 * @param customDir Optional custom directory path
 * @returns Path to upload directory
 */
function ensureUploadDir(customDir) {
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
async function saveUploadedFile(file, userId, isPremium = false) {
    try {
        // Ensure upload directory exists
        const uploadDir = ensureUploadDir();
        // Generate unique filename
        const originalName = file.name || 'unknown';
        const extension = path.extname(originalName).toLowerCase();
        const mimeType = file.type || 'application/octet-stream';
        const fileSize = file.size || 0;
        // Validate file type and size
        await (0, exports.validateFileType)(mimeType, extension.substring(1));
        await (0, exports.validateFileSize)(fileSize, isPremium);
        // Generate a unique filename with UUID
        const uniqueId = (0, uuid_1.v4)();
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
        }
        else {
            // Otherwise, create a dummy file
            fs.writeFileSync(filePath, 'Simulated file content');
        }
        // Create uploaded file object
        const uploadedFile = {
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
        await (0, redis_1.setCache)(`file:${uniqueId}`, uploadedFile, 60 * 60 * 24);
        return uploadedFile;
    }
    catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
}
/**
 * Delete a file from disk
 * @param filePath Path to file
 * @returns Promise<void>
 */
async function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    catch (error) {
        console.error('File deletion error:', error);
        throw error;
    }
}
/**
 * Get file extension from MIME type
 * @param mimeType MIME type
 * @returns File extension
 */
function getExtensionFromMimetype(mimeType) {
    const mimeMap = {
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
async function calculateFileHash(filePath) {
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
        }
        catch (error) {
            reject(error);
        }
    });
}
/**
 * Scan file for viruses (mock implementation)
 * @param filePath Path to file
 * @returns Promise<boolean> True if file is safe
 */
async function scanFileForViruses(filePath) {
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
async function checkRateLimits(userId, isPremium) {
    // In a real implementation, we would check Redis for rate limits
    // For now, we'll just return false (not exceeded)
    return false;
}
