import JsonLd from '@/components/JsonLd';

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Privacy Policy - ConvertViral',
    'description': 'Privacy Policy for ConvertViral file conversion platform. Learn how we collect, use, and protect your personal information.',
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
      'headline': 'Privacy Policy',
      'datePublished': '2024-06-15',
      'dateModified': '2024-06-15',
      'about': {
        '@type': 'Thing',
        'name': 'Privacy Policy',
        'description': 'Information about how ConvertViral collects, uses, and protects your personal information.'
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