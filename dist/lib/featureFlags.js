"use strict";
/**
 * Feature Flags System for ConvertViral
 *
 * This file contains feature flags that control various aspects of the application.
 * These flags can be toggled to enable or disable features without changing the code.
 *
 * IMPORTANT: This is a temporary configuration during the beta phase.
 * When ready to launch paid plans, set these flags to true.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_FLAGS = void 0;
exports.isFeatureEnabled = isFeatureEnabled;
exports.FEATURE_FLAGS = {
    /**
     * Controls whether payment functionality is enabled
     * When false, all payment buttons and checkout flows are disabled
     */
    paymentsEnabled: false,
    /**
     * Controls whether premium tiers are visible in the pricing page
     * When false, only the free tier is shown
     */
    premiumTiersVisible: false,
    /**
     * Controls whether conversion limits are enforced
     * When false, all users get unlimited conversions regardless of plan
     */
    conversionLimits: false,
    /**
     * Controls whether upgrade prompts are shown
     * When false, no upgrade prompts are displayed
     */
    upgradePrompts: false,
    /**
     * Controls whether file size limits are enforced
     * When false, all users can upload files of any size
     */
    fileSizeLimits: false,
    /**
     * Message to display during beta phase
     */
    betaMessage: "Currently in beta - all features free!"
};
/**
 * Helper function to check if a feature is enabled
 * @param feature The feature flag to check
 * @returns boolean indicating if the feature is enabled
 */
function isFeatureEnabled(feature) {
    if (feature === 'betaMessage') {
        return false; // Handle the string case
    }
    return Boolean(exports.FEATURE_FLAGS[feature]);
}
