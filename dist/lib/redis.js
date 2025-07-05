"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.setCache = setCache;
exports.getCache = getCache;
exports.deleteCache = deleteCache;
exports.closeRedisConnection = closeRedisConnection;
const redis_1 = require("redis");
let redisClient = null;
async function getRedisClient() {
    if (!redisClient) {
        redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL,
        });
        redisClient.on('error', (err) => {
            console.error('Redis client error:', err);
        });
        await redisClient.connect();
    }
    return redisClient;
}
async function setCache(key, value, expireInSeconds = 3600) {
    try {
        const client = await getRedisClient();
        await client.set(key, JSON.stringify(value), {
            EX: expireInSeconds,
        });
        return true;
    }
    catch (error) {
        console.error('Redis set error:', error);
        return false;
    }
}
async function getCache(key) {
    try {
        const client = await getRedisClient();
        const data = await client.get(key);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
}
async function deleteCache(key) {
    try {
        const client = await getRedisClient();
        await client.del(key);
        return true;
    }
    catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
}
async function closeRedisConnection() {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
    }
}
