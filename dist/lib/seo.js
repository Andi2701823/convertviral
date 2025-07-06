"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteConfig = void 0;
exports.generateBaseMetadata = generateBaseMetadata;
exports.generateConversionMetadata = generateConversionMetadata;
exports.generateConversionStructuredData = generateConversionStructuredData;
exports.generateFAQStructuredData = generateFAQStructuredData;
exports.generateHowToStructuredData = generateHowToStructuredData;
exports.generateOrganizationStructuredData = generateOrganizationStructuredData;
exports.generateWebApplicationStructuredData = generateWebApplicationStructuredData;
const fileTypes_1 = require("./fileTypes");
// Site configuration
exports.siteConfig = {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'ConvertViral',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.netlify.app',
    description: 'Free online file converter. Convert documents, images, audio, and video files with ease.',
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
    supportedLocales: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'en,es,fr,de,it,pt,ja,zh').split(','),
    twitterHandle: '@convertviral',
    logoUrl: 'https://convertviral.netlify.app/logo.png',
    ogImage: '/og-image.jpg',
    twitterImage: '/twitter-image.jpg',
    authors: [{ name: 'ConvertViral Team' }],
    creator: 'ConvertViral',
    publisher: 'ConvertViral',
};
// Generate base metadata for any page
function generateBaseMetadata({ title, description, path = '', keywords = [], noIndex = false, }) {
    const url = `${exports.siteConfig.url}${path}`;
    const defaultKeywords = ['file conversion', 'convert pdf', 'convert image', 'convert audio', 'convert video', 'free converter'];
    const allKeywords = [...defaultKeywords, ...keywords].join(', ');
    return {
        title,
        description,
        keywords: allKeywords,
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
// Generate metadata for a conversion page
function generateConversionMetadata({ sourceFormat, targetFormat, }) {
    // Get format display names if available
    const sourceFormatName = fileTypes_1.fileFormats[sourceFormat]?.name || sourceFormat.toUpperCase();
    const targetFormatName = fileTypes_1.fileFormats[targetFormat]?.name || targetFormat.toUpperCase();
    const title = `Convert ${sourceFormatName} to ${targetFormatName} - Free Online Converter`;
    const description = `Fast, secure, and free online ${sourceFormatName} to ${targetFormatName} conversion. No registration required. Convert your files instantly.`;
    const path = `/convert/${sourceFormat}-to-${targetFormat}`;
    const keywords = [
        `${sourceFormat} to ${targetFormat}`,
        `convert ${sourceFormat}`,
        `${sourceFormat} converter`,
        `${targetFormat} converter`,
        `online ${sourceFormat} to ${targetFormat}`,
        `free ${sourceFormat} to ${targetFormat}`,
    ];
    return generateBaseMetadata({ title, description, path, keywords });
}
// Generate structured data for a conversion page
function generateConversionStructuredData({ sourceFormat, targetFormat, }) {
    // Get format display names if available
    const sourceFormatName = fileTypes_1.fileFormats[sourceFormat]?.name || sourceFormat.toUpperCase();
    const targetFormatName = fileTypes_1.fileFormats[targetFormat]?.name || targetFormat.toUpperCase();
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: `${sourceFormatName} to ${targetFormatName} Converter - ConvertViral`,
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
// Generate FAQ structured data
function generateFAQStructuredData(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
// Generate HowTo structured data for conversion guides
function generateHowToStructuredData({ title, description, steps, totalTime = 'PT2M', }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: title,
        description: description,
        totalTime: totalTime,
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            url: `#step-${index + 1}`,
            name: step.name,
            itemListElement: {
                '@type': 'HowToDirection',
                text: step.text,
            },
            image: step.image,
        })),
    };
}
// Generate Organization structured data
function generateOrganizationStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ConvertViral',
        url: exports.siteConfig.url,
        logo: `${exports.siteConfig.url}/logo.svg`,
        sameAs: [
            'https://twitter.com/convertviral',
            'https://facebook.com/convertviral',
            'https://instagram.com/convertviral',
            'https://linkedin.com/company/convertviral',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '',
            contactType: 'customer service',
            email: 'support@convertviral.com',
            availableLanguage: ['English'],
        },
    };
}
// Generate WebApplication structured data
function generateWebApplicationStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ConvertViral',
        applicationCategory: 'UtilitiesApplication',
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
