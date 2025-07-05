'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('loading');
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary-600 animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-white"></div>
          </div>
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-2xl font-semibold text-gray-800"
        >
          {t('title')}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-2 text-gray-600"
        >
          {t('description')}
        </motion.p>
      </motion.div>
    </div>
  );
}