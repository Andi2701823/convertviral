# SEO and Analytics Implementation Guide

## Overview

This document provides an overview of the SEO and analytics implementation for ConvertViral.com. The implementation includes:

- Dynamic metadata generation
- Structured data (JSON-LD)
- Sitemaps and robots.txt
- Google Analytics 4 integration
- A/B testing framework
- Performance monitoring (Core Web Vitals)

## Configuration

The implementation uses environment variables for configuration. These are defined in `.env.local`:

```
# Site configuration
NEXT_PUBLIC_SITE_URL=https://convertviral.com
NEXT_PUBLIC_SITE_NAME=ConvertViral

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# A/B Testing
NEXT_PUBLIC_ENABLE_AB_TESTING=true

# Performance monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# SEO
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,es,fr,de,it,pt,ja,zh
```

## Key Components

### SEO

- **lib/seo.ts**: Central module for generating metadata and structured data
- **components/CanonicalUrl.tsx**: Component for adding canonical URLs
- **components/HreflangTags.tsx**: Component for adding hreflang tags
- **public/robots.txt**: Rules for search engine crawlers
- **public/sitemap.xml**: Main sitemap
- **public/sitemaps/**: Directory containing dynamic sitemaps

### Analytics

- **lib/analytics.ts**: Core analytics implementation
- **components/AnalyticsProvider.tsx**: Provider component for initializing analytics
- **components/WebVitalsTracker.tsx**: Component for tracking Core Web Vitals

### A/B Testing

- **lib/abTesting.ts**: A/B testing framework
- **components/ABTest.tsx**: Component for implementing A/B tests

## Dynamic Routes

The following dynamic routes have been implemented with SEO optimization:

- **/convert/[format]/page.tsx**: Pages for specific conversion formats
- **/formats/[format]/page.tsx**: Pages for file format information
- **/convert/[from]-to-[to]/page.tsx**: Pages for specific conversion pairs
- **/tools/batch-converter/page.tsx**: Batch conversion tool page

## Sitemap Generation

Sitemaps are generated during the build process using:

1. **next-sitemap**: For generating the main sitemap
2. **scripts/generate-conversion-sitemaps.ts**: For generating dynamic sitemaps

The process is automated through npm scripts in package.json:

```json
"scripts": {
  "build": "next build && npm run generate-dynamic-sitemaps && npm run postbuild",
  "postbuild": "next-sitemap",
  "generate-sitemap": "next-sitemap",
  "generate-dynamic-sitemaps": "ts-node scripts/generate-conversion-sitemaps.ts"
}
```

## Usage Guidelines

### Adding New Pages

When adding new pages:

1. Use the `generateBaseMetadata` function from `lib/seo.ts`
2. Add appropriate structured data using functions from `lib/seo.ts`
3. Include the page in the sitemap generation process if needed

### Tracking Events

To track custom events:

```typescript
import { trackEvent } from '@/lib/analytics';

// Track a custom event
trackEvent('button_click', { button_id: 'convert_button' });
```

### Implementing A/B Tests

To implement an A/B test:

```tsx
import { ABTest } from '@/components/ABTest';

// In your component
<ABTest 
  testId="conversion-button"
  variants={{
    'default': <Button>Convert</Button>,
    'large-green': <Button size="large" color="green">Convert Now</Button>,
    'animated': <AnimatedButton>Convert</AnimatedButton>
  }}
  onConversion={() => trackTestConversion('conversion-button')}
/>
```

## Maintenance

### Updating Sitemaps

Sitemaps are automatically generated during the build process. To manually update:

```bash
npm run generate-sitemap
npm run generate-dynamic-sitemaps
```

### Monitoring Performance

Core Web Vitals are tracked automatically when performance monitoring is enabled. View the data in Google Analytics under the "Events" section.

## Future Improvements

- Implement server-side rendering for dynamic routes to improve SEO
- Add schema.org markup for more page types
- Implement internationalization (i18n) for multi-language support
- Add more detailed analytics dashboards
- Implement user journey tracking