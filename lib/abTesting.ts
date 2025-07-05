import { trackABTestImpression, trackABTestConversion } from './analytics';

// Define test configuration type
interface TestConfig {
  variants: string[];
  weights: number[];
}

type Variant = 'A' | 'B';

interface ABTest {
  id: string;
  name: string;
  variants: {
    A: string;
    B: string;
  };
}

// Define available A/B tests
export const abTests: Record<string, ABTest> = {
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
const testConfigurations: Record<string, TestConfig> = {
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
const isABTestingEnabled = process.env.NEXT_PUBLIC_ENABLE_AB_TESTING === 'true';

/**
 * Get the variant for a specific test
 * @param testId - The ID of the test
 * @returns The variant assigned to the user
 */
export const getTestVariant = (testId: string): string => {
  // If A/B testing is disabled, always return the default variant
  if (!isABTestingEnabled) {
    return testConfigurations[testId]?.variants[0] || 'default';
  }

  if (typeof window === 'undefined') {
    // Return default variant for SSR
    return testConfigurations[testId]?.variants[0] || 'default';
  }

  // Check if user already has a variant assigned
  const storedVariant = localStorage.getItem(`ab_test_${testId}`);
  if (storedVariant) {
    return storedVariant;
  }

  // Get test configuration
  const testConfig = testConfigurations[testId];
  if (!testConfig) {
    console.error(`A/B test configuration not found for test ID: ${testId}`);
    return 'default';
  }

  // Assign variant based on weights
  const { variants, weights } = testConfig;
  const randomValue = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < variants.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      // Store the assigned variant
      localStorage.setItem(`ab_test_${testId}`, variants[i]);
      return variants[i];
    }
  }

  // Fallback to first variant
  localStorage.setItem(`ab_test_${testId}`, variants[0]);
  return variants[0];
};

/**
 * Get the content for a specific test variant
 * @param testId - The ID of the test
 * @param variantContents - Object containing content for each variant
 * @returns The content for the assigned variant
 */
export const getTestContent = <T>(testId: string, variantContents: Record<string, T>): T => {
  // If A/B testing is disabled, return default content
  if (!isABTestingEnabled) {
    return variantContents['default'] || Object.values(variantContents)[0];
  }
  
  const variant = getTestVariant(testId);
  
  // Track impression
  trackTestImpression(testId, variant);
  
  return variantContents[variant] || variantContents['default'];
};

/**
 * Track an impression for a specific test
 * @param testId - The ID of the test
 * @param variant - The variant shown to the user
 */
const trackTestImpression = (testId: string, variant: string): void => {
  // If A/B testing is disabled, don't track impressions
  if (!isABTestingEnabled || typeof window === 'undefined') return;
  
  // Track impression in analytics
  trackABTestImpression(testId, variant);
};

/**
 * Track a conversion for a specific test
 * 
 * @param testId The ID of the A/B test
 * @param conversionType The type of conversion (e.g., 'click', 'signup', 'purchase')
 */
export function trackTestConversion(testId: string, conversionType: string = 'default'): void {
  // If A/B testing is disabled, don't track conversions
  if (!isABTestingEnabled || typeof window === 'undefined') return;
  
  // Check if test exists in either configuration
  if (!testConfigurations[testId] && !abTests[testId]) {
    console.error(`A/B test with ID "${testId}" not found`);
    return;
  }
  
  const variant = getTestVariant(testId);
  trackABTestConversion(testId, variant);
}

/**
 * A/B test component props
 */
export interface ABTestProps {
  testId: string;
  trackImpression?: boolean;
  renderA: (content: string) => React.ReactNode;
  renderB: (content: string) => React.ReactNode;
}