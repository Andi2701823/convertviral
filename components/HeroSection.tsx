'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, DocumentIcon, ImageIcon, MusicIcon } from './Icons';

type ConversionType = {
  id: string;
  name: string;
  from: string;
  to: string;
  icon: React.ReactNode;
};

const popularConversions: ConversionType[] = [
  {
    id: 'pdf-to-docx',
    name: 'PDF to Word',
    from: 'PDF',
    to: 'DOCX',
    icon: <DocumentIcon className="h-5 w-5" />,
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    from: 'JPG',
    to: 'PDF',
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3',
    from: 'MP4',
    to: 'MP3',
    icon: <MusicIcon className="h-5 w-5" />,
  },
];

const testimonials = [
  { name: 'Sarah J.', text: '5 files converted in seconds.' },
  { name: 'Mike T.', text: 'Best converter I\'ve used!' },
  { name: 'Elena R.', text: 'Saved me hours of work.' },
  { name: 'David K.', text: 'Amazing quality.' },
  { name: 'Priya M.', text: 'Very easy to use.' },
  { name: 'Carlos B.', text: '50MB video in seconds!' },
];

const HeroSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section className="relative bg-surface-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Convert Anything
          </motion.h1>

          <motion.p
            className="text-xl text-surface-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Fast, secure file conversion. No registration required.
          </motion.p>
        </div>

        {/* Main drag & drop area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div
            className={`drop-zone ${isDragging ? 'drop-zone-active' : ''} bg-white shadow-soft-lg rounded-2xl p-12`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileSelector}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileInputChange}
              multiple
            />

            <div className="flex flex-col items-center justify-center">
              <motion.div
                className="h-16 w-16 mb-4 text-primary-500"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </motion.div>

              <h3 className="text-xl font-semibold mb-2 text-surface-800">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                  : 'Drop your files here'}
              </h3>

              <p className="text-surface-500 mb-4">
                {selectedFiles.length > 0
                  ? 'Click to convert'
                  : 'or click to browse'}
              </p>

              {selectedFiles.length > 0 && (
                <button className="btn-primary flex items-center">
                  Convert Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Popular conversion buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <p className="text-center text-sm text-surface-500 mb-4">Popular conversions</p>

          <div className="flex flex-wrap justify-center gap-3">
            {popularConversions.map((conversion) => (
              <motion.div
                key={conversion.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/convert/${conversion.id}`}
                  className="flex items-center bg-white rounded-lg px-4 py-3 shadow-soft hover:shadow-soft-lg transition-shadow duration-200"
                >
                  <div className="bg-primary-100 text-primary-600 p-2 rounded-lg mr-3">
                    {conversion.icon}
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium text-surface-800">{conversion.name}</span>
                    <span className="block text-xs text-surface-500">{conversion.from} → {conversion.to}</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/convert"
                className="flex items-center bg-white rounded-lg px-4 py-3 shadow-soft hover:shadow-soft-lg transition-shadow duration-200"
              >
                <div className="bg-surface-100 text-surface-600 p-2 rounded-lg mr-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-sm font-medium text-surface-800">All Formats</span>
                  <span className="block text-xs text-surface-500">100+ supported</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-8 text-center">
            <div>
              <p className="text-2xl font-bold text-surface-900">2.3M+</p>
              <p className="text-sm text-surface-500">Users</p>
            </div>
            <div className="w-px h-8 bg-surface-200"></div>
            <div>
              <p className="text-2xl font-bold text-surface-900">847M+</p>
              <p className="text-sm text-surface-500">Files Converted</p>
            </div>
            <div className="w-px h-8 bg-surface-200"></div>
            <div>
              <p className="text-2xl font-bold text-surface-900">4.8/5</p>
              <p className="text-sm text-surface-500">Rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
