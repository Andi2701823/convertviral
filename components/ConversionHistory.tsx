'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversion, ConversionStatus } from '@prisma/client';

type ConversionHistoryProps = {
  userId?: string;
};

const ConversionHistory = ({ userId }: ConversionHistoryProps) => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchConversions = async () => {
      try {
        setIsLoading(true);
        // Mock data for demonstration
        const mockConversions: Conversion[] = [
          {
            id: 'conv_1',
            userId: userId || null,
            sourceFormat: 'pdf',
            targetFormat: 'docx',
            sourceSize: 1024 * 1024 * 2, // 2MB
            resultSize: 1024 * 1024 * 1.8, // 1.8MB
            status: ConversionStatus.COMPLETED,
            sourceUrl: 'https://example.com/source.pdf',
            resultUrl: 'https://example.com/result.docx',
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
            isPublic: false,
            shareCount: 0,
            pointsEarned: 10,
            batchId: null,
          },
          {
            id: 'conv_2',
            userId: userId || null,
            sourceFormat: 'jpg',
            targetFormat: 'png',
            sourceSize: 1024 * 1024 * 1, // 1MB
            resultSize: 1024 * 1024 * 1.2, // 1.2MB
            status: ConversionStatus.COMPLETED,
            sourceUrl: 'https://example.com/source.jpg',
            resultUrl: 'https://example.com/result.png',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30), // 2 hours ago + 30 seconds
            isPublic: true,
            shareCount: 3,
            pointsEarned: 5,
            batchId: null,
          },
          {
            id: 'conv_3',
            userId: userId || null,
            sourceFormat: 'mp4',
            targetFormat: 'mp3',
            sourceSize: 1024 * 1024 * 10, // 10MB
            resultSize: 1024 * 1024 * 1, // 1MB
            status: ConversionStatus.COMPLETED,
            sourceUrl: 'https://example.com/source.mp4',
            resultUrl: 'https://example.com/result.mp3',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60), // 1 day ago + 1 minute
            isPublic: false,
            shareCount: 0,
            pointsEarned: 15,
            batchId: null,
          },
        ];

        setConversions(mockConversions);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load conversion history');
        setIsLoading(false);
      }
    };

    fetchConversions();
  }, [userId]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversion history found.
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Recent Conversions</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversion
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {conversions.map((conversion) => (
                <motion.tr
                  key={conversion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {conversion.sourceFormat === 'pdf' && '📄'}
                        {conversion.sourceFormat === 'docx' && '📝'}
                        {conversion.sourceFormat === 'jpg' && '🖼️'}
                        {conversion.sourceFormat === 'png' && '🖼️'}
                        {conversion.sourceFormat === 'mp4' && '🎬'}
                        {conversion.sourceFormat === 'mp3' && '🎵'}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {conversion.sourceFormat.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {conversion.sourceFormat.toUpperCase()} → {conversion.targetFormat.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatFileSize(conversion.sourceSize)}
                      {conversion.resultSize && (
                        <span> → {formatFileSize(conversion.resultSize)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(conversion.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      conversion.status === ConversionStatus.COMPLETED
                        ? 'bg-green-100 text-green-800'
                        : conversion.status === ConversionStatus.PROCESSING
                        ? 'bg-blue-100 text-blue-800'
                        : conversion.status === ConversionStatus.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {conversion.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {conversion.status === ConversionStatus.COMPLETED && (
                      <div className="flex space-x-2">
                        <a
                          href={conversion.resultUrl || '#'}
                          className="text-primary-600 hover:text-primary-900"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                        <button className="text-secondary-600 hover:text-secondary-900">
                          Share
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConversionHistory;