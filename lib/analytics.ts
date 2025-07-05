'use client';

// Types for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Window interface is declared in global.d.ts

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Google Analytics 4 implementation
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Check if GA has already been initialized
  if (typeof window.gtag === 'function') return;
  
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  
  // Initialize GA
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date().toISOString());
  window.gtag('config', measurementId);
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Custom event tracking
export const trackEvent = ({
  action,
  category,
  label,
  value,
  ...otherProps
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...otherProps,
    });
  }
};

// Predefined conversion events
export const trackFileUploadStarted = (fileType: string, fileSize: number) => {
  trackEvent({
    action: 'file_upload_started',
    category: 'Conversion',
    label: fileType,
    file_size: fileSize,
  });
};

export const trackConversionCompleted = ({
  sourceFormat,
  targetFormat,
  fileSize,
  conversionTime,
  success,
}: {
  sourceFormat: string;
  targetFormat: string;
  fileSize: number;
  conversionTime: number;
  success: boolean;
}) => {
  trackEvent({
    action: 'conversion_completed',
    category: 'Conversion',
    label: `${sourceFormat}_to_${targetFormat}`,
    file_size: fileSize,
    conversion_time: conversionTime,
    success: success,
  });
};

export const trackFormatSelected = (sourceFormat: string, targetFormat: string) => {
  trackEvent({
    action: 'format_selected',
    category: 'Conversion',
    label: `${sourceFormat}_to_${targetFormat}`,
  });
};

export const trackAchievementUnlocked = (achievementId: string, achievementName: string) => {
  trackEvent({
    action: 'achievement_unlocked',
    category: 'Gamification',
    label: achievementName,
    achievement_id: achievementId,
  });
};

export const trackSocialShareClicked = (platform: string, contentType: string) => {
  trackEvent({
    action: 'social_share_clicked',
    category: 'Engagement',
    label: platform,
    content_type: contentType,
  });
};

export const trackPremiumUpgradeViewed = (planType: string, source: string) => {
  trackEvent({
    action: 'premium_upgrade_viewed',
    category: 'Monetization',
    label: planType,
    source: source,
  });
};

// Performance monitoring
export const trackCoreWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  // This function will be called by the WebVitalsTracker component
  // which uses the web-vitals library to measure performance metrics
};

// Track individual Web Vital metric
export const trackWebVital = (metric: string, value: number) => {
  if (typeof window === 'undefined') return;
  
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

// Helper function to determine rating (good, needs improvement, poor)
const getRating = (metric: string, value: number): string => {
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
export const trackConversionSuccessRate = (success: boolean, errorType?: string) => {
  trackEvent({
    action: 'conversion_success_rate',
    category: 'Performance',
    label: success ? 'success' : 'failure',
    error_type: errorType,
  });
};

// Track API response times
export const trackApiResponseTime = (endpoint: string, responseTime: number) => {
  trackEvent({
    action: 'api_response_time',
    category: 'Performance',
    label: endpoint,
    value: Math.round(responseTime),
  });
};

// Track user satisfaction scores
export const trackUserSatisfaction = (score: number, feedback?: string) => {
  trackEvent({
    action: 'user_satisfaction',
    category: 'Feedback',
    value: score,
    feedback: feedback,
  });
};

// A/B Testing
export const trackABTestImpression = (testId: string, variant: string) => {
  if (typeof window === 'undefined') return;
  
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'ab_test_impression', {
      test_id: testId,
      variant: variant,
      non_interaction: true,
    });
  }
};

export const trackABTestConversion = (testId: string, variant: string) => {
  if (typeof window === 'undefined') return;
  
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'ab_test_conversion', {
      test_id: testId,
      variant: variant,
    });
  }
};