import { Metadata } from 'next';
import { CheckIcon } from '@/components/Icons';
import { ClockIcon, LockClosedIcon as LockIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SubscriptionCheckout from '@/components/SubscriptionCheckout';
import JsonLd from '@/components/JsonLd';
import WaitlistModal from '@/components/WaitlistModal';
import CountdownTimer from '@/components/CountdownTimer';
import SocialProof from '@/components/SocialProof';
import { HeaderAdBanner, SidebarAdUnit, InContentAdUnit, FooterAdBanner } from '@/components/AdSenseEnhanced';
import AffiliateRecommendations from '@/components/AffiliateRecommendations';
import SponsoredSuggestions from '@/components/SponsoredSuggestions';
import LeadMagnet from '@/components/LeadMagnet';

export const metadata: Metadata = {
  title: 'Pricing - ConvertViral',
  description: 'Choose the perfect plan for your file conversion needs. Free and premium options available.',
};

function generatePricingJsonLd(pricingTiers: PricingTier[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "ConvertViral File Conversion Service",
    "description": "File conversion platform with multiple pricing tiers",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "24.99",
      "offerCount": pricingTiers.length,
      "offers": pricingTiers.map(tier => ({
        "@type": "Offer",
        "name": tier.name,
        "description": tier.description,
        "price": tier.price.replace('$', ''),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }))
    }
  };
}

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  locked?: boolean;
  launchDate?: string;
  originalPrice?: string;
  discount?: string;
};

export default async function PricingPage() {
  // Benutzer-Session abrufen
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  
  // Launch date for premium features (30 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);
  
  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for occasional conversions',
      features: [
        '10 conversions per day',
        'Basic file formats',
        'Max file size: 25MB',
        'Standard conversion speed',
        'Watermark on outputs',
        'Community support',
      ],
      cta: 'Get Started',
    },
    {
      name: 'Premium',
      price: '$4.99',
      originalPrice: '$9.99',
      discount: '50% OFF Early Bird',
      description: 'Unlimited conversions without limits',
      features: [
        'Unlimited conversions',
        'All file formats',
        'Max file size: 500MB',
        'Priority conversion speed',
        'No watermarks',
        'Email support',
        'Advanced gamification',
        'Batch conversions',
      ],
      cta: 'Join Waitlist',
      popular: true,
      locked: true,
      launchDate: launchDate.toISOString(),
    },
    {
      name: 'Business',
      price: '$19.99',
      originalPrice: '$39.99',
      discount: '50% OFF Early Bird',
      description: 'For teams and professionals',
      features: [
        'Everything in Premium',
        'Max file size: 2GB',
        'Ultra-fast conversion speed',
        'API access',
        'White-label solution',
        'Team management',
        'Priority support',
        'Custom branding',
        'Advanced analytics',
      ],
      cta: 'Join Waitlist',
      locked: true,
      launchDate: launchDate.toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Ad Banner */}
      <HeaderAdBanner />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with Ads and Affiliate Recommendations */}
          <div className="lg:col-span-1 space-y-6">
            <SidebarAdUnit />
            <div className="sticky top-4">
              <AffiliateRecommendations 
                category="software" 
                maxItems={3} 
                layout="list" 
                showFilters={false}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Choose Your <span className="text-blue-600">Conversion</span> Plan
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Start free and upgrade when you're ready for unlimited conversions and premium features.
              </p>
            </div>

            {/* Launch Countdown */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
                <ClockIcon className="h-5 w-5" />
                <span className="font-semibold">Launch Countdown</span>
              </div>
              <CountdownTimer targetDate={launchDate.toISOString()} />
              <SocialProof />
            </div>

            {/* Sponsored Suggestions */}
            <div className="mb-12">
              <SponsoredSuggestions 
                maxSuggestions={3} 
                layout="horizontal"
              />
            </div>

            {/* In-Content Ad */}
            <div className="mb-12">
              <InContentAdUnit />
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md">
                <button className="px-4 py-2 text-sm font-medium rounded-l-md bg-primary-100 text-primary-800">
                  Monthly
                </button>
                <button className="px-4 py-2 text-sm font-medium rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                  Annual (Save 20%)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
        {pricingTiers.map((tier) => (
          <div 
            key={tier.name}
            className={`bg-white rounded-lg shadow-lg overflow-hidden relative ${
              tier.popular ? 'ring-2 ring-primary-500 transform md:-translate-y-4' : ''
            } ${tier.locked ? 'opacity-95' : ''}`}
          >
            {tier.locked && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <LockIcon className="h-3 w-3 mr-1" />
                  Coming Soon
                </div>
              </div>
            )}
            
            {tier.popular && (
              <div className={`text-white text-center py-2 text-sm font-medium ${
                tier.locked 
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600' 
                  : 'bg-primary-500'
              }`}>
                {tier.locked ? '🚀 Most Anticipated' : 'Most Popular'}
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{tier.name}</h2>
                {tier.locked && (
                  <div className="flex items-center text-orange-600">
                    <StarIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Early Bird</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{tier.description}</p>
              
              <div className="mb-6">
                {tier.originalPrice && tier.locked ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl text-gray-400 line-through">{tier.originalPrice}</span>
                      <span className="text-4xl font-extrabold text-green-600">{tier.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {tier.discount}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">{tier.price}</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                )}
              </div>
              
              {tier.name === 'Free' ? (
                <a 
                  href='/convert'
                  className="block text-center py-3 px-6 rounded-md font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
                >
                  {tier.cta}
                </a>
              ) : tier.locked ? (
                <WaitlistModal 
                  planType={tier.name.toLowerCase()}
                  planPrice={tier.price}
                  originalPrice={tier.originalPrice}
                  discount={tier.discount}
                  launchDate={tier.launchDate}
                >
                  <button className={`w-full py-3 px-6 rounded-md font-medium transition-all duration-200 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                  }`}>
                    <div className="flex items-center justify-center">
                      <LockIcon className="h-4 w-4 mr-2" />
                      {tier.cta}
                    </div>
                  </button>
                </WaitlistModal>
              ) : (
                <a 
                  href={isLoggedIn ? `/checkout/${tier.name.toLowerCase()}` : '/login?redirect=pricing'}
                  className={`block text-center py-3 px-6 rounded-md font-medium transition-colors ${
                    tier.popular 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {tier.cta}
                </a>
              )}
            </div>
            
            <div className={`px-6 pt-2 pb-6 ${
              tier.locked ? 'bg-gradient-to-b from-gray-50 to-gray-100' : 'bg-gray-50'
            }`}>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                What's included
              </h3>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className={`h-5 w-5 flex-shrink-0 mr-2 ${
                      tier.locked ? 'text-orange-500' : 'text-green-500'
                    }`} />
                    <span className={tier.locked ? 'text-gray-700' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              {tier.locked && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800 font-medium">
                      Available in {Math.ceil((new Date(tier.launchDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
            </div>

            {/* Lead Magnet */}
             <div className="mt-16 mb-12">
               <LeadMagnet 
                 title="Free File Conversion Guide"
                 subtitle="Master Every Format Like a Pro"
                 magnetType="ebook"
                 trigger="manual"
               />
             </div>

            <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Do you offer refunds?</h3>
            <p className="text-gray-600">
              We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and Apple Pay. For Business plans, we also accept bank transfers.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Is my data secure?</h3>
            <p className="text-gray-600">
              Yes, we use industry-standard encryption to protect your files. We also delete all converted files after 24 hours.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Do you offer custom plans?</h3>
            <p className="text-gray-600">
              Yes, for enterprise customers with specific needs, we offer custom plans. Contact our sales team for details.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">How do I cancel my subscription?</h3>
            <p className="text-gray-600">
              You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your billing period.
            </p>
          </div>
        </div>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-6">Our support team is here to help you find the perfect plan for your needs.</p>
              <div className="flex justify-center space-x-4">
                <a href="/contact" className="btn-secondary">
                  Contact Support
                </a>
                <a href="/convert" className="btn-primary">
                  Try For Free
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Ad Banner */}
       <FooterAdBanner />
       
       <JsonLd data={generatePricingJsonLd(pricingTiers)} />
    </div>
  );
}