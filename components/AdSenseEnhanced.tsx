'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface AdSenseEnhancedProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export default function AdSenseEnhanced({
  adSlot,
  adFormat = 'auto',
  adLayout,
  className = '',
  style = {},
  responsive = true,
  priority = 'medium'
}: AdSenseEnhancedProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (error) {
      console.error('AdSense error:', error);
      setAdError(true);
    }
  }, []);

  const adStyle = {
    display: 'block',
    minHeight: adFormat === 'rectangle' ? '250px' : '90px',
    ...style
  };

  if (adError) {
    return (
      <div className={`ad-placeholder bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500 text-sm">Advertisement Space</p>
      </div>
    );
  }

  return (
    <>
      <Script
        id="adsbygoogle-init"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossOrigin="anonymous"
        strategy={priority === 'high' ? 'beforeInteractive' : 'lazyOnload'}
      />
      
      <div className={`ad-container ${className}`}>
        <ins
          className="adsbygoogle"
          style={adStyle}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-ad-layout={adLayout}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
        
        {!adLoaded && (
          <div className="ad-loading bg-gray-50 border border-gray-200 rounded-lg p-4 text-center animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        )}
      </div>
    </>
  );
}

// AdSense placement components for different sections
export function HeaderAdBanner() {
  return (
    <AdSenseEnhanced
      adSlot="1234567890"
      adFormat="horizontal"
      className="mb-6"
      priority="high"
    />
  );
}

export function SidebarAdUnit() {
  return (
    <AdSenseEnhanced
      adSlot="2345678901"
      adFormat="vertical"
      className="sticky top-4"
      style={{ width: '300px', height: '600px' }}
    />
  );
}

export function InContentAdUnit() {
  return (
    <AdSenseEnhanced
      adSlot="3456789012"
      adFormat="rectangle"
      className="my-8 mx-auto"
      style={{ width: '336px', height: '280px' }}
    />
  );
}

export function FooterAdBanner() {
  return (
    <AdSenseEnhanced
      adSlot="4567890123"
      adFormat="horizontal"
      className="mt-8"
      priority="low"
    />
  );
}

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}