'use client';

import { ArrowRightIcon } from '@/components/Icons';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-surface-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for All Your Conversion Needs
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Discover why ConvertViral offers the most comprehensive, secure, and user-friendly file conversion experience on the web.
            </p>
            <div>
              <Link
                href="/convert"
                className="inline-flex items-center bg-white text-surface-900 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
              >
                Try It Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">Core Features</h2>
            <p className="text-xl text-surface-500 max-w-3xl mx-auto">Everything you need for seamless file conversions in one powerful platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-6">
              <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 mb-4 text-2xl">🔄</div>
              <h3 className="text-xl font-semibold text-surface-800 mb-2">Batch Processing</h3>
              <p className="text-surface-500">Convert multiple files at once to save time. Perfect for processing large collections.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-6">
              <div className="inline-block p-3 rounded-full bg-accent-100 text-accent-600 mb-4 text-2xl">🔒</div>
              <h3 className="text-xl font-semibold text-surface-800 mb-2">Privacy-First</h3>
              <p className="text-surface-500">All files are encrypted and deleted after conversion. No tracking, no data mining—ever.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-6">
              <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 mb-4 text-2xl">⚡</div>
              <h3 className="text-xl font-semibold text-surface-800 mb-2">Lightning Fast</h3>
              <p className="text-surface-500">Our cloud infrastructure delivers conversions in seconds, even for large files.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-6">
              <div className="inline-block p-3 rounded-full bg-accent-100 text-accent-600 mb-4 text-2xl">📱</div>
              <h3 className="text-xl font-semibold text-surface-800 mb-2">Mobile Friendly</h3>
              <p className="text-surface-500">Enjoy a seamless experience on any device—desktop, tablet, or smartphone.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-6">
              <div className="inline-block p-3 rounded-full bg-primary-100 text-primary-600 mb-4 text-2xl">🎯</div>
              <h3 className="text-xl font-semibold text-surface-800 mb-2">100+ Formats</h3>
              <p className="text-surface-500">Convert images, documents, audio, video, and more. New formats added regularly.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-6">
              <div className="inline-block p-3 rounded-full bg-accent-100 text-accent-600 mb-4 text-2xl">🏆</div>
              <h3 className="text-xl font-semibold text-surface-800 mb-2">Gamification</h3>
              <p className="text-surface-500">Earn points and badges as you convert. Compete on leaderboards and unlock rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Converting?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">Join millions of satisfied users who trust ConvertViral for fast, secure, and free file conversions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/convert"
              className="inline-flex items-center justify-center bg-white text-surface-900 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
            >
              Start Converting
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-surface-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-surface-600 transition-colors duration-300 border border-surface-600"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}