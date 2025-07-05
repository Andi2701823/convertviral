import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Sign Up - ConvertViral',
  description: 'Create your ConvertViral account to start converting files, track your conversion history, and access premium features.',
};

function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Sign Up - ConvertViral',
    'description': 'Create your ConvertViral account to start converting files, track your conversion history, and access premium features.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ConvertViral',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://convertviral.com/logo.svg'
      }
    },
    'potentialAction': {
      '@type': 'RegisterAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://convertviral.com/signup',
        'inLanguage': 'en',
        'name': 'Sign Up Form'
      },
      'result': {
        '@type': 'Thing',
        'name': 'Registration Success'
      }
    }
  };
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = generateJsonLd();

  return (
    <>
      <JsonLd data={jsonLdData} />
      {children}
    </>
  );
}