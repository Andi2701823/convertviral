// Type definitions for next-intl/link
import { ComponentProps } from 'react';
import { Link as NavigationLink } from 'next-intl/navigation';

export type LinkProps = ComponentProps<typeof NavigationLink>;
export { NavigationLink as Link };