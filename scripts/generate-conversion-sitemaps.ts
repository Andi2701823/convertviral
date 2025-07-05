import fs from 'fs';
import path from 'path';
import { fileFormats, FileFormat } from '../lib/fileTypes';

/**
 * Generate dynamic sitemaps for conversion routes
 * 
 * This script generates XML sitemaps for all possible conversion combinations
 * based on the file formats supported by the application.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://convertviral.com';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAPS_DIR = path.join(PUBLIC_DIR, 'sitemaps');

// Ensure sitemaps directory exists
if (!fs.existsSync(SITEMAPS_DIR)) {
  fs.mkdirSync(SITEMAPS_DIR, { recursive: true });
}

// Generate conversion sitemap
function generateConversionSitemap() {
  const formatKeys = Object.keys(fileFormats);
  const conversionPairs: string[] = [];
  
  // Generate all possible conversion pairs
  formatKeys.forEach(fromFormat => {
    const fromCategory = fileFormats[fromFormat].category.id;
    
    formatKeys.forEach(toFormat => {
      // Skip if same format
      if (fromFormat === toFormat) return;
      
      // Only include conversions within the same category or specific cross-category conversions
      const toCategory = fileFormats[toFormat].category.id;
      if (fromCategory === toCategory || isValidCrossCategoryConversion(fromCategory, toCategory)) {
        conversionPairs.push(`${fromFormat}-to-${toFormat}`);
      }
    });
  });
  
  // Generate XML content
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  conversionPairs.forEach(pair => {
    xmlContent += '  <url>\n';
    xmlContent += `    <loc>${SITE_URL}/convert/${pair}</loc>\n`;
    xmlContent += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
    xmlContent += '    <changefreq>weekly</changefreq>\n';
    xmlContent += '    <priority>0.9</priority>\n';
    xmlContent += '  </url>\n';
  });
  
  xmlContent += '</urlset>';
  
  // Write to file
  fs.writeFileSync(path.join(SITEMAPS_DIR, 'conversion-sitemaps.xml'), xmlContent);
  console.log(`Generated conversion sitemap with ${conversionPairs.length} URLs`);
}

// Generate format sitemap
function generateFormatSitemap() {
  const formatKeys = Object.keys(fileFormats);
  
  // Generate XML content
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  formatKeys.forEach(format => {
    xmlContent += '  <url>\n';
    xmlContent += `    <loc>${SITE_URL}/formats/${format}</loc>\n`;
    xmlContent += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
    xmlContent += '    <changefreq>monthly</changefreq>\n';
    xmlContent += '    <priority>0.8</priority>\n';
    xmlContent += '  </url>\n';
  });
  
  xmlContent += '</urlset>';
  
  // Write to file
  fs.writeFileSync(path.join(SITEMAPS_DIR, 'format-sitemaps.xml'), xmlContent);
  console.log(`Generated format sitemap with ${formatKeys.length} URLs`);
}

// Helper function to determine if a cross-category conversion is valid
function isValidCrossCategoryConversion(fromCategory: string, toCategory: string): boolean {
  // Define valid cross-category conversions
  const validCrossCategory: Record<string, string[]> = {
    'document': ['image'], // e.g., PDF to JPG
    'image': ['document'],  // e.g., JPG to PDF
  };
  
  return validCrossCategory[fromCategory]?.includes(toCategory) || false;
}

// Run the generators
generateConversionSitemap();
generateFormatSitemap();