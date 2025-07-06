'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="w-16 h-1 bg-primary-600 mx-auto my-6"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
          >
            Go to Home Page
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            href="/convert"
            className="inline-flex items-center justify-center bg-white text-primary-600 border border-primary-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300"
          >
            Convert Files
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
              Contact us
            </Link>
            {' '}or{' '}
            <Link href="/faq" className="text-primary-600 hover:underline">
              check our FAQ
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}