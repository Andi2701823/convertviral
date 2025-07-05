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
exports.registerWorker = registerWorker;
exports.updateWorkerStatus = updateWorkerStatus;
exports.getWorkerStatus = getWorkerStatus;
exports.addToQueue = addToQueue;
exports.getNextJob = getNextJob;
exports.processJob = processJob;
exports.startWorker = startWorker;
exports.runMaintenance = runMaintenance;
var redis_1 = require("./redis");
var conversion_1 = require("./conversion");
var security_1 = require("./security");
var cdn_1 = require("./cdn");
/**
 * Register a worker
 * @param workerId Worker ID
 * @returns Promise<Worker>
 */
function registerWorker(workerId) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, now, worker, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    now = Date.now();
                    worker = {
                        id: workerId,
                        status: 'idle',
                        currentJobId: null,
                        lastActive: now,
                    };
                    return [4 /*yield*/, redis.set("worker:".concat(workerId), JSON.stringify(worker), {
                            EX: 60 * 60, // 1 hour expiry
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, worker];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error registering worker:', error_1);
                    throw new Error('Failed to register worker');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Update worker status
 * @param workerId Worker ID
 * @param status Worker status
 * @param currentJobId Current job ID (null if idle)
 * @returns Promise<Worker>
 */
function updateWorkerStatus(workerId_1, status_1) {
    return __awaiter(this, arguments, void 0, function (workerId, status, currentJobId) {
        var redis, now, worker, error_2;
        if (currentJobId === void 0) { currentJobId = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    now = Date.now();
                    worker = {
                        id: workerId,
                        status: status,
                        currentJobId: currentJobId,
                        lastActive: now,
                    };
                    return [4 /*yield*/, redis.set("worker:".concat(workerId), JSON.stringify(worker), {
                            EX: 60 * 60, // 1 hour expiry
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, worker];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error updating worker status:', error_2);
                    throw new Error('Failed to update worker status');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get worker status
 * @param workerId Worker ID
 * @returns Promise<Worker | null>
 */
function getWorkerStatus(workerId) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, workerJson, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get("worker:".concat(workerId))];
                case 2:
                    workerJson = _a.sent();
                    if (!workerJson) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, JSON.parse(workerJson)];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error getting worker status:', error_3);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Add a job to the queue
 * @param jobId Job ID
 * @param priority Priority (higher number = higher priority)
 * @returns Promise<QueueItem>
 */
function addToQueue(jobId_1) {
    return __awaiter(this, arguments, void 0, function (jobId, priority) {
        var redis, now, queueItemId, queueItem, error_4;
        if (priority === void 0) { priority = 1; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    now = Date.now();
                    queueItemId = "queue:item:".concat(jobId);
                    queueItem = {
                        id: queueItemId,
                        jobId: jobId,
                        priority: priority,
                        addedAt: now,
                    };
                    // Add to queue sorted set (score = priority)
                    return [4 /*yield*/, redis.zAdd('conversion:queue', { score: priority, value: queueItemId })];
                case 2:
                    // Add to queue sorted set (score = priority)
                    _a.sent();
                    // Store queue item details
                    return [4 /*yield*/, redis.set(queueItemId, JSON.stringify(queueItem), {
                            EX: 24 * 60 * 60, // 24 hour expiry
                        })];
                case 3:
                    // Store queue item details
                    _a.sent();
                    return [2 /*return*/, queueItem];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error adding to queue:', error_4);
                    throw new Error('Failed to add job to queue');
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the next job from the queue
 * @returns Promise<string | null> Job ID or null if queue is empty
 */
function getNextJob() {
    return __awaiter(this, void 0, void 0, function () {
        var redis, result, queueItemId, queueItemJson, queueItem, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 1:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.zRange('conversion:queue', 0, 0, { REV: true })];
                case 2:
                    result = _a.sent();
                    if (!result || result.length === 0) {
                        return [2 /*return*/, null];
                    }
                    queueItemId = result[0];
                    // Remove from queue
                    return [4 /*yield*/, redis.zRem('conversion:queue', queueItemId)];
                case 3:
                    // Remove from queue
                    _a.sent();
                    return [4 /*yield*/, redis.get(queueItemId)];
                case 4:
                    queueItemJson = _a.sent();
                    if (!queueItemJson) {
                        return [2 /*return*/, null];
                    }
                    queueItem = JSON.parse(queueItemJson);
                    return [2 /*return*/, queueItem.jobId];
                case 5:
                    error_5 = _a.sent();
                    console.error('Error getting next job:', error_5);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Process a conversion job
 * @param workerId Worker ID
 * @param jobId Job ID
 * @returns Promise<ConversionResult | null>
 */
function processJob(workerId, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var redis, jobJson, job, scanResult, result, cdnFile, error_6, redis, jobJson, job, redisError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 25]);
                    // Update worker status to busy
                    return [4 /*yield*/, updateWorkerStatus(workerId, 'busy', jobId)];
                case 1:
                    // Update worker status to busy
                    _a.sent();
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 2:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get("conversion:job:".concat(jobId))];
                case 3:
                    jobJson = _a.sent();
                    if (!!jobJson) return [3 /*break*/, 5];
                    return [4 /*yield*/, updateWorkerStatus(workerId, 'idle')];
                case 4:
                    _a.sent();
                    return [2 /*return*/, null];
                case 5:
                    job = JSON.parse(jobJson);
                    // Update job status to processing
                    job.status = 'PROCESSING';
                    job.startedAt = Date.now();
                    return [4 /*yield*/, redis.set("conversion:job:".concat(jobId), JSON.stringify(job), {
                            EX: 24 * 60 * 60, // 24 hour expiry
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, security_1.scanFileForViruses)(job.sourceFile)];
                case 7:
                    scanResult = _a.sent();
                    if (!!scanResult.isClean) return [3 /*break*/, 10];
                    // Update job status to failed
                    job.status = 'FAILED';
                    job.error = 'File contains malware';
                    job.completedAt = Date.now();
                    return [4 /*yield*/, redis.set("conversion:job:".concat(jobId), JSON.stringify(job), {
                            EX: 24 * 60 * 60, // 24 hour expiry
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, updateWorkerStatus(workerId, 'idle')];
                case 9:
                    _a.sent();
                    return [2 /*return*/, null];
                case 10: return [4 /*yield*/, (0, conversion_1.convertFile)(job)];
                case 11:
                    result = _a.sent();
                    if (!(result.status === 'COMPLETED' &&
                        result.outputFilePath &&
                        result.outputFileName &&
                        result.outputMimeType)) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, cdn_1.uploadToCDN)(result.outputFilePath, result.outputFileName, result.outputMimeType, 24 // 24 hour TTL
                        )];
                case 12:
                    cdnFile = _a.sent();
                    result.cdnUrl = cdnFile.cdnUrl;
                    result.downloadUrl = cdnFile.url;
                    _a.label = 13;
                case 13: 
                // Update job status
                return [4 /*yield*/, redis.set("conversion:result:".concat(jobId), JSON.stringify(result), {
                        EX: 24 * 60 * 60, // 24 hour expiry
                    })];
                case 14:
                    // Update job status
                    _a.sent();
                    // Update worker status to idle
                    return [4 /*yield*/, updateWorkerStatus(workerId, 'idle')];
                case 15:
                    // Update worker status to idle
                    _a.sent();
                    return [2 /*return*/, result];
                case 16:
                    error_6 = _a.sent();
                    console.error('Error processing job:', error_6);
                    // Update worker status to error
                    return [4 /*yield*/, updateWorkerStatus(workerId, 'error')];
                case 17:
                    // Update worker status to error
                    _a.sent();
                    _a.label = 18;
                case 18:
                    _a.trys.push([18, 23, , 24]);
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 19:
                    redis = _a.sent();
                    return [4 /*yield*/, redis.get("conversion:job:".concat(jobId))];
                case 20:
                    jobJson = _a.sent();
                    if (!jobJson) return [3 /*break*/, 22];
                    job = JSON.parse(jobJson);
                    job.status = 'FAILED';
                    job.error = 'Internal server error';
                    job.completedAt = Date.now();
                    return [4 /*yield*/, redis.set("conversion:job:".concat(jobId), JSON.stringify(job), {
                            EX: 24 * 60 * 60, // 24 hour expiry
                        })];
                case 21:
                    _a.sent();
                    _a.label = 22;
                case 22: return [3 /*break*/, 24];
                case 23:
                    redisError_1 = _a.sent();
                    console.error('Error updating job status:', redisError_1);
                    return [3 /*break*/, 24];
                case 24: return [2 /*return*/, null];
                case 25: return [2 /*return*/];
            }
        });
    });
}
/**
 * Start the worker process
 * This function should be called by a background process or cron job
 * @param workerId Worker ID
 */
function startWorker(workerId) {
    return __awaiter(this, void 0, void 0, function () {
        var worker, jobId, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    // Register worker
                    return [4 /*yield*/, registerWorker(workerId)];
                case 1:
                    // Register worker
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 10];
                    return [4 /*yield*/, getWorkerStatus(workerId)];
                case 3:
                    worker = _a.sent();
                    if (!worker || worker.status === 'error') {
                        console.error('Worker is in error state or not registered');
                        return [3 /*break*/, 10];
                    }
                    if (!(worker.status === 'busy')) return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, getNextJob()];
                case 6:
                    jobId = _a.sent();
                    if (!!jobId) return [3 /*break*/, 8];
                    // No jobs in queue, wait and continue
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 7:
                    // No jobs in queue, wait and continue
                    _a.sent();
                    return [3 /*break*/, 2];
                case 8: 
                // Process the job
                return [4 /*yield*/, processJob(workerId, jobId)];
                case 9:
                    // Process the job
                    _a.sent();
                    return [3 /*break*/, 2];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_7 = _a.sent();
                    console.error('Error in worker process:', error_7);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Run maintenance tasks
 * This function should be called periodically (e.g., via a cron job)
 */
function runMaintenance() {
    return __awaiter(this, void 0, void 0, function () {
        var redis, now, workerKeys, _i, workerKeys_1, key, workerJson, worker, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    // Clean up old conversions
                    return [4 /*yield*/, (0, conversion_1.cleanupOldConversions)()];
                case 1:
                    // Clean up old conversions
                    _a.sent();
                    return [4 /*yield*/, (0, redis_1.getRedisClient)()];
                case 2:
                    redis = _a.sent();
                    now = Date.now();
                    return [4 /*yield*/, redis.keys('worker:*')];
                case 3:
                    workerKeys = _a.sent();
                    _i = 0, workerKeys_1 = workerKeys;
                    _a.label = 4;
                case 4:
                    if (!(_i < workerKeys_1.length)) return [3 /*break*/, 8];
                    key = workerKeys_1[_i];
                    return [4 /*yield*/, redis.get(key)];
                case 5:
                    workerJson = _a.sent();
                    if (!workerJson) return [3 /*break*/, 7];
                    worker = JSON.parse(workerJson);
                    if (!(now - worker.lastActive > 60 * 60 * 1000)) return [3 /*break*/, 7];
                    return [4 /*yield*/, redis.del(key)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_8 = _a.sent();
                    console.error('Error running maintenance:', error_8);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
