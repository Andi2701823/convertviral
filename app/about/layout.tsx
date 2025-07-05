import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About Us - ConvertViral',
  description: 'Learn about ConvertViral, our mission, team, and the story behind our file conversion platform.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ConvertViral",
    "url": "https://convertviral.com",
    "logo": "https://convertviral.com/logo.png",
    "description": "A modern file conversion platform that allows you to convert files between different formats quickly and easily.",
    "foundingDate": "2023",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "4"
    },
    "sameAs": [
      "https://twitter.com/convertviral",
      "https://facebook.com/convertviral",
      "https://linkedin.com/company/convertviral"
    ]
  };

  return (
    <>
      {children}
      <JsonLd data={jsonLdData} />
    </>
  );
}