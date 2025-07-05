'use client';

import { useState, useEffect } from 'react';
import { StarIcon, ArrowTopRightOnSquareIcon as ExternalLinkIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { ClockIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface SponsoredSuggestion {
  id: string;
  title: string;
  description: string;
  provider: string;
  providerLogo: string;
  rating: number;
  reviews: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  badge?: 'sponsored' | 'recommended' | 'popular' | 'new';
  category: string;
  estimatedTime: string;
  userCount: string;
}

interface SponsoredSuggestionsProps {
  fileType?: string;
  conversionType?: string;
  maxSuggestions?: number;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

const sponsoredSuggestions: SponsoredSuggestion[] = [
  {
    id: '1',
    title: 'CloudConvert Pro',
    description: 'Professional cloud-based file conversion with API access and advanced features.',
    provider: 'CloudConvert',
    providerLogo: '/api/placeholder/40/40',
    rating: 4.8,
    reviews: 12847,
    price: '$9.99/month',
    originalPrice: '$19.99/month',
    discount: '50% OFF',
    features: ['200+ formats', 'API access', 'Batch processing', '10GB storage'],
    ctaText: 'Try Free for 14 Days',
    ctaUrl: 'https://cloudconvert.com?ref=convertviral',
    badge: 'recommended',
    category: 'Cloud Service',
    estimatedTime: '< 1 minute',
    userCount: '2M+'
  },
  {
    id: '2',
    title: 'Adobe Acrobat Pro',
    description: 'Industry-standard PDF tools for professional document management and conversion.',
    provider: 'Adobe',
    providerLogo: '/api/placeholder/40/40',
    rating: 4.7,
    reviews: 8932,
    price: '$14.99/month',
    features: ['PDF editing', 'E-signatures', 'OCR technology', 'Mobile sync'],
    ctaText: 'Start Free Trial',
    ctaUrl: 'https://adobe.com/acrobat?ref=convertviral',
    badge: 'popular',
    category: 'PDF Tools',
    estimatedTime: '< 30 seconds',
    userCount: '5M+'
  },
  {
    id: '3',
    title: 'Zamzar Pro',
    description: 'Fast, reliable file conversion with premium features and priority processing.',
    provider: 'Zamzar',
    providerLogo: '/api/placeholder/40/40',
    rating: 4.6,
    reviews: 5421,
    price: '$16/month',
    originalPrice: '$24/month',
    discount: '33% OFF',
    features: ['1000+ formats', 'Priority queue', 'No file limits', 'Email delivery'],
    ctaText: 'Get Premium Access',
    ctaUrl: 'https://zamzar.com?ref=convertviral',
    badge: 'sponsored',
    category: 'File Conversion',
    estimatedTime: '< 2 minutes',
    userCount: '1M+'
  },
  {
    id: '4',
    title: 'Convertio Premium',
    description: 'Advanced online converter with OCR, batch processing, and cloud integration.',
    provider: 'Convertio',
    providerLogo: '/api/placeholder/40/40',
    rating: 4.5,
    reviews: 3847,
    price: '$9.99/month',
    features: ['OCR support', 'Cloud storage', 'Batch conversion', 'API access'],
    ctaText: 'Upgrade Now',
    ctaUrl: 'https://convertio.co?ref=convertviral',
    badge: 'new',
    category: 'Online Tools',
    estimatedTime: '< 1 minute',
    userCount: '800K+'
  }
];

export default function SponsoredSuggestions({
  fileType,
  conversionType,
  maxSuggestions = 3,
  layout = 'horizontal'
}: SponsoredSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SponsoredSuggestion[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Filter and sort suggestions based on context
    let filtered = [...sponsoredSuggestions];
    
    // Sort by rating and reviews
    filtered.sort((a, b) => {
      if (a.badge === 'recommended' && b.badge !== 'recommended') return -1;
      if (a.badge !== 'recommended' && b.badge === 'recommended') return 1;
      return b.rating - a.rating;
    });
    
    setSuggestions(filtered.slice(0, maxSuggestions));
  }, [fileType, conversionType, maxSuggestions]);

  const handleSponsoredClick = (suggestion: SponsoredSuggestion) => {
    // Track sponsored click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sponsored_click', {
        event_category: 'monetization',
        event_label: suggestion.provider,
        value: parseFloat(suggestion.price.replace(/[^0-9.]/g, ''))
      });
    }
    
    // Open sponsored link
    window.open(suggestion.ctaUrl, '_blank', 'noopener,noreferrer');
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'sponsored':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'recommended':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'popular':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'new':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'sponsored':
        return <SparklesIcon className="h-3 w-3" />;
      case 'recommended':
        return <TrophyIcon className="h-3 w-3" />;
      case 'popular':
        return <UserGroupIcon className="h-3 w-3" />;
      case 'new':
        return <StarIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="sponsored-suggestions bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <SparklesIcon className="h-5 w-5 text-blue-600 mr-2" />
            Recommended Premium Tools
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Professional solutions for faster, better conversions
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      <div className={`grid gap-4 ${
        layout === 'horizontal' ? 'grid-cols-1 md:grid-cols-3' :
        layout === 'vertical' ? 'grid-cols-1' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={suggestion.providerLogo}
                  alt={suggestion.provider}
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600">{suggestion.provider}</p>
                </div>
              </div>
              
              {suggestion.badge && (
                <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border ${
                  getBadgeStyle(suggestion.badge)
                }`}>
                  {getBadgeIcon(suggestion.badge)}
                  <span className="ml-1 capitalize">{suggestion.badge}</span>
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {suggestion.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                  <span>{suggestion.rating}</span>
                  <span className="ml-1">({suggestion.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-3 w-3 mr-1" />
                  <span>{suggestion.userCount}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>{suggestion.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {suggestion.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
                {suggestion.features.length > 3 && (
                  <span className="text-xs text-gray-500">+{suggestion.features.length - 3} more</span>
                )}
              </div>
            </div>

            {/* Pricing and CTA */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{suggestion.price}</span>
                  {suggestion.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{suggestion.originalPrice}</span>
                  )}
                </div>
                {suggestion.discount && (
                  <span className="text-xs text-green-600 font-medium">{suggestion.discount}</span>
                )}
              </div>
              
              <button
                onClick={() => handleSponsoredClick(suggestion)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {suggestion.ctaText}
                <ExternalLinkIcon className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          <SparklesIcon className="h-3 w-3 inline mr-1" />
          Sponsored recommendations • We may earn a commission
        </p>
      </div>
    </div>
  );
}

// Declare global gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}