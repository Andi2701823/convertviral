import JsonLd from '@/components/JsonLd';

function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Leaderboard - ConvertViral',
    'description': 'See who has the most points and conversions on ConvertViral.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ConvertViral',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://convertviral.com/logo.svg'
      }
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Daily Leaderboard',
          'description': 'Top users for today'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Weekly Leaderboard',
          'description': 'Top users for this week'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Monthly Leaderboard',
          'description': 'Top users for this month'
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': 'All-Time Leaderboard',
          'description': 'Top users of all time'
        }
      ]
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
          'name': 'Leaderboard',
          'item': 'https://convertviral.com/leaderboard'
        }
      ]
    }
  };
}

export default function LeaderboardLayout({
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