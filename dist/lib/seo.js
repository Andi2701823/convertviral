"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteConfig = void 0;
exports.generateBaseMetadata = generateBaseMetadata;
exports.generateConversionMetadata = generateConversionMetadata;
exports.generateConversionStructuredData = generateConversionStructuredData;
exports.generateFAQStructuredData = generateFAQStructuredData;
exports.generateHowToStructuredData = generateHowToStructuredData;
exports.generateOrganizationStructuredData = generateOrganizationStructuredData;
exports.generateWebApplicationStructuredData = generateWebApplicationStructuredData;
var fileTypes_1 = require("./fileTypes");
// Site configuration
exports.siteConfig = {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'ConvertViral',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com',
    description: 'Free online file converter. Convert documents, images, audio, and video files with ease.',
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
    supportedLocales: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'en,es,fr,de,it,pt,ja,zh').split(','),
    twitterHandle: '@convertviral',
    logoUrl: 'https://convertviral.com/logo.png',
    ogImage: '/og-image.jpg',
    twitterImage: '/twitter-image.jpg',
    authors: [{ name: 'ConvertViral Team' }],
    creator: 'ConvertViral',
    publisher: 'ConvertViral',
};
// Generate base metadata for any page
function generateBaseMetadata(_a) {
    var title = _a.title, description = _a.description, _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.keywords, keywords = _c === void 0 ? [] : _c, _d = _a.noIndex, noIndex = _d === void 0 ? false : _d;
    var url = "".concat(exports.siteConfig.url).concat(path);
    var defaultKeywords = ['file conversion', 'convert pdf', 'convert image', 'convert audio', 'convert video', 'free converter'];
    var allKeywords = __spreadArray(__spreadArray([], defaultKeywords, true), keywords, true).join(', ');
    return {
        title: title,
        description: description,
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
            title: title,
            description: description,
            url: url,
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
            title: title,
            description: description,
            images: [exports.siteConfig.twitterImage],
        },
    };
}
// Generate metadata for a conversion page
function generateConversionMetadata(_a) {
    var _b, _c;
    var sourceFormat = _a.sourceFormat, targetFormat = _a.targetFormat;
    // Get format display names if available
    var sourceFormatName = ((_b = fileTypes_1.fileFormats[sourceFormat]) === null || _b === void 0 ? void 0 : _b.name) || sourceFormat.toUpperCase();
    var targetFormatName = ((_c = fileTypes_1.fileFormats[targetFormat]) === null || _c === void 0 ? void 0 : _c.name) || targetFormat.toUpperCase();
    var title = "Convert ".concat(sourceFormatName, " to ").concat(targetFormatName, " - Free Online Converter");
    var description = "Fast, secure, and free online ".concat(sourceFormatName, " to ").concat(targetFormatName, " conversion. No registration required. Convert your files instantly.");
    var path = "/convert/".concat(sourceFormat, "-to-").concat(targetFormat);
    var keywords = [
        "".concat(sourceFormat, " to ").concat(targetFormat),
        "convert ".concat(sourceFormat),
        "".concat(sourceFormat, " converter"),
        "".concat(targetFormat, " converter"),
        "online ".concat(sourceFormat, " to ").concat(targetFormat),
        "free ".concat(sourceFormat, " to ").concat(targetFormat),
    ];
    return generateBaseMetadata({ title: title, description: description, path: path, keywords: keywords });
}
// Generate structured data for a conversion page
function generateConversionStructuredData(_a) {
    var _b, _c;
    var sourceFormat = _a.sourceFormat, targetFormat = _a.targetFormat;
    // Get format display names if available
    var sourceFormatName = ((_b = fileTypes_1.fileFormats[sourceFormat]) === null || _b === void 0 ? void 0 : _b.name) || sourceFormat.toUpperCase();
    var targetFormatName = ((_c = fileTypes_1.fileFormats[targetFormat]) === null || _c === void 0 ? void 0 : _c.name) || targetFormat.toUpperCase();
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: "".concat(sourceFormatName, " to ").concat(targetFormatName, " Converter - ConvertViral"),
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
        mainEntity: faqs.map(function (faq) { return ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        }); }),
    };
}
// Generate HowTo structured data for conversion guides
function generateHowToStructuredData(_a) {
    var title = _a.title, description = _a.description, steps = _a.steps, _b = _a.totalTime, totalTime = _b === void 0 ? 'PT2M' : _b;
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: title,
        description: description,
        totalTime: totalTime,
        step: steps.map(function (step, index) { return ({
            '@type': 'HowToStep',
            url: "#step-".concat(index + 1),
            name: step.name,
            itemListElement: {
                '@type': 'HowToDirection',
                text: step.text,
            },
            image: step.image,
        }); }),
    };
}
// Generate Organization structured data
function generateOrganizationStructuredData() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ConvertViral',
        url: exports.siteConfig.url,
        logo: "".concat(exports.siteConfig.url, "/logo.svg"),
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
