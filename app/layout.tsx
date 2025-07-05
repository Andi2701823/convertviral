import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { generateBaseMetadata } from '@/lib/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import { ConsentType } from '@/types/consent';
import JsonLd from '@/components/JsonLd';
import HreflangTags from '@/components/HreflangTags';

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

import enMessages from '../i18n/en.json';
import deMessages from '../i18n/de.json';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  let messages;
  if (locale === 'de') {
    messages = deMessages;
  } else {
    messages = enMessages;
  }
  
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
    <html lang={locale}>
      <head>
        <JsonLd data={orgStructuredData} />
        <Suspense fallback={null}>
          <HreflangTags />
        </Suspense>
        <meta name="google-site-verification" content="8JuqKkIod-KCDrentWueKmaFj3BnMqnp1HXQ9tcC7hk" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense fallback={<div>Loading...</div>}>
            <AnalyticsProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <ServiceWorkerRegistration />
              <CookieConsent />
             </AnalyticsProvider>
           </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}