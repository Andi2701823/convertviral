'use client';

import { usePathname } from 'next/navigation';
import Head from 'next/head';

interface CanonicalUrlProps {
  path?: string;
}

/**
 * Component to add canonical URL to pages
 * 
 * This helps prevent duplicate content issues by specifying the preferred URL for a page
 * when multiple URLs might access the same content.
 * 
 * @param path Optional override path. If not provided, uses the current pathname.
 */
export default function CanonicalUrl({ path }: CanonicalUrlProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com';
  const canonicalUrl = `${baseUrl}${path || pathname}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}