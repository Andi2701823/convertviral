#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const MESSAGES_DIR = path.join(PROJECT_ROOT, 'messages');
const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'];

// File extensions to scan
const SCAN_EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx'];

// Directories to exclude from scanning
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', 'uploads', '.git', 'prisma'];

// Extract translation keys from file content
function extractKeysFromContent(content: string, filePath: string): Set<string> {
  const keys = new Set<string>();
  
  // Patterns to match translation key usage
  const patterns = [
    // t('key') or t("key")
    /\bt\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    // t(`key`) - template literals
    /\bt\s*\(\s*`([^`]+)`\s*\)/g,
    // useTranslations().t('key')
    /\.t\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    // useTranslations().t(`key`)
    /\.t\s*\(\s*`([^`]+)`\s*\)/g,
    // getTranslations('namespace')
    /getTranslations\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    // useTranslations('namespace')
    /useTranslations\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      
      // Skip dynamic keys or variables
      if (!key.includes('${') && !key.includes('+') && key.length > 0) {
        keys.add(key);
      }
    }
  }
  
  return keys;
}

// Recursively scan directory for files
function scanDirectory(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_DIRS.includes(entry.name)) {
          files.push(...scanDirectory(fullPath));
        }
      } else if (entry.isFile()) {
        // Include files with target extensions
        const ext = path.extname(entry.name);
        if (SCAN_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan directory ${dir}:`, error);
  }
  
  return files;
}

// Load existing translations
function loadExistingTranslations(): Record<string, Set<string>> {
  const existing: Record<string, Set<string>> = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    existing[locale] = new Set();
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const translations = JSON.parse(content);
        
        // Extract all keys recursively
        const extractKeys = (obj: any, prefix = ''): void => {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null) {
              extractKeys(value, fullKey);
            } else {
              existing[locale].add(fullKey);
            }
          }
        };
        
        extractKeys(translations);
      } catch (error) {
        console.warn(`⚠️  Could not load ${filePath}:`, error);
      }
    }
  }
  
  return existing;
}

// Main extraction function
function extractTranslationKeys() {
  console.log('🔍 Extracting translation keys from codebase...\n');
  
  // Scan all relevant files
  const files = scanDirectory(PROJECT_ROOT);
  console.log(`📁 Scanning ${files.length} files...\n`);
  
  // Extract keys from all files
  const allUsedKeys = new Set<string>();
  const keysByFile: Record<string, Set<string>> = {};
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const keys = extractKeysFromContent(content, filePath);
      
      if (keys.size > 0) {
        const relativePath = path.relative(PROJECT_ROOT, filePath);
        keysByFile[relativePath] = keys;
        
        keys.forEach(key => allUsedKeys.add(key));
      }
    } catch (error) {
      console.warn(`⚠️  Could not read ${filePath}:`, error);
    }
  }
  
  console.log(`📊 Found ${allUsedKeys.size} unique translation keys in codebase\n`);
  
  // Load existing translations
  const existingTranslations = loadExistingTranslations();
  
  // Find missing keys
  const missingKeys: Record<string, string[]> = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    const existing = existingTranslations[locale];
    const missing = Array.from(allUsedKeys).filter(key => !existing.has(key));
    
    if (missing.length > 0) {
      missingKeys[locale] = missing;
    }
  }
  
  // Report results
  if (Object.keys(missingKeys).length > 0) {
    console.log('❌ Missing translations found:\n');
    
    for (const [locale, keys] of Object.entries(missingKeys)) {
      console.log(`${locale.toUpperCase()}:`);
      keys.forEach(key => console.log(`  - ${key}`));
      console.log(`  Total: ${keys.length}\n`);
    }
  } else {
    console.log('✅ All used translation keys are present in translation files\n');
  }
  
  // Show usage by file
  console.log('📋 Translation key usage by file:');
  for (const [filePath, keys] of Object.entries(keysByFile)) {
    console.log(`  ${filePath}: ${keys.size} keys`);
    if (keys.size <= 10) {
      Array.from(keys).forEach(key => console.log(`    - ${key}`));
    }
  }
  
  // Find unused translations (keys in translation files but not used in code)
  console.log('\n🔍 Checking for unused translations...');
  const unusedKeys: Record<string, string[]> = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    const existing = existingTranslations[locale];
    const unused = Array.from(existing).filter(key => !allUsedKeys.has(key));
    
    if (unused.length > 0) {
      unusedKeys[locale] = unused;
    }
  }
  
  if (Object.keys(unusedKeys).length > 0) {
    console.log('\n⚠️  Potentially unused translations found:');
    for (const [locale, keys] of Object.entries(unusedKeys)) {
      console.log(`\n${locale.toUpperCase()}:`);
      keys.forEach(key => console.log(`  - ${key}`));
      console.log(`  Total: ${keys.length}`);
    }
    console.log('\n💡 Note: Some keys might be used dynamically and not detected by static analysis.');
  } else {
    console.log('✅ No unused translations detected');
  }
  
  // Summary
  console.log('\n📈 Summary:');
  console.log(`  - Total keys used in code: ${allUsedKeys.size}`);
  console.log(`  - Files with translations: ${Object.keys(keysByFile).length}`);
  
  for (const locale of SUPPORTED_LOCALES) {
    const existing = existingTranslations[locale].size;
    const missing = missingKeys[locale]?.length || 0;
    const unused = unusedKeys[locale]?.length || 0;
    
    console.log(`  - ${locale.toUpperCase()}: ${existing} existing, ${missing} missing, ${unused} potentially unused`);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  extractTranslationKeys();
}

export { extractTranslationKeys };