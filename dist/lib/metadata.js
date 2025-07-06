"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteConfig = void 0;
exports.generateMetadata = generateMetadata;
exports.generateConversionMetadata = generateConversionMetadata;
exports.generateConversionStructuredData = generateConversionStructuredData;
// Base metadata for the site
exports.siteConfig = {
    name: 'ConvertViral',
    description: 'Convert any file format with our fast, free, and easy-to-use online file converter.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.netlify.app',
    ogImage: '/og-image.jpg',
    twitterImage: '/twitter-image.jpg',
    authors: [{ name: 'ConvertViral Team' }],
    creator: 'ConvertViral',
    publisher: 'ConvertViral',
};
// Function to generate metadata for a page
function generateMetadata({ title, description, path = '', noIndex = false, }) {
    const url = `${exports.siteConfig.url}${path}`;
    return {
        title,
        description,
        keywords: 'file conversion, convert pdf, convert image, convert video, convert audio',
        authors: exports.siteConfig.authors,
        creator: exports.siteConfig.creator,
        publisher: exports.siteConfig.publisher,
        metadataBase: new URL(exports.siteConfig.url),
        alternates: {
            canonical: url,
        },
        robots: noIndex ? 'noindex, nofollow' : 'index, follow',
        openGraph: {
            title,
            description,
            url,
            siteName: exports.siteConfig.name,
            images: [
                {
                    url: exports.siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [exports.siteConfig.twitterImage],
        },
    };
}
// Function to generate metadata for a conversion page
function generateConversionMetadata({ sourceFormat, targetFormat, }) {
    const title = `Convert ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} - ConvertViral`;
    const description = `Convert your ${sourceFormat.toUpperCase()} files to ${targetFormat.toUpperCase()} format online for free. Fast, easy, and secure file conversion.`;
    const path = `/convert/${sourceFormat}-to-${targetFormat}`;
    return generateMetadata({ title, description, path });
}
// Function to generate structured data for a conversion page
function generateConversionStructuredData({ sourceFormat, targetFormat, }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: `${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} Converter`,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1024',
        },
    };
}
