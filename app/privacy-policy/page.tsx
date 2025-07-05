'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '../../navigation';

interface PrivacyPolicyProps {}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  const t = useTranslations('privacy');

  const openCookiePreferences = () => {
    if (typeof window !== 'undefined' && (window as any).openCookiePreferences) {
      (window as any).openCookiePreferences();
    }
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
            Privacy Policy
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose dark:prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  ConvertViral ("we," "our," or "us") is committed to protecting your privacy and ensuring 
                  compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws. 
                  This Privacy Policy explains how we collect, use, process, and protect your personal data when 
                  you use our file conversion services.
                </p>
                <p className="mb-4">
                  <strong>Data Controller:</strong> ConvertViral<br/>
                  <strong>Contact:</strong> privacy@convertviral.com<br/>
                  <strong>DPO Contact:</strong> dpo@convertviral.com
                </p>
              </section>

              {/* Data We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
                
                <h3 className="text-xl font-medium mb-3">2.1 Personal Data</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Account Information:</strong> Email address, username, password (hashed)</li>
                  <li><strong>Profile Data:</strong> Display name, profile picture, preferences</li>
                  <li><strong>Billing Information:</strong> Name, billing address, payment method details (processed by Stripe)</li>
                  <li><strong>Communication Data:</strong> Support tickets, feedback, correspondence</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">2.2 Technical Data</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, conversion history, session duration</li>
                  <li><strong>Performance Data:</strong> Core Web Vitals, page load times, error logs</li>
                  <li><strong>Security Data:</strong> Login attempts, security events, fraud prevention data</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">2.3 File Data</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Uploaded Files:</strong> Original files you upload for conversion</li>
                  <li><strong>Converted Files:</strong> Files generated through our conversion process</li>
                  <li><strong>File Metadata:</strong> File names, sizes, formats, conversion parameters</li>
                  <li><strong>Processing Logs:</strong> Conversion status, error logs, processing time</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Legal Basis for Processing</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Data Type</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Legal Basis</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Account Data</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Contract Performance</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Service delivery, authentication</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">File Processing</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Contract Performance</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">File conversion services</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Analytics Data</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Consent</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Service improvement, optimization</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Marketing Data</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Consent</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Marketing communications</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Security Data</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Legitimate Interest</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Fraud prevention, security</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Data Processing */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. How We Process Your Data</h2>
                
                <h3 className="text-xl font-medium mb-3">4.1 File Conversion Process</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Files are uploaded to secure servers with end-to-end encryption</li>
                  <li>Virus scanning is performed on all uploaded files</li>
                  <li>Files are processed using isolated conversion engines</li>
                  <li>Converted files are temporarily stored for download</li>
                  <li>All files are automatically deleted after 24 hours</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">4.2 Data Security Measures</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256 for data at rest</li>
                  <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring, intrusion detection</li>
                  <li><strong>Backups:</strong> Encrypted backups with geographic distribution</li>
                  <li><strong>Incident Response:</strong> Documented procedures for data breaches</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">4.3 Data Retention</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Account Data:</strong> Retained while account is active + 30 days after deletion</li>
                  <li><strong>File Data:</strong> Automatically deleted after 24 hours</li>
                  <li><strong>Usage Analytics:</strong> Aggregated data retained for 2 years</li>
                  <li><strong>Security Logs:</strong> Retained for 1 year for security purposes</li>
                  <li><strong>Billing Records:</strong> Retained for 7 years for tax compliance</li>
                </ul>
              </section>

              {/* International Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. International Data Transfers</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    ⚠️ Important: Data Transfer to USA
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Some of our services involve transferring your data to the United States. 
                    This requires your explicit consent as the US does not have an adequacy decision from the EU.
                  </p>
                </div>
                
                <h3 className="text-xl font-medium mb-3">5.1 Transfer Mechanisms</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved data transfer agreements</li>
                  <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection</li>
                  <li><strong>Explicit Consent:</strong> For transfers to USA-based service providers</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">5.2 Third-Party Processors</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Service</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Provider</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Location</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Safeguards</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Cloud Hosting</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">AWS/Vercel</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">USA/EU</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">SCCs, Consent</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Payment Processing</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Stripe</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">USA/EU</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">SCCs, PCI DSS</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Google Analytics</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">USA</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Consent, Data Minimization</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Error Tracking</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">Sentry</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">USA</td>
                        <td className="border border-gray-300 dark:border-gray-600 p-3">SCCs, Data Scrubbing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights Under GDPR</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🔍 Right of Access</h4>
                    <p className="text-sm">Request a copy of your personal data we hold</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">✏️ Right to Rectification</h4>
                    <p className="text-sm">Correct inaccurate or incomplete data</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🗑️ Right to Erasure</h4>
                    <p className="text-sm">Request deletion of your personal data</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">⏸️ Right to Restrict Processing</h4>
                    <p className="text-sm">Limit how we process your data</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📦 Right to Data Portability</h4>
                    <p className="text-sm">Receive your data in a portable format</p>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🚫 Right to Object</h4>
                    <p className="text-sm">Object to processing based on legitimate interests</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📧 Exercise Your Rights
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 mb-3">
                    To exercise any of these rights, contact us at: <strong>privacy@convertviral.com</strong>
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    We will respond within 30 days and may request identity verification for security purposes.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar technologies to enhance your experience. You can manage your 
                  cookie preferences at any time.
                </p>
                
                <button
                  onClick={openCookiePreferences}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  🍪 Manage Cookie Preferences
                </button>

                <h3 className="text-xl font-medium mb-3">7.1 Cookie Categories</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>Essential Cookies:</strong> Required for basic functionality (cannot be disabled)</li>
                  <li><strong>Functional Cookies:</strong> Enhance user experience and remember preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising and marketing</li>
                </ul>
              </section>

              {/* Data Breaches */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Data Breach Notification</h2>
                <p className="mb-4">
                  In the unlikely event of a data breach that poses a high risk to your rights and freedoms, 
                  we will:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Notify the relevant supervisory authority within 72 hours</li>
                  <li>Inform affected individuals without undue delay</li>
                  <li>Provide clear information about the breach and our response</li>
                  <li>Offer guidance on protective measures you can take</li>
                </ul>
              </section>

              {/* Children's Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="mb-4">
                  Our service is not intended for children under 16 years of age. We do not knowingly 
                  collect personal data from children under 16. If you believe we have collected data 
                  from a child under 16, please contact us immediately.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Data Protection Officer</h3>
                  <p className="mb-2"><strong>Email:</strong> dpo@convertviral.com</p>
                  <p className="mb-2"><strong>Privacy Inquiries:</strong> privacy@convertviral.com</p>
                  <p className="mb-4"><strong>General Contact:</strong> support@convertviral.com</p>
                  
                  <h4 className="font-medium mb-2">Supervisory Authority</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you have concerns about our data processing, you can lodge a complaint with your 
                    local data protection authority or the lead supervisory authority in your jurisdiction.
                  </p>
                </div>
              </section>

              {/* Updates */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Policy Updates</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Requesting renewed consent where required by law</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Continued use of our service after policy updates constitutes acceptance of the new terms.
                </p>
              </section>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link 
              href="/cookie-policy"
              className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">🍪 Cookie Policy</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed information about our cookie usage
              </p>
            </Link>
            
            <button
              onClick={openCookiePreferences}
              className="block w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">⚙️ Cookie Preferences</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your cookie and tracking preferences
              </p>
            </button>
            
            <Link 
              href="/contact"
              className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold mb-2">📧 Contact DPO</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get in touch with our Data Protection Officer
              </p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;