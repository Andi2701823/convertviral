'use client';

import { Link } from '../navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRightIcon, CheckIcon, DocumentIcon, ImageIcon, MusicIcon, VideoIcon, BookIcon, ArchiveIcon } from '@/components/Icons';

export default function HomePage() {
  const t = useTranslations('homepage');

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('hero_title')}
              </h1>
              <p className="text-xl mb-8 text-white text-opacity-90">
                {t('hero_subtitle', { userCount: '50,000+', fileCount: '2M+' })}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/convert" 
                  className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
                >
                  {t('upload_button')}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/features" 
                  className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-6 py-3 rounded-lg border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                >
                  {t('why_choose_us')}
                </Link>
              </div>
              <div className="mt-8 flex items-center text-sm text-white text-opacity-90">
                <CheckIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>{t('fast_conversion')}</span>
                <span className="mx-3">•</span>
                <CheckIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>{t('secure_processing')}</span>
                <span className="mx-3">•</span>
                <CheckIcon className="h-5 w-5 mr-2 text-green-300" />
                <span>{t('free_to_use')}</span>
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
                    {t('convert_now')}
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                  <div className="mt-4 text-center text-xs text-gray-500">
                    {t('secure_files_notice')}
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-yellow-300 rounded-full flex items-center justify-center text-primary-800 font-bold text-lg transform rotate-12 shadow-lg">
                {t('free_tag')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ConvertViral? Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('why_choose_us')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('why_choose_us_desc')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('fast_conversion')}</h3>
              <p className="text-gray-600">{t('fast_conversion_desc')}</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{t('convert_up_to_500mb')}</p>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{t('batch_processing')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('secure_processing')}</h3>
              <p className="text-gray-600">{t('secure_processing_desc')}</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{t('end_to_end_encryption')}</p>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{t('gdpr_compliant')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('earn_rewards')}</h3>
              <p className="text-gray-600">{t('earn_rewards_desc')}</p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{t('earn_badges')}</p>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-500">{t('unlock_premium')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/features" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors duration-300">
              {t('explore_all_features')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Conversions Section */}
      <section className="popular-conversions-container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('popular_conversions_title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('popular_conversions_desc')}</p>
          </div>
          <div className="popular-conversions-grid">
            <div className="popular-conversions-card">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">HEIC to JPG</h3>
                <p className="text-sm text-gray-500">iPhone Photos</p>
              </div>
            </div>
            <div className="popular-conversions-card">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Word to PDF</h3>
                <p className="text-sm text-gray-500">Business Docs</p>
              </div>
            </div>
            <div className="popular-conversions-card">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">MP4 to MP3</h3>
                <p className="text-sm text-gray-500">Video Audio</p>
              </div>
            </div>
            <div className="popular-conversions-card">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">MOV to MP4</h3>
                <p className="text-sm text-gray-500">iPhone Videos</p>
              </div>
            </div>
            <div className="popular-conversions-card">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">JPG to WebP</h3>
                <p className="text-sm text-gray-500">Web Optimization</p>
              </div>
            </div>
            <div className="popular-conversions-card">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Excel to PDF</h3>
                <p className="text-sm text-gray-500">Report Sharing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Convert Any File Type</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Support for over 100+ file formats with high-quality conversion results</p>
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
                Join over 50,000 satisfied users who trust ConvertViral for fast, secure, and high-quality file conversions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                    <CheckIcon className="h-4 w-4 text-primary-800" />
                  </div>
                  <p className="ml-3 text-white text-opacity-90">No software to install - works in your browser</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-400 flex items-center justify-center mt-1">
                    <CheckIcon className="h-4 w-4 text-primary-800" />
                  </div>
                  <p className="ml-3 text-white text-opacity-90">Convert up to 10 files simultaneously</p>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-white">ConvertViral</span>
                <span className="ml-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-md uppercase">Beta</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The fastest and most secure platform to convert your files between 100+ formats. Free, easy to use, and no registration required.
              </p>
              <div className="flex space-x-4 mb-8">
                <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Subscribe to our newsletter</h3>
                <p className="text-gray-400 text-sm mb-4">Get the latest updates and news about file conversion</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  />
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
              <ul className="space-y-4">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors duration-300">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors duration-300">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Converters</h3>
              <ul className="space-y-4">
                <li><Link href="/convert/pdf" className="text-gray-400 hover:text-white transition-colors duration-300">PDF Converter</Link></li>
                <li><Link href="/convert/image" className="text-gray-400 hover:text-white transition-colors duration-300">Image Converter</Link></li>
                <li><Link href="/convert/audio" className="text-gray-400 hover:text-white transition-colors duration-300">Audio Converter</Link></li>
                <li><Link href="/convert/video" className="text-gray-400 hover:text-white transition-colors duration-300">Video Converter</Link></li>
                <li><Link href="/convert/ebook" className="text-gray-400 hover:text-white transition-colors duration-300">eBook Converter</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ConvertViral. All rights reserved.</p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy</Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Cookies</Link>
                <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}