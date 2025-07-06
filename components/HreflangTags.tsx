'use client';

import { usePathname } from 'next/navigation';
import Head from 'next/head';

interface HreflangTagsProps {
  path?: string;
  languages?: { code: string; url: string }[];
}

/**
 * Component to add hreflang tags for multi-language support
 * 
 * This helps search engines understand which language versions of a page are available
 * and which one to show to users based on their language preferences.
 * 
 * @param path Optional override path. If not provided, uses the current pathname.
 * @param languages Optional array of language codes and URLs. If not provided, uses default languages.
 */
export default function HreflangTags({ path, languages }: HreflangTagsProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com';
  const currentPath = path || pathname;
  
  // Only English is supported
  const defaultLanguages = [
    { code: 'en', url: '' },      // English (default)
  ];
  
  const supportedLanguages = languages || defaultLanguages;
  
  return (
    <Head>
      {/* Default language (x-default) */}
      <link 
        rel="alternate" 
        href={`${baseUrl}${currentPath}`} 
        hrefLang="x-default" 
      />
      
      {/* Language-specific alternates */}
      {supportedLanguages.map(lang => (
        <link 
          key={lang.code}
          rel="alternate" 
          href={`${baseUrl}${lang.url}${currentPath}`} 
          hrefLang={lang.code} 
        />
      ))}
    </Head>
  );
}