import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fileFormats, fileCategories } from '@/lib/fileTypes';
import { generateBaseMetadata, generateFAQStructuredData } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { format: string } }): Promise<Metadata> {
  const { format } = params;
  
  // Check if format is valid
  if (!fileFormats[format]) {
    return {
      title: 'File Formats - ConvertViral',
      description: 'Learn about different file formats and how to convert between them.',
    };
  }
  
  const formatName = fileFormats[format].name;
  const formatExtension = fileFormats[format].extension;
  
  return generateBaseMetadata({
    title: `${formatName} (${formatExtension.toUpperCase()}) Format - ConvertViral`,
    description: `Learn about the ${formatName} (${formatExtension.toUpperCase()}) file format, its uses, advantages, and how to convert to and from ${formatExtension.toUpperCase()} files.`,
    path: `/formats/${format}`,
    keywords: [
      `${formatExtension} format`,
      `${formatName}`,
      `convert ${formatExtension}`,
      `${formatExtension} file`,
      `${formatExtension} converter`,
    ],
  });
}

// Helper function to generate JSON-LD structured data
function generateFormatJsonLd(format: string) {
  // Check if format is valid
  if (!fileFormats[format]) {
    return null;
  }
  
  const formatName = fileFormats[format].name;
  const formatExtension = fileFormats[format].extension;
  
  // Generate FAQ structured data
  return generateFAQStructuredData([
    {
      question: `What is a ${formatExtension.toUpperCase()} file?`,
      answer: `A ${formatExtension.toUpperCase()} file is a ${fileFormats[format].description}. It is commonly used for ${getFormatUseCase(format)}.`,
    },
    {
      question: `How do I open a ${formatExtension.toUpperCase()} file?`,
      answer: `You can open a ${formatExtension.toUpperCase()} file using ${getFormatSoftware(format)}.`,
    },
    {
      question: `How do I convert a ${formatExtension.toUpperCase()} file to another format?`,
      answer: `You can convert a ${formatExtension.toUpperCase()} file to another format using ConvertViral's free online converter. Simply upload your ${formatExtension.toUpperCase()} file, select the output format, and click Convert.`,
    },
    {
      question: `What are the advantages of ${formatExtension.toUpperCase()} files?`,
      answer: `${formatExtension.toUpperCase()} files offer several advantages including ${getFormatAdvantages(format)}.`,
    },
    {
      question: `What are the limitations of ${formatExtension.toUpperCase()} files?`,
      answer: `Some limitations of ${formatExtension.toUpperCase()} files include ${getFormatLimitations(format)}.`,
    },
  ]);
}

// Helper functions to get format information
function getFormatUseCase(format: string): string {
  const formatMap: Record<string, string> = {
    pdf: 'sharing documents that need to maintain their formatting across different devices and platforms',
    docx: 'creating and editing text documents with rich formatting',
    xlsx: 'storing and organizing data in spreadsheets with calculations and charts',
    pptx: 'creating presentations with slides, animations, and multimedia',
    jpg: 'storing photographs and complex graphics with a small file size',
    png: 'storing images with transparency and lossless compression',
    gif: 'creating simple animations and images with limited colors',
    mp3: 'storing audio with good compression and quality balance',
    wav: 'storing high-quality uncompressed audio',
    mp4: 'storing video with good compression and quality balance',
    // Add more formats as needed
  };
  
  return formatMap[format] || 'various purposes depending on the specific needs';
}

function getFormatSoftware(format: string): string {
  const formatMap: Record<string, string> = {
    pdf: 'Adobe Acrobat Reader, Chrome, Firefox, or other PDF viewers',
    docx: 'Microsoft Word, Google Docs, LibreOffice Writer, or other word processors',
    xlsx: 'Microsoft Excel, Google Sheets, LibreOffice Calc, or other spreadsheet applications',
    pptx: 'Microsoft PowerPoint, Google Slides, LibreOffice Impress, or other presentation software',
    jpg: 'most image viewers and editors like Windows Photos, Preview (Mac), GIMP, or Adobe Photoshop',
    png: 'most image viewers and editors like Windows Photos, Preview (Mac), GIMP, or Adobe Photoshop',
    gif: 'most web browsers and image viewers',
    mp3: 'media players like Windows Media Player, iTunes, VLC, or streaming services',
    wav: 'most audio players and editing software',
    mp4: 'media players like VLC, Windows Media Player, QuickTime, or streaming services',
    // Add more formats as needed
  };
  
  return formatMap[format] || 'various software applications depending on your operating system';
}

function getFormatAdvantages(format: string): string {
  const formatMap: Record<string, string> = {
    pdf: 'consistent formatting across devices, support for interactive elements, and document security features',
    docx: 'rich text formatting, compatibility with most word processors, and easy editing',
    xlsx: 'powerful calculation capabilities, data visualization with charts, and data analysis tools',
    pptx: 'support for animations, multimedia elements, and presentation notes',
    jpg: 'small file size with good image quality, perfect for photographs, and universal compatibility',
    png: 'lossless compression, transparency support, and good for graphics with text',
    gif: 'support for simple animations, small file size, and wide compatibility',
    mp3: 'small file size with good audio quality, universal compatibility, and metadata support',
    wav: 'uncompressed audio quality, perfect for audio editing, and no quality loss',
    mp4: 'good compression with high quality, support for various codecs, and universal compatibility',
    // Add more formats as needed
  };
  
  return formatMap[format] || 'various advantages depending on your specific use case';
}

function getFormatLimitations(format: string): string {
  const formatMap: Record<string, string> = {
    pdf: 'difficulty in editing content, potentially large file sizes for complex documents, and text extraction issues',
    docx: 'potential formatting issues when opened in different software, and larger file size compared to plain text',
    xlsx: 'complexity for simple data needs, and potential compatibility issues with older software',
    pptx: 'large file size for presentations with many images or videos, and potential font compatibility issues',
    jpg: 'lossy compression that reduces quality with each save, no transparency support, and artifacts in sharp edges',
    png: 'larger file size compared to JPG for photographs, and limited animation support',
    gif: 'limited to 256 colors, lower image quality, and potentially large file size for animations',
    mp3: 'lossy compression that reduces audio quality, not ideal for professional audio work',
    wav: 'very large file size, and limited metadata support',
    mp4: 'quality loss with high compression, and potential compatibility issues with older devices',
    // Add more formats as needed
  };
  
  return formatMap[format] || 'various limitations depending on your specific use case';
}

// Get popular conversion pairs for a format
function getPopularConversions(format: string): { from: string[]; to: string[] } {
  const conversionMap: Record<string, { from: string[]; to: string[] }> = {
    pdf: {
      from: ['docx', 'jpg', 'png'],
      to: ['docx', 'jpg', 'png'],
    },
    docx: {
      from: ['pdf', 'txt'],
      to: ['pdf', 'txt'],
    },
    jpg: {
      from: ['png', 'pdf', 'heic'],
      to: ['png', 'pdf', 'webp'],
    },
    png: {
      from: ['jpg', 'pdf', 'svg'],
      to: ['jpg', 'pdf', 'webp'],
    },
    mp3: {
      from: ['wav', 'ogg', 'flac'],
      to: ['wav', 'ogg', 'flac'],
    },
    mp4: {
      from: ['avi', 'mov', 'webm'],
      to: ['avi', 'mov', 'webm'],
    },
    // Add more formats as needed
  };
  
  return conversionMap[format] || { from: [], to: [] };
}

export default function FormatPage({ params }: { params: { format: string } }) {
  const { format } = params;
  
  // Check if format is valid
  if (!fileFormats[format]) {
    notFound();
  }
  
  const formatData = fileFormats[format];
  const formatName = formatData.name;
  const formatExtension = formatData.extension;
  const formatCategory = formatData.category;
  const formatDescription = formatData.description;
  
  // Get popular conversions
  const popularConversions = getPopularConversions(format);
  
  // Get JSON-LD structured data
  const jsonLdData = generateFormatJsonLd(format);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Add JSON-LD structured data */}
      <JsonLd data={jsonLdData} />
      <h1 className="text-3xl font-bold text-center mb-8">
        {formatName} ({formatExtension.toUpperCase()}) Format
      </h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="mr-4 text-4xl text-blue-500">
            {<formatData.icon />}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{formatName}</h2>
            <p className="text-gray-600">{formatDescription}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Category</h3>
            <p className="flex items-center">
              <span className="mr-2">{<formatCategory.icon />}</span>
              {formatCategory.name}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">File Extension</h3>
            <p>.{formatExtension}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">MIME Types</h3>
            <ul className="list-disc list-inside">
              {formatData.mimeTypes.map((mimeType) => (
                <li key={mimeType}>{mimeType}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Convert from {formatExtension.toUpperCase()}</h2>
          <p className="mb-4">
            Convert your {formatName} files to other formats with our free online converter.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {popularConversions.to.map((toFormat) => (
              <Link 
                key={toFormat}
                href={`/convert/${format}-to-${toFormat}`}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded flex items-center justify-center"
              >
                {formatExtension.toUpperCase()} to {toFormat.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Convert to {formatExtension.toUpperCase()}</h2>
          <p className="mb-4">
            Convert other file formats to {formatName} with our free online converter.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {popularConversions.from.map((fromFormat) => (
              <Link 
                key={fromFormat}
                href={`/convert/${fromFormat}-to-${format}`}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded flex items-center justify-center"
              >
                {fromFormat.toUpperCase()} to {formatExtension.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="prose max-w-none mb-12">
        <h2>About {formatName} Files</h2>
        <p>
          {formatName} ({formatExtension.toUpperCase()}) files are {formatDescription}. They are commonly used for {getFormatUseCase(format)}.
        </p>
        
        <h3>How to Open {formatExtension.toUpperCase()} Files</h3>
        <p>
          You can open {formatExtension.toUpperCase()} files using {getFormatSoftware(format)}.
        </p>
        
        <h3>Advantages of {formatExtension.toUpperCase()} Files</h3>
        <p>
          {formatExtension.toUpperCase()} files offer several advantages:
        </p>
        <ul>
          {getFormatAdvantages(format).split(', ').map((advantage, index) => (
            <li key={index}>{advantage}</li>
          ))}
        </ul>
        
        <h3>Limitations of {formatExtension.toUpperCase()} Files</h3>
        <p>
          Some limitations of {formatExtension.toUpperCase()} files include:
        </p>
        <ul>
          {getFormatLimitations(format).split(', ').map((limitation, index) => (
            <li key={index}>{limitation}</li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium">What is a {formatExtension.toUpperCase()} file?</h3>
            <p className="mt-2 text-gray-600">
              A {formatExtension.toUpperCase()} file is a {formatDescription}. It is commonly used for {getFormatUseCase(format)}.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">How do I open a {formatExtension.toUpperCase()} file?</h3>
            <p className="mt-2 text-gray-600">
              You can open a {formatExtension.toUpperCase()} file using {getFormatSoftware(format)}.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">How do I convert a {formatExtension.toUpperCase()} file to another format?</h3>
            <p className="mt-2 text-gray-600">
              You can convert a {formatExtension.toUpperCase()} file to another format using ConvertViral's free online converter. 
              Simply upload your {formatExtension.toUpperCase()} file, select the output format, and click Convert.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">What are the advantages of {formatExtension.toUpperCase()} files?</h3>
            <p className="mt-2 text-gray-600">
              {formatExtension.toUpperCase()} files offer several advantages including {getFormatAdvantages(format)}.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium">What are the limitations of {formatExtension.toUpperCase()} files?</h3>
            <p className="mt-2 text-gray-600">
              Some limitations of {formatExtension.toUpperCase()} files include {getFormatLimitations(format)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}