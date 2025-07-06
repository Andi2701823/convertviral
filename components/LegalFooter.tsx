'use client';

import Link from 'next/link';

export default function LegalFooter() {
  const currentYear = new Date().getFullYear();
  
  // Since i18n is removed, we'll default to English
  const isGerman = false;
  
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            © {currentYear} ConvertViral. All rights reserved.
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
                  About Us
                </Link>
                <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </>
            )}
            <Link href="/cookies" className="hover:text-primary-600 transition-colors">
              {isGerman ? 'Cookie-Richtlinie' : 'Cookie Policy'}
            </Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}