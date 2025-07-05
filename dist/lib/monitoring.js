"use strict";
/**
 * Monitoring and Error Tracking Service for ConvertViral
 * Integrates with Sentry for error tracking and custom performance monitoring
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSentry = initSentry;
exports.captureException = captureException;
exports.startTransaction = startTransaction;
exports.withPerformanceMonitoring = withPerformanceMonitoring;
exports.trackDatabaseQuery = trackDatabaseQuery;
exports.trackMetric = trackMetric;
exports.setUserContext = setUserContext;
exports.clearUserContext = clearUserContext;
const Sentry = __importStar(require("@sentry/nextjs"));
// Performance metrics thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
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
            integrations: (integrations) => {
                // Add any integrations that are available
                return integrations;
            },
            beforeSend(event) {
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
                message: `${op}: ${name}`,
                level: 'info',
            });
        }
        catch (error) {
            console.error('Error adding transaction breadcrumb:', error);
        }
    }
    // Return a dummy transaction object
    return {
        finish: () => { },
        setTag: (key, value) => { },
        setData: (key, value) => { },
    };
}
/**
 * Middleware for API route performance monitoring
 * @param handler API route handler
 * @returns Wrapped handler with performance monitoring
 */
function withPerformanceMonitoring(handler) {
    return async (req, res) => {
        const startTime = Date.now();
        const route = req.url || 'unknown-route';
        const method = req.method || 'unknown-method';
        // Start transaction
        const transaction = startTransaction(`API ${method} ${route}`, 'api.request');
        try {
            // Execute the handler
            await handler(req, res);
        }
        catch (error) {
            // Capture any uncaught exceptions
            captureException(error, { route, method });
            throw error;
        }
        finally {
            // Calculate response time
            const responseTime = Date.now() - startTime;
            // Set transaction data
            transaction.setTag('http.method', method);
            transaction.setTag('http.route', route);
            transaction.setData('response_time_ms', responseTime);
            // Categorize response time
            let performanceCategory = 'fast';
            if (responseTime > PERFORMANCE_THRESHOLDS.API_SLOW) {
                performanceCategory = 'slow';
            }
            else if (responseTime > PERFORMANCE_THRESHOLDS.API_MEDIUM) {
                performanceCategory = 'medium';
            }
            transaction.setTag('performance.category', performanceCategory);
            // Log slow responses
            if (responseTime > PERFORMANCE_THRESHOLDS.API_SLOW) {
                console.warn(`Slow API response: ${method} ${route} took ${responseTime}ms`);
            }
            // Finish transaction
            transaction.finish();
        }
    };
}
/**
 * Track database query performance
 * @param queryName Name of the query
 * @param callback Function that executes the database query
 * @returns Result of the callback function
 */
async function trackDatabaseQuery(queryName, callback) {
    const startTime = Date.now();
    const transaction = startTransaction(`DB Query: ${queryName}`, 'db.query');
    try {
        // Execute the query
        return await callback();
    }
    catch (error) {
        // Capture query errors
        captureException(error, { queryName });
        throw error;
    }
    finally {
        // Calculate query time
        const queryTime = Date.now() - startTime;
        // Set transaction data
        transaction.setData('query_name', queryName);
        transaction.setData('query_time_ms', queryTime);
        // Categorize query performance
        let performanceCategory = 'fast';
        if (queryTime > PERFORMANCE_THRESHOLDS.DB_SLOW) {
            performanceCategory = 'slow';
        }
        else if (queryTime > PERFORMANCE_THRESHOLDS.DB_MEDIUM) {
            performanceCategory = 'medium';
        }
        transaction.setTag('performance.category', performanceCategory);
        // Log slow queries
        if (queryTime > PERFORMANCE_THRESHOLDS.DB_SLOW) {
            console.warn(`Slow database query: ${queryName} took ${queryTime}ms`);
        }
        // Finish transaction
        transaction.finish();
    }
}
/**
 * Track custom performance metrics
 * @param name Metric name
 * @param value Metric value
 * @param tags Additional tags
 */
function trackMetric(name, value, tags = {}) {
    if (process.env.SENTRY_DSN) {
        // Use a custom approach for metrics since metrics API might not be available
        try {
            // Capture as a custom measurement instead
            Sentry.captureMessage(`Metric: ${name}`, {
                level: 'info',
                extra: { value, ...tags }
            });
        }
        catch (error) {
            console.error('Error tracking metric:', error);
        }
    }
    // Log significant metrics
    console.info(`Metric: ${name} = ${value}`, tags);
}
/**
 * Set user information for error tracking
 * @param userId User ID
 * @param userData Additional user data
 */
function setUserContext(userId, userData = {}) {
    if (process.env.SENTRY_DSN) {
        Sentry.setUser({
            id: userId,
            ...userData,
        });
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
