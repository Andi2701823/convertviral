import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Features - ConvertViral',
  description: 'Explore the powerful features of ConvertViral file conversion platform. Fast conversions, batch processing, cloud storage integration, and more.',
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "ConvertViral Features",
    "description": "Key features of the ConvertViral file conversion platform",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Lightning-Fast Conversion",
        "description": "Convert files in seconds with our optimized conversion engine. Support for 100+ file formats."
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Batch Processing",
        "description": "Convert multiple files at once to save time. Perfect for processing large collections."
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Cloud Storage Integration",
        "description": "Connect with Dropbox, Google Drive, and OneDrive to convert files directly from your cloud storage."
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Advanced Compression",
        "description": "Reduce file sizes without losing quality using our smart compression algorithms."
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Secure File Handling",
        "description": "Your files are encrypted during transfer and automatically deleted after 24 hours."
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "API Access",
        "description": "Integrate our conversion capabilities into your own applications with our developer API."
      }
    ]
  };

  return (
    <>
      {children}
      <JsonLd data={jsonLdData} />
    </>
  );
}