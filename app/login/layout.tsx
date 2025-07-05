import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Login - ConvertViral',
  description: 'Sign in to your ConvertViral account to access your file conversions, history, and account settings.',
};

function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Login - ConvertViral',
    'description': 'Sign in to your ConvertViral account to access your file conversions, history, and account settings.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ConvertViral',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://convertviral.com/logo.svg'
      }
    },
    'potentialAction': {
      '@type': 'LoginAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://convertviral.com/login',
        'inLanguage': 'en',
        'name': 'Login Form'
      },
      'result': {
        '@type': 'Thing',
        'name': 'Login Success'
      }
    }
  };
}

export default function LoginLayout({
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