'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface CookiePolicyProps {}

const CookiePolicy: React.FC<CookiePolicyProps> = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const openCookiePreferences = () => {
    if (typeof window !== 'undefined' && (window as any).openCookiePreferences) {
      (window as any).openCookiePreferences();
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const cookieData = {
    essential: [
      { name: 'session_token', purpose: 'User authentication and session management', duration: 'Session', type: 'HTTP Cookie', domain: 'convertviral.com' },
      { name: 'csrf_token', purpose: 'Cross-site request forgery protection', duration: 'Session', type: 'HTTP Cookie', domain: 'convertviral.com' },
      { name: 'gdpr-consent-record', purpose: 'Store user consent preferences', duration: '1 year', type: 'Local Storage', domain: 'convertviral.com' }
    ],
    functional: [
      { name: 'user_preferences', purpose: 'Store UI preferences and settings', duration: '1 year', type: 'Local Storage', domain: 'convertviral.com' },
      { name: 'theme_preference', purpose: 'Remember dark/light mode preference', duration: '1 year', type: 'Local Storage', domain: 'convertviral.com' },
      { name: 'language_preference', purpose: 'Store selected language', duration: '1 year', type: 'HTTP Cookie', domain: 'convertviral.com' }
    ],
    analytics: [
      { name: '_ga', purpose: 'Google Analytics - distinguish users', duration: '2 years', type: 'HTTP Cookie', domain: '.convertviral.com' },
      { name: '_ga_*', purpose: 'Google Analytics - session identification', duration: '2 years', type: 'HTTP Cookie', domain: '.convertviral.com' },
      { name: '_gid', purpose: 'Google Analytics - distinguish users', duration: '24 hours', type: 'HTTP Cookie', domain: '.convertviral.com' },
      { name: 'conversion_analytics', purpose: 'Track conversion success rates', duration: '30 days', type: 'Local Storage', domain: 'convertviral.com' }
    ],
    marketing: [
      { name: '_fbp', purpose: 'Facebook Pixel - track conversions', duration: '3 months', type: 'HTTP Cookie', domain: '.convertviral.com' },
      { name: 'marketing_campaign', purpose: 'Track marketing campaign effectiveness', duration: '30 days', type: 'HTTP Cookie', domain: 'convertviral.com' },
      { name: 'referral_source', purpose: 'Track referral sources for attribution', duration: '7 days', type: 'Local Storage', domain: 'convertviral.com' }
    ]
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-surface-900 mb-8">
            Cookie Policy
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-sm text-surface-500 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            {/* Quick Actions */}
            <div className="bg-surface-100 border border-surface-200 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-surface-800 mb-3">
                🍪 Manage Your Cookie Preferences
              </h3>
              <p className="text-surface-500 mb-4 text-sm">
                You can change your cookie preferences at any time by clicking the button below.
              </p>
              <button
                onClick={openCookiePreferences}
                className="bg-surface-800 text-white px-4 py-2 rounded-lg hover:bg-surface-700 transition-colors text-sm"
              >
                Open Cookie Preferences
              </button>
            </div>

            <div className="max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">1. What Are Cookies?</h2>
                <p className="mb-4 text-surface-600">
                  Cookies are small text files that are stored on your device when you visit our website.
                  They help us provide you with a better experience by remembering your preferences,
                  analyzing how you use our service, and enabling certain functionality.
                </p>
                <p className="mb-4 text-surface-600">
                  We also use similar technologies such as:
                </p>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Local Storage:</strong> Browser storage for larger amounts of data</li>
                  <li><strong>Session Storage:</strong> Temporary storage that expires when you close your browser</li>
                  <li><strong>Web Beacons:</strong> Small transparent images used for analytics</li>
                  <li><strong>Pixels:</strong> Tracking codes for marketing and analytics</li>
                </ul>
              </section>

              {/* How We Use Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">2. How We Use Cookies</h2>
                <p className="mb-4 text-surface-600">
                  We use cookies for the following purposes:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-accent-600">✅ Essential Functions</h4>
                    <p className="text-sm text-surface-500">Authentication, security, and basic website functionality</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-primary-600">🔧 Enhanced Experience</h4>
                    <p className="text-sm text-surface-500">Remember your preferences and improve usability</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-primary-600">📊 Analytics</h4>
                    <p className="text-sm text-surface-500">Understand how you use our service to make improvements</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-600">📢 Marketing</h4>
                    <p className="text-sm text-surface-500">Show relevant advertisements and measure campaign effectiveness</p>
                  </div>
                </div>
              </section>

              {/* Cookie Categories */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">3. Types of Cookies We Use</h2>

                {/* Essential Cookies */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('essential')}
                    className="w-full flex items-center justify-between p-4 bg-surface-100 border border-surface-200 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✅</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-surface-800">
                          Essential Cookies (Always Active)
                        </h3>
                        <p className="text-sm text-surface-500">
                          Required for basic website functionality - cannot be disabled
                        </p>
                      </div>
                    </div>
                    <span className="text-surface-600">
                      {expandedSection === 'essential' ? '−' : '+'}
                    </span>
                  </button>

                  {expandedSection === 'essential' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-x-auto"
                    >
                      <table className="w-full border-collapse border border-surface-200 text-sm">
                        <thead>
                          <tr className="bg-surface-100">
                            <th className="border border-surface-200 p-2 text-left">Cookie Name</th>
                            <th className="border border-surface-200 p-2 text-left">Purpose</th>
                            <th className="border border-surface-200 p-2 text-left">Duration</th>
                            <th className="border border-surface-200 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.essential.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-surface-200 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.purpose}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.duration}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </div>

                {/* Functional Cookies */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('functional')}
                    className="w-full flex items-center justify-between p-4 bg-surface-100 border border-surface-200 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔧</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-surface-800">
                          Functional Cookies
                        </h3>
                        <p className="text-sm text-surface-500">
                          Enhance your experience by remembering preferences
                        </p>
                      </div>
                    </div>
                    <span className="text-surface-600">
                      {expandedSection === 'functional' ? '−' : '+'}
                    </span>
                  </button>

                  {expandedSection === 'functional' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-x-auto"
                    >
                      <table className="w-full border-collapse border border-surface-200 text-sm">
                        <thead>
                          <tr className="bg-surface-100">
                            <th className="border border-surface-200 p-2 text-left">Cookie Name</th>
                            <th className="border border-surface-200 p-2 text-left">Purpose</th>
                            <th className="border border-surface-200 p-2 text-left">Duration</th>
                            <th className="border border-surface-200 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.functional.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-surface-200 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.purpose}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.duration}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </div>

                {/* Analytics Cookies */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('analytics')}
                    className="w-full flex items-center justify-between p-4 bg-surface-100 border border-surface-200 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📊</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-surface-800">
                          Analytics Cookies
                        </h3>
                        <p className="text-sm text-surface-500">
                          Help us understand how you use our service
                        </p>
                      </div>
                    </div>
                    <span className="text-surface-600">
                      {expandedSection === 'analytics' ? '−' : '+'}
                    </span>
                  </button>

                  {expandedSection === 'analytics' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-x-auto"
                    >
                      <table className="w-full border-collapse border border-surface-200 text-sm">
                        <thead>
                          <tr className="bg-surface-100">
                            <th className="border border-surface-200 p-2 text-left">Cookie Name</th>
                            <th className="border border-surface-200 p-2 text-left">Purpose</th>
                            <th className="border border-surface-200 p-2 text-left">Duration</th>
                            <th className="border border-surface-200 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.analytics.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-surface-200 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.purpose}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.duration}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </div>

                {/* Marketing Cookies */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('marketing')}
                    className="w-full flex items-center justify-between p-4 bg-surface-100 border border-surface-200 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-surface-800">
                          Marketing Cookies
                        </h3>
                        <p className="text-sm text-surface-500">
                          Used for advertising and marketing campaigns
                        </p>
                      </div>
                    </div>
                    <span className="text-surface-600">
                      {expandedSection === 'marketing' ? '−' : '+'}
                    </span>
                  </button>

                  {expandedSection === 'marketing' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 overflow-x-auto"
                    >
                      <table className="w-full border-collapse border border-surface-200 text-sm">
                        <thead>
                          <tr className="bg-surface-100">
                            <th className="border border-surface-200 p-2 text-left">Cookie Name</th>
                            <th className="border border-surface-200 p-2 text-left">Purpose</th>
                            <th className="border border-surface-200 p-2 text-left">Duration</th>
                            <th className="border border-surface-200 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.marketing.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-surface-200 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.purpose}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.duration}</td>
                              <td className="border border-surface-200 p-2 text-surface-600">{cookie.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* Third-Party Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">4. Third-Party Cookies</h2>
                <p className="mb-4 text-surface-600">
                  Some cookies are set by third-party services that appear on our pages:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-surface-200">
                    <thead>
                      <tr className="bg-surface-100">
                        <th className="border border-surface-200 p-3 text-left">Service</th>
                        <th className="border border-surface-200 p-3 text-left">Purpose</th>
                        <th className="border border-surface-200 p-3 text-left">Privacy Policy</th>
                        <th className="border border-surface-200 p-3 text-left">Opt-Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Google Analytics</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Website analytics and performance monitoring</td>
                        <td className="border border-surface-200 p-3">
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                            Google Privacy Policy
                          </a>
                        </td>
                        <td className="border border-surface-200 p-3">
                          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                            GA Opt-out
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Stripe</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Payment processing and fraud prevention</td>
                        <td className="border border-surface-200 p-3">
                          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                            Stripe Privacy Policy
                          </a>
                        </td>
                        <td className="border border-surface-200 p-3 text-surface-600">Required for payments</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Sentry</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Error tracking and performance monitoring</td>
                        <td className="border border-surface-200 p-3">
                          <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                            Sentry Privacy Policy
                          </a>
                        </td>
                        <td className="border border-surface-200 p-3 text-surface-600">Via cookie preferences</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Managing Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">5. Managing Your Cookie Preferences</h2>

                <h3 className="text-xl font-medium mb-3 text-surface-700">5.1 Our Cookie Preference Center</h3>
                <p className="mb-4 text-surface-600">
                  You can manage your cookie preferences at any time using our preference center:
                </p>
                <button
                  onClick={openCookiePreferences}
                  className="bg-surface-800 text-white px-6 py-3 rounded-lg hover:bg-surface-700 transition-colors mb-6"
                >
                  🍪 Open Cookie Preferences
                </button>

                <h3 className="text-xl font-medium mb-3 text-surface-700">5.2 Browser Settings</h3>
                <p className="mb-4 text-surface-600">
                  You can also control cookies through your browser settings:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">🌐 Chrome</h4>
                    <p className="text-sm text-surface-500">Settings → Privacy and security → Cookies and other site data</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">🦊 Firefox</h4>
                    <p className="text-sm text-surface-500">Settings → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">🧭 Safari</h4>
                    <p className="text-sm text-surface-500">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">📱 Mobile</h4>
                    <p className="text-sm text-surface-500">Browser settings → Privacy → Cookies</p>
                  </div>
                </div>

                <div className="bg-surface-100 border border-surface-200 rounded-lg p-4">
                  <h4 className="font-semibold text-surface-700 mb-2">
                    ⚠️ Important Note
                  </h4>
                  <p className="text-surface-500 text-sm">
                    Disabling certain cookies may affect the functionality of our website.
                    Essential cookies cannot be disabled as they are necessary for basic operation.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">6. Contact Us</h2>
                <p className="mb-4 text-surface-600">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-surface-50 rounded-lg p-6">
                  <p className="mb-2 text-surface-700"><strong>Email:</strong> privacy@convertviral.com</p>
                  <p className="mb-2 text-surface-700"><strong>Data Protection Officer:</strong> dpo@convertviral.com</p>
                  <p className="text-surface-700"><strong>General Support:</strong> support@convertviral.com</p>
                </div>
              </section>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link
              href="/privacy-policy"
              className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2 text-surface-800">🔒 Privacy Policy</h3>
              <p className="text-sm text-surface-500">
                Read our comprehensive privacy policy
              </p>
            </Link>

            <button
              onClick={openCookiePreferences}
              className="block w-full text-left bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2 text-surface-800">⚙️ Cookie Preferences</h3>
              <p className="text-sm text-surface-500">
                Customize your cookie and tracking settings
              </p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;