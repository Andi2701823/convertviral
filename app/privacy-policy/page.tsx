'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PrivacyPolicyProps {}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {

  const openCookiePreferences = () => {
    if (typeof window !== 'undefined' && (window as any).openCookiePreferences) {
      (window as any).openCookiePreferences();
    }
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
            Privacy Policy
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-sm text-surface-500 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">1. Introduction</h2>
                <p className="mb-4 text-surface-600">
                  ConvertViral ("we," "our," or "us") is committed to protecting your privacy and ensuring
                  compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
                  This Privacy Policy explains how we collect, use, process, and protect your personal data when
                  you use our file conversion services.
                </p>
                <p className="mb-4 text-surface-600">
                  <strong>Data Controller:</strong> ConvertViral<br />
                  <strong>Contact:</strong> privacy@convertviral.com<br />
                  <strong>DPO Contact:</strong> dpo@convertviral.com
                </p>
              </section>

              {/* Data We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">2. Data We Collect</h2>

                <h3 className="text-xl font-medium mb-3 text-surface-700">2.1 Personal Data</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Account Information:</strong> Email address, username, password (hashed)</li>
                  <li><strong>Profile Data:</strong> Display name, profile picture, preferences</li>
                  <li><strong>Billing Information:</strong> Name, billing address, payment method details (processed by Stripe)</li>
                  <li><strong>Communication Data:</strong> Support tickets, feedback, correspondence</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-surface-700">2.2 Technical Data</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, conversion history, session duration</li>
                  <li><strong>Performance Data:</strong> Core Web Vitals, page load times, error logs</li>
                  <li><strong>Security Data:</strong> Login attempts, security events, fraud prevention data</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-surface-700">2.3 File Data</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Uploaded Files:</strong> Original files you upload for conversion</li>
                  <li><strong>Converted Files:</strong> Files generated through our conversion process</li>
                  <li><strong>File Metadata:</strong> File names, sizes, formats, conversion parameters</li>
                  <li><strong>Processing Logs:</strong> Conversion status, error logs, processing time</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">3. Legal Basis for Processing</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-surface-200">
                    <thead>
                      <tr className="bg-surface-100">
                        <th className="border border-surface-200 p-3 text-left">Data Type</th>
                        <th className="border border-surface-200 p-3 text-left">Legal Basis</th>
                        <th className="border border-surface-200 p-3 text-left">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Account Data</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Contract Performance</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Service delivery, authentication</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">File Processing</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Contract Performance</td>
                        <td className="border border-surface-200 p-3 text-surface-600">File conversion services</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Analytics Data</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Consent</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Service improvement, optimization</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Marketing Data</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Consent</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Marketing communications</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Security Data</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Legitimate Interest</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Fraud prevention, security</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Data Processing */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">4. How We Process Your Data</h2>

                <h3 className="text-xl font-medium mb-3 text-surface-700">4.1 File Conversion Process</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li>Files are uploaded to secure servers with end-to-end encryption</li>
                  <li>Virus scanning is performed on all uploaded files</li>
                  <li>Files are processed using isolated conversion engines</li>
                  <li>Converted files are temporarily stored for download</li>
                  <li>All files are automatically deleted after 24 hours</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-surface-700">4.2 Data Security Measures</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256 for data at rest</li>
                  <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring, intrusion detection</li>
                  <li><strong>Backups:</strong> Encrypted backups with geographic distribution</li>
                  <li><strong>Incident Response:</strong> Documented procedures for data breaches</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-surface-700">4.3 Data Retention</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Account Data:</strong> Retained while account is active + 30 days after deletion</li>
                  <li><strong>File Data:</strong> Automatically deleted after 24 hours</li>
                  <li><strong>Usage Analytics:</strong> Aggregated data retained for 2 years</li>
                  <li><strong>Security Logs:</strong> Retained for 1 year for security purposes</li>
                  <li><strong>Billing Records:</strong> Retained for 7 years for tax compliance</li>
                </ul>
              </section>

              {/* International Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">5. International Data Transfers</h2>
                <div className="bg-surface-100 border border-surface-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-surface-700 mb-2">
                    ⚠️ Important: Data Transfer to USA
                  </h4>
                  <p className="text-surface-500">
                    Some of our services involve transferring your data to the United States.
                    This requires your explicit consent as the US does not have an adequacy decision from the EU.
                  </p>
                </div>

                <h3 className="text-xl font-medium mb-3 text-surface-700">5.1 Transfer Mechanisms</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved data transfer agreements</li>
                  <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection</li>
                  <li><strong>Explicit Consent:</strong> For transfers to USA-based service providers</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-surface-700">5.2 Third-Party Processors</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-surface-200">
                    <thead>
                      <tr className="bg-surface-100">
                        <th className="border border-surface-200 p-3 text-left">Service</th>
                        <th className="border border-surface-200 p-3 text-left">Provider</th>
                        <th className="border border-surface-200 p-3 text-left">Location</th>
                        <th className="border border-surface-200 p-3 text-left">Safeguards</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Cloud Hosting</td>
                        <td className="border border-surface-200 p-3 text-surface-600">AWS/Vercel</td>
                        <td className="border border-surface-200 p-3 text-surface-600">USA/EU</td>
                        <td className="border border-surface-200 p-3 text-surface-600">SCCs, Consent</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Payment Processing</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Stripe</td>
                        <td className="border border-surface-200 p-3 text-surface-600">USA/EU</td>
                        <td className="border border-surface-200 p-3 text-surface-600">SCCs, PCI DSS</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Analytics</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Google Analytics</td>
                        <td className="border border-surface-200 p-3 text-surface-600">USA</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Consent, Data Minimization</td>
                      </tr>
                      <tr>
                        <td className="border border-surface-200 p-3 text-surface-700">Error Tracking</td>
                        <td className="border border-surface-200 p-3 text-surface-600">Sentry</td>
                        <td className="border border-surface-200 p-3 text-surface-600">USA</td>
                        <td className="border border-surface-200 p-3 text-surface-600">SCCs, Data Scrubbing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">6. Your Rights Under GDPR</h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">🔍 Right of Access</h4>
                    <p className="text-sm text-surface-500">Request a copy of your personal data we hold</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">✏️ Right to Rectification</h4>
                    <p className="text-sm text-surface-500">Correct inaccurate or incomplete data</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">🗑️ Right to Erasure</h4>
                    <p className="text-sm text-surface-500">Request deletion of your personal data</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">⏸️ Right to Restrict Processing</h4>
                    <p className="text-sm text-surface-500">Limit how we process your data</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">📦 Right to Data Portability</h4>
                    <p className="text-sm text-surface-500">Receive your data in a portable format</p>
                  </div>
                  <div className="border border-surface-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-surface-700">🚫 Right to Object</h4>
                    <p className="text-sm text-surface-500">Object to processing based on legitimate interests</p>
                  </div>
                </div>

                <div className="bg-surface-100 border border-surface-200 rounded-lg p-4">
                  <h4 className="font-semibold text-surface-700 mb-2">
                    📧 Exercise Your Rights
                  </h4>
                  <p className="text-surface-500 mb-3">
                    To exercise any of these rights, contact us at: <strong>privacy@convertviral.com</strong>
                  </p>
                  <p className="text-surface-500 text-sm">
                    We will respond within 30 days and may request identity verification for security purposes.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">7. Cookies and Tracking</h2>
                <p className="mb-4 text-surface-600">
                  We use cookies and similar technologies to enhance your experience. You can manage your
                  cookie preferences at any time.
                </p>

                <button
                  onClick={openCookiePreferences}
                  className="bg-surface-800 text-white px-6 py-2 rounded-lg hover:bg-surface-700 transition-colors mb-4"
                >
                  🍪 Manage Cookie Preferences
                </button>

                <h3 className="text-xl font-medium mb-3 text-surface-700">7.1 Cookie Categories</h3>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li><strong>Essential Cookies:</strong> Required for basic functionality (cannot be disabled)</li>
                  <li><strong>Functional Cookies:</strong> Enhance user experience and remember preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising and marketing</li>
                </ul>
              </section>

              {/* Data Breaches */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">8. Data Breach Notification</h2>
                <p className="mb-4 text-surface-600">
                  In the unlikely event of a data breach that poses a high risk to your rights and freedoms,
                  we will:
                </p>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li>Notify the relevant supervisory authority within 72 hours</li>
                  <li>Inform affected individuals without undue delay</li>
                  <li>Provide clear information about the breach and our response</li>
                  <li>Offer guidance on protective measures you can take</li>
                </ul>
              </section>

              {/* Children's Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">9. Children&apos;s Privacy</h2>
                <p className="mb-4 text-surface-600">
                  Our service is not intended for children under 16 years of age. We do not knowingly
                  collect personal data from children under 16. If you believe we have collected data
                  from a child under 16, please contact us immediately.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">10. Contact Information</h2>
                <div className="bg-surface-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 text-surface-700">Data Protection Officer</h3>
                  <p className="mb-2 text-surface-600"><strong>Email:</strong> dpo@convertviral.com</p>
                  <p className="mb-2 text-surface-600"><strong>Privacy Inquiries:</strong> privacy@convertviral.com</p>
                  <p className="mb-4 text-surface-600"><strong>General Contact:</strong> support@convertviral.com</p>

                  <h4 className="font-medium mb-2 text-surface-700">Supervisory Authority</h4>
                  <p className="text-sm text-surface-500">
                    If you have concerns about our data processing, you can lodge a complaint with your
                    local data protection authority or the lead supervisory authority in your jurisdiction.
                  </p>
                </div>
              </section>

              {/* Updates */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-surface-800 mb-4">11. Policy Updates</h2>
                <p className="mb-4 text-surface-600">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  material changes by:
                </p>
                <ul className="list-disc pl-6 mb-4 text-surface-600">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications for significant changes</li>
                  <li>Requesting renewed consent where required by law</li>
                </ul>
                <p className="text-sm text-surface-500">
                  Continued use of our service after policy updates constitutes acceptance of the new terms.
                </p>
              </section>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link
              href="/cookie-policy"
              className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2 text-surface-700">🍪 Cookie Policy</h3>
              <p className="text-sm text-surface-500">
                Detailed information about our cookie usage
              </p>
            </Link>

            <button
              onClick={openCookiePreferences}
              className="block w-full text-left bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2 text-surface-700">⚙️ Cookie Preferences</h3>
              <p className="text-sm text-surface-500">
                Manage your cookie and tracking preferences
              </p>
            </button>

            <Link
              href="/contact"
              className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-2 text-surface-700">📧 Contact DPO</h3>
              <p className="text-sm text-surface-500">
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