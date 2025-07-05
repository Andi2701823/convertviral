'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('global_error');
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl text-red-500 mb-6">🚨</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {t('description')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={reset}
                className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
              >
                {t('buttons.try_again')}
              </button>
              <a 
                href="/"
                className="inline-flex items-center justify-center bg-white text-primary-600 border border-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300"
              >
                {t('buttons.go_home')}
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12"
            >
              <p className="text-gray-500">
                {t('help_text.prefix')}{' '}
                <a href="mailto:support@convertviral.com" className="text-primary-600 hover:underline">
                  {t('help_text.email')}
                </a>
              </p>
              {process.env.NODE_ENV === 'development' && error?.message && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-w-lg mx-auto">
                  <p className="text-sm font-mono text-red-600">{error.message}</p>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Stack trace</summary>
                      <pre className="mt-2 text-xs text-gray-700 overflow-auto">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  );
}