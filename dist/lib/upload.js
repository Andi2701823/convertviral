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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileSize = exports.validateFileType = void 0;
exports.ensureUploadDir = ensureUploadDir;
exports.saveUploadedFile = saveUploadedFile;
exports.deleteFile = deleteFile;
exports.getExtensionFromMimetype = getExtensionFromMimetype;
exports.calculateFileHash = calculateFileHash;
exports.scanFileForViruses = scanFileForViruses;
exports.checkRateLimits = checkRateLimits;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var uuid_1 = require("uuid");
var fileTypes_1 = require("./fileTypes");
// Re-export the validation functions
exports.validateFileType = fileTypes_1.validateFileType;
exports.validateFileSize = fileTypes_1.validateFileSize;
var redis_1 = require("./redis");
var crypto = __importStar(require("crypto"));
/**
 * Ensure upload directory exists
 * @param customDir Optional custom directory path
 * @returns Path to upload directory
 */
function ensureUploadDir(customDir) {
    var uploadDir = customDir || path.join(process.cwd(), 'uploads', 'temp');
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
function saveUploadedFile(file_1, userId_1) {
    return __awaiter(this, arguments, void 0, function (file, userId, isPremium) {
        var uploadDir, originalName, extension, mimeType, fileSize, uniqueId, fileName, filePath, writeStream, uploadedFile, error_1;
        if (isPremium === void 0) { isPremium = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    uploadDir = ensureUploadDir();
                    originalName = file.name || 'unknown';
                    extension = path.extname(originalName).toLowerCase();
                    mimeType = file.type || 'application/octet-stream';
                    fileSize = file.size || 0;
                    // Validate file type and size
                    return [4 /*yield*/, (0, exports.validateFileType)(mimeType, extension.substring(1))];
                case 1:
                    // Validate file type and size
                    _a.sent();
                    return [4 /*yield*/, (0, exports.validateFileSize)(fileSize, isPremium)];
                case 2:
                    _a.sent();
                    uniqueId = (0, uuid_1.v4)();
                    fileName = "".concat(uniqueId).concat(extension);
                    filePath = path.join(uploadDir, fileName);
                    writeStream = fs.createWriteStream(filePath);
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
                    uploadedFile = {
                        id: uniqueId,
                        originalName: originalName,
                        fileName: fileName,
                        filePath: filePath,
                        fileSize: fileSize,
                        mimeType: mimeType,
                        extension: extension.substring(1),
                        uploadedAt: Date.now(),
                        userId: userId,
                        isPremium: isPremium,
                    };
                    // Store file info in Redis with 24-hour TTL
                    return [4 /*yield*/, (0, redis_1.setCache)("file:".concat(uniqueId), uploadedFile, 60 * 60 * 24)];
                case 3:
                    // Store file info in Redis with 24-hour TTL
                    _a.sent();
                    return [2 /*return*/, uploadedFile];
                case 4:
                    error_1 = _a.sent();
                    console.error('File upload error:', error_1);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a file from disk
 * @param filePath Path to file
 * @returns Promise<void>
 */
function deleteFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            catch (error) {
                console.error('File deletion error:', error);
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Get file extension from MIME type
 * @param mimeType MIME type
 * @returns File extension
 */
function getExtensionFromMimetype(mimeType) {
    var mimeMap = {
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
function calculateFileHash(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        var hash_1 = crypto.createHash('sha256');
                        var stream = fs.createReadStream(filePath);
                        stream.on('data', function (data) {
                            hash_1.update(data);
                        });
                        stream.on('end', function () {
                            resolve(hash_1.digest('hex'));
                        });
                        stream.on('error', function (error) {
                            reject(error);
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
        });
    });
}
/**
 * Scan file for viruses (mock implementation)
 * @param filePath Path to file
 * @returns Promise<boolean> True if file is safe
 */
function scanFileForViruses(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // In a real implementation, we would integrate with a virus scanning service
            // For now, we'll just return true (file is safe)
            return [2 /*return*/, true];
        });
    });
}
/**
 * Check if user has exceeded rate limits
 * @param userId User ID
 * @param isPremium Whether user is premium
 * @returns Promise<boolean> True if rate limit exceeded
 */
function checkRateLimits(userId, isPremium) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // In a real implementation, we would check Redis for rate limits
            // For now, we'll just return false (not exceeded)
            return [2 /*return*/, false];
        });
    });
}
