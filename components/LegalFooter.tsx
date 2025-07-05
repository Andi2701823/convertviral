'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../navigation';
import { useLocale } from 'next-intl';

export default function LegalFooter() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  
  // Determine which legal links to show based on locale
  const isGerman = locale === 'de';
  
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            © {currentYear} ConvertViral. {t('copyright')}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {isGerman ? (
              // German legal links
              <>
                <Link href="/impressum" className="hover:text-primary-600 transition-colors">
                  Impressum
                </Link>
                <Link href="/datenschutz" className="hover:text-primary-600 transition-colors">
                  Datenschutz
                </Link>
                <Link href="/agb" className="hover:text-primary-600 transition-colors">
                  AGB
                </Link>
              </>
            ) : (
              // International legal links
              <>
                <Link href="/about" className="hover:text-primary-600 transition-colors">
                  {t('about_us')}
                </Link>
                <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                  {t('privacy_policy')}
                </Link>
                <Link href="/terms" className="hover:text-primary-600 transition-colors">
                  {t('terms_of_service')}
                </Link>
              </>
            )}
            <Link href="/cookies" className="hover:text-primary-600 transition-colors">
              {isGerman ? 'Cookie-Richtlinie' : 'Cookie Policy'}
            </Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">
              {t('contact_us')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}