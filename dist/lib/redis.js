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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.setCache = setCache;
exports.getCache = getCache;
exports.deleteCache = deleteCache;
exports.closeRedisConnection = closeRedisConnection;
var redis_1 = require("redis");
var redisClient = null;
function getRedisClient() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!redisClient) return [3 /*break*/, 2];
                    redisClient = (0, redis_1.createClient)({
                        url: process.env.REDIS_URL,
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
function setCache(key_1, value_1) {
    return __awaiter(this, arguments, void 0, function (key, value, expireInSeconds) {
        var client, error_1;
        if (expireInSeconds === void 0) { expireInSeconds = 3600; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getRedisClient()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, client.set(key, JSON.stringify(value), {
                            EX: expireInSeconds,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.error('Redis set error:', error_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getCache(key) {
    return __awaiter(this, void 0, void 0, function () {
        var client, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getRedisClient()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, client.get(key)];
                case 2:
                    data = _a.sent();
                    if (!data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, JSON.parse(data)];
                case 3:
                    error_2 = _a.sent();
                    console.error('Redis get error:', error_2);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteCache(key) {
    return __awaiter(this, void 0, void 0, function () {
        var client, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getRedisClient()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, client.del(key)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_3 = _a.sent();
                    console.error('Redis delete error:', error_3);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function closeRedisConnection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!redisClient) return [3 /*break*/, 2];
                    return [4 /*yield*/, redisClient.quit()];
                case 1:
                    _a.sent();
                    redisClient = null;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
