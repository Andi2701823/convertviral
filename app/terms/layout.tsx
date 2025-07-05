import JsonLd from '@/components/JsonLd';

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Terms of Service - ConvertViral',
    'description': 'Terms of Service for ConvertViral file conversion platform. Read our terms and conditions for using our services.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ConvertViral',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://convertviral.com/logo.svg'
      }
    },
    'mainEntity': {
      '@type': 'WebContent',
      'headline': 'Terms of Service',
      'datePublished': '2023-06-01',
      'dateModified': '2023-06-01',
      'about': {
        '@type': 'Thing',
        'name': 'Terms and Conditions',
        'description': 'Legal terms and conditions for using the ConvertViral file conversion service.'
      }
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      {children}
    </>
  );
}