'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '../../navigation';
import { useState } from 'react';

interface CookiePolicyProps {}

const CookiePolicy: React.FC<CookiePolicyProps> = () => {
  const t = useTranslations('cookies');
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
      {
        name: 'session_token',
        purpose: 'User authentication and session management',
        duration: 'Session',
        type: 'HTTP Cookie',
        domain: 'convertviral.com'
      },
      {
        name: 'csrf_token',
        purpose: 'Cross-site request forgery protection',
        duration: 'Session',
        type: 'HTTP Cookie',
        domain: 'convertviral.com'
      },
      {
        name: 'gdpr-consent-record',
        purpose: 'Store user consent preferences',
        duration: '1 year',
        type: 'Local Storage',
        domain: 'convertviral.com'
      }
    ],
    functional: [
      {
        name: 'user_preferences',
        purpose: 'Store UI preferences and settings',
        duration: '1 year',
        type: 'Local Storage',
        domain: 'convertviral.com'
      },
      {
        name: 'theme_preference',
        purpose: 'Remember dark/light mode preference',
        duration: '1 year',
        type: 'Local Storage',
        domain: 'convertviral.com'
      },
      {
        name: 'language_preference',
        purpose: 'Store selected language',
        duration: '1 year',
        type: 'HTTP Cookie',
        domain: 'convertviral.com'
      }
    ],
    analytics: [
      {
        name: '_ga',
        purpose: 'Google Analytics - distinguish users',
        duration: '2 years',
        type: 'HTTP Cookie',
        domain: '.convertviral.com'
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics - session identification',
        duration: '2 years',
        type: 'HTTP Cookie',
        domain: '.convertviral.com'
      },
      {
        name: '_gid',
        purpose: 'Google Analytics - distinguish users',
        duration: '24 hours',
        type: 'HTTP Cookie',
        domain: '.convertviral.com'
      },
      {
        name: 'conversion_analytics',
        purpose: 'Track conversion success rates',
        duration: '30 days',
        type: 'Local Storage',
        domain: 'convertviral.com'
      }
    ],
    marketing: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel - track conversions',
        duration: '3 months',
        type: 'HTTP Cookie',
        domain: '.convertviral.com'
      },
      {
        name: 'marketing_campaign',
        purpose: 'Track marketing campaign effectiveness',
        duration: '30 days',
        type: 'HTTP Cookie',
        domain: 'convertviral.com'
      },
      {
        name: 'referral_source',
        purpose: 'Track referral sources for attribution',
        duration: '7 days',
        type: 'Local Storage',
        domain: 'convertviral.com'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Cookie Policy
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            {/* Quick Actions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                🍪 Manage Your Cookie Preferences
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4 text-sm">
                You can change your cookie preferences at any time by clicking the button below.
              </p>
              <button
                onClick={openCookiePreferences}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Open Cookie Preferences
              </button>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
                <p className="mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences, 
                  analyzing how you use our service, and enabling certain functionality.
                </p>
                <p className="mb-4">
                  We also use similar technologies such as:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Local Storage:</strong> Browser storage for larger amounts of data</li>
                  <li><strong>Session Storage:</strong> Temporary storage that expires when you close your browser</li>
                  <li><strong>Web Beacons:</strong> Small transparent images used for analytics</li>
                  <li><strong>Pixels:</strong> Tracking codes for marketing and analytics</li>
                </ul>
              </section>

              {/* How We Use Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
                <p className="mb-4">
                  We use cookies for the following purposes:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-green-600">✅ Essential Functions</h4>
                    <p className="text-sm">Authentication, security, and basic website functionality</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-600">🔧 Enhanced Experience</h4>
                    <p className="text-sm">Remember your preferences and improve usability</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-purple-600">📊 Analytics</h4>
                    <p className="text-sm">Understand how you use our service to make improvements</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-orange-600">📢 Marketing</h4>
                    <p className="text-sm">Show relevant advertisements and measure campaign effectiveness</p>
                  </div>
                </div>
              </section>

              {/* Cookie Categories */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
                
                {/* Essential Cookies */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('essential')}
                    className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✅</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                          Essential Cookies (Always Active)
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          Required for basic website functionality - cannot be disabled
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600">
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
                      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Cookie Name</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Purpose</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Duration</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.essential.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 dark:border-gray-600 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.purpose}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.duration}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.type}</td>
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
                    className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔧</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                          Functional Cookies
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          Enhance your experience by remembering preferences
                        </p>
                      </div>
                    </div>
                    <span className="text-blue-600">
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
                      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Cookie Name</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Purpose</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Duration</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.functional.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 dark:border-gray-600 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.purpose}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.duration}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.type}</td>
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
                    className="w-full flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📊</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                          Analytics Cookies
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-300">
                          Help us understand how you use our service
                        </p>
                      </div>
                    </div>
                    <span className="text-purple-600">
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
                      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Cookie Name</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Purpose</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Duration</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.analytics.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 dark:border-gray-600 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.purpose}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.duration}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.type}</td>
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
                    className="w-full flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📢</span>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                          Marketing Cookies
                        </h3>
                        <p className="text-sm text-orange-600 dark:text-orange-300">
                          Used for advertising and marketing campaigns
                        </p>
                      </div>
                    </div>
                    <span className="text-orange-600">
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
                      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Cookie Name</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Purpose</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Duration</th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cookieData.marketing.map((cookie, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 dark:border-gray-600 p-2 font-mono text-xs">{cookie.name}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.purpose}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.duration}</td>
                              <td className="border border-gray-300 dark:border-gray-600 p-2">{cookie.type}</td>
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
                <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
                <p className="mb-4">
                  Some cookies are set by third-party services that appear on our pages:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Service</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Purpose</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Privacy Policy</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Opt-Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Google Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Website analytics and performance monitoring</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Google Privacy Policy
                          </a>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            GA Opt-out
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Stripe</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Payment processing and fraud prevention</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Stripe Privacy Policy
                          </a>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Required for payments</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Sentry</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Error tracking and performance monitoring</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">
                          <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Sentry Privacy Policy
                          </a>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Via cookie preferences</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Managing Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Managing Your Cookie Preferences</h2>
                
                <h3 className="text-xl font-medium mb-3">5.1 Our Cookie Preference Center</h3>
                <p className="mb-4">
                  You can manage your cookie preferences at any time using our preference center:
                </p>
                <button
                  onClick={openCookiePreferences}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6"
                >
                  🍪 Open Cookie Preferences
                </button>

                <h3 className="text-xl font-medium mb-3">5.2 Browser Settings</h3>
                <p className="mb-4">
                  You can also control cookies through your browser settings:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🌐 Chrome</h4>
                    <p className="text-sm">Settings → Privacy and security → Cookies and other site data</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🦊 Firefox</h4>
                    <p className="text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🧭 Safari</h4>
                    <p className="text-sm">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📱 Mobile</h4>
                    <p className="text-sm">Browser settings → Privacy → Cookies</p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    ⚠️ Important Note
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    Disabling certain cookies may affect the functionality of our website. 
                    Essential cookies cannot be disabled as they are necessary for basic operation.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <p className="mb-2"><strong>Email:</strong> privacy@convertviral.com</p>
                  <p className="mb-2"><strong>Data Protection Officer:</strong> dpo@convertviral.com</p>
                  <p><strong>General Support:</strong> support@convertviral.com</p>
                </div>
              </section>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link 
              href="/privacy-policy"
              className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">🔒 Privacy Policy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Read our comprehensive privacy policy
              </p>
            </Link>
            
            <button
              onClick={openCookiePreferences}
              className="block w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">⚙️ Cookie Preferences</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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