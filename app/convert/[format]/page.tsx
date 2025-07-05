import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fileFormats } from '@/lib/fileTypes';
import { generateConversionMetadata, generateConversionStructuredData, generateHowToStructuredData } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

// Dynamically import the FileUploader component with no SSR
const FileUploader = dynamic(() => import('@/components/FileUploader'), {
  ssr: false,
});

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { format: string } }): Promise<Metadata> {
  const { format } = params;
  
  // Parse the format parameter (e.g., "pdf-to-docx")
  const formatParts = format.split('-to-');
  
  if (formatParts.length !== 2) {
    return {
      title: 'Convert Files - ConvertViral',
      description: 'Upload and convert your files to any format with our easy-to-use conversion tool.',
    };
  }
  
  const [sourceFormat, targetFormat] = formatParts;
  
  // Check if formats are valid
  if (!fileFormats[sourceFormat] || !fileFormats[targetFormat]) {
    return {
      title: 'Convert Files - ConvertViral',
      description: 'Upload and convert your files to any format with our easy-to-use conversion tool.',
    };
  }
  
  // Generate metadata for the conversion page
  return generateConversionMetadata({ sourceFormat, targetFormat });
}

// Helper function to generate JSON-LD structured data
function generatePageJsonLd(format: string) {
  const formatParts = format.split('-to-');
  
  if (formatParts.length !== 2) {
    return null;
  }
  
  const [sourceFormat, targetFormat] = formatParts;
  
  // Check if formats are valid
  if (!fileFormats[sourceFormat] || !fileFormats[targetFormat]) {
    return null;
  }
  
  const sourceFormatName = fileFormats[sourceFormat].name;
  const targetFormatName = fileFormats[targetFormat].name;
  
  // Generate structured data
  return [
    // Conversion tool structured data
    generateConversionStructuredData({ sourceFormat, targetFormat }),
    
    // How-to structured data
    generateHowToStructuredData({
      title: `How to Convert ${sourceFormatName} to ${targetFormatName}`,
      description: `Learn how to convert ${sourceFormatName} files to ${targetFormatName} format online for free with ConvertViral.`,
      steps: [
        {
          name: 'Upload Your File',
          text: `Drag and drop your ${sourceFormatName} file or click to browse your files.`,
          image: '/screenshots/upload-step.jpg',
        },
        {
          name: 'Select Output Format',
          text: `Choose ${targetFormatName} as your output format.`,
          image: '/screenshots/format-step.jpg',
        },
        {
          name: 'Convert and Download',
          text: 'Click the Convert button and download your converted file when ready.',
          image: '/screenshots/download-step.jpg',
        },
      ],
    }),
  ];
}

export default function ConversionPage({ params }: { params: { format: string } }) {
  const { format } = params;
  const formatParts = format.split('-to-');
  
  // If format is invalid, show 404 page
  if (formatParts.length !== 2) {
    notFound();
  }
  
  const [sourceFormat, targetFormat] = formatParts;
  
  // Check if formats are valid
  if (!fileFormats[sourceFormat] || !fileFormats[targetFormat]) {
    notFound();
  }
  
  const sourceFormatName = fileFormats[sourceFormat].name;
  const targetFormatName = fileFormats[targetFormat].name;
  
  // Get JSON-LD structured data
  const jsonLdData = generatePageJsonLd(format);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Add JSON-LD structured data */}
      <JsonLd data={jsonLdData} />
      <h1 className="text-3xl font-bold text-center mb-8">
        Convert {sourceFormatName} to {targetFormatName}
      </h1>
      
      <div className="text-center mb-8">
        <p className="text-lg">
          Upload your {sourceFormatName} file and convert it to {targetFormatName} format instantly.
        </p>
      </div>
      
      <FileUploader sourceFormat={sourceFormat} targetFormat={targetFormat} />
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">How to Convert {sourceFormatName} to {targetFormatName}</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="card">
            <div className="text-3xl mb-4">1️⃣</div>
            <h3 className="text-xl font-medium mb-2">Upload Your {sourceFormatName} File</h3>
            <p className="text-gray-600">Drag and drop your file or click to browse.</p>
          </div>
          
          <div className="card">
            <div className="text-3xl mb-4">2️⃣</div>
            <h3 className="text-xl font-medium mb-2">Choose {targetFormatName} Format</h3>
            <p className="text-gray-600">Select {targetFormatName} as your output format.</p>
          </div>
          
          <div className="card">
            <div className="text-3xl mb-4">3️⃣</div>
            <h3 className="text-xl font-medium mb-2">Download Result</h3>
            <p className="text-gray-600">Get your converted {targetFormatName} file instantly.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">About {sourceFormatName} to {targetFormatName} Conversion</h2>
        <div className="prose max-w-none">
          <p>
            Converting from {sourceFormatName} to {targetFormatName} is a common task that many people need to perform. 
            Our online converter makes this process simple and efficient, allowing you to convert your files without 
            installing any software.
          </p>
          <h3>Benefits of Converting {sourceFormatName} to {targetFormatName}</h3>
          <ul>
            <li>Fast and easy conversion process</li>
            <li>No software installation required</li>
            <li>Secure and private - your files are deleted after conversion</li>
            <li>High-quality conversion results</li>
            <li>Free to use for basic conversions</li>
          </ul>
          <h3>Common Uses for {targetFormatName} Files</h3>
          <p>
            {targetFormatName} files are commonly used for [purpose of target format]. They offer advantages such as 
            [advantages of target format] and are compatible with [compatible software/platforms].
          </p>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium">How do I convert {sourceFormatName} to {targetFormatName}?</h3>
            <p className="mt-2 text-gray-600">
              Simply upload your {sourceFormatName} file using our file uploader, select {targetFormatName} as the output format, 
              and click the Convert button. Once the conversion is complete, you can download your {targetFormatName} file.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Is it safe to convert {sourceFormatName} to {targetFormatName} online?</h3>
            <p className="mt-2 text-gray-600">
              Yes, our conversion process is secure. Your files are encrypted during transfer and automatically deleted 
              after conversion. We never share your files with third parties.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">How long does it take to convert {sourceFormatName} to {targetFormatName}?</h3>
            <p className="mt-2 text-gray-600">
              Most conversions are completed within seconds. However, the exact time depends on the file size and complexity. 
              Larger files may take a bit longer to process.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">What is the maximum file size for {sourceFormatName} to {targetFormatName} conversion?</h3>
            <p className="mt-2 text-gray-600">
              Free users can convert files up to 50MB. Premium users can convert files up to 500MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}