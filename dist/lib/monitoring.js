"use strict";
/**
 * Monitoring and Error Tracking Service for ConvertViral
 * Integrates with Sentry for error tracking and custom performance monitoring
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.initSentry = initSentry;
exports.captureException = captureException;
exports.startTransaction = startTransaction;
exports.withPerformanceMonitoring = withPerformanceMonitoring;
exports.trackDatabaseQuery = trackDatabaseQuery;
exports.trackMetric = trackMetric;
exports.setUserContext = setUserContext;
exports.clearUserContext = clearUserContext;
var Sentry = __importStar(require("@sentry/nextjs"));
// Performance metrics thresholds (in milliseconds)
var PERFORMANCE_THRESHOLDS = {
    // Page load thresholds
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100, // First Input Delay
    CLS: 0.1, // Cumulative Layout Shift (unitless)
    TTI: 3800, // Time to Interactive
    // API response time thresholds
    API_FAST: 100, // Fast API response
    API_MEDIUM: 500, // Medium API response
    API_SLOW: 1000, // Slow API response
    // Database query thresholds
    DB_FAST: 50, // Fast database query
    DB_MEDIUM: 200, // Medium database query
    DB_SLOW: 500 // Slow database query
};
/**
 * Initialize Sentry for error tracking and performance monitoring
 */
function initSentry() {
    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            // Configure integrations using the recommended approach
            integrations: function (integrations) {
                // Add any integrations that are available
                return integrations;
            },
            beforeSend: function (event) {
                // Sanitize sensitive data
                if (event.request && event.request.headers) {
                    delete event.request.headers['authorization'];
                    delete event.request.headers['cookie'];
                }
                // Remove sensitive data from URLs
                if (event.request && event.request.url) {
                    event.request.url = event.request.url.replace(/token=[^&]+/, 'token=[REDACTED]');
                }
                return event;
            },
        });
    }
}
/**
 * Capture an exception with Sentry
 * @param error Error to capture
 * @param context Additional context information
 */
function captureException(error, context) {
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(error, { extra: context });
    }
    else {
        console.error('Error:', error, context);
    }
}
/**
 * Start a performance transaction for monitoring
 * @param name Transaction name
 * @param op Operation type
 * @returns Sentry transaction object
 */
function startTransaction(name, op) {
    if (process.env.SENTRY_DSN) {
        // Create a simplified transaction object since direct transaction methods aren't available
        try {
            // Add a breadcrumb instead of starting a transaction
            Sentry.addBreadcrumb({
                category: 'transaction',
                message: "".concat(op, ": ").concat(name),
                level: 'info',
            });
        }
        catch (error) {
            console.error('Error adding transaction breadcrumb:', error);
        }
    }
    // Return a dummy transaction object
    return {
        finish: function () { },
        setTag: function (key, value) { },
        setData: function (key, value) { },
    };
}
/**
 * Middleware for API route performance monitoring
 * @param handler API route handler
 * @returns Wrapped handler with performance monitoring
 */
function withPerformanceMonitoring(handler) {
    var _this = this;
    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var startTime, route, method, transaction, error_1, responseTime, performanceCategory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    route = req.url || 'unknown-route';
                    method = req.method || 'unknown-method';
                    transaction = startTransaction("API ".concat(method, " ").concat(route), 'api.request');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // Execute the handler
                    return [4 /*yield*/, handler(req, res)];
                case 2:
                    // Execute the handler
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    // Capture any uncaught exceptions
                    captureException(error_1, { route: route, method: method });
                    throw error_1;
                case 4:
                    responseTime = Date.now() - startTime;
                    // Set transaction data
                    transaction.setTag('http.method', method);
                    transaction.setTag('http.route', route);
                    transaction.setData('response_time_ms', responseTime);
                    performanceCategory = 'fast';
                    if (responseTime > PERFORMANCE_THRESHOLDS.API_SLOW) {
                        performanceCategory = 'slow';
                    }
                    else if (responseTime > PERFORMANCE_THRESHOLDS.API_MEDIUM) {
                        performanceCategory = 'medium';
                    }
                    transaction.setTag('performance.category', performanceCategory);
                    // Log slow responses
                    if (responseTime > PERFORMANCE_THRESHOLDS.API_SLOW) {
                        console.warn("Slow API response: ".concat(method, " ").concat(route, " took ").concat(responseTime, "ms"));
                    }
                    // Finish transaction
                    transaction.finish();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Track database query performance
 * @param queryName Name of the query
 * @param callback Function that executes the database query
 * @returns Result of the callback function
 */
function trackDatabaseQuery(queryName, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, transaction, error_2, queryTime, performanceCategory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    transaction = startTransaction("DB Query: ".concat(queryName), 'db.query');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, callback()];
                case 2: 
                // Execute the query
                return [2 /*return*/, _a.sent()];
                case 3:
                    error_2 = _a.sent();
                    // Capture query errors
                    captureException(error_2, { queryName: queryName });
                    throw error_2;
                case 4:
                    queryTime = Date.now() - startTime;
                    // Set transaction data
                    transaction.setData('query_name', queryName);
                    transaction.setData('query_time_ms', queryTime);
                    performanceCategory = 'fast';
                    if (queryTime > PERFORMANCE_THRESHOLDS.DB_SLOW) {
                        performanceCategory = 'slow';
                    }
                    else if (queryTime > PERFORMANCE_THRESHOLDS.DB_MEDIUM) {
                        performanceCategory = 'medium';
                    }
                    transaction.setTag('performance.category', performanceCategory);
                    // Log slow queries
                    if (queryTime > PERFORMANCE_THRESHOLDS.DB_SLOW) {
                        console.warn("Slow database query: ".concat(queryName, " took ").concat(queryTime, "ms"));
                    }
                    // Finish transaction
                    transaction.finish();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Track custom performance metrics
 * @param name Metric name
 * @param value Metric value
 * @param tags Additional tags
 */
function trackMetric(name, value, tags) {
    if (tags === void 0) { tags = {}; }
    if (process.env.SENTRY_DSN) {
        // Use a custom approach for metrics since metrics API might not be available
        try {
            // Capture as a custom measurement instead
            Sentry.captureMessage("Metric: ".concat(name), {
                level: 'info',
                extra: __assign({ value: value }, tags)
            });
        }
        catch (error) {
            console.error('Error tracking metric:', error);
        }
    }
    // Log significant metrics
    console.info("Metric: ".concat(name, " = ").concat(value), tags);
}
/**
 * Set user information for error tracking
 * @param userId User ID
 * @param userData Additional user data
 */
function setUserContext(userId, userData) {
    if (userData === void 0) { userData = {}; }
    if (process.env.SENTRY_DSN) {
        Sentry.setUser(__assign({ id: userId }, userData));
    }
}
/**
 * Clear user context
 */
function clearUserContext() {
    if (process.env.SENTRY_DSN) {
        Sentry.setUser(null);
    }
}
