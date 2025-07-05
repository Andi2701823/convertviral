'use client';

import { useEffect, useState } from 'react';
import { Link } from '../../navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

// Define interfaces for conversion objects
interface ConversionHistoryItem {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  fileSize: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

interface PendingConversion {
  id: string;
  fileId: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  fileSize: number;
  targetFormat: string;
  createdAt: string;
  fileData?: any;
}

export default function OfflinePage() {
  const t = useTranslations('offline');
  // State for offline data
  const [offlineConversions, setOfflineConversions] = useState<ConversionHistoryItem[]>([]);
  const [pendingConversions, setPendingConversions] = useState<PendingConversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for cached conversions in IndexedDB when component mounts
  useEffect(() => {
    async function loadOfflineData() {
      try {
        // Import dynamically to avoid issues during SSR
        const { getAllItems, getPendingConversions } = await import('../../lib/offlineStorage');
        
        // Get conversion history and pending conversions
        const history = await getAllItems<ConversionHistoryItem>('conversionHistory');
        const pending = await getPendingConversions();
        
        setOfflineConversions(history || []);
        setPendingConversions(pending as PendingConversion[] || []);
      } catch (error) {
        console.error('Failed to load offline data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadOfflineData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{t('title')}</h1>
          
          
          <p className="text-gray-600 text-center mb-6">
            {t('description')}
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium text-gray-800 mb-2">{t('capabilities.title')}</h2>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>{t('capabilities.view_history')}</li>
              <li>{t('capabilities.queue_conversions')}</li>
              <li>{t('capabilities.check_achievements')}</li>
            </ul>
          </div>
          
          {isLoading ? (
            <div className="mt-4 p-4 text-center text-gray-500">
              <p>{t('loading')}</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {offlineConversions.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-3">{t('cached_conversions')}</h3>
                  <div className="space-y-2">
                    {offlineConversions.map((conversion, index) => (
                      <motion.div 
                        key={conversion.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{conversion.fileName || 'Unnamed file'}</p>
                          <p className="text-sm text-gray-500">{conversion.fromFormat} → {conversion.toFormat}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Cached</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {pendingConversions.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-3">{t('pending_conversions')}</h3>
                  <div className="space-y-2">
                    {pendingConversions.map((conversion, index) => (
                      <motion.div 
                        key={conversion.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{conversion.fileName || 'Unnamed file'}</p>
                          <p className="text-sm text-gray-500">{conversion.fromFormat} → {conversion.toFormat}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {offlineConversions.length === 0 && pendingConversions.length === 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">{t('no_conversions')}</p>
                </div>
              )}
            </div>
          )}
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Link href="/" className="btn-primary text-center flex-1">
                {t('buttons.try_again')}
              </Link>
              <Link href="/dashboard" className="btn-secondary text-center flex-1">
                {t('buttons.go_to_dashboard')}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t('footer.brand')}</span>
            <span className="text-sm text-gray-500">{t('footer.mode')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}