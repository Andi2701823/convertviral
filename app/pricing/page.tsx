'use client';

import { CheckIcon } from '@/components/Icons';
import Link from 'next/link';



export default function PricingPage() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for you and start converting files today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-extrabold text-gray-900">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mb-8">Perfect for occasional conversions and trying out our service.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">10 conversions per day</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Files up to 25MB</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Standard conversion speed</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Basic file formats</span>
                </li>
              </ul>
              
              <Link 
                href="/signup"
                className="block w-full bg-gray-100 text-gray-800 text-center font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100 relative transition-transform duration-300 hover:transform hover:scale-105">
            <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
              Popular
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-extrabold text-gray-900">$4.99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mb-8">For regular users who need more conversions and larger files.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Unlimited conversions</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Files up to 100MB</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Priority conversion speed</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All file formats</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">No ads</span>
                </li>
              </ul>
              
              <a 
                href="https://buy.stripe.com/7sY4gBeAG8Qu425g2l6Ri00"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary-600 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300"
              >
                Subscribe Now
              </a>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-extrabold text-gray-900">$19.99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mb-8">For businesses with high-volume conversion needs.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Unlimited conversions</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Files up to 500MB</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Fastest conversion speed</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">All file formats</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">API access</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-600">Priority support</span>
                </li>
              </ul>
              
              <a 
                href="https://buy.stripe.com/00w5kFbou9Uybux2bv6Ri01"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-800 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors duration-300"
              >
                Subscribe Now
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my subscription at any time?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">How secure are my files?</h4>
              <p className="text-gray-600">All files are encrypted during the conversion process and automatically deleted after 24 hours. We never access your files for any purpose other than conversion.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">We offer a 7-day money-back guarantee if you're not satisfied with our service. Contact our support team to request a refund.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe payment gateway.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}