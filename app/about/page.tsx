'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex-grow">
      {/* Hero */}
      <section className="bg-surface-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">About ConvertViral</h1>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            Your trusted partner for fast, secure file conversions.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-6">Our Story</h2>
            <p className="text-surface-500 mb-4">
              ConvertViral was born from a simple frustration: converting files online was either too complicated, too expensive, or too risky. We believed there had to be a better way.
            </p>
            <p className="text-surface-500">
              Today, we serve millions of users worldwide with our growing suite of conversion tools. Our mission: make file conversion accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Fast</h3>
              <p className="text-surface-500 text-sm">Files converted in seconds, not minutes.</p>
            </div>
            <div className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center text-accent-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Secure</h3>
              <p className="text-surface-500 text-sm">Files encrypted, auto-deleted after 24h.</p>
            </div>
            <div className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-surface-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-800 mb-2">Simple</h3>
              <p className="text-surface-500 text-sm">No signup, no hassle. Just convert.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <p className="text-3xl font-bold text-primary-600">2M+</p>
              <p className="text-surface-500 text-sm">Users</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-primary-600">50M+</p>
              <p className="text-surface-500 text-sm">Files Converted</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-primary-600">100+</p>
              <p className="text-surface-500 text-sm">Formats</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-primary-600">99.9%</p>
              <p className="text-surface-500 text-sm">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-surface-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to convert?</h2>
          <p className="text-surface-400 mb-6">Start converting in seconds. No signup required.</p>
          <Link href="/convert" className="btn-accent inline-flex items-center">
            Start Converting
            <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
