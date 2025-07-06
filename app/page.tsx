'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CheckIcon, DocumentIcon, ImageIcon, MusicIcon, VideoIcon, BookIcon, ArchiveIcon } from '@/components/Icons';

export default function HomePage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Convert Anything, Share Everything!
              </h1>
              <p className="text-xl mb-8 text-white text-opacity-90">
                Join 50,000+ users who converted 2M+ files securely
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/convert" 
                  className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                  Upload Files
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/features" 
                  className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-6 py-3 rounded-lg border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                >
                  Why Choose Us
                </Link>
              </div>
              <div className="mt-8 flex items-center text-sm text-white text-opacity-90">
                <CheckIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>Lightning Fast</span>
                <span className="mx-3">•</span>
                <CheckIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>100% Secure</span>
                <span className="mx-3">•</span>
                <CheckIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>Free to Use</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20 shadow-xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl">
                      📄
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">document.pdf</h3>
                      <p className="text-sm text-gray-500">2.4 MB • PDF Document</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-gray-500">Convert to:</div>
                    <div className="relative">
                      <select 
                        className="appearance-none bg-gray-100 rounded-lg py-2 pl-4 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        defaultValue="docx"
                      >
                        <option value="docx">Word (DOCX)</option>
                        <option value="txt">Text (TXT)</option>
                        <option value="pptx">PowerPoint (PPTX)</option>
                        <option value="xlsx">Excel (XLSX)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center">
                    Convert Now
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                  <div className="mt-4 text-center text-xs text-gray-500">
                    Your files are secure and automatically deleted after 24 hours
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-yellow-300 rounded-full flex items-center justify-center text-primary-800 font-bold text-lg transform rotate-12 shadow-lg">
                FREE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ConvertViral? Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ConvertViral?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our platform offers the fastest, most secure way to convert your files with no compromises.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">Our optimized conversion engine processes your files in seconds, not minutes.</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">Convert files up to 500MB</p>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">Batch processing available</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Secure</h3>
              <p className="text-gray-600">Your files are encrypted during conversion and automatically deleted after 24 hours.</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">End-to-end encryption</p>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">GDPR compliant</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Earn Rewards</h3>
              <p className="text-gray-600">Earn points with every conversion and unlock premium features as you go.</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">Earn badges and achievements</p>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">Unlock premium features</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/features" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors duration-300">
              Explore All Features
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Conversions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Conversions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Quickly convert between the most popular file formats with just a few clicks.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
              <div className="h-16 w-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">HEIC to JPG</h3>
              <p className="text-sm text-gray-500 mt-2">Convert iPhone photos to universal format</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
              <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <DocumentIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Word to PDF</h3>
              <p className="text-sm text-gray-500 mt-2">Professional document sharing</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
              <div className="h-16 w-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MusicIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">MP4 to MP3</h3>
              <p className="text-sm text-gray-500 mt-2">Extract audio from videos</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
              <div className="h-16 w-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <VideoIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">MOV to MP4</h3>
              <p className="text-sm text-gray-500 mt-2">Make iPhone videos compatible</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
              <div className="h-16 w-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">JPG to WebP</h3>
              <p className="text-sm text-gray-500 mt-2">Optimize images for web</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center">
              <div className="h-16 w-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <DocumentIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Excel to PDF</h3>
              <p className="text-sm text-gray-500 mt-2">Share spreadsheets professionally</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Convert Any File Type</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our platform supports over 100 different file formats for all your conversion needs.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-300 mb-4">
                  <DocumentIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">PDF</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">Convert to/from DOCX, PPT, XLS</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 group-hover:bg-white group-hover:text-green-600 transition-colors duration-300 mb-4">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">Images</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">JPG, PNG, SVG, WebP</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 group-hover:bg-white group-hover:text-purple-600 transition-colors duration-300 mb-4">
                  <MusicIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">Audio</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">MP3, WAV, FLAC, AAC</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 group-hover:bg-white group-hover:text-red-600 transition-colors duration-300 mb-4">
                  <VideoIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">Video</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">MP4, AVI, MOV, WebM</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 group-hover:bg-white group-hover:text-yellow-600 transition-colors duration-300 mb-4">
                  <BookIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">eBooks</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">EPUB, MOBI, AZW, PDF</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              <div className="relative z-10 p-6 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors duration-300 mb-4">
                  <ArchiveIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">Archives</h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">ZIP, RAR, TAR, 7Z</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/convert" 
              className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
            >
              View All Supported Formats
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white opacity-5 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Files?</h2>
              <p className="text-xl mb-8 text-white text-opacity-90">
                Join over 50,000 satisfied users who trust ConvertViral for their file conversion needs.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                    <CheckIcon className="h-4 w-4 text-primary-800" />
                  </div>
                  <p className="ml-3 text-white text-opacity-90">No software installation required</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                    <CheckIcon className="h-4 w-4 text-primary-800" />
                  </div>
                  <p className="ml-3 text-white text-opacity-90">Convert multiple files at once</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                    <CheckIcon className="h-4 w-4 text-primary-800" />
                  </div>
                  <p className="ml-3 text-white text-opacity-90">Earn points and unlock premium features</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/convert" 
                  className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                  Start Converting Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/signup" 
                  className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-6 py-3 rounded-lg border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-lg transform rotate-12 z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-300 rounded-full z-0"></div>
              
              <div className="relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="mx-auto text-sm font-medium text-gray-500">ConvertViral</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-lg">
                        🎬
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-semibold text-gray-900">video.mp4</h3>
                        <p className="text-xs text-gray-500">18.4 MB • MP4 Video</p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Converting...
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                    <span>Converting to MP3</span>
                    <span>70%</span>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">Estimated time remaining: 12 seconds</div>
                      <button className="text-xs text-primary-600 font-medium hover:text-primary-700">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white border-opacity-10 text-center text-white text-opacity-80">
            <p>Already converted over 1.5 million files for users worldwide</p>
          </div>
        </div>
      </section>
    </main>
  );
}