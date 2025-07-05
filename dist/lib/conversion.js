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
exports.convertFile = convertFile;
exports.getSupportedFormats = getSupportedFormats;
exports.calculateConversionPoints = calculateConversionPoints;
exports.checkForBadgeEarning = checkForBadgeEarning;
exports.cleanupOldConversions = cleanupOldConversions;
var redis_1 = require("./redis");
var fileTypes_1 = require("./fileTypes");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var child_process_1 = require("child_process");
var util = __importStar(require("util"));
// Convert exec to Promise-based
var execPromise = util.promisify(child_process_1.exec);
/**
 * Convert a file from one format to another
 * @param job The conversion job
 * @param options Conversion options
 * @returns Promise with conversion result
 */
function convertFile(job_1) {
    return __awaiter(this, arguments, void 0, function (job, options) {
        var outputDir, sourceExt, baseName, targetExt, outputFile, stats, pointsEarned, badgesEarned, result, error_1, result;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 11]);
                    // Update job status to PROCESSING
                    job.status = 'PROCESSING';
                    return [4 /*yield*/, (0, redis_1.setCache)("conversion:".concat(job.jobId), job, 60 * 60 * 24)];
                case 1:
                    _a.sent(); // 24 hours TTL
                    // Set initial progress
                    return [4 /*yield*/, (0, redis_1.setCache)("progress:".concat(job.jobId), 0, 60 * 60 * 24)];
                case 2:
                    // Set initial progress
                    _a.sent();
                    outputDir = path.join(process.cwd(), 'uploads', 'output');
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, { recursive: true });
                    }
                    sourceExt = path.extname(job.sourceFile);
                    baseName = path.basename(job.sourceFile, sourceExt);
                    targetExt = ".".concat(job.targetFormat.toLowerCase());
                    outputFile = path.join(outputDir, "".concat(baseName, "_").concat(Date.now()).concat(targetExt));
                    // Perform the conversion based on source and target formats
                    return [4 /*yield*/, performConversion(job.sourceFile, outputFile, job.sourceFormat, job.targetFormat, options, job.jobId)];
                case 3:
                    // Perform the conversion based on source and target formats
                    _a.sent();
                    // Check if output file exists
                    if (!fs.existsSync(outputFile)) {
                        throw new Error('Conversion failed: Output file not created');
                    }
                    stats = fs.statSync(outputFile);
                    // Set final progress
                    return [4 /*yield*/, (0, redis_1.setCache)("progress:".concat(job.jobId), 100, 60 * 60 * 24)];
                case 4:
                    // Set final progress
                    _a.sent();
                    pointsEarned = calculateConversionPoints(job.sourceSize, job.targetFormat);
                    return [4 /*yield*/, checkForBadgeEarning(job.userId, job.sourceFormat, job.targetFormat)];
                case 5:
                    badgesEarned = _a.sent();
                    result = {
                        jobId: job.jobId,
                        status: 'COMPLETED',
                        resultUrl: "/api/download?file=".concat(path.basename(outputFile)),
                        resultSize: stats.size,
                        completedAt: Date.now(),
                        pointsEarned: pointsEarned,
                        badgesEarned: badgesEarned,
                    };
                    // Update job status to COMPLETED
                    job.status = 'COMPLETED';
                    return [4 /*yield*/, (0, redis_1.setCache)("conversion:".concat(job.jobId), job, 60 * 60 * 24)];
                case 6:
                    _a.sent();
                    // Store result in Redis
                    return [4 /*yield*/, (0, redis_1.setCache)("result:".concat(job.jobId), result, 60 * 60 * 24)];
                case 7:
                    // Store result in Redis
                    _a.sent();
                    return [2 /*return*/, result];
                case 8:
                    error_1 = _a.sent();
                    console.error('Conversion error:', error_1);
                    // Update job status to FAILED
                    job.status = 'FAILED';
                    return [4 /*yield*/, (0, redis_1.setCache)("conversion:".concat(job.jobId), job, 60 * 60 * 24)];
                case 9:
                    _a.sent();
                    result = {
                        jobId: job.jobId,
                        status: 'FAILED',
                        error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                        completedAt: Date.now(),
                    };
                    // Store result in Redis
                    return [4 /*yield*/, (0, redis_1.setCache)("result:".concat(job.jobId), result, 60 * 60 * 24)];
                case 10:
                    // Store result in Redis
                    _a.sent();
                    return [2 /*return*/, result];
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * Perform the actual conversion using appropriate tools
 * This is where we would integrate with libraries like FFmpeg, ImageMagick, etc.
 */
function performConversion(sourceFile, outputFile, sourceFormat, targetFormat, options, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var conversionType, updateProgress, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    conversionType = getConversionType(sourceFormat, targetFormat);
                    updateProgress = function (progress) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, redis_1.setCache)("progress:".concat(jobId), progress, 60 * 60 * 24)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _a = conversionType;
                    switch (_a) {
                        case 'image': return [3 /*break*/, 1];
                        case 'document': return [3 /*break*/, 3];
                        case 'audio': return [3 /*break*/, 5];
                        case 'video': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, convertImage(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 3: return [4 /*yield*/, convertDocument(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 5: return [4 /*yield*/, convertAudio(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, convertVideo(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress)];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 9: throw new Error("Unsupported conversion: ".concat(sourceFormat, " to ").concat(targetFormat));
                case 10: return [2 /*return*/];
            }
        });
    });
}
/**
 * Determine the type of conversion based on source and target formats
 */
function getConversionType(sourceFormat, targetFormat) {
    var sourceFormatObj = (0, fileTypes_1.getFileFormatByExtension)(sourceFormat);
    var targetFormatObj = (0, fileTypes_1.getFileFormatByExtension)(targetFormat);
    if (!sourceFormatObj || !targetFormatObj) {
        throw new Error("Invalid format: ".concat(!sourceFormatObj ? sourceFormat : targetFormat));
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
    throw new Error("Unsupported conversion between ".concat(sourceFormat, " and ").concat(targetFormat));
}
/**
 * Convert image files using ImageMagick
 */
function convertImage(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var quality, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    quality = options.quality === 'high' ? 100 : options.quality === 'medium' ? 80 : 60;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    // Update progress to 10%
                    return [4 /*yield*/, updateProgress(10)];
                case 2:
                    // Update progress to 10%
                    _a.sent();
                    // Simulate conversion delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 3:
                    // Simulate conversion delay
                    _a.sent();
                    // Update progress to 50%
                    return [4 /*yield*/, updateProgress(50)];
                case 4:
                    // Update progress to 50%
                    _a.sent();
                    // Example command for ImageMagick (commented out for simulation)
                    // const command = `convert ${sourceFile} -quality ${quality} ${outputFile}`;
                    // await execPromise(command);
                    // For simulation, just copy the file
                    fs.copyFileSync(sourceFile, outputFile);
                    // Update progress to 100%
                    return [4 /*yield*/, updateProgress(100)];
                case 5:
                    // Update progress to 100%
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Image conversion error:', error_2);
                    throw error_2;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Convert document files using appropriate libraries
 */
function convertDocument(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    // Update progress to 10%
                    return [4 /*yield*/, updateProgress(10)];
                case 1:
                    // Update progress to 10%
                    _a.sent();
                    // Simulate conversion delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 2:
                    // Simulate conversion delay
                    _a.sent();
                    // Update progress to 30%
                    return [4 /*yield*/, updateProgress(30)];
                case 3:
                    // Update progress to 30%
                    _a.sent();
                    // Simulate more processing
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 4:
                    // Simulate more processing
                    _a.sent();
                    // Update progress to 70%
                    return [4 /*yield*/, updateProgress(70)];
                case 5:
                    // Update progress to 70%
                    _a.sent();
                    // For simulation, just copy the file
                    fs.copyFileSync(sourceFile, outputFile);
                    // Update progress to 100%
                    return [4 /*yield*/, updateProgress(100)];
                case 6:
                    // Update progress to 100%
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    console.error('Document conversion error:', error_3);
                    throw error_3;
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Convert audio files using FFmpeg
 */
function convertAudio(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    // Update progress to 10%
                    return [4 /*yield*/, updateProgress(10)];
                case 1:
                    // Update progress to 10%
                    _a.sent();
                    // Simulate conversion delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // Simulate conversion delay
                    _a.sent();
                    // Update progress to 40%
                    return [4 /*yield*/, updateProgress(40)];
                case 3:
                    // Update progress to 40%
                    _a.sent();
                    // Example command for FFmpeg (commented out for simulation)
                    // const bitrate = options.quality === 'high' ? '320k' : options.quality === 'medium' ? '192k' : '128k';
                    // const command = `ffmpeg -i ${sourceFile} -b:a ${bitrate} ${outputFile}`;
                    // await execPromise(command);
                    // Simulate more processing
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 4:
                    // Example command for FFmpeg (commented out for simulation)
                    // const bitrate = options.quality === 'high' ? '320k' : options.quality === 'medium' ? '192k' : '128k';
                    // const command = `ffmpeg -i ${sourceFile} -b:a ${bitrate} ${outputFile}`;
                    // await execPromise(command);
                    // Simulate more processing
                    _a.sent();
                    // Update progress to 80%
                    return [4 /*yield*/, updateProgress(80)];
                case 5:
                    // Update progress to 80%
                    _a.sent();
                    // For simulation, just copy the file
                    fs.copyFileSync(sourceFile, outputFile);
                    // Update progress to 100%
                    return [4 /*yield*/, updateProgress(100)];
                case 6:
                    // Update progress to 100%
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    console.error('Audio conversion error:', error_4);
                    throw error_4;
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Convert video files using FFmpeg
 */
function convertVideo(sourceFile, outputFile, sourceFormat, targetFormat, options, updateProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    // Update progress to 5%
                    return [4 /*yield*/, updateProgress(5)];
                case 1:
                    // Update progress to 5%
                    _a.sent();
                    // Simulate conversion delay
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // Simulate conversion delay
                    _a.sent();
                    // Update progress to 20%
                    return [4 /*yield*/, updateProgress(20)];
                case 3:
                    // Update progress to 20%
                    _a.sent();
                    progress = 30;
                    _a.label = 4;
                case 4:
                    if (!(progress <= 90)) return [3 /*break*/, 8];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, updateProgress(progress)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    progress += 10;
                    return [3 /*break*/, 4];
                case 8:
                    // For simulation, just copy the file
                    fs.copyFileSync(sourceFile, outputFile);
                    // Update progress to 100%
                    return [4 /*yield*/, updateProgress(100)];
                case 9:
                    // Update progress to 100%
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_5 = _a.sent();
                    console.error('Video conversion error:', error_5);
                    throw error_5;
                case 11: return [2 /*return*/];
            }
        });
    });
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
    var points = 10;
    // Add points based on file size (1 point per MB, max 50)
    var fileSizeMB = fileSize / (1024 * 1024);
    points += Math.min(Math.floor(fileSizeMB), 50);
    // Add points based on target format complexity
    var complexFormats = ['pdf', 'mp4', 'webp'];
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
function checkForBadgeEarning(userId, sourceFormat, targetFormat) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, formatPair, earnedBadges, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, redis_1.getCache)("user:".concat(userId, ":stats"))];
                case 1:
                    stats = (_a.sent()) || {
                        totalConversions: 0,
                        totalPoints: 0,
                        uniqueFormats: [],
                    };
                    // Update stats
                    stats.totalConversions += 1;
                    stats.totalPoints += calculateConversionPoints(0, targetFormat); // We don't have file size here
                    formatPair = "".concat(sourceFormat, "-").concat(targetFormat);
                    if (!stats.uniqueFormats.includes(formatPair)) {
                        stats.uniqueFormats.push(formatPair);
                    }
                    // Save updated stats
                    return [4 /*yield*/, (0, redis_1.setCache)("user:".concat(userId, ":stats"), stats, 0)];
                case 2:
                    // Save updated stats
                    _a.sent(); // No expiration
                    earnedBadges = [];
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
                    return [2 /*return*/, earnedBadges];
                case 3:
                    error_6 = _a.sent();
                    console.error('Badge earning check error:', error_6);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Clean up old conversion jobs and files
 * @param olderThan Time in milliseconds (default: 24 hours)
 */
function cleanupOldConversions() {
    return __awaiter(this, arguments, void 0, function (olderThan) {
        var cutoffTime;
        if (olderThan === void 0) { olderThan = 24 * 60 * 60 * 1000; }
        return __generator(this, function (_a) {
            try {
                cutoffTime = Date.now() - olderThan;
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
            return [2 /*return*/];
        });
    });
}
