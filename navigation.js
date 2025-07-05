import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'];
export const localePrefix = 'never';
export const defaultLocale = 'en';

// Export navigation components and hooks
export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix, defaultLocale });