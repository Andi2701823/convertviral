"use strict";
/**
 * Caching Service for ConvertViral
 * Provides multi-level caching strategies for improved performance
 */
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
const redis_1 = require("redis");
// Cache TTL defaults
const DEFAULT_CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10); // 1 hour in seconds
const SHORT_CACHE_TTL = 60; // 1 minute
const LONG_CACHE_TTL = 86400; // 24 hours
// Initialize Redis client
let redisClient;
/**
 * Initialize the Redis client
 */
async function initRedisClient() {
    if (!redisClient) {
        redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    // Exponential backoff with max delay of 10 seconds
                    return Math.min(retries * 100, 10000);
                }
            }
        });
        redisClient.on('error', (err) => {
            console.error('Redis client error:', err);
        });
        await redisClient.connect();
    }
    return redisClient;
}
/**
 * Memory cache for faster access to frequently used data
 * This reduces Redis calls for hot data
 */
class MemoryCache {
    constructor() {
        this.cache = new Map();
    }
    /**
     * Set a value in the memory cache
     * @param key Cache key
     * @param value Value to cache
     * @param ttl TTL in seconds
     */
    set(key, value, ttl = DEFAULT_CACHE_TTL) {
        const expires = Date.now() + ttl * 1000;
        this.cache.set(key, { value, expires });
    }
    /**
     * Get a value from the memory cache
     * @param key Cache key
     * @returns Cached value or null if not found or expired
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        // Check if item has expired
        if (item.expires < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    /**
     * Delete a value from the memory cache
     * @param key Cache key
     */
    delete(key) {
        this.cache.delete(key);
    }
    /**
     * Clear all items from the memory cache
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Clean expired items from the memory cache
     */
    cleanExpired() {
        const now = Date.now();
        // Use Array.from to avoid TypeScript downlevelIteration error
        Array.from(this.cache.entries()).forEach(([key, item]) => {
            if (item.expires < now) {
                this.cache.delete(key);
            }
        });
    }
}
// Create memory cache instance
const memoryCache = new MemoryCache();
// Clean expired memory cache items every minute
setInterval(() => {
    memoryCache.cleanExpired();
}, 60000);
/**
 * Get a value from the cache (memory first, then Redis)
 * @param key Cache key
 * @returns Cached value or null if not found
 */
async function getCachedValue(key) {
    // Try memory cache first
    const memValue = memoryCache.get(key);
    if (memValue !== null) {
        return memValue;
    }
    // Try Redis cache
    try {
        const client = await initRedisClient();
        const value = await client.get(key);
        if (!value)
            return null;
        // Parse the value
        const parsed = JSON.parse(value);
        // Store in memory cache for faster subsequent access
        memoryCache.set(key, parsed);
        return parsed;
    }
    catch (error) {
        console.error('Redis cache error:', error);
        return null;
    }
}
/**
 * Set a value in both memory and Redis caches
 * @param key Cache key
 * @param value Value to cache
 * @param ttl TTL in seconds
 */
async function setCachedValue(key, value, ttl = DEFAULT_CACHE_TTL) {
    // Set in memory cache
    memoryCache.set(key, value, ttl);
    // Set in Redis cache
    try {
        const client = await initRedisClient();
        await client.set(key, JSON.stringify(value), { EX: ttl });
    }
    catch (error) {
        console.error('Redis cache set error:', error);
    }
}
/**
 * Delete a value from both memory and Redis caches
 * @param key Cache key
 */
async function deleteCachedValue(key) {
    // Delete from memory cache
    memoryCache.delete(key);
    // Delete from Redis cache
    try {
        const client = await initRedisClient();
        await client.del(key);
    }
    catch (error) {
        console.error('Redis cache delete error:', error);
    }
}
/**
 * Cache middleware for API routes
 * @param ttl TTL in seconds
 * @returns Middleware function
 */
function withCache(ttl = DEFAULT_CACHE_TTL) {
    return async (req, res, next) => {
        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }
        // Generate cache key from URL and query parameters
        const cacheKey = `api:${req.url}`;
        try {
            // Try to get from cache
            const cachedData = await getCachedValue(cacheKey);
            if (cachedData) {
                // Add cache header
                res.setHeader('X-Cache', 'HIT');
                return res.status(200).json(cachedData);
            }
            // Cache miss, capture the response
            const originalJson = res.json;
            res.json = async (data) => {
                // Store in cache
                await setCachedValue(cacheKey, data, ttl);
                // Add cache header
                res.setHeader('X-Cache', 'MISS');
                // Send the response
                return originalJson.call(res, data);
            };
            next();
        }
        catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
}
/**
 * Cache specific data types with appropriate TTLs
 */
/**
 * Cache conversion formats (long TTL as they rarely change)
 * @param formats Conversion formats to cache
 */
async function cacheFormats(formats) {
    await setCachedValue('formats', formats, LONG_CACHE_TTL);
}
/**
 * Get cached conversion formats
 * @returns Cached formats or null if not found
 */
async function getCachedFormats() {
    return await getCachedValue('formats');
}
/**
 * Cache user-specific data (short TTL as it changes frequently)
 * @param userId User ID
 * @param data User data to cache
 */
async function cacheUserData(userId, data) {
    await setCachedValue(`user:${userId}`, data, SHORT_CACHE_TTL);
}
/**
 * Get cached user data
 * @param userId User ID
 * @returns Cached user data or null if not found
 */
async function getCachedUserData(userId) {
    return await getCachedValue(`user:${userId}`);
}
