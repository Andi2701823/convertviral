"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var fileTypes_1 = require("../lib/fileTypes");
/**
 * Generate dynamic sitemaps for conversion routes
 *
 * This script generates XML sitemaps for all possible conversion combinations
 * based on the file formats supported by the application.
 */
var SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com';
var PUBLIC_DIR = path_1.default.join(process.cwd(), 'public');
var SITEMAPS_DIR = path_1.default.join(PUBLIC_DIR, 'sitemaps');
// Ensure sitemaps directory exists
if (!fs_1.default.existsSync(SITEMAPS_DIR)) {
    fs_1.default.mkdirSync(SITEMAPS_DIR, { recursive: true });
}
// Generate conversion sitemap
function generateConversionSitemap() {
    var formatKeys = Object.keys(fileTypes_1.fileFormats);
    var conversionPairs = [];
    // Generate all possible conversion pairs
    formatKeys.forEach(function (fromFormat) {
        var fromCategory = fileTypes_1.fileFormats[fromFormat].category.id;
        formatKeys.forEach(function (toFormat) {
            // Skip if same format
            if (fromFormat === toFormat)
                return;
            // Only include conversions within the same category or specific cross-category conversions
            var toCategory = fileTypes_1.fileFormats[toFormat].category.id;
            if (fromCategory === toCategory || isValidCrossCategoryConversion(fromCategory, toCategory)) {
                conversionPairs.push("".concat(fromFormat, "-to-").concat(toFormat));
            }
        });
    });
    // Generate XML content
    var xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    conversionPairs.forEach(function (pair) {
        xmlContent += '  <url>\n';
        xmlContent += "    <loc>".concat(SITE_URL, "/convert/").concat(pair, "</loc>\n");
        xmlContent += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
        xmlContent += '    <changefreq>weekly</changefreq>\n';
        xmlContent += '    <priority>0.9</priority>\n';
        xmlContent += '  </url>\n';
    });
    xmlContent += '</urlset>';
    // Write to file
    fs_1.default.writeFileSync(path_1.default.join(SITEMAPS_DIR, 'conversion-sitemaps.xml'), xmlContent);
    console.log("Generated conversion sitemap with ".concat(conversionPairs.length, " URLs"));
}
// Generate format sitemap
function generateFormatSitemap() {
    var formatKeys = Object.keys(fileTypes_1.fileFormats);
    // Generate XML content
    var xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    formatKeys.forEach(function (format) {
        xmlContent += '  <url>\n';
        xmlContent += "    <loc>".concat(SITE_URL, "/formats/").concat(format, "</loc>\n");
        xmlContent += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
        xmlContent += '    <changefreq>monthly</changefreq>\n';
        xmlContent += '    <priority>0.8</priority>\n';
        xmlContent += '  </url>\n';
    });
    xmlContent += '</urlset>';
    // Write to file
    fs_1.default.writeFileSync(path_1.default.join(SITEMAPS_DIR, 'format-sitemaps.xml'), xmlContent);
    console.log("Generated format sitemap with ".concat(formatKeys.length, " URLs"));
}
// Helper function to determine if a cross-category conversion is valid
function isValidCrossCategoryConversion(fromCategory, toCategory) {
    var _a;
    // Define valid cross-category conversions
    var validCrossCategory = {
        'document': ['image'], // e.g., PDF to JPG
        'image': ['document'], // e.g., JPG to PDF
    };
    return ((_a = validCrossCategory[fromCategory]) === null || _a === void 0 ? void 0 : _a.includes(toCategory)) || false;
}
// Run the generators
generateConversionSitemap();
generateFormatSitemap();
