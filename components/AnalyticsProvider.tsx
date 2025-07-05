'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { initGA, trackPageView } from '@/lib/analytics';
import WebVitalsTracker from './WebVitalsTracker';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  const enablePerformanceMonitoring = process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
  
  // Initialize Google Analytics
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    // Initialize GA
    initGA();
  }, []);
  
  // Track page views
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    // Track page view
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname, searchParams]);
  
  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      {/* Web Vitals Tracker - Only include if performance monitoring is enabled */}
      {enablePerformanceMonitoring && <WebVitalsTracker />}
      
      {children}
    </>
  );
}