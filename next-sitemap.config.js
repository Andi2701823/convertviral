/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/dashboard/', '/settings/'] },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com'}/sitemaps/conversion-sitemaps.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com'}/sitemaps/format-sitemaps.xml`,
    ],
  },
  exclude: ['/api/*', '/dashboard/*', '/settings/*'],
  transform: async (config, path) => {
    // Custom priority based on path
    let priority = 0.7;
    
    if (path === '/') {
      priority = 1.0;
    } else if (path.startsWith('/convert')) {
      priority = 0.9;
    } else if (path.startsWith('/formats')) {
      priority = 0.8;
    }
    
    // Custom change frequency based on path
    let changefreq = 'monthly';
    
    if (path === '/' || path.startsWith('/convert')) {
      changefreq = 'weekly';
    } else if (path.startsWith('/blog')) {
      changefreq = 'daily';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};