"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackABTestConversion = exports.trackABTestImpression = exports.trackUserSatisfaction = exports.trackApiResponseTime = exports.trackConversionSuccessRate = exports.trackWebVital = exports.trackCoreWebVitals = exports.trackPremiumUpgradeViewed = exports.trackSocialShareClicked = exports.trackAchievementUnlocked = exports.trackFormatSelected = exports.trackConversionCompleted = exports.trackFileUploadStarted = exports.trackEvent = exports.trackPageView = exports.initGA = void 0;
// Window interface is declared in global.d.ts
// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
// Google Analytics 4 implementation
const initGA = () => {
    if (typeof window === 'undefined')
        return;
    // Check if GA has already been initialized
    if (typeof window.gtag === 'function')
        return;
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
    // Initialize GA
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date().toISOString());
    window.gtag('config', measurementId);
};
exports.initGA = initGA;
// Track page views
const trackPageView = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};
exports.trackPageView = trackPageView;
// Custom event tracking
const trackEvent = ({ action, category, label, value, ...otherProps }) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
            ...otherProps,
        });
    }
};
exports.trackEvent = trackEvent;
// Predefined conversion events
const trackFileUploadStarted = (fileType, fileSize) => {
    (0, exports.trackEvent)({
        action: 'file_upload_started',
        category: 'Conversion',
        label: fileType,
        file_size: fileSize,
    });
};
exports.trackFileUploadStarted = trackFileUploadStarted;
const trackConversionCompleted = ({ sourceFormat, targetFormat, fileSize, conversionTime, success, }) => {
    (0, exports.trackEvent)({
        action: 'conversion_completed',
        category: 'Conversion',
        label: `${sourceFormat}_to_${targetFormat}`,
        file_size: fileSize,
        conversion_time: conversionTime,
        success: success,
    });
};
exports.trackConversionCompleted = trackConversionCompleted;
const trackFormatSelected = (sourceFormat, targetFormat) => {
    (0, exports.trackEvent)({
        action: 'format_selected',
        category: 'Conversion',
        label: `${sourceFormat}_to_${targetFormat}`,
    });
};
exports.trackFormatSelected = trackFormatSelected;
const trackAchievementUnlocked = (achievementId, achievementName) => {
    (0, exports.trackEvent)({
        action: 'achievement_unlocked',
        category: 'Gamification',
        label: achievementName,
        achievement_id: achievementId,
    });
};
exports.trackAchievementUnlocked = trackAchievementUnlocked;
const trackSocialShareClicked = (platform, contentType) => {
    (0, exports.trackEvent)({
        action: 'social_share_clicked',
        category: 'Engagement',
        label: platform,
        content_type: contentType,
    });
};
exports.trackSocialShareClicked = trackSocialShareClicked;
const trackPremiumUpgradeViewed = (planType, source) => {
    (0, exports.trackEvent)({
        action: 'premium_upgrade_viewed',
        category: 'Monetization',
        label: planType,
        source: source,
    });
};
exports.trackPremiumUpgradeViewed = trackPremiumUpgradeViewed;
// Performance monitoring
const trackCoreWebVitals = () => {
    if (typeof window === 'undefined')
        return;
    // This function will be called by the WebVitalsTracker component
    // which uses the web-vitals library to measure performance metrics
};
exports.trackCoreWebVitals = trackCoreWebVitals;
// Track individual Web Vital metric
const trackWebVital = (metric, value) => {
    if (typeof window === 'undefined')
        return;
    // Track the web vital in analytics
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'web_vital', {
            metric_name: metric,
            metric_value: value,
            metric_delta: value, // For compatibility with web-vitals library
            metric_rating: getRating(metric, value),
        });
    }
};
exports.trackWebVital = trackWebVital;
// Helper function to determine rating (good, needs improvement, poor)
const getRating = (metric, value) => {
    switch (metric) {
        case 'LCP':
            return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        case 'FID':
            return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
        case 'CLS':
            return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
        case 'TTFB':
            return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        case 'FCP':
            return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        default:
            return 'unknown';
    }
};
// Track conversion success rates
const trackConversionSuccessRate = (success, errorType) => {
    (0, exports.trackEvent)({
        action: 'conversion_success_rate',
        category: 'Performance',
        label: success ? 'success' : 'failure',
        error_type: errorType,
    });
};
exports.trackConversionSuccessRate = trackConversionSuccessRate;
// Track API response times
const trackApiResponseTime = (endpoint, responseTime) => {
    (0, exports.trackEvent)({
        action: 'api_response_time',
        category: 'Performance',
        label: endpoint,
        value: Math.round(responseTime),
    });
};
exports.trackApiResponseTime = trackApiResponseTime;
// Track user satisfaction scores
const trackUserSatisfaction = (score, feedback) => {
    (0, exports.trackEvent)({
        action: 'user_satisfaction',
        category: 'Feedback',
        value: score,
        feedback: feedback,
    });
};
exports.trackUserSatisfaction = trackUserSatisfaction;
// A/B Testing
const trackABTestImpression = (testId, variant) => {
    if (typeof window === 'undefined')
        return;
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'ab_test_impression', {
            test_id: testId,
            variant: variant,
            non_interaction: true,
        });
    }
};
exports.trackABTestImpression = trackABTestImpression;
const trackABTestConversion = (testId, variant) => {
    if (typeof window === 'undefined')
        return;
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'ab_test_conversion', {
            test_id: testId,
            variant: variant,
        });
    }
};
exports.trackABTestConversion = trackABTestConversion;
