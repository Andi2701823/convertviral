import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us - ConvertViral',
  description: 'Get in touch with the ConvertViral team. We\'re here to help with any questions about our file conversion services.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'ConvertViral Contact Page',
    'description': 'Contact information for ConvertViral',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'ConvertViral',
      'email': 'support@convertviral.com',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '',
        'contactType': 'customer service',
        'email': 'support@convertviral.com',
        'availableLanguage': ['English', 'German', 'Spanish', 'French', 'Portuguese', 'Italian', 'Japanese', 'Korean'],
        'hoursAvailable': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '17:00'
        }
      },
      'sameAs': [
        'https://twitter.com/convertviral',
        'https://facebook.com/convertviral',
        'https://instagram.com/convertviral'
      ]
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      {children}
    </>
  );
}