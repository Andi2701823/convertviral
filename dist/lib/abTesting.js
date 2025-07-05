"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestContent = exports.getTestVariant = exports.abTests = void 0;
exports.trackTestConversion = trackTestConversion;
var analytics_1 = require("./analytics");
// Define available A/B tests
exports.abTests = {
    'conversion-button': {
        id: 'conversion-button',
        name: 'Conversion Button Test',
        variants: {
            A: 'Convert Now',
            B: 'Start Conversion',
        },
    },
    'pricing-layout': {
        id: 'pricing-layout',
        name: 'Pricing Page Layout',
        variants: {
            A: 'cards',
            B: 'table',
        },
    },
    'gamification-visibility': {
        id: 'gamification-visibility',
        name: 'Gamification Elements Visibility',
        variants: {
            A: 'visible',
            B: 'hidden',
        },
    },
    'mobile-upload-ui': {
        id: 'mobile-upload-ui',
        name: 'Mobile Upload UI',
        variants: {
            A: 'standard',
            B: 'simplified',
        },
    },
};
// A/B Testing Configuration
var testConfigurations = {
    'conversion-button': {
        variants: ['default', 'large-green', 'animated'],
        weights: [0.33, 0.33, 0.34], // Must sum to 1
    },
    'pricing-layout': {
        variants: ['horizontal', 'vertical'],
        weights: [0.5, 0.5], // Must sum to 1
    },
    // Add more test configurations as needed
};
// Check if A/B testing is enabled
var isABTestingEnabled = process.env.NEXT_PUBLIC_ENABLE_AB_TESTING === 'true';
/**
 * Get the variant for a specific test
 * @param testId - The ID of the test
 * @returns The variant assigned to the user
 */
var getTestVariant = function (testId) {
    var _a, _b;
    // If A/B testing is disabled, always return the default variant
    if (!isABTestingEnabled) {
        return ((_a = testConfigurations[testId]) === null || _a === void 0 ? void 0 : _a.variants[0]) || 'default';
    }
    if (typeof window === 'undefined') {
        // Return default variant for SSR
        return ((_b = testConfigurations[testId]) === null || _b === void 0 ? void 0 : _b.variants[0]) || 'default';
    }
    // Check if user already has a variant assigned
    var storedVariant = localStorage.getItem("ab_test_".concat(testId));
    if (storedVariant) {
        return storedVariant;
    }
    // Get test configuration
    var testConfig = testConfigurations[testId];
    if (!testConfig) {
        console.error("A/B test configuration not found for test ID: ".concat(testId));
        return 'default';
    }
    // Assign variant based on weights
    var variants = testConfig.variants, weights = testConfig.weights;
    var randomValue = Math.random();
    var cumulativeWeight = 0;
    for (var i = 0; i < variants.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue <= cumulativeWeight) {
            // Store the assigned variant
            localStorage.setItem("ab_test_".concat(testId), variants[i]);
            return variants[i];
        }
    }
    // Fallback to first variant
    localStorage.setItem("ab_test_".concat(testId), variants[0]);
    return variants[0];
};
exports.getTestVariant = getTestVariant;
/**
 * Get the content for a specific test variant
 * @param testId - The ID of the test
 * @param variantContents - Object containing content for each variant
 * @returns The content for the assigned variant
 */
var getTestContent = function (testId, variantContents) {
    // If A/B testing is disabled, return default content
    if (!isABTestingEnabled) {
        return variantContents['default'] || Object.values(variantContents)[0];
    }
    var variant = (0, exports.getTestVariant)(testId);
    // Track impression
    trackTestImpression(testId, variant);
    return variantContents[variant] || variantContents['default'];
};
exports.getTestContent = getTestContent;
/**
 * Track an impression for a specific test
 * @param testId - The ID of the test
 * @param variant - The variant shown to the user
 */
var trackTestImpression = function (testId, variant) {
    // If A/B testing is disabled, don't track impressions
    if (!isABTestingEnabled || typeof window === 'undefined')
        return;
    // Track impression in analytics
    (0, analytics_1.trackABTestImpression)(testId, variant);
};
/**
 * Track a conversion for a specific test
 *
 * @param testId The ID of the A/B test
 * @param conversionType The type of conversion (e.g., 'click', 'signup', 'purchase')
 */
function trackTestConversion(testId, conversionType) {
    if (conversionType === void 0) { conversionType = 'default'; }
    // If A/B testing is disabled, don't track conversions
    if (!isABTestingEnabled || typeof window === 'undefined')
        return;
    // Check if test exists in either configuration
    if (!testConfigurations[testId] && !exports.abTests[testId]) {
        console.error("A/B test with ID \"".concat(testId, "\" not found"));
        return;
    }
    var variant = (0, exports.getTestVariant)(testId);
    (0, analytics_1.trackABTestConversion)(testId, variant);
}
