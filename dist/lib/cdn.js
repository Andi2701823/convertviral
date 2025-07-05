"use strict";
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
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var uuid_1 = require("uuid");
var redis_1 = require("./redis");
var fileTypes_1 = require("./fileTypes");
var copyFile = (0, util_1.promisify)(fs_1.default.copyFile);
var mkdir = (0, util_1.promisify)(fs_1.default.mkdir);
// Base URL for local development
var LOCAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
// In production, this would be your actual CDN URL
var CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || LOCAL_BASE_URL;
// CDN directory (in a real implementation, this would be configured differently)
var CDN_DIR = path_1.default.join(process.cwd(), 'public', 'cdn');
/**
 * Ensure the CDN directory exists
 */
function ensureCDNDir() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mkdir(CDN_DIR, { recursive: true })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error creating CDN directory:', error_1);
                    throw new Error('Failed to create CDN directory');
                case 3: return [2 /*return*/];
            }
        });
    });
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
function uploadToCDN(sourcePath_1, fileName_1, mimeType_1) {
    return __awaiter(this, arguments, void 0, function (sourcePath, fileName, mimeType, ttlHours) {
        var fileId, safeFileName, cdnFileName, cdnFilePath, stats, fileSize, formattedSize, expiresAt, cdnFile, redis, error_2;
        if (ttlHours === void 0) { ttlHours = 24; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    // Ensure CDN directory exists
                    return [4 /*yield*/, ensureCDNDir()];
                case 1:
                    // Ensure CDN directory exists
                    _a.sent();
                    fileId = (0, uuid_1.v4)();
                    safeFileName = encodeURIComponent(path_1.default.basename(fileName));
                    cdnFileName = "".concat(fileId, "-").concat(safeFileName);
                    cdnFilePath = path_1.default.join(CDN_DIR, cdnFileName);
                    // Copy the file to the CDN directory
                    return [4 /*yield*/, copyFile(sourcePath, cdnFilePath)];
                case 2:
                    // Copy the file to the CDN directory
                    _a.sent();
                    stats = fs_1.default.statSync(cdnFilePath);
                    fileSize = stats.size;
                    formattedSize = (0, fileTypes_1.formatFileSize)(fileSize);
                    expiresAt = Date.now() + ttlHours * 60 * 60 * 1000;
                    cdnFile = {
                        url: "".concat(LOCAL_BASE_URL, "/api/download?file=").concat(cdnFileName),
                        cdnUrl: "".concat(CDN_BASE_URL, "/cdn/").concat(cdnFileName),
                        fileName: safeFileName,
                        filePath: cdnFilePath,
                        fileSize: fileSize,
                        formattedSize: formattedSize,
                        mimeType: mimeType,
                        expiresAt: expiresAt,
                    };
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 3:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.set("cdn:".concat(cdnFileName), JSON.stringify(cdnFile), {
                            EX: ttlHours * 60 * 60,
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, cdnFile];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error uploading to CDN:', error_2);
                    throw new Error('Failed to upload file to CDN');
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get CDN file information
 * @param cdnFileName CDN file name
 * @returns CDN file information or null if not found
 */
function getCDNFile(cdnFileName) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, cdnFileJson, cdnFile, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get("cdn:".concat(cdnFileName))];
                case 2:
                    cdnFileJson = _a.sent();
                    if (!cdnFileJson) {
                        return [2 /*return*/, null];
                    }
                    cdnFile = JSON.parse(cdnFileJson);
                    if (!(cdnFile.expiresAt < Date.now())) return [3 /*break*/, 4];
                    // Delete expired file information from Redis
                    return [4 /*yield*/, redis.del("cdn:".concat(cdnFileName))];
                case 3:
                    // Delete expired file information from Redis
                    _a.sent();
                    // Delete expired file from disk
                    if (fs_1.default.existsSync(cdnFile.filePath)) {
                        fs_1.default.unlinkSync(cdnFile.filePath);
                    }
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/, cdnFile];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error getting CDN file:', error_3);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a file from the CDN
 * @param cdnFileName CDN file name
 * @returns Promise<boolean> indicating success
 */
function deleteFromCDN(cdnFileName) {
    return __awaiter(this, void 0, void 0, function () {
        var cdnFile, redis, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getCDNFile(cdnFileName)];
                case 1:
                    cdnFile = _a.sent();
                    if (!cdnFile) {
                        return [2 /*return*/, false];
                    }
                    // Delete file from disk
                    if (fs_1.default.existsSync(cdnFile.filePath)) {
                        fs_1.default.unlinkSync(cdnFile.filePath);
                    }
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 2:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.del("cdn:".concat(cdnFileName))];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error deleting from CDN:', error_4);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Clean up expired CDN files
 * This should be run periodically (e.g., via a cron job)
 */
function cleanupExpiredCDNFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var redis, now, keys, _i, keys_1, key, cdnFileJson, cdnFile, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    now = Date.now();
                    return [4 /*yield*/, redis.keys('cdn:*')];
                case 2:
                    keys = _a.sent();
                    _i = 0, keys_1 = keys;
                    _a.label = 3;
                case 3:
                    if (!(_i < keys_1.length)) return [3 /*break*/, 7];
                    key = keys_1[_i];
                    return [4 /*yield*/, redis.get(key)];
                case 4:
                    cdnFileJson = _a.sent();
                    if (!cdnFileJson) return [3 /*break*/, 6];
                    cdnFile = JSON.parse(cdnFileJson);
                    if (!(cdnFile.expiresAt < now)) return [3 /*break*/, 6];
                    // Delete expired file from disk
                    if (fs_1.default.existsSync(cdnFile.filePath)) {
                        fs_1.default.unlinkSync(cdnFile.filePath);
                    }
                    // Delete expired file information from Redis
                    return [4 /*yield*/, redis.del(key)];
                case 5:
                    // Delete expired file information from Redis
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_5 = _a.sent();
                    console.error('Error cleaning up expired CDN files:', error_5);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * Generate a pre-signed URL for direct CDN access
 * In a real implementation, this would generate a signed URL for a cloud CDN
 * @param cdnFileName CDN file name
 * @param expiryMinutes Expiry time in minutes (default: 15)
 * @returns Pre-signed URL or null if file not found
 */
function generatePresignedURL(cdnFileName_1) {
    return __awaiter(this, arguments, void 0, function (cdnFileName, expiryMinutes) {
        var cdnFile, token, expiryTime, redis, error_6;
        if (expiryMinutes === void 0) { expiryMinutes = 15; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getCDNFile(cdnFileName)];
                case 1:
                    cdnFile = _a.sent();
                    if (!cdnFile) {
                        return [2 /*return*/, null];
                    }
                    token = (0, uuid_1.v4)();
                    expiryTime = Date.now() + expiryMinutes * 60 * 1000;
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 2:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.set("cdn:token:".concat(token), cdnFileName, {
                            EX: expiryMinutes * 60,
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, "".concat(CDN_BASE_URL, "/cdn/").concat(cdnFileName, "?token=").concat(token, "&expires=").concat(expiryTime)];
                case 4:
                    error_6 = _a.sent();
                    console.error('Error generating pre-signed URL:', error_6);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Validate a pre-signed URL token
 * @param token Token from the URL
 * @param expiryTime Expiry time from the URL
 * @returns CDN file name or null if invalid
 */
function validatePresignedURL(token, expiryTime) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, cdnFileName, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Check if the URL has expired
                    if (expiryTime < Date.now()) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get("cdn:token:".concat(token))];
                case 2:
                    cdnFileName = _a.sent();
                    return [2 /*return*/, cdnFileName];
                case 3:
                    error_7 = _a.sent();
                    console.error('Error validating pre-signed URL:', error_7);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
