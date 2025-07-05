'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  DocumentIcon, 
  ImageIcon, 
  VideoIcon, 
  MusicIcon, 
  ArchiveIcon, 
  BookIcon 
} from './Icons';

type ConversionCard = {
  id: string;
  title: string;
  description: string;
  fromFormat: string;
  toFormat: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  usageCount: number;
  category: 'document' | 'image' | 'video' | 'audio' | 'ebook' | 'archive';
};

const conversionCards: ConversionCard[] = [
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable Word files',
    fromFormat: 'PDF',
    toFormat: 'DOCX',
    icon: <DocumentIcon className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '30 sec',
    usageCount: 1254789,
    category: 'document',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    fromFormat: 'DOCX',
    toFormat: 'PDF',
    icon: <DocumentIcon className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '25 sec',
    usageCount: 987654,
    category: 'document',
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert JPG images to PDF documents',
    fromFormat: 'JPG',
    toFormat: 'PDF',
    icon: <ImageIcon className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '20 sec',
    usageCount: 876543,
    category: 'image',
  },
  {
    id: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format',
    fromFormat: 'PNG',
    toFormat: 'JPG',
    icon: <ImageIcon className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '10 sec',
    usageCount: 765432,
    category: 'image',
  },
  {
    id: 'mp4-to-mp3',
    title: 'MP4 to MP3',
    description: 'Extract audio from MP4 videos to MP3',
    fromFormat: 'MP4',
    toFormat: 'MP3',
    icon: <MusicIcon className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '45 sec',
    usageCount: 654321,
    category: 'audio',
  },
  {
    id: 'mp3-to-wav',
    title: 'MP3 to WAV',
    description: 'Convert MP3 audio to WAV format',
    fromFormat: 'MP3',
    toFormat: 'WAV',
    icon: <MusicIcon className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '30 sec',
    usageCount: 543210,
    category: 'audio',
  },
  {
    id: 'mp4-to-avi',
    title: 'MP4 to AVI',
    description: 'Convert MP4 videos to AVI format',
    fromFormat: 'MP4',
    toFormat: 'AVI',
    icon: <VideoIcon className="h-8 w-8" />,
    color: 'from-red-500 to-red-600',
    estimatedTime: '60 sec',
    usageCount: 432109,
    category: 'video',
  },
  {
    id: 'avi-to-mp4',
    title: 'AVI to MP4',
    description: 'Convert AVI videos to MP4 format',
    fromFormat: 'AVI',
    toFormat: 'MP4',
    icon: <VideoIcon className="h-8 w-8" />,
    color: 'from-red-500 to-red-600',
    estimatedTime: '55 sec',
    usageCount: 321098,
    category: 'video',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert PDF pages to JPG images',
    fromFormat: 'PDF',
    toFormat: 'JPG',
    icon: <ImageIcon className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '40 sec',
    usageCount: 210987,
    category: 'image',
  },
  {
    id: 'epub-to-pdf',
    title: 'EPUB to PDF',
    description: 'Convert EPUB ebooks to PDF format',
    fromFormat: 'EPUB',
    toFormat: 'PDF',
    icon: <BookIcon className="h-8 w-8" />,
    color: 'from-yellow-500 to-yellow-600',
    estimatedTime: '35 sec',
    usageCount: 198765,
    category: 'ebook',
  },
  {
    id: 'pdf-to-epub',
    title: 'PDF to EPUB',
    description: 'Convert PDF documents to EPUB ebooks',
    fromFormat: 'PDF',
    toFormat: 'EPUB',
    icon: <BookIcon className="h-8 w-8" />,
    color: 'from-yellow-500 to-yellow-600',
    estimatedTime: '45 sec',
    usageCount: 187654,
    category: 'ebook',
  },
  {
    id: 'zip-to-rar',
    title: 'ZIP to RAR',
    description: 'Convert ZIP archives to RAR format',
    fromFormat: 'ZIP',
    toFormat: 'RAR',
    icon: <ArchiveIcon className="h-8 w-8" />,
    color: 'from-indigo-500 to-indigo-600',
    estimatedTime: '50 sec',
    usageCount: 176543,
    category: 'archive',
  },
  {
    id: 'rar-to-zip',
    title: 'RAR to ZIP',
    description: 'Convert RAR archives to ZIP format',
    fromFormat: 'RAR',
    toFormat: 'ZIP',
    icon: <ArchiveIcon className="h-8 w-8" />,
    color: 'from-indigo-500 to-indigo-600',
    estimatedTime: '45 sec',
    usageCount: 165432,
    category: 'archive',
  },
  {
    id: 'webm-to-mp4',
    title: 'WebM to MP4',
    description: 'Convert WebM videos to MP4 format',
    fromFormat: 'WebM',
    toFormat: 'MP4',
    icon: <VideoIcon className="h-8 w-8" />,
    color: 'from-red-500 to-red-600',
    estimatedTime: '40 sec',
    usageCount: 154321,
    category: 'video',
  },
  {
    id: 'wav-to-mp3',
    title: 'WAV to MP3',
    description: 'Convert WAV audio to MP3 format',
    fromFormat: 'WAV',
    toFormat: 'MP3',
    icon: <MusicIcon className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '25 sec',
    usageCount: 143210,
    category: 'audio',
  },
  {
    id: 'png-to-webp',
    title: 'PNG to WebP',
    description: 'Convert PNG images to WebP format',
    fromFormat: 'PNG',
    toFormat: 'WebP',
    icon: <ImageIcon className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '15 sec',
    usageCount: 132109,
    category: 'image',
  },
  {
    id: 'ppt-to-pdf',
    title: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    fromFormat: 'PPT',
    toFormat: 'PDF',
    icon: <DocumentIcon className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '35 sec',
    usageCount: 121098,
    category: 'document',
  },
  {
    id: 'mov-to-mp4',
    title: 'MOV to MP4',
    description: 'Convert MOV videos to MP4 format',
    fromFormat: 'MOV',
    toFormat: 'MP4',
    icon: <VideoIcon className="h-8 w-8" />,
    color: 'from-red-500 to-red-600',
    estimatedTime: '50 sec',
    usageCount: 110987,
    category: 'video',
  },
  {
    id: 'flac-to-mp3',
    title: 'FLAC to MP3',
    description: 'Convert FLAC audio to MP3 format',
    fromFormat: 'FLAC',
    toFormat: 'MP3',
    icon: <MusicIcon className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '30 sec',
    usageCount: 109876,
    category: 'audio',
  },
  {
    id: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format',
    fromFormat: 'JPG',
    toFormat: 'PNG',
    icon: <ImageIcon className="h-8 w-8" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '15 sec',
    usageCount: 98765,
    category: 'image',
  },
];

type CategoryFilter = 'all' | 'document' | 'image' | 'video' | 'audio' | 'ebook' | 'archive';

const ConversionGrid = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  
  const filteredCards = activeCategory === 'all' 
    ? conversionCards 
    : conversionCards.filter(card => card.category === activeCategory);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const categories = [
    { id: 'all', name: 'All Formats', icon: '🔄' },
    { id: 'document', name: 'Documents', icon: '📄' },
    { id: 'image', name: 'Images', icon: '🖼️' },
    { id: 'video', name: 'Videos', icon: '🎬' },
    { id: 'audio', name: 'Audio', icon: '🎵' },
    { id: 'ebook', name: 'eBooks', icon: '📚' },
    { id: 'archive', name: 'Archives', icon: '🗄️' },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Popular Conversion Types</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose from our most popular file conversion options or explore all 100+ supported formats
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as CategoryFilter)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category.id 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Conversion cards grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
          key={activeCategory} // This forces re-animation when category changes
        >
          {filteredCards.map((card) => (
            <motion.div 
              key={card.id}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient background that shows on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 ${card.color}"></div>
              
              <Link href={`/convert/${card.id}`} className="block p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br ${card.color} text-white group-hover:bg-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300`}>
                    {card.icon}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors duration-300">
                    ~{card.estimatedTime}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                  {card.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300 mb-4">
                  {card.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-800 dark:text-gray-300 group-hover:bg-white group-hover:bg-opacity-20 group-hover:text-white transition-colors duration-300">
                      {card.fromFormat}
                    </span>
                    <svg className="h-4 w-4 mx-1 text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-800 dark:text-gray-300 group-hover:bg-white group-hover:bg-opacity-20 group-hover:text-white transition-colors duration-300">
                      {card.toFormat}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors duration-300">
                    {formatNumber(card.usageCount)} uses
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link 
            href="/convert"
            className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            View All 100+ Formats
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ConversionGrid;