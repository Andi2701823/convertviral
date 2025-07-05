'use client';

import { useEffect } from 'react';
import { trackWebVital } from '@/lib/analytics';

// Define metric type for web-vitals
type WebVitalsMetric = {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries: PerformanceEntry[];
};

/**
 * Component to track Core Web Vitals metrics
 * 
 * This component uses the web-vitals library to measure and report
 * Core Web Vitals metrics to our analytics system.
 * 
 * Core Web Vitals tracked:
 * - LCP (Largest Contentful Paint): measures loading performance
 * - FID (First Input Delay): measures interactivity
 * - CLS (Cumulative Layout Shift): measures visual stability
 * - TTFB (Time to First Byte): measures server response time
 * - FCP (First Contentful Paint): measures when first content is painted
 */
export default function WebVitalsTracker() {
  const enablePerformanceMonitoring = process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
  
  useEffect(() => {
    // Only run in browser and if performance monitoring is enabled
    if (typeof window === 'undefined' || !enablePerformanceMonitoring) return;
    
    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then((webVitals) => {
      const { onLCP, onFID, onCLS, onTTFB, onFCP } = webVitals;
      // Track Largest Contentful Paint
      onLCP((metric: WebVitalsMetric) => {
        trackWebVital('LCP', metric.value);
      });
      
      // Track First Input Delay
      onFID((metric: WebVitalsMetric) => {
        trackWebVital('FID', metric.value);
      });
      
      // Track Cumulative Layout Shift
      onCLS((metric: WebVitalsMetric) => {
        trackWebVital('CLS', metric.value);
      });
      
      // Track Time to First Byte
      onTTFB((metric: WebVitalsMetric) => {
        trackWebVital('TTFB', metric.value);
      });
      
      // Track First Contentful Paint
      onFCP((metric: WebVitalsMetric) => {
        trackWebVital('FCP', metric.value);
      });
    });
  }, [enablePerformanceMonitoring]);
  
  // This component doesn't render anything
  return null;
}