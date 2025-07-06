'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ConvertViral</h1>
            <p className="text-xl mb-8 text-white text-opacity-90 max-w-3xl mx-auto">
              Your trusted partner for fast, secure, and easy file conversions
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                ConvertViral was born from a simple frustration: converting files online was either too complicated, too expensive, or too risky for your data privacy. We believed there had to be a better way to provide this essential service to everyone.  
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Founded by a team of developers and digital content creators, we set out to build the most user-friendly, secure, and efficient file conversion platform on the web. Today, we're proud to serve millions of users worldwide with our growing suite of conversion tools.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full z-0"></div>
              <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="flex items-center justify-center h-full bg-primary-50 p-8">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <div className="text-2xl font-bold text-primary-600">From Idea to Reality</div>
                      <p className="text-gray-600 mt-2">Launched in 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe that file conversion should be accessible to everyone, regardless of technical expertise or budget constraints. Our mission is to break down digital barriers by providing the most intuitive file conversion experience on the web.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every feature we build is guided by our core values: speed, privacy, and user satisfaction. We're committed to continuous improvement and innovation to meet the evolving needs of our global user base.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">Our optimized conversion engines process your files in seconds, not minutes. We've built our infrastructure to handle high volumes with minimal wait times.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Privacy First</h3>
              <p className="text-gray-600">Your files are yours alone. We use end-to-end encryption, automatic file deletion after 24 hours, and never access your content for any purpose other than conversion.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Enjoyable Experience</h3>
              <p className="text-gray-600">We've gamified the conversion process with rewards, badges, and a user-friendly interface that makes file conversion surprisingly fun and engaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind ConvertViral who are dedicated to making file conversion accessible, secure, and enjoyable for everyone.  
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">Alex Johnson</h3>
                <p className="text-gray-500 text-center mb-3">Founder & CEO</p>
                <p className="text-gray-600 text-center text-sm">Former Google engineer with a passion for creating tools that simplify digital workflows.</p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">Sarah Chen</h3>
                <p className="text-gray-500 text-center mb-3">CTO & Lead Developer</p>
                <p className="text-gray-600 text-center text-sm">Full-stack developer with expertise in cloud architecture and security.</p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">Michael Rodriguez</h3>
                <p className="text-gray-500 text-center mb-3">Head of User Experience</p>
                <p className="text-gray-600 text-center text-sm">UX/UI specialist with a background in gamification and product design.</p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">Emma Wilson</h3>
                <p className="text-gray-500 text-center mb-3">Marketing Director</p>
                <p className="text-gray-600 text-center text-sm">Digital marketing expert focused on growth strategies and user acquisition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact By The Numbers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Since our launch, we've helped millions of users transform their files quickly and securely. Here's a snapshot of our journey so far.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">2M+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50M+</div>
              <div className="text-gray-600">Files Converted</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-gray-600">Supported Formats</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-gray-600">Service Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Files?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join millions of satisfied users who trust ConvertViral for fast, secure, and free file conversions. No software to install, no complicated settings—just upload and convert.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/convert" 
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-300"
            >
              Start Converting Now
            </Link>
            <Link 
              href="/signup" 
              className="bg-transparent hover:bg-primary-600 border-2 border-white px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-300"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}