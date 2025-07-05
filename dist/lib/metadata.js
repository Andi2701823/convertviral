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
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    ogImage: '/og-image.jpg',
    twitterImage: '/twitter-image.jpg',
    authors: [{ name: 'ConvertViral Team' }],
    creator: 'ConvertViral',
    publisher: 'ConvertViral',
};
// Function to generate metadata for a page
function generateMetadata(_a) {
    var title = _a.title, description = _a.description, _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.noIndex, noIndex = _c === void 0 ? false : _c;
    var url = "".concat(exports.siteConfig.url).concat(path);
    return {
        title: title,
        description: description,
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
// Function to generate metadata for a conversion page
function generateConversionMetadata(_a) {
    var sourceFormat = _a.sourceFormat, targetFormat = _a.targetFormat;
    var title = "Convert ".concat(sourceFormat.toUpperCase(), " to ").concat(targetFormat.toUpperCase(), " - ConvertViral");
    var description = "Convert your ".concat(sourceFormat.toUpperCase(), " files to ").concat(targetFormat.toUpperCase(), " format online for free. Fast, easy, and secure file conversion.");
    var path = "/convert/".concat(sourceFormat, "-to-").concat(targetFormat);
    return generateMetadata({ title: title, description: description, path: path });
}
// Function to generate structured data for a conversion page
function generateConversionStructuredData(_a) {
    var sourceFormat = _a.sourceFormat, targetFormat = _a.targetFormat;
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: "".concat(sourceFormat.toUpperCase(), " to ").concat(targetFormat.toUpperCase(), " Converter"),
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
