#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MESSAGES_DIR = path.join(__dirname, '../messages');
const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'];

// Recursively extract all translation keys from an object
function extractKeys(obj: TranslationKeys, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Load translation file
function loadTranslations(locale: string): TranslationKeys {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Translation file not found: ${filePath}`);
    return {};
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error);
    return {};
  }
}

// Main function to find missing translations
function findMissingTranslations() {
  console.log('🔍 Checking for missing translations...\n');
  
  // Load all translations
  const allTranslations: Record<string, TranslationKeys> = {};
  const allKeys: Record<string, string[]> = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    allTranslations[locale] = loadTranslations(locale);
    allKeys[locale] = extractKeys(allTranslations[locale]);
  }
  
  // Get all unique keys across all locales
  const uniqueKeys = new Set<string>();
  Object.values(allKeys).forEach(keys => {
    keys.forEach(key => uniqueKeys.add(key));
  });
  
  console.log(`📊 Total unique translation keys: ${uniqueKeys.size}\n`);
  
  // Check for missing keys in each locale
  let hasErrors = false;
  
  for (const locale of SUPPORTED_LOCALES) {
    const localeKeys = new Set(allKeys[locale]);
    const missingKeys = Array.from(uniqueKeys).filter(key => !localeKeys.has(key));
    
    if (missingKeys.length > 0) {
      hasErrors = true;
      console.log(`❌ Missing translations in ${locale.toUpperCase()}:`);
      missingKeys.forEach(key => {
        console.log(`   - ${key}`);
      });
      console.log(`   Total missing: ${missingKeys.length}\n`);
    } else {
      console.log(`✅ ${locale.toUpperCase()}: All translations present`);
    }
  }
  
  // Show translation coverage statistics
  console.log('\n📈 Translation Coverage:');
  for (const locale of SUPPORTED_LOCALES) {
    const coverage = (allKeys[locale].length / uniqueKeys.size) * 100;
    const status = coverage === 100 ? '✅' : coverage >= 90 ? '⚠️' : '❌';
    console.log(`${status} ${locale.toUpperCase()}: ${coverage.toFixed(1)}% (${allKeys[locale].length}/${uniqueKeys.size})`);
  }
  
  if (!hasErrors) {
    console.log('\n🎉 All translations are complete!');
  } else {
    console.log('\n⚠️  Some translations are missing. Please add them to maintain consistency.');
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  findMissingTranslations();
}

export { findMissingTranslations };