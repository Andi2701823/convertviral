'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, DocumentIcon, ImageIcon, MusicIcon } from './Icons';

type ConversionType = {
  id: string;
  name: string;
  from: string;
  to: string;
  icon: React.ReactNode;
  color: string;
};

const popularConversions: ConversionType[] = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    from: 'PDF',
    to: 'DOCX',
    icon: <DocumentIcon className="h-5 w-5" />,
    color: 'bg-blue-500',
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    from: 'JPG',
    to: 'PDF',
    icon: <ImageIcon className="h-5 w-5" />,
    color: 'bg-green-500',
  },
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3',
    from: 'MP4',
    to: 'MP3',
    icon: <MusicIcon className="h-5 w-5" />,
    color: 'bg-purple-500',
  },
];

const testimonials = [
  { name: 'Sarah J.', text: 'Converted 5 files just now. So fast!' },
  { name: 'Mike T.', text: 'Best converter I\'ve ever used!' },
  { name: 'Elena R.', text: 'Saved me hours of work. Thank you!' },
  { name: 'David K.', text: 'The quality is amazing. Highly recommend!' },
  { name: 'Priya M.', text: 'Super easy to use and very reliable.' },
  { name: 'Carlos B.', text: 'Just converted a 50MB video in seconds!' },
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
      // In a real app, you would handle file upload/conversion here
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      // In a real app, you would handle file upload/conversion here
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 dark:from-primary-900 dark:via-primary-800 dark:to-secondary-800 py-20 lg:py-24">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white opacity-5 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Convert Anything, <span className="text-yellow-300">Share Everything!</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white text-opacity-90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join <span className="font-bold text-yellow-300">2.3M+</span> users who converted <span className="font-bold text-yellow-300">847M+</span> files
          </motion.p>
        </div>

        {/* Main drag & drop area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div 
            className={`drop-zone ${isDragging ? 'drop-zone-active' : ''} bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg rounded-xl shadow-xl border-2 border-dashed ${isDragging ? 'border-primary-400' : 'border-gray-300 dark:border-gray-600'} p-10 text-center cursor-pointer transition-all duration-300`}
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
                className="h-20 w-20 mb-4 text-primary-500 dark:text-primary-400"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut" 
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected` 
                  : 'Drag & Drop your files here'}
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedFiles.length > 0 
                  ? 'Click convert to start processing' 
                  : 'or click to browse your files'}
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
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-white text-opacity-90">Popular Conversions</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {popularConversions.map((conversion) => (
              <motion.div 
                key={conversion.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Link 
                  href={`/convert/${conversion.id}`}
                  className="flex items-center bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className={`${conversion.color} text-white p-2 rounded-md mr-3`}>
                    {conversion.icon}
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{conversion.name}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{conversion.from} → {conversion.to}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/convert"
                className="flex items-center bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="bg-gray-500 text-white p-2 rounded-md mr-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">More Formats</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">100+ supported</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Social proof ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-5xl mx-auto overflow-hidden"
        >
          <div className="relative py-4 bg-white dark:bg-gray-800 bg-opacity-10 dark:bg-opacity-10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center space-x-4 animate-marquee">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg px-4 py-2 shadow-md"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;