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
var http_1 = require("http");
var url_1 = require("url");
var next_1 = __importDefault(require("next"));
var socket_io_1 = require("socket.io");
var redis_1 = require("./lib/redis");
var dev = process.env.NODE_ENV !== 'production';
var hostname = 'localhost';
var port = parseInt(process.env.PORT || '3000', 10);
// Initialize Next.js app
var app = (0, next_1.default)({ dev: dev, hostname: hostname, port: port });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    // Create HTTP server
    var server = (0, http_1.createServer)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var parsedUrl, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    parsedUrl = (0, url_1.parse)(req.url, true);
                    return [4 /*yield*/, handle(req, res, parsedUrl)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error occurred handling', req.url, err_1);
                    res.statusCode = 500;
                    res.end('Internal server error');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // Initialize Socket.IO with CORS configuration
    var io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    // Socket.IO connection handler
    io.on('connection', function (socket) {
        console.log('Client connected:', socket.id);
        // Handle subscription to job progress
        socket.on('subscribe', function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var jobId_1, interval_1;
            return __generator(this, function (_a) {
                try {
                    jobId_1 = data.jobId;
                    if (!jobId_1) {
                        socket.emit('error', { message: 'Job ID is required' });
                        return [2 /*return*/];
                    }
                    console.log("Client ".concat(socket.id, " subscribed to job ").concat(jobId_1));
                    // Join a room specific to this job
                    socket.join("job:".concat(jobId_1));
                    interval_1 = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var job, progress, result, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    return [4 /*yield*/, (0, redis_1.getCache)("conversion:job:".concat(jobId_1))];
                                case 1:
                                    job = _a.sent();
                                    return [4 /*yield*/, (0, redis_1.getCache)("progress:".concat(jobId_1))];
                                case 2:
                                    progress = (_a.sent()) || 0;
                                    if (!job) {
                                        socket.emit('error', { message: 'Job not found' });
                                        clearInterval(interval_1);
                                        return [2 /*return*/];
                                    }
                                    // Send progress update
                                    socket.emit('progress', {
                                        jobId: jobId_1,
                                        status: job.status,
                                        progress: progress,
                                    });
                                    if (!(job.status === 'COMPLETED' || job.status === 'FAILED')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, redis_1.getCache)("conversion:result:".concat(jobId_1))];
                                case 3:
                                    result = _a.sent();
                                    if (job.status === 'COMPLETED' && result) {
                                        socket.emit('completed', {
                                            jobId: jobId_1,
                                            result: result,
                                        });
                                    }
                                    else if (job.status === 'FAILED') {
                                        socket.emit('failed', {
                                            jobId: jobId_1,
                                            error: job.error || 'Conversion failed',
                                        });
                                    }
                                    clearInterval(interval_1);
                                    socket.leave("job:".concat(jobId_1));
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_1 = _a.sent();
                                    console.error('WebSocket error:', error_1);
                                    socket.emit('error', { message: 'Internal server error' });
                                    clearInterval(interval_1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); }, 1000);
                    // Clean up interval when connection is closed
                    socket.on('disconnect', function () {
                        clearInterval(interval_1);
                    });
                }
                catch (error) {
                    console.error('WebSocket subscription error:', error);
                    socket.emit('error', { message: 'Failed to subscribe to job updates' });
                }
                return [2 /*return*/];
            });
        }); });
        // Handle unsubscribe
        socket.on('unsubscribe', function (data) {
            var jobId = data.jobId;
            if (jobId) {
                socket.leave("job:".concat(jobId));
                console.log("Client ".concat(socket.id, " unsubscribed from job ").concat(jobId));
            }
        });
        // Handle disconnect
        socket.on('disconnect', function () {
            console.log('Client disconnected:', socket.id);
        });
    });
    // Start the server
    server.listen(port, function () {
        console.log("> Ready on http://".concat(hostname, ":").concat(port));
    });
});
