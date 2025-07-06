'use client'; 

import { useState } from 'react'; 

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaStyle: string;
  popular: boolean;
  stripeLink: string | null;
}

interface GtagEvent {
  currency: string;
  value: number;
  item_name: string;
}

// Add type definition for window.gtag
declare global {
  interface Window {
    gtag?: (event: string, action: string, params: GtagEvent) => void;
  }
}

export default function PricingSection() { 
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly'); 

  const pricingPlans: PricingPlan[] = [ 
    { 
      name: "Free", 
      price: "$0", 
      period: "/month", 
      description: "Perfect for getting started", 
      features: [ 
        "10 conversions per day", 
        "Files up to 25MB", 
        "Basic formats (PDF, JPG, MP3, MP4)", 
        "Standard quality", 
        "With watermark", 
        "Email support" 
      ], 
      cta: "Current Plan", 
      ctaStyle: "bg-gray-200 text-gray-600 cursor-not-allowed", 
      popular: false, 
      stripeLink: null 
    }, 
    { 
      name: "Premium", 
      price: "$4.99", 
      period: "/month", 
      description: "For power users and content creators", 
      features: [ 
        "Unlimited conversions", 
        "Files up to 500MB", 
        "All 100+ formats", 
        "Highest quality", 
        "No watermarks", 
        "Batch processing (50 files)", 
        "Priority queue", 
        "7-day cloud storage", 
        "Advanced editing tools", 
        "Priority email support" 
      ], 
      cta: "Upgrade to Premium", 
      ctaStyle: "bg-blue-600 text-white hover:bg-blue-700", 
      popular: true, 
      stripeLink: "https://buy.stripe.com/7sY4gBeAG8Qu425g2l6Ri00" 
    }, 
    { 
      name: "Business", 
      price: "$19.99", 
      period: "/month", 
      description: "For teams and developers", 
      features: [ 
        "Everything in Premium", 
        "Files up to 2GB", 
        "API access for automation", 
        "Webhook notifications", 
        "White-label branding", 
        "Team accounts (5 users)", 
        "30-day cloud storage", 
        "Usage analytics dashboard", 
        "Live chat support", 
        "Custom integrations", 
        "SLA guarantee" 
      ], 
      cta: "Upgrade to Business", 
      ctaStyle: "bg-purple-600 text-white hover:bg-purple-700", 
      popular: false, 
      stripeLink: "https://buy.stripe.com/00w5kFbou9Uybux2bv6Ri01" 
    } 
  ]; 

  const handleUpgrade = (plan: PricingPlan) => { 
    if (plan.stripeLink) { 
      // Track conversion event 
      if (typeof window !== 'undefined' && window.gtag) { 
        window.gtag('event', 'begin_checkout', { 
          currency: 'USD', 
          value: parseFloat(plan.price.replace('$', '')), 
          item_name: plan.name 
        }); 
      } 
      
      // Redirect to Stripe 
      window.open(plan.stripeLink, '_blank'); 
    } 
  }; 

  return ( 
    <section className="py-20 bg-gray-50"> 
      <div className="max-w-7xl mx-auto px-4"> 
        <div className="text-center mb-16"> 
          <h2 className="text-4xl font-bold mb-4"> 
            Simple, Transparent Pricing 
          </h2> 
          <p className="text-xl text-gray-600 mb-8"> 
            Choose the perfect plan for your conversion needs 
          </p> 
          
          {/* Billing Toggle */} 
          <div className="inline-flex bg-gray-200 rounded-lg p-1"> 
            <button 
              onClick={() => setBillingCycle('monthly')} 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${ 
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600' 
              }`} 
            > 
              Monthly 
            </button> 
            <button 
              onClick={() => setBillingCycle('yearly')} 
              className={`px-4 py-2 rounded-md font-medium transition-colors ${ 
                billingCycle === 'yearly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600' 
              }`} 
            > 
              Yearly 
              <span className="ml-1 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs"> 
                Save 20% 
              </span> 
            </button> 
          </div> 
        </div> 

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
          {pricingPlans.map((plan, index) => ( 
            <div 
              key={index} 
              className={` 
                relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 
                ${plan.popular 
                  ? 'border-2 border-blue-500 scale-105 shadow-2xl' 
                  : 'border border-gray-200 hover:shadow-xl' 
                } 
              `} 
            > 
              {plan.popular && ( 
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"> 
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium"> 
                    Most Popular 
                  </span> 
                </div> 
              )} 

              <div className="text-center mb-8"> 
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3> 
                <p className="text-gray-600 mb-4">{plan.description}</p> 
                
                <div className="mb-6"> 
                  <span className="text-5xl font-bold">{plan.price}</span> 
                  <span className="text-gray-500">{plan.period}</span> 
                  
                  {billingCycle === 'yearly' && plan.price !== '$0' && ( 
                    <div className="text-sm text-green-600 mt-1"> 
                      Save ${(parseFloat(plan.price.replace('$', '')) * 12 * 0.2).toFixed(2)} per year 
                    </div> 
                  )} 
                </div> 
              </div> 

              <ul className="space-y-3 mb-8"> 
                {plan.features.map((feature, featureIndex) => ( 
                  <li key={featureIndex} className="flex items-start gap-3"> 
                    <span className="text-green-500 mt-0.5">✓</span> 
                    <span className="text-gray-700">{feature}</span> 
                  </li> 
                ))} 
              </ul> 

              <button 
                onClick={() => handleUpgrade(plan)} 
                disabled={!plan.stripeLink} 
                className={` 
                  w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 
                  ${plan.ctaStyle} 
                `} 
              > 
                {plan.cta} 
              </button> 
            </div> 
          ))} 
        </div> 
      </div> 
    </section> 
  ); 
}