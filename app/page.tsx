'use client';

import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import { ArrowRightIcon, CheckIcon, DocumentIcon, ImageIcon, MusicIcon, VideoIcon } from '@/components/Icons';

const formatCategories = [
  {
    name: 'Documents',
    icon: <DocumentIcon className="h-6 w-6" />,
    formats: 'PDF, DOCX, XLSX',
  },
  {
    name: 'Images',
    icon: <ImageIcon className="h-6 w-6" />,
    formats: 'JPG, PNG, WebP',
  },
  {
    name: 'Audio',
    icon: <MusicIcon className="h-6 w-6" />,
    formats: 'MP3, WAV, FLAC',
  },
  {
    name: 'Video',
    icon: <VideoIcon className="h-6 w-6" />,
    formats: 'MP4, MOV, AVI',
  },
];

const popularConversions = [
  { from: 'PDF', to: 'DOCX', desc: 'Word documents' },
  { from: 'JPG', to: 'PNG', desc: 'Images' },
  { from: 'MP4', to: 'MP3', desc: 'Audio extraction' },
  { from: 'HEIC', to: 'JPG', desc: 'iPhone photos' },
  { from: 'DOCX', to: 'PDF', desc: 'Professional sharing' },
  { from: 'MOV', to: 'MP4', desc: 'Video compatibility' },
];

export default function HomePage() {
  return (
    <main className="flex-grow">
      {/* Hero Section - Clean component */}
      <HeroSection />

      {/* Why Choose Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Why ConvertViral?</h2>
            <p className="section-subtitle">Simple, fast, and secure file conversion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Lightning Fast</h3>
              <p className="text-surface-500 text-sm">Convert files in seconds, not minutes. Our optimized engine handles it all.</p>
            </div>

            <div className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center text-accent-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Secure & Private</h3>
              <p className="text-surface-500 text-sm">Files encrypted in transit, automatically deleted after 24 hours.</p>
            </div>

            <div className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-surface-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Free to Use</h3>
              <p className="text-surface-500 text-sm">No registration required. Start converting immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Conversions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Popular Conversions</h2>
            <p className="section-subtitle">Most used conversion types.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularConversions.map((conv, i) => (
              <Link
                key={i}
                href={`/convert/${conv.from.toLowerCase()}-to-${conv.to.toLowerCase()}`}
                className="card-hover p-4 text-center"
              >
                <div className="text-xs text-surface-500 mb-1">{conv.desc}</div>
                <div className="font-semibold text-surface-800">{conv.from} → {conv.to}</div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/convert" className="btn-primary inline-flex items-center">
              All Conversions
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* File Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">All File Types</h2>
            <p className="section-subtitle">100+ formats supported.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {formatCategories.map((cat, i) => (
              <div key={i} className="card-hover p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 mx-auto mb-4">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-surface-800 mb-1">{cat.name}</h3>
                <p className="text-sm text-surface-500">{cat.formats}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to convert?</h2>
          <p className="text-surface-400 mb-8">Start converting your files in seconds. No signup required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/convert" className="btn-accent inline-flex items-center justify-center">
              Start Converting
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/features" className="btn-secondary inline-flex items-center justify-center">
              Learn More
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-surface-400">
            <div className="flex items-center">
              <CheckIcon className="h-4 w-4 mr-2 text-accent-400" />
              No signup
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-4 w-4 mr-2 text-accent-400" />
              No limits
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-4 w-4 mr-2 text-accent-400" />
              Secure
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
