import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the FileUploader component with no SSR
const FileUploader = dynamic(() => import('@/components/FileUploader'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Convert Files - ConvertViral',
  description: 'Upload and convert your files to any format with our easy-to-use conversion tool.',
};

export default function ConvertPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Convert Your Files</h1>
      
      <div className="text-center mb-8">
        <p className="text-lg">Upload your file and select the output format to convert.</p>
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
    </div>
  );
}