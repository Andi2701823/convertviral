import '../styles/globals.css';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { generateBaseMetadata } from '@/lib/seo';
import Navigation from '@/components/Navigation';
import NewFooter from '@/components/NewFooter';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import { ConsentType } from '@/types/consent';
import JsonLd from '@/components/JsonLd';

const ServiceWorkerRegistration = dynamic(() => import('@/components/ServiceWorkerRegistration'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

// Create base metadata configuration (but don't export it)
const baseMetadata = generateBaseMetadata({
  title: 'ConvertViral - Free Online File Converter',
  description: 'Fast, secure, and free online file conversion. Convert PDF, images, audio, video instantly. No registration required.',
  keywords: ['file conversion', 'convert pdf', 'convert image', 'convert video', 'convert audio', 'free converter', 'online converter'],
});

// Generate metadata
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    ...baseMetadata,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Organization structured data
  const orgStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ConvertViral',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com'}/logo.png`,
    sameAs: [
      'https://twitter.com/convertviral',
      'https://www.facebook.com/convertviral',
    ],
  };

  return (
    <html lang="en">
      <head>
        <JsonLd data={orgStructuredData} />
        <meta name="google-site-verification" content="8JuqKkIod-KCDrentWueKmaFj3BnMqnp1HXQ9tcC7hk" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <AnalyticsProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <NewFooter />
            <ServiceWorkerRegistration />
            <CookieConsent />
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  );
}