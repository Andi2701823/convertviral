"use strict";
/**
 * Caching Service for ConvertViral
 * Provides multi-level caching strategies for improved performance
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
exports.initRedisClient = initRedisClient;
exports.getCachedValue = getCachedValue;
exports.setCachedValue = setCachedValue;
exports.deleteCachedValue = deleteCachedValue;
exports.withCache = withCache;
exports.cacheFormats = cacheFormats;
exports.getCachedFormats = getCachedFormats;
exports.cacheUserData = cacheUserData;
exports.getCachedUserData = getCachedUserData;
var redis_1 = require("redis");
// Cache TTL defaults
var DEFAULT_CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10); // 1 hour in seconds
var SHORT_CACHE_TTL = 60; // 1 minute
var LONG_CACHE_TTL = 86400; // 24 hours
// Initialize Redis client
var redisClient;
/**
 * Initialize the Redis client
 */
function initRedisClient() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!redisClient) return [3 /*break*/, 2];
                    redisClient = (0, redis_1.createClient)({
                        url: process.env.REDIS_URL,
                        socket: {
                            reconnectStrategy: function (retries) {
                                // Exponential backoff with max delay of 10 seconds
                                return Math.min(retries * 100, 10000);
                            }
                        }
                    });
                    redisClient.on('error', function (err) {
                        console.error('Redis client error:', err);
                    });
                    return [4 /*yield*/, redisClient.connect()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, redisClient];
            }
        });
    });
}
/**
 * Memory cache for faster access to frequently used data
 * This reduces Redis calls for hot data
 */
var MemoryCache = /** @class */ (function () {
    function MemoryCache() {
        this.cache = new Map();
    }
    /**
     * Set a value in the memory cache
     * @param key Cache key
     * @param value Value to cache
     * @param ttl TTL in seconds
     */
    MemoryCache.prototype.set = function (key, value, ttl) {
        if (ttl === void 0) { ttl = DEFAULT_CACHE_TTL; }
        var expires = Date.now() + ttl * 1000;
        this.cache.set(key, { value: value, expires: expires });
    };
    /**
     * Get a value from the memory cache
     * @param key Cache key
     * @returns Cached value or null if not found or expired
     */
    MemoryCache.prototype.get = function (key) {
        var item = this.cache.get(key);
        if (!item)
            return null;
        // Check if item has expired
        if (item.expires < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    };
    /**
     * Delete a value from the memory cache
     * @param key Cache key
     */
    MemoryCache.prototype.delete = function (key) {
        this.cache.delete(key);
    };
    /**
     * Clear all items from the memory cache
     */
    MemoryCache.prototype.clear = function () {
        this.cache.clear();
    };
    /**
     * Clean expired items from the memory cache
     */
    MemoryCache.prototype.cleanExpired = function () {
        var _this = this;
        var now = Date.now();
        // Use Array.from to avoid TypeScript downlevelIteration error
        Array.from(this.cache.entries()).forEach(function (_a) {
            var key = _a[0], item = _a[1];
            if (item.expires < now) {
                _this.cache.delete(key);
            }
        });
    };
    return MemoryCache;
}());
// Create memory cache instance
var memoryCache = new MemoryCache();
// Clean expired memory cache items every minute
setInterval(function () {
    memoryCache.cleanExpired();
}, 60000);
/**
 * Get a value from the cache (memory first, then Redis)
 * @param key Cache key
 * @returns Cached value or null if not found
 */
function getCachedValue(key) {
    return __awaiter(this, void 0, void 0, function () {
        var memValue, client, value, parsed, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    memValue = memoryCache.get(key);
                    if (memValue !== null) {
                        return [2 /*return*/, memValue];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, initRedisClient()];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, client.get(key)];
                case 3:
                    value = _a.sent();
                    if (!value)
                        return [2 /*return*/, null];
                    parsed = JSON.parse(value);
                    // Store in memory cache for faster subsequent access
                    memoryCache.set(key, parsed);
                    return [2 /*return*/, parsed];
                case 4:
                    error_1 = _a.sent();
                    console.error('Redis cache error:', error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Set a value in both memory and Redis caches
 * @param key Cache key
 * @param value Value to cache
 * @param ttl TTL in seconds
 */
function setCachedValue(key_1, value_1) {
    return __awaiter(this, arguments, void 0, function (key, value, ttl) {
        var client, error_2;
        if (ttl === void 0) { ttl = DEFAULT_CACHE_TTL; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Set in memory cache
                    memoryCache.set(key, value, ttl);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, initRedisClient()];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, client.set(key, JSON.stringify(value), { EX: ttl })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Redis cache set error:', error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Delete a value from both memory and Redis caches
 * @param key Cache key
 */
function deleteCachedValue(key) {
    return __awaiter(this, void 0, void 0, function () {
        var client, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Delete from memory cache
                    memoryCache.delete(key);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, initRedisClient()];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, client.del(key)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Redis cache delete error:', error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Cache middleware for API routes
 * @param ttl TTL in seconds
 * @returns Middleware function
 */
function withCache(ttl) {
    var _this = this;
    if (ttl === void 0) { ttl = DEFAULT_CACHE_TTL; }
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var cacheKey, cachedData, originalJson_1, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Skip caching for non-GET requests
                    if (req.method !== 'GET') {
                        return [2 /*return*/, next()];
                    }
                    cacheKey = "api:".concat(req.url);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getCachedValue(cacheKey)];
                case 2:
                    cachedData = _a.sent();
                    if (cachedData) {
                        // Add cache header
                        res.setHeader('X-Cache', 'HIT');
                        return [2 /*return*/, res.status(200).json(cachedData)];
                    }
                    originalJson_1 = res.json;
                    res.json = function (data) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                // Store in cache
                                return [4 /*yield*/, setCachedValue(cacheKey, data, ttl)];
                                case 1:
                                    // Store in cache
                                    _a.sent();
                                    // Add cache header
                                    res.setHeader('X-Cache', 'MISS');
                                    // Send the response
                                    return [2 /*return*/, originalJson_1.call(res, data)];
                            }
                        });
                    }); };
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Cache middleware error:', error_4);
                    next();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Cache specific data types with appropriate TTLs
 */
/**
 * Cache conversion formats (long TTL as they rarely change)
 * @param formats Conversion formats to cache
 */
function cacheFormats(formats) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setCachedValue('formats', formats, LONG_CACHE_TTL)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get cached conversion formats
 * @returns Cached formats or null if not found
 */
function getCachedFormats() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCachedValue('formats')];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Cache user-specific data (short TTL as it changes frequently)
 * @param userId User ID
 * @param data User data to cache
 */
function cacheUserData(userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setCachedValue("user:".concat(userId), data, SHORT_CACHE_TTL)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get cached user data
 * @param userId User ID
 * @returns Cached user data or null if not found
 */
function getCachedUserData(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCachedValue("user:".concat(userId))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
