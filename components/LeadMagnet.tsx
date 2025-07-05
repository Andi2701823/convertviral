'use client';

import { useState } from 'react';
import { XMarkIcon, DocumentArrowDownIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

interface LeadMagnetProps {
  title?: string;
  subtitle?: string;
  magnetType?: 'ebook' | 'checklist' | 'template' | 'course' | 'toolkit';
  trigger?: 'exit-intent' | 'scroll' | 'time' | 'manual';
  delay?: number;
  showOnce?: boolean;
}

interface LeadMagnetContent {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  downloadUrl: string;
  previewImage: string;
  fileSize: string;
  format: string;
}

const leadMagnets: Record<string, LeadMagnetContent> = {
  ebook: {
    title: 'The Complete File Conversion Guide',
    subtitle: 'Master Every Format Like a Pro',
    description: 'A comprehensive 50-page guide covering all major file formats, conversion techniques, and professional tips.',
    benefits: [
      'Learn 100+ file format conversions',
      'Professional quality optimization tips',
      'Batch processing workflows',
      'Troubleshooting common issues',
      'Industry best practices'
    ],
    downloadUrl: '/downloads/conversion-guide.pdf',
    previewImage: '/api/placeholder/300/400',
    fileSize: '2.3 MB',
    format: 'PDF'
  },
  checklist: {
    title: 'File Conversion Checklist',
    subtitle: 'Never Miss a Step Again',
    description: 'A printable checklist to ensure perfect conversions every time, used by 10,000+ professionals.',
    benefits: [
      'Step-by-step conversion process',
      'Quality control checkpoints',
      'Common mistake prevention',
      'Time-saving shortcuts',
      'Printable format'
    ],
    downloadUrl: '/downloads/conversion-checklist.pdf',
    previewImage: '/api/placeholder/300/400',
    fileSize: '0.8 MB',
    format: 'PDF'
  },
  template: {
    title: 'Professional Conversion Templates',
    subtitle: 'Ready-to-Use Templates Pack',
    description: 'A collection of 25+ professional templates for documents, presentations, and media files.',
    benefits: [
      '25+ professional templates',
      'Multiple format options',
      'Customizable designs',
      'Commercial license included',
      'Regular updates'
    ],
    downloadUrl: '/downloads/conversion-templates.zip',
    previewImage: '/api/placeholder/300/400',
    fileSize: '15.7 MB',
    format: 'ZIP'
  },
  course: {
    title: 'Free Mini-Course: Conversion Mastery',
    subtitle: '5-Day Email Course',
    description: 'Learn advanced conversion techniques through our exclusive 5-day email course with video tutorials.',
    benefits: [
      '5 comprehensive video lessons',
      'Hands-on exercises',
      'Expert tips and tricks',
      'Community access',
      'Certificate of completion'
    ],
    downloadUrl: '/courses/conversion-mastery',
    previewImage: '/api/placeholder/300/400',
    fileSize: 'Online',
    format: 'Video'
  },
  toolkit: {
    title: 'Ultimate Conversion Toolkit',
    subtitle: 'Everything You Need in One Package',
    description: 'Complete toolkit with guides, templates, checklists, and bonus tools worth $197 - yours free!',
    benefits: [
      'Complete conversion guide',
      'Professional templates',
      'Quality checklists',
      'Bonus automation scripts',
      'Lifetime updates'
    ],
    downloadUrl: '/downloads/conversion-toolkit.zip',
    previewImage: '/api/placeholder/300/400',
    fileSize: '45.2 MB',
    format: 'ZIP'
  }
};

export default function LeadMagnet({
  title,
  subtitle,
  magnetType = 'ebook',
  trigger = 'manual',
  delay = 3000,
  showOnce = true
}: LeadMagnetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<'offer' | 'form' | 'success'>('offer');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    interests: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const magnet = leadMagnets[magnetType];
  const displayTitle = title || magnet.title;
  const displaySubtitle = subtitle || magnet.subtitle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          magnetType,
          source: 'lead_magnet'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setCurrentStep('success');
      
      // Track conversion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'lead_magnet_conversion', {
          event_category: 'engagement',
          event_label: magnetType,
          value: 1
        });
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // Track download
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'file_download', {
        event_category: 'engagement',
        event_label: magnetType,
        value: 1
      });
    }

    // Trigger download
    window.open(magnet.downloadUrl, '_blank');
  };

  const closeMagnet = () => {
    setIsVisible(false);
    if (showOnce) {
      localStorage.setItem('leadMagnetShown', 'true');
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 z-50"
      >
        <DocumentArrowDownIcon className="h-5 w-5 inline mr-2" />
        Free Guide
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          <button
            onClick={closeMagnet}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {currentStep === 'offer' && (
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left side - Image */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <img
                    src={magnet.previewImage}
                    alt={displayTitle}
                    className="w-64 h-80 object-cover rounded-lg shadow-2xl mx-auto mb-6"
                  />
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                      {magnet.format}
                    </span>
                    <span>{magnet.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      FREE DOWNLOAD
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">(4.9/5)</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{displayTitle}</h2>
                  <p className="text-xl text-blue-600 font-semibold mb-4">{displaySubtitle}</p>
                  <p className="text-gray-600 mb-6">{magnet.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What you'll get:</h3>
                  <ul className="space-y-2">
                    {magnet.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 mr-1 text-green-500" />
                      No spam, ever
                    </span>
                    <span>10,000+ downloads</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">FREE</div>
                    <div className="text-sm text-gray-500 line-through">Worth $47</div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('form')}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Get Free Access Now
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By clicking above, you agree to our terms and privacy policy.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'form' && (
            <div className="p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <EnvelopeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h2>
                <p className="text-gray-600">Enter your email to get instant access to your free {magnetType}.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Me The Free Guide'}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => setCurrentStep('offer')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Back to details
                </button>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="p-8 text-center max-w-md mx-auto">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">
                Check your email for the download link. It should arrive within the next few minutes.
              </p>

              <button
                onClick={handleDownload}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
              >
                <DocumentArrowDownIcon className="h-5 w-5 inline mr-2" />
                Download Now
              </button>

              <button
                onClick={closeMagnet}
                className="text-gray-600 hover:text-gray-700 text-sm"
              >
                Close
              </button>
            </div>
          )}
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