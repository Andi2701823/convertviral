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
exports.calculateFileHash = calculateFileHash;
exports.isKnownCleanFile = isKnownCleanFile;
exports.markFileAsClean = markFileAsClean;
exports.scanFileForViruses = scanFileForViruses;
exports.checkRateLimits = checkRateLimits;
exports.validateFileExtension = validateFileExtension;
exports.sanitizeFilename = sanitizeFilename;
exports.apiRateLimit = apiRateLimit;
exports.validateBody = validateBody;
exports.cors = cors;
exports.securityHeaders = securityHeaders;
exports.generateSecureToken = generateSecureToken;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.combineMiddleware = combineMiddleware;
exports.createSecureApiRoute = createSecureApiRoute;
var crypto = __importStar(require("crypto"));
var fs = __importStar(require("fs"));
var util_1 = require("util");
var redis_1 = require("./redis");
var zod_1 = require("zod");
var monitoring_1 = require("./monitoring");
var readFile = (0, util_1.promisify)(fs.readFile);
/**
 * Calculate file hash (SHA-256)
 * @param filePath Path to the file
 * @returns Promise with the file hash
 */
function calculateFileHash(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBuffer, hashSum, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(filePath)];
                case 1:
                    fileBuffer = _a.sent();
                    hashSum = crypto.createHash('sha256');
                    hashSum.update(fileBuffer);
                    return [2 /*return*/, hashSum.digest('hex')];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error calculating file hash:', error_1);
                    throw new Error('Failed to calculate file hash');
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if a file has been previously scanned and is clean
 * @param fileHash SHA-256 hash of the file
 * @returns Promise<boolean> true if file is known to be clean
 */
function isKnownCleanFile(fileHash) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get("virus:clean:".concat(fileHash))];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result === 'clean'];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error checking known clean file:', error_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Mark a file as clean in the cache
 * @param fileHash SHA-256 hash of the file
 * @param ttlInSeconds Time to live in seconds (default: 7 days)
 */
function markFileAsClean(fileHash_1) {
    return __awaiter(this, arguments, void 0, function (fileHash, ttlInSeconds) {
        var redis, error_3;
        if (ttlInSeconds === void 0) { ttlInSeconds = 7 * 24 * 60 * 60; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.set("virus:clean:".concat(fileHash), 'clean', { EX: ttlInSeconds })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error marking file as clean:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Scan file for viruses (mock implementation)
 * In a real implementation, this would integrate with a virus scanning service
 * @param filePath Path to the file
 * @returns Promise with scan result
 */
function scanFileForViruses(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileHash, isKnownClean, startTime, fileStats, fileSizeInMB, delay_1, isClean, scanTime, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, calculateFileHash(filePath)];
                case 1:
                    fileHash = _a.sent();
                    return [4 /*yield*/, isKnownCleanFile(fileHash)];
                case 2:
                    isKnownClean = _a.sent();
                    if (isKnownClean) {
                        return [2 /*return*/, {
                                isClean: true,
                                scanTime: 0,
                            }];
                    }
                    startTime = Date.now();
                    fileStats = fs.statSync(filePath);
                    fileSizeInMB = fileStats.size / (1024 * 1024);
                    delay_1 = Math.max(500, fileSizeInMB * 100);
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                case 3:
                    _a.sent();
                    isClean = true;
                    if (!isClean) return [3 /*break*/, 5];
                    return [4 /*yield*/, markFileAsClean(fileHash)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    scanTime = Date.now() - startTime;
                    return [2 /*return*/, {
                            isClean: isClean,
                            scanTime: scanTime,
                        }];
                case 6:
                    error_4 = _a.sent();
                    console.error('Error scanning file for viruses:', error_4);
                    throw new Error('Failed to scan file for viruses');
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check rate limits for a user
 * @param userId User ID
 * @param action Action type (e.g., 'upload', 'convert')
 * @param isPremium Whether the user is premium
 * @returns Promise<boolean> true if within rate limits
 */
function checkRateLimits(userId, action, isPremium) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, now_1, windowSize_1, limits, limit, key, usageWithScores, validUsage, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    now_1 = Date.now();
                    windowSize_1 = 60 * 60 * 1000;
                    limits = {
                        upload: { free: 10, premium: 100 },
                        convert: { free: 20, premium: 200 },
                        download: { free: 30, premium: 300 },
                    };
                    limit = isPremium ? limits[action].premium : limits[action].free;
                    key = "ratelimit:".concat(userId, ":").concat(action);
                    return [4 /*yield*/, redis.zRangeWithScores(key, 0, -1)];
                case 2:
                    usageWithScores = _a.sent();
                    validUsage = usageWithScores.filter(function (item) {
                        return parseInt(item.score.toString()) > now_1 - windowSize_1;
                    });
                    // Check if user is within limits
                    if (validUsage.length >= limit) {
                        return [2 /*return*/, false];
                    }
                    // Add current timestamp to the sorted set
                    return [4 /*yield*/, redis.zAdd(key, { score: now_1, value: now_1.toString() })];
                case 3:
                    // Add current timestamp to the sorted set
                    _a.sent();
                    // Set expiry on the key
                    return [4 /*yield*/, redis.expire(key, Math.ceil(windowSize_1 / 1000))];
                case 4:
                    // Set expiry on the key
                    _a.sent();
                    return [2 /*return*/, true];
                case 5:
                    error_5 = _a.sent();
                    console.error('Error checking rate limits:', error_5);
                    // In case of error, allow the action (fail open for user experience)
                    return [2 /*return*/, true];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Validate file extension against allowed list
 * @param extension File extension
 * @param allowedExtensions Array of allowed extensions
 * @returns boolean indicating if extension is allowed
 */
function validateFileExtension(extension, allowedExtensions) {
    if (!allowedExtensions || allowedExtensions.length === 0) {
        return true; // No restrictions
    }
    var normalizedExtension = extension.toLowerCase().replace(/^\./, '');
    return allowedExtensions.includes(normalizedExtension);
}
/**
 * Sanitize filename to prevent path traversal and other security issues
 * @param filename Original filename
 * @returns Sanitized filename
 */
function sanitizeFilename(filename) {
    // Remove path traversal characters and other potentially dangerous characters
    return filename
        .replace(/\.\.+/g, '') // Remove path traversal sequences
        .replace(/[\/\\]/g, '') // Remove slashes
        .replace(/[\x00-\x1f\x7f-\xff]/g, '') // Remove control characters
        .replace(/[<>:"|\?\*]/g, '') // Remove reserved characters
        .trim(); // Remove leading/trailing whitespace
}
/**
 * Rate limiting middleware for API routes
 * @param maxRequests Maximum number of requests allowed in the time window
 * @param windowMs Time window in milliseconds
 * @returns Middleware function
 */
function apiRateLimit(maxRequests, windowMs) {
    var _this = this;
    if (maxRequests === void 0) { maxRequests = 100; }
    if (windowMs === void 0) { windowMs = 60000; }
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var ip, key, redis, currentCount, count, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
                    key = "apiratelimit:".concat(ip, ":").concat(req.url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 2:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get(key)];
                case 3:
                    currentCount = _a.sent();
                    count = currentCount ? parseInt(currentCount, 10) : 0;
                    // Set rate limit headers
                    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
                    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count - 1).toString());
                    if (count >= maxRequests) {
                        // Rate limit exceeded
                        res.setHeader('Retry-After', Math.ceil(windowMs / 1000).toString());
                        return [2 /*return*/, res.status(429).json({ error: 'Too many requests, please try again later' })];
                    }
                    // Increment count and set expiry
                    return [4 /*yield*/, redis.incr(key)];
                case 4:
                    // Increment count and set expiry
                    _a.sent();
                    return [4 /*yield*/, redis.expire(key, Math.ceil(windowMs / 1000))];
                case 5:
                    _a.sent();
                    // Continue to the next middleware
                    next();
                    return [3 /*break*/, 7];
                case 6:
                    error_6 = _a.sent();
                    // If Redis fails, allow the request but log the error
                    console.error('Rate limiting error:', error_6);
                    (0, monitoring_1.captureException)(error_6, { context: 'rate-limiting' });
                    next();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Validate request body against a Zod schema
 * @param schema Zod schema for validation
 * @returns Middleware function
 */
function validateBody(schema) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var validatedData;
        return __generator(this, function (_a) {
            try {
                validatedData = schema.parse(req.body);
                // Replace request body with validated data
                req.body = validatedData;
                // Continue to the next middleware
                next();
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    // Return validation errors
                    return [2 /*return*/, res.status(400).json({
                            error: 'Validation failed',
                            details: error.errors,
                        })];
                }
                // Handle other errors
                console.error('Validation error:', error);
                (0, monitoring_1.captureException)(error, { context: 'input-validation' });
                return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
            }
            return [2 /*return*/];
        });
    }); };
}
/**
 * CORS middleware
 * @param allowedOrigins Array of allowed origins
 * @returns Middleware function
 */
function cors(allowedOrigins) {
    if (allowedOrigins === void 0) { allowedOrigins = ['*']; }
    return function (req, res, next) {
        var origin = req.headers.origin;
        // Set CORS headers
        if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        // Continue to the next middleware
        next();
    };
}
/**
 * Set security headers middleware
 */
function securityHeaders(req, res, next) {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*; font-src 'self' data:; connect-src 'self' https://* wss://*;");
    // Continue to the next middleware
    next();
}
/**
 * Generate a secure random token
 * @param length Length of the token
 * @returns Secure random token
 */
function generateSecureToken(length) {
    if (length === void 0) { length = 32; }
    return crypto.randomBytes(length).toString('hex');
}
/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, hash;
        return __generator(this, function (_a) {
            salt = crypto.randomBytes(16).toString('hex');
            hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            return [2 /*return*/, "".concat(salt, ":").concat(hash)];
        });
    });
}
/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns Whether the password matches
 */
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, salt, hash, verifyHash;
        return __generator(this, function (_b) {
            _a = hashedPassword.split(':'), salt = _a[0], hash = _a[1];
            verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            return [2 /*return*/, hash === verifyHash];
        });
    });
}
/**
 * Combine multiple middleware functions into a single middleware
 * @param middlewares Array of middleware functions
 * @returns Combined middleware function
 */
function combineMiddleware(middlewares) {
    return function (req, res, next) {
        // Create a middleware chain
        var runMiddleware = function (i) {
            if (i < middlewares.length) {
                middlewares[i](req, res, function () { return runMiddleware(i + 1); });
            }
            else {
                next();
            }
        };
        runMiddleware(0);
    };
}
/**
 * Create a secure API route with common middleware
 * @param handler API route handler
 * @param options Configuration options
 * @returns Next.js API handler
 */
function createSecureApiRoute(handler, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, rateLimit, _b, corsOrigins, bodySchema, _c, methods, middlewares, executeMiddleware, error_7;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = options.rateLimit, rateLimit = _a === void 0 ? { maxRequests: 100, windowMs: 60000 } : _a, _b = options.corsOrigins, corsOrigins = _b === void 0 ? ['*'] : _b, bodySchema = options.bodySchema, _c = options.methods, methods = _c === void 0 ? ['GET', 'POST', 'PUT', 'DELETE'] : _c;
                    // Check if method is allowed
                    if (!methods.includes(req.method || 'GET')) {
                        return [2 /*return*/, res.status(405).json({ error: 'Method not allowed' })];
                    }
                    middlewares = [
                        securityHeaders,
                        cors(corsOrigins),
                        apiRateLimit(rateLimit.maxRequests, rateLimit.windowMs)
                    ];
                    // Add body validation if schema is provided
                    if (bodySchema && ['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
                        middlewares.push(validateBody(bodySchema));
                    }
                    executeMiddleware = function () {
                        return new Promise(function (resolve, reject) {
                            combineMiddleware(middlewares)(req, res, function () { return resolve(); });
                        });
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    // Run middleware
                    return [4 /*yield*/, executeMiddleware()];
                case 2:
                    // Run middleware
                    _d.sent();
                    // If response is already sent (e.g., by rate limiter), return
                    if (res.writableEnded)
                        return [2 /*return*/];
                    // Execute handler
                    return [4 /*yield*/, handler(req, res)];
                case 3:
                    // Execute handler
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _d.sent();
                    console.error('API route error:', error_7);
                    (0, monitoring_1.captureException)(error_7, { context: 'api-route' });
                    // If response is already sent, return
                    if (res.writableEnded)
                        return [2 /*return*/];
                    // Send error response
                    res.status(500).json({ error: 'Internal server error' });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
