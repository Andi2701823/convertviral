'use client';

import { CheckIcon } from '@/components/Icons';
import Link from 'next/link';
import { useState } from 'react';
import { FEATURE_FLAGS } from '@/lib/featureFlags';

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-surface-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-surface-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-surface-500 max-w-3xl mx-auto">
            Start converting files today with our powerful platform.
          </p>
          {!FEATURE_FLAGS.premiumTiersVisible && (
            <div className="mt-4 inline-block bg-primary-100 text-primary-600 px-4 py-2 rounded-full font-medium">
              {FEATURE_FLAGS.betaMessage}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Plan - Centered in the grid */}
          <div className="md:col-start-1 md:col-end-2 lg:col-start-2 lg:col-end-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-surface-200 transition-transform duration-300 hover:scale-105 p-8">
              <h3 className="text-2xl font-bold text-surface-900 mb-4">Free</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-extrabold text-surface-900">$0</span>
                <span className="text-surface-500 ml-1">/month</span>
              </div>
              <p className="text-surface-500 mb-8">Everything you need for powerful file conversions.</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-surface-600">Unlimited conversions</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-surface-600">No file size limits</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-surface-600">Fast conversion speed</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-surface-600">All file formats</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-surface-600">No watermarks</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="block w-full bg-surface-900 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-surface-700 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Premium and Business plans are hidden with CSS when feature flag is off */}
          {FEATURE_FLAGS.premiumTiersVisible && (
            <>
              {/* Premium Plan */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-surface-200 relative transition-transform duration-300 hover:scale-105" style={{ display: 'none' }}>
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
                  Popular
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-surface-900 mb-4">Premium</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-extrabold text-surface-900">$4.99</span>
                    <span className="text-surface-500 ml-1">/month</span>
                  </div>
                  <p className="text-surface-500 mb-8">For regular users who need more conversions and larger files.</p>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Unlimited conversions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Files up to 100MB</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Priority conversion speed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">All file formats</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">No ads</span>
                    </li>
                  </ul>

                  {FEATURE_FLAGS.paymentsEnabled ? (
                    <a
                      href="https://buy.stripe.com/7sY4gBeAG8Qu425g2l6Ri00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-surface-900 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-surface-700 transition-colors duration-300"
                    >
                      Subscribe Now
                    </a>
                  ) : (
                    <button
                      disabled
                      className="block w-full bg-surface-200 text-surface-500 text-center font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>

              {/* Business Plan */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-surface-200 transition-transform duration-300 hover:scale-105" style={{ display: 'none' }}>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-surface-900 mb-4">Business</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-extrabold text-surface-900">$19.99</span>
                    <span className="text-surface-500 ml-1">/month</span>
                  </div>
                  <p className="text-surface-500 mb-8">For businesses with high-volume conversion needs.</p>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Unlimited conversions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Files up to 500MB</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Fastest conversion speed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">All file formats</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">API access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                      <span className="ml-3 text-surface-600">Priority support</span>
                    </li>
                  </ul>

                  {FEATURE_FLAGS.paymentsEnabled ? (
                    <a
                      href="https://buy.stripe.com/00w5kFbou9Uybux2bv6Ri01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-surface-800 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-surface-700 transition-colors duration-300"
                    >
                      Subscribe Now
                    </a>
                  ) : (
                    <button
                      disabled
                      className="block w-full bg-surface-200 text-surface-500 text-center font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Email signup for premium notification */}
        {!FEATURE_FLAGS.premiumTiersVisible && (
          <div className="mt-12 max-w-xl mx-auto bg-surface-100 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-surface-900 mb-3">More plans launching soon!</h3>
            <p className="text-surface-500 mb-4">Get notified when our premium plans become available.</p>

            {isSubmitted ? (
              <div className="bg-surface-100 text-accent-600 p-3 rounded-lg">
                <p>Thank you! We&apos;ll notify you when premium plans launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-grow px-4 py-2 rounded-lg border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="bg-surface-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-surface-700 transition-colors"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-16 bg-white rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-surface-900 mb-6">Frequently Asked Questions</h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-surface-800 mb-2">Can I cancel my subscription at any time?</h4>
              <p className="text-surface-500">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-surface-800 mb-2">How secure are my files?</h4>
              <p className="text-surface-500">All files are encrypted during the conversion process and automatically deleted after 24 hours. We never access your files for any purpose other than conversion.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-surface-800 mb-2">Do you offer refunds?</h4>
              <p className="text-surface-500">We offer a 7-day money-back guarantee if you&apos;re not satisfied with our service. Contact our support team to request a refund.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-surface-800 mb-2">What payment methods do you accept?</h4>
              <p className="text-surface-500">We accept all major credit cards, PayPal, and Apple Pay through our secure Stripe payment gateway.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}