'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../navigation';
import { ArrowRightIcon, CheckIcon } from '@/components/Icons';



export default function AboutPage() {
  const t = useTranslations('about');
  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl mb-8 text-white text-opacity-90 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('story_title')}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('story_paragraph1')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {t('story_paragraph2')}
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
                      <div className="text-2xl font-bold text-primary-600">{t('idea_to_reality')}</div>
                      <p className="text-gray-600 mt-2">{t('launched_in_2023')}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('mission_title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('mission_paragraph1')}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('mission_paragraph2')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('speed_title')}</h3>
              <p className="text-gray-600">{t('speed_desc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('privacy_title')}</h3>
              <p className="text-gray-600">{t('privacy_desc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t('fun_title')}</h3>
              <p className="text-gray-600">{t('fun_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('team_title')}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('team_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">{t('team_member1_name')}</h3>
                <p className="text-gray-500 text-center mb-3">{t('team_member1_role')}</p>
                <p className="text-gray-600 text-center text-sm">{t('team_member1_description')}</p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">{t('team_member2_name')}</h3>
                <p className="text-gray-500 text-center mb-3">{t('team_member2_role')}</p>
                <p className="text-gray-600 text-center text-sm">{t('team_member2_description')}</p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">{t('team_member3_name')}</h3>
                <p className="text-gray-500 text-center mb-3">{t('team_member3_role')}</p>
                <p className="text-gray-600 text-center text-sm">{t('team_member3_description')}</p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-1">{t('team_member4_name')}</h3>
                <p className="text-gray-500 text-center mb-3">{t('team_member4_role')}</p>
                <p className="text-gray-600 text-center text-sm">{t('team_member4_description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">{t('stats_conversions_count')}</div>
              <p className="text-gray-600">{t('stats_conversions_text')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">{t('stats_users_count')}</div>
              <p className="text-gray-600">{t('stats_users_text')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">{t('stats_formats_count')}</div>
              <p className="text-gray-600">{t('stats_formats_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta_section_title')}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t('cta_section_description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/convert" 
              className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
            >
              {t('cta_button_text')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-6 py-3 rounded-lg border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
            >
              {t('cta_button2')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}