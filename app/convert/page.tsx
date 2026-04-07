import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';
import { generateWebApplicationStructuredData } from '@/lib/seo';

const FileUploader = dynamic(() => import('@/components/FileUploader'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Convert Files - ConvertViral',
  description: 'Fast, secure, free online file converter. Convert PDF, images, audio, video. No registration required. Supported formats: JPG, PNG, PDF, MP4, MP3, DOCX and more.',
  keywords: ['file converter', 'convert files online', 'pdf converter', 'image converter', 'audio converter', 'video converter', 'free converter', 'no registration'],
  alternates: {
    canonical: 'https://convertviral.netlify.app/convert',
  },
  openGraph: {
    title: 'Convert Files Online - ConvertViral',
    description: 'Free online file converter. Convert PDF, images, audio and video in seconds. No registration required.',
    url: 'https://convertviral.netlify.app/convert',
    siteName: 'ConvertViral',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Convert Files Online - ConvertViral',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert Files Online - ConvertViral',
    description: 'Free online file converter. Convert PDF, images, audio and video in seconds. No registration required.',
    images: ['/twitter-image.jpg'],
  },
};

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://convertviral.netlify.app/convert/#webpage',
  url: 'https://convertviral.netlify.app/convert',
  name: 'Convert Files - ConvertViral',
  description: 'Fast, secure, free online file converter. Convert PDF, images, audio, video. No registration required.',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://convertviral.netlify.app/#website',
    name: 'ConvertViral',
    url: 'https://convertviral.netlify.app',
  },
  dateModified: new Date().toISOString().split('T')[0],
};

export default function ConvertPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={webPageSchema} />
      <JsonLd data={generateWebApplicationStructuredData()} />
      <h1 className="text-3xl font-bold text-center mb-8">
        Convert Your Files
      </h1>

      <div className="text-center mb-8">
        <p className="text-lg mb-4">
          Upload your file and select the output format to convert.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="bg-gray-100 px-3 py-1 rounded-full">PDF</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">JPG / PNG</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">MP4 / MOV</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">MP3 / WAV</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">DOCX / XLSX</span>
        </div>
      </div>

      <FileUploader />

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="card">
            <div className="text-3xl mb-4">1️⃣</div>
            <h3 className="text-xl font-medium mb-2">Upload Your Files</h3>
            <p className="text-gray-600">Drag and drop your files or click to browse.</p>
          </div>

          <div className="card">
            <div className="text-3xl mb-4">2️⃣</div>
            <h3 className="text-xl font-medium mb-2">Choose Format</h3>
            <p className="text-gray-600">Select the output format you need.</p>
          </div>

          <div className="card">
            <div className="text-3xl mb-4">3️⃣</div>
            <h3 className="text-xl font-medium mb-2">Download Result</h3>
            <p className="text-gray-600">Get your converted file instantly.</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">Supported File Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-medium">Documents</h3>
            <p className="text-sm text-gray-500">PDF, DOCX, XLSX, PPTX</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🖼️</div>
            <h3 className="font-medium">Images</h3>
            <p className="text-sm text-gray-500">JPG, PNG, WebP, HEIC</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎵</div>
            <h3 className="font-medium">Audio</h3>
            <p className="text-sm text-gray-500">MP3, WAV, FLAC, M4A</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎬</div>
            <h3 className="font-medium">Video</h3>
            <p className="text-sm text-gray-500">MP4, MOV, AVI, MKV</p>
          </div>
        </div>
      </div>
    </div>
  );
}
