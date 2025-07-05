import JsonLd from '@/components/JsonLd';

function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Dashboard - ConvertViral',
    'description': 'View your conversion history, badges, and stats.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ConvertViral',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://convertviral.com/logo.svg'
      }
    },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://convertviral.com'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Dashboard',
          'item': 'https://convertviral.com/dashboard'
        }
      ]
    }
  };
}

export default function DashboardLayout({
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