'use client';

import { useState, useEffect } from 'react';
import { StarIcon, ArrowTopRightOnSquareIcon as ExternalLinkIcon, TagIcon } from '@heroicons/react/24/solid';
import { ShieldCheckIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  affiliateUrl: string;
  category: 'software' | 'hardware' | 'course' | 'service';
  tags: string[];
  discount?: string;
  featured?: boolean;
}

interface AffiliateRecommendationsProps {
  category?: 'software' | 'hardware' | 'course' | 'service' | 'all';
  maxItems?: number;
  layout?: 'grid' | 'list' | 'carousel';
  showFilters?: boolean;
}

const affiliateProducts: AffiliateProduct[] = [
  {
    id: '1',
    name: 'Adobe Creative Cloud',
    description: 'Complete creative suite for professional design, video editing, and content creation.',
    price: '$52.99/month',
    originalPrice: '$79.99/month',
    rating: 4.8,
    reviews: 12847,
    image: '/api/placeholder/300/200',
    affiliateUrl: 'https://adobe.com?ref=convertviral',
    category: 'software',
    tags: ['Design', 'Video', 'Professional'],
    discount: '34% OFF',
    featured: true
  },
  {
    id: '2',
    name: 'Canva Pro',
    description: 'Easy-to-use design platform with premium templates and features.',
    price: '$14.99/month',
    rating: 4.7,
    reviews: 8932,
    image: '/api/placeholder/300/200',
    affiliateUrl: 'https://canva.com?ref=convertviral',
    category: 'software',
    tags: ['Design', 'Templates', 'Easy'],
    featured: true
  },
  {
    id: '3',
    name: 'Wacom Intuos Graphics Tablet',
    description: 'Professional drawing tablet for digital artists and designers.',
    price: '$79.99',
    originalPrice: '$99.99',
    rating: 4.6,
    reviews: 3421,
    image: '/api/placeholder/300/200',
    affiliateUrl: 'https://wacom.com?ref=convertviral',
    category: 'hardware',
    tags: ['Drawing', 'Professional', 'Tablet'],
    discount: '20% OFF'
  },
  {
    id: '4',
    name: 'Complete Web Development Course',
    description: 'Learn full-stack web development from beginner to advanced level.',
    price: '$89.99',
    originalPrice: '$199.99',
    rating: 4.9,
    reviews: 15632,
    image: '/api/placeholder/300/200',
    affiliateUrl: 'https://udemy.com?ref=convertviral',
    category: 'course',
    tags: ['Programming', 'Web Dev', 'Course'],
    discount: '55% OFF',
    featured: true
  },
  {
    id: '5',
    name: 'Cloudflare Pro',
    description: 'Enhanced website performance, security, and analytics.',
    price: '$20/month',
    rating: 4.5,
    reviews: 2847,
    image: '/api/placeholder/300/200',
    affiliateUrl: 'https://cloudflare.com?ref=convertviral',
    category: 'service',
    tags: ['Hosting', 'Security', 'Performance']
  }
];

export default function AffiliateRecommendations({
  category = 'all',
  maxItems = 6,
  layout = 'grid',
  showFilters = true
}: AffiliateRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [filteredProducts, setFilteredProducts] = useState<AffiliateProduct[]>([]);

  useEffect(() => {
    let filtered = affiliateProducts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Sort by featured first, then by rating
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
    
    setFilteredProducts(filtered.slice(0, maxItems));
  }, [selectedCategory, maxItems]);

  const handleAffiliateClick = (product: AffiliateProduct) => {
    // Track affiliate click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        event_category: 'monetization',
        event_label: product.name,
        value: parseFloat(product.price.replace(/[^0-9.]/g, ''))
      });
    }
    
    // Open affiliate link
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'course', label: 'Courses' },
    { value: 'service', label: 'Services' }
  ];

  return (
    <div className="affiliate-recommendations bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Recommended Tools</h3>
          <p className="text-gray-600 mt-1">Professional tools to enhance your workflow</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>Trusted Partners</span>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-6 ${
        layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        layout === 'list' ? 'grid-cols-1' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`affiliate-card bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
              product.featured ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {product.featured && (
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 text-center">
                ⭐ FEATURED
              </div>
            )}
            
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.category === 'software' ? 'bg-blue-100 text-blue-800' :
                  product.category === 'hardware' ? 'bg-green-100 text-green-800' :
                  product.category === 'course' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {product.category.toUpperCase()}
                </span>
                
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
                
                <button
                  onClick={() => handleAffiliateClick(product)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Deal
                  <ExternalLinkIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5 text-green-500" />
            <span>Verified Partners</span>
          </div>
          <div className="flex items-center space-x-2">
            <TruckIcon className="h-5 w-5 text-blue-500" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCardIcon className="h-5 w-5 text-purple-500" />
            <span>Secure Payment</span>
          </div>
        </div>
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