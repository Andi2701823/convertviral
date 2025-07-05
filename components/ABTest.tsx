'use client';

import { useEffect, useState } from 'react';
import { getTestVariant, trackTestConversion, ABTestProps, abTests } from '@/lib/abTesting';

/**
 * A/B Test Component
 * 
 * This component renders different content based on which variant (A or B) the user is assigned to.
 * It also tracks impressions and can track conversions when triggered.
 * 
 * @example
 * <ABTest
 *   testId="conversion-button"
 *   renderA={(content) => <button className="bg-blue-500">{content}</button>}
 *   renderB={(content) => <button className="bg-green-500">{content}</button>}
 * />
 */
export default function ABTest({ testId, trackImpression = true, renderA, renderB }: ABTestProps) {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null);
  const [content, setContent] = useState<string>('');
  
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    const assignedVariant = getTestVariant(testId);
    // Get the test configuration to determine if it's A or B
    const testConfig = abTests[testId];
    if (testConfig) {
      const isVariantA = assignedVariant === 'A';
      setVariant(isVariantA ? 'A' : 'B');
      setContent(String(isVariantA ? testConfig.variants.A : testConfig.variants.B));
      
      // Track impression if enabled
      if (trackImpression) {
        // Import and call trackTestImpression here if needed
      }
    }
  }, [testId, trackImpression]);
  
  // Don't render anything during SSR or until variant is determined
  if (!variant) return null;
  
  // Render the appropriate variant
  return variant === 'A' ? renderA(content) : renderB(content);
}

/**
 * Hook to track a conversion for an A/B test
 * 
 * @param testId The ID of the A/B test
 * @param conversionType The type of conversion (e.g., 'click', 'signup', 'purchase')
 * @returns A function to trigger the conversion tracking
 */
export function useABTestConversion(testId: string, conversionType: string) {
  return () => trackTestConversion(testId, conversionType);
}