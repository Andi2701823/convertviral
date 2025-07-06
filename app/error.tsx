'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl text-red-500 mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We're sorry, but an error occurred while processing your request. Please try again or return to the home page.
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
            Try Again
          </button>
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-white text-primary-600 border border-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300"
          >
            Go to Home Page
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact our support team
            </Link>
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
  );
}