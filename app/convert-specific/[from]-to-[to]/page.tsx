import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fileFormats } from '@/lib/fileTypes';
import { generateConversionMetadata, generateConversionStructuredData, generateHowToStructuredData } from '@/lib/seo';
import { trackFormatSelected } from '@/lib/analytics';
import JsonLd from '@/components/JsonLd';

// Dynamically import FileUploader with no SSR
const FileUploader = dynamic(() => import('@/components/FileUploader'), {
  ssr: false,
});

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { from: string; to: string } }): Promise<Metadata> {
  const { from, to } = params;
  
  // Check if formats are valid
  if (!fileFormats[from] || !fileFormats[to]) {
    return {
      title: 'File Conversion - ConvertViral',
      description: 'Convert files between different formats with our free online converter.',
    };
  }
  
  return generateConversionMetadata({
    sourceFormat: from,
    targetFormat: to,
  });
}

// Helper function to generate JSON-LD structured data
function generatePageJsonLd(from: string, to: string) {
  // Check if formats are valid
  if (!fileFormats[from] || !fileFormats[to]) {
    return null;
  }
  
  const fromFormatName = fileFormats[from].name;
  const fromFormatExtension = fileFormats[from].extension;
  const toFormatName = fileFormats[to].name;
  const toFormatExtension = fileFormats[to].extension;
  
  // Generate structured data for conversion tool
  const conversionTool = generateConversionStructuredData({
    sourceFormat: from,
    targetFormat: to,
  });
  
  // Generate how-to structured data
  const howTo = generateHowToStructuredData({
    title: `How to Convert ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()}`,
    description: `Learn how to convert ${fromFormatName} files to ${toFormatName} format online for free with ConvertViral.`,
    steps: [
      {
        name: 'Upload your file',
        text: `Click the upload button or drag and drop your ${fromFormatExtension.toUpperCase()} file into the upload area.`,
        image: '/images/upload-step.svg',
      },
      {
        name: 'Wait for conversion',
        text: 'Our system will automatically convert your file. This usually takes a few seconds depending on the file size.',
        image: '/images/convert-step.svg',
      },
      {
        name: 'Download your converted file',
        text: `Once the conversion is complete, download your new ${toFormatExtension.toUpperCase()} file.`,
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
        'name': `How do I convert ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `To convert ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()}, upload your ${fromFormatExtension.toUpperCase()} file using our tool, wait for the conversion to complete, and then download your new ${toFormatExtension.toUpperCase()} file.`,
        },
      },
      {
        '@type': 'Question',
        'name': `Is it safe to convert ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()} online?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes, ConvertViral ensures your files are securely processed. Your files are automatically deleted after conversion, and we never share your files with third parties.`,
        },
      },
      {
        '@type': 'Question',
        'name': `How long does it take to convert ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Most conversions take only a few seconds. However, larger files or complex conversions may take longer. You can convert files up to 100MB for free.`,
        },
      },
      {
        '@type': 'Question',
        'name': `Do I need to create an account to convert ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `No, you don't need to create an account or register to use our free ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()} converter. Simply upload your file and convert it instantly.`,
        },
      },
      {
        '@type': 'Question',
        'name': `What are the advantages of converting ${fromFormatExtension.toUpperCase()} to ${toFormatExtension.toUpperCase()}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': getConversionAdvantages(from, to),
        },
      },
    ],
  };
  
  return [
    conversionTool,
    howTo,
    faq,
  ];
}

// Helper function to get conversion advantages
function getConversionAdvantages(from: string, to: string): string {
  const conversionMap: Record<string, Record<string, string>> = {
    pdf: {
      docx: 'Converting PDF to DOCX allows you to edit the content easily in word processors like Microsoft Word. This is useful when you need to update or modify the content of a PDF document.',
      jpg: 'Converting PDF to JPG allows you to extract images from PDF documents or create image versions of PDF pages that can be easily shared or used in presentations.',
      png: 'Converting PDF to PNG creates high-quality images with transparency support, which is ideal for using PDF content in designs or presentations.',
    },
    docx: {
      pdf: 'Converting DOCX to PDF creates a document that maintains its formatting across different devices and platforms. PDF files are also more secure and can be password protected.',
      txt: 'Converting DOCX to TXT extracts the plain text content, removing all formatting. This is useful when you only need the text content without any formatting.',
    },
    jpg: {
      png: 'Converting JPG to PNG can be beneficial when you need transparency support or want to avoid further quality loss in editing.',
      pdf: 'Converting JPG to PDF allows you to create a document from your images, which is useful for creating reports or documents with images.',
      webp: 'Converting JPG to WebP typically results in smaller file sizes while maintaining similar quality, which is ideal for web usage.',
    },
    // Add more conversions as needed
  };
  
  return conversionMap[from]?.[to] || 
    `Converting ${fileFormats[from].extension.toUpperCase()} to ${fileFormats[to].extension.toUpperCase()} can provide different advantages depending on your specific needs and use case.`;
}

// Get common use cases for a specific conversion
function getConversionUseCases(from: string, to: string): string[] {
  const conversionMap: Record<string, Record<string, string[]>> = {
    pdf: {
      docx: [
        'Editing content in a PDF document',
        'Updating information in a form or document',
        'Extracting text and images for reuse',
        'Modifying the layout or formatting of a document',
      ],
      jpg: [
        'Creating image versions of PDF pages',
        'Extracting images from PDF documents',
        'Sharing PDF content on social media',
        'Using PDF content in presentations or designs',
      ],
    },
    docx: {
      pdf: [
        'Creating a non-editable version of a document',
        'Ensuring consistent formatting across devices',
        'Sharing documents that don\'t need to be edited',
        'Creating a document for printing',
      ],
    },
    jpg: {
      png: [
        'Creating images with transparency',
        'Improving quality for graphics with text',
        'Preparing images for graphic design work',
        'Avoiding quality loss in image editing',
      ],
    },
    // Add more conversions as needed
  };
  
  return conversionMap[from]?.[to] || [
    `Converting ${fileFormats[from].name} files to ${fileFormats[to].name} format`,
    'Processing files for specific software compatibility',
    'Optimizing files for different use cases',
    'Meeting specific format requirements',
  ];
}

export default function ConversionPage({ params }: { params: { from: string; to: string } }) {
  const { from, to } = params;
  
  // Check if formats are valid
  if (!fileFormats[from] || !fileFormats[to]) {
    notFound();
  }
  
  const fromFormat = fileFormats[from];
  const toFormat = fileFormats[to];
  
  // Track format selection for analytics
  if (typeof window !== 'undefined') {
    trackFormatSelected(from, to);
  }
  
  // Get common use cases for this conversion
  const useCases = getConversionUseCases(from, to);
  
  // Generate JSON-LD structured data
  const jsonLdData = generatePageJsonLd(from, to);
  
  return (
    <>
      <JsonLd data={jsonLdData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Convert {fromFormat.name} to {toFormat.name}
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Free online {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()} converter. No registration required.
        </p>
      </div>
      
      <div className="mb-16">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Upload your {fromFormat.extension.toUpperCase()} file</h2>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop your file or click to browse. Max file size: 100MB.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6" id="upload">
            <FileUploader 
              sourceFormat={from}
              targetFormat={to}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">1</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your file</h3>
              <p className="text-sm text-gray-500">
                Click the upload button or drag and drop your {fromFormat.extension.toUpperCase()} file into the upload area.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Wait for conversion</h3>
              <p className="text-sm text-gray-500">
                Our system will automatically convert your file. This usually takes a few seconds depending on the file size.
              </p>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="text-4xl text-blue-500 mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Download your file</h3>
              <p className="text-sm text-gray-500">
                Once the conversion is complete, download your new {toFormat.extension.toUpperCase()} file.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}?</h2>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-4">
              {getConversionAdvantages(from, to)}
            </p>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Common Use Cases:</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {useCases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How do I convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}?</h3>
            <p className="text-gray-700">
              To convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}, upload your {fromFormat.extension.toUpperCase()} file using our tool above, 
              wait for the conversion to complete, and then download your new {toFormat.extension.toUpperCase()} file. The process is completely free and doesn't require registration.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Is it safe to convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()} online?</h3>
            <p className="text-gray-700">
              Yes, ConvertViral ensures your files are securely processed. Your files are automatically deleted after conversion, 
              and we never share your files with third parties. We also offer offline conversion capabilities for added privacy.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How long does it take to convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}?</h3>
            <p className="text-gray-700">
              Most conversions take only a few seconds. However, larger files or complex conversions may take longer. 
              You can convert files up to 100MB for free. For larger files or batch conversions, consider upgrading to our premium plan.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Do I need to create an account to convert {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}?</h3>
            <p className="text-gray-700">
              No, you don't need to create an account or register to use our free {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()} converter. 
              Simply upload your file and convert it instantly. However, creating an account allows you to access your conversion history and earn rewards.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">What are the advantages of converting {fromFormat.extension.toUpperCase()} to {toFormat.extension.toUpperCase()}?</h3>
            <p className="text-gray-700">
              {getConversionAdvantages(from, to)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Conversions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(fileFormats)
            .filter(format => format !== from && format !== to && 
                    (fileFormats[format].category.id === fileFormats[from].category.id || 
                     fileFormats[format].category.id === fileFormats[to].category.id))
            .slice(0, 8)
            .map(format => (
              <a 
                key={format}
                href={format === from ? `/convert/${format}-to-${to}` : `/convert/${from}-to-${format}`}
                className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 text-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900 font-medium">
                  {format === from ? 
                    `${fileFormats[format].extension.toUpperCase()} to ${fileFormats[to].extension.toUpperCase()}` : 
                    `${fileFormats[from].extension.toUpperCase()} to ${fileFormats[format].extension.toUpperCase()}`}
                </span>
              </a>
            ))
          }
        </div>
      </div>
    </div>
    </>
  );
}