// Type definitions for next-intl/link
// This file provides TypeScript definitions for the next-intl/link module
// It re-exports the Link component from next-intl/navigation

import { ComponentProps } from 'react';
import { Link as NavigationLink } from 'next-intl/navigation';

// Export the Link component props type
export type LinkProps = ComponentProps<typeof NavigationLink>;

// Export the Link component
export { NavigationLink as Link };

// Default export for compatibility
export default NavigationLink;