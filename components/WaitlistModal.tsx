'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, GiftIcon, ShareIcon, CheckIcon } from '@heroicons/react/24/outline';

interface WaitlistModalProps {
  children: React.ReactNode;
  planType: string;
  planPrice: string;
  originalPrice?: string;
  discount?: string;
  launchDate?: string;
}

export default function WaitlistModal({ 
  children, 
  planType, 
  planPrice, 
  originalPrice, 
  discount, 
  launchDate 
}: WaitlistModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'signup' | 'success' | 'share'>('signup');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    referralCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Fetch current waitlist count
      fetchWaitlistCount();
    }
  }, [isOpen]);

  const fetchWaitlistCount = async () => {
    try {
      const response = await fetch(`/api/waitlist/count?planType=${planType}`);
      const data = await response.json();
      setWaitlistCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch waitlist count:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          planType,
          source: 'pricing_page'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setDiscountCode(data.discountCode);
      setStep('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const shareText = `I just joined the waitlist for ${planType} plan at ConvertViral! 🚀 Getting 50% off when it launches. Join me!`;
    const shareUrl = `${window.location.origin}/pricing?ref=${formData.email}`;
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
    
    // Track social share
    try {
      await fetch('/api/waitlist/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          platform
        }),
      });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const copyDiscountCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('signup');
      setFormData({ email: '', name: '', referralCode: '' });
      setError(null);
      setDiscountCode(null);
    }, 300);
  };

  if (!isOpen) {
    return (
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
    );
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
      
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'signup' ? `Join ${planType} Waitlist` : 
               step === 'success' ? 'Welcome to the Waitlist!' : 
               'Share & Get Rewards'}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'signup' && (
              <div className="space-y-6">
                {/* Benefits */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-3">
                    <GiftIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Early Bird Benefits</span>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2" />
                      {discount} - Save {originalPrice ? `$${(parseFloat(originalPrice.replace('$', '')) - parseFloat(planPrice.replace('$', ''))).toFixed(2)}` : '$5'}/month
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2" />
                      First access when we launch
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Exclusive launch updates
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Bonus features for early supporters
                    </li>
                  </ul>
                </div>

                {/* Social Proof */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-primary-600">{waitlistCount.toLocaleString()}</span> people are already waiting for {planType}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="referralCode"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter referral code"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Joining...' : `Join Waitlist & Get ${discount}`}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center">
                  We'll only email you about the launch and important updates. No spam, ever.
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    You're on the list!
                  </h3>
                  <p className="text-gray-600">
                    We'll notify you as soon as {planType} launches with your exclusive discount.
                  </p>
                </div>

                {discountCode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-2">Your Early Bird Discount Code:</p>
                    <div className="flex items-center justify-between bg-white border border-yellow-300 rounded px-3 py-2">
                      <code className="font-mono text-lg font-bold text-yellow-900">{discountCode}</code>
                      <button
                        onClick={copyDiscountCode}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => setStep('share')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share & Get Bonus Rewards
                  </button>
                  
                  <button
                    onClick={closeModal}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {step === 'share' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Share & Get Bonus Rewards
                  </h3>
                  <p className="text-gray-600">
                    Share with friends and get additional perks when we launch!
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors text-sm"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-sm"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors text-sm"
                  >
                    LinkedIn
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Sharing Rewards:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 1 share = Extra 1 month free trial</li>
                    <li>• 3 shares = Priority customer support</li>
                    <li>• 5 shares = Exclusive beta features access</li>
                  </ul>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}