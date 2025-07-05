// Global type definitions

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

// Extend the NodeJS namespace
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
    NEXT_PUBLIC_ENABLE_AB_TESTING: string;
    NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: string;
    NEXT_PUBLIC_DEFAULT_LOCALE: string;
    NEXT_PUBLIC_SUPPORTED_LOCALES: string;
  }
}