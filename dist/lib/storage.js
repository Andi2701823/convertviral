"use strict";
/**
 * Storage Service for ConvertViral
 * Handles file uploads, downloads, and management using AWS S3
 */
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
exports.generateFileKey = generateFileKey;
exports.uploadFile = uploadFile;
exports.getSignedDownloadUrl = getSignedDownloadUrl;
exports.getSignedUploadUrl = getSignedUploadUrl;
exports.deleteFile = deleteFile;
exports.scheduleFileDeletion = scheduleFileDeletion;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var uuid_1 = require("uuid");
// Initialize S3 client
var s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
var BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
var CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || '';
// Default expiration time for signed URLs (24 hours)
var DEFAULT_EXPIRATION = 60 * 60 * 24;
/**
 * Generate a unique file key for S3
 * @param fileName Original file name
 * @param userId Optional user ID to associate with the file
 * @returns Unique file key
 */
function generateFileKey(fileName, userId) {
    var timestamp = Date.now();
    var uuid = (0, uuid_1.v4)();
    var sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return userId
        ? "uploads/".concat(userId, "/").concat(timestamp, "-").concat(uuid, "-").concat(sanitizedFileName)
        : "uploads/anonymous/".concat(timestamp, "-").concat(uuid, "-").concat(sanitizedFileName);
}
/**
 * Upload a file to S3
 * @param fileBuffer File buffer to upload
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param userId Optional user ID to associate with the file
 * @returns Object containing the file key and public URL
 */
function uploadFile(fileBuffer, fileName, contentType, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var fileKey, uploadParams, publicUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileKey = generateFileKey(fileName, userId);
                    uploadParams = {
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
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3Client.send(new client_s3_1.PutObjectCommand(uploadParams))];
                case 2:
                    _a.sent();
                    publicUrl = CLOUDFRONT_DOMAIN
                        ? "https://".concat(CLOUDFRONT_DOMAIN, "/").concat(fileKey)
                        : "https://".concat(BUCKET_NAME, ".s3.").concat(process.env.AWS_REGION, ".amazonaws.com/").concat(fileKey);
                    return [2 /*return*/, {
                            key: fileKey,
                            url: publicUrl
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error uploading file to S3:', error_1);
                    throw new Error('Failed to upload file');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Generate a signed URL for downloading a file
 * @param fileKey S3 file key
 * @param expiresIn Expiration time in seconds (default: 24 hours)
 * @returns Signed URL for downloading the file
 */
function getSignedDownloadUrl(fileKey_1) {
    return __awaiter(this, arguments, void 0, function (fileKey, expiresIn) {
        var command, error_2;
        if (expiresIn === void 0) { expiresIn = DEFAULT_EXPIRATION; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new client_s3_1.GetObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: fileKey
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: expiresIn })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error generating signed URL:', error_2);
                    throw new Error('Failed to generate download URL');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Generate a signed URL for uploading a file directly to S3
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param userId Optional user ID to associate with the file
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 * @returns Object containing the file key and signed upload URL
 */
function getSignedUploadUrl(fileName_1, contentType_1, userId_1) {
    return __awaiter(this, arguments, void 0, function (fileName, contentType, userId, expiresIn) {
        var fileKey, command, signedUrl, error_3;
        if (expiresIn === void 0) { expiresIn = 3600; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileKey = generateFileKey(fileName, userId);
                    command = new client_s3_1.PutObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: fileKey,
                        ContentType: contentType,
                        Metadata: {
                            originalName: fileName,
                            uploadedBy: userId || 'anonymous',
                            uploadedAt: new Date().toISOString()
                        }
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: expiresIn })];
                case 2:
                    signedUrl = _a.sent();
                    return [2 /*return*/, {
                            key: fileKey,
                            url: signedUrl
                        }];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error generating signed upload URL:', error_3);
                    throw new Error('Failed to generate upload URL');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a file from S3
 * @param fileKey S3 file key
 * @returns True if deletion was successful
 */
function deleteFile(fileKey) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteParams, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deleteParams = {
                        Bucket: BUCKET_NAME,
                        Key: fileKey
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error deleting file from S3:', error_4);
                    throw new Error('Failed to delete file');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Schedule a file for deletion after a specified time
 * @param fileKey S3 file key
 * @param delayHours Number of hours before deletion (default: 24)
 */
function scheduleFileDeletion(fileKey, delayHours) {
    var _this = this;
    if (delayHours === void 0) { delayHours = 24; }
    var delayMs = delayHours * 60 * 60 * 1000;
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteFile(fileKey)];
                case 1:
                    _a.sent();
                    console.log("File ".concat(fileKey, " deleted after ").concat(delayHours, " hours"));
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Failed to delete file ".concat(fileKey, ":"), error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, delayMs);
}
