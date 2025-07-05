import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { generateBaseMetadata, generateHowToStructuredData } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

// Dynamically import BatchFileUploader with no SSR
const BatchFileUploader = dynamic(() => import('@/components/BatchFileUploader'), {
  ssr: false,
});

// Generate metadata for the page
export function generateMetadata(): Metadata {
  return generateBaseMetadata({
    title: 'Batch File Converter - Convert Multiple Files at Once',
    description: 'Convert multiple files at once with our free batch file converter. Support for PDF, images, audio, video, and more. No registration required.',
    path: '/tools/batch-converter',
    keywords: [
      'batch converter',
      'bulk file conversion',
      'convert multiple files',
      'batch file processing',
      'mass conversion',
      'convert files in bulk',
    ],
  });
}

// Helper function to generate JSON-LD structured data
function generateBatchJsonLd() {
  // Generate how-to structured data
  const howTo = generateHowToStructuredData({
    title: 'How to Convert Multiple Files at Once',
    description: 'Learn how to convert multiple files simultaneously using ConvertViral\'s free batch converter.',
    steps: [
      {
        name: 'Upload your files',
        text: 'Click the upload button or drag and drop multiple files into the upload area.',
        image: '/images/upload-step.svg',
      },
      {
        name: 'Select output format',
        text: 'Choose the format you want to convert your files to from the dropdown menu.',
        image: '/images/format-step.svg',
      },
      {
        name: 'Start batch conversion',
        text: 'Click the "Convert All" button to start the batch conversion process.',
        image: '/images/convert-step.svg',
      },
      {
        name: 'Download converted files',
        text: 'Once the conversion is complete, download all your converted files individually or as a ZIP archive.',
        image: '/images/download-step.svg',
      },
    ],
  });
  
  // Generate FAQ structured data
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How many files can I convert at once?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'With our free plan, you can convert up to 10 files at once. Each file can be up to 100MB in size. For larger batch conversions, consider upgrading to our premium plan.',
        },
      },
      {
        '@type': 'Question',
        'name': 'What file formats are supported for batch conversion?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our batch converter supports a wide range of formats including PDF, DOCX, XLSX, PPTX, JPG, PNG, GIF, MP3, WAV, MP4, and many more. You can convert between document formats, image formats, audio formats, and video formats.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Is batch conversion free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, our basic batch conversion service is completely free with no registration required. For advanced features like higher file size limits, more files per batch, and priority processing, we offer premium plans.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How long does batch conversion take?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The conversion time depends on the number of files, their sizes, and the complexity of the conversion. Most batches are processed within a few minutes. You can see real-time progress for each file during conversion.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Is my data safe during batch conversion?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, we take data security seriously. All file transfers are encrypted, and your files are automatically deleted from our servers after conversion. We also offer offline conversion capabilities for added privacy.',
        },
      },
    ],
  };
  
  // Generate WebApplication structured data
  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'ConvertViral Batch File Converter',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'description': 'Convert multiple files at once with our free batch file converter. Support for PDF, images, audio, video, and more.',
  };
  
  return [
    howTo,
    faq,
    webApplication,
  ];
}

export default function BatchConverterPage() {
  // Get JSON-LD structured data
  const jsonLdData = generateBatchJsonLd();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Add JSON-LD structured data using the reusable component */}
      <JsonLd data={jsonLdData} />
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Batch File Converter
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Convert multiple files at once. Fast, secure, and free.
        </p>
      </div>
      
      <div className="mb-16">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Upload your files</h2>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop multiple files or click to browse. Max 10 files, 100MB each.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6" id="upload">
            {/* Placeholder for BatchFileUploader component */}
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                BatchFileUploader component will be implemented here.
                <br />
                This component will allow users to upload multiple files,
                <br />
                select a target format, and convert them all at once.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Convert Multiple Files at Once</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">1</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your files</h3>
              <p className="text-sm text-gray-500">
                Click the upload button or drag and drop multiple files into the upload area.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select output format</h3>
              <p className="text-sm text-gray-500">
                Choose the format you want to convert your files to from the dropdown menu.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start batch conversion</h3>
              <p className="text-sm text-gray-500">
                Click the "Convert All" button to start the batch conversion process.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">4</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Download files</h3>
              <p className="text-sm text-gray-500">
                Once complete, download all your converted files individually or as a ZIP archive.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Batch Conversion</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-700">
                Convert multiple files simultaneously instead of processing them one by one. 
                Perfect for large projects or when you need to convert entire folders.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consistent Results</h3>
              <p className="text-gray-700">
                All your files are processed with the same conversion settings, 
                ensuring consistent quality and formatting across all outputs.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Simplified Workflow</h3>
              <p className="text-gray-700">
                Streamline your document processing workflow by handling multiple conversions 
                in a single operation. Download all results in one convenient ZIP archive.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How many files can I convert at once?</h3>
            <p className="text-gray-700">
              With our free plan, you can convert up to 10 files at once. Each file can be up to 100MB in size. 
              For larger batch conversions, consider upgrading to our premium plan.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">What file formats are supported for batch conversion?</h3>
            <p className="text-gray-700">
              Our batch converter supports a wide range of formats including PDF, DOCX, XLSX, PPTX, JPG, PNG, GIF, MP3, WAV, MP4, and many more. 
              You can convert between document formats, image formats, audio formats, and video formats.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Is batch conversion free?</h3>
            <p className="text-gray-700">
              Yes, our basic batch conversion service is completely free with no registration required. 
              For advanced features like higher file size limits, more files per batch, and priority processing, we offer premium plans.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How long does batch conversion take?</h3>
            <p className="text-gray-700">
              The conversion time depends on the number of files, their sizes, and the complexity of the conversion. 
              Most batches are processed within a few minutes. You can see real-time progress for each file during conversion.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Is my data safe during batch conversion?</h3>
            <p className="text-gray-700">
              Yes, we take data security seriously. All file transfers are encrypted, and your files are automatically deleted from our servers after conversion. 
              We also offer offline conversion capabilities for added privacy.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Need to convert more files?</h2>
        <p className="text-gray-700 mb-4">
          Upgrade to our premium plan to convert up to 100 files at once, with larger file size limits and priority processing.
        </p>
        <a 
          href="/pricing"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Premium Plans
        </a>
      </div>
    </div>
  );
}