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

// Extract interpolation variables from a translation string
function extractInterpolationVars(text: string): string[] {
  const matches = text.match(/\{[^}]+\}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
}

// Recursively validate translation object
function validateTranslationObject(obj: any, path = '', locale: string): string[] {
  const errors: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      errors.push(...validateTranslationObject(value, currentPath, locale));
    } else if (typeof value === 'string') {
      // Check for common issues
      if (value.trim() === '') {
        errors.push(`Empty translation: ${currentPath}`);
      }
      
      // Check for untranslated English text in non-English locales
      if (locale !== 'en' && /^[A-Z][a-z\s]+$/.test(value) && value.split(' ').length <= 3) {
        // This is a simple heuristic - might need adjustment
        errors.push(`Possibly untranslated English text: ${currentPath} = "${value}"`);
      }
      
      // Check for HTML tags without proper escaping
      if (value.includes('<') && !value.includes('&lt;')) {
        errors.push(`Potential unescaped HTML: ${currentPath} = "${value}"`);
      }
    } else {
      errors.push(`Invalid translation type (${typeof value}): ${currentPath}`);
    }
  }
  
  return errors;
}

// Validate interpolation consistency across locales
function validateInterpolationConsistency(allTranslations: Record<string, TranslationKeys>) {
  const errors: string[] = [];
  
  // Get all translation keys from English (reference locale)
  const englishKeys = extractAllKeys(allTranslations.en);
  
  for (const key of englishKeys) {
    const englishValue = getValueByPath(allTranslations.en, key);
    
    if (typeof englishValue === 'string') {
      const englishVars = extractInterpolationVars(englishValue);
      
      for (const locale of SUPPORTED_LOCALES) {
        if (locale === 'en') continue;
        
        const localeValue = getValueByPath(allTranslations[locale], key);
        
        if (typeof localeValue === 'string') {
          const localeVars = extractInterpolationVars(localeValue);
          
          // Check if interpolation variables match
          const missingVars = englishVars.filter(v => !localeVars.includes(v));
          const extraVars = localeVars.filter(v => !englishVars.includes(v));
          
          if (missingVars.length > 0) {
            errors.push(`${locale.toUpperCase()}: Missing interpolation variables in "${key}": ${missingVars.join(', ')}`);
          }
          
          if (extraVars.length > 0) {
            errors.push(`${locale.toUpperCase()}: Extra interpolation variables in "${key}": ${extraVars.join(', ')}`);
          }
        }
      }
    }
  }
  
  return errors;
}

// Helper function to extract all keys from nested object
function extractAllKeys(obj: TranslationKeys, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Helper function to get value by dot notation path
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Load and validate translation file
function validateTranslationFile(locale: string): { valid: boolean; errors: string[] } {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const errors: string[] = [];
  
  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`Translation file not found: ${filePath}`] };
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);
    
    // Validate JSON structure
    errors.push(...validateTranslationObject(translations, '', locale));
    
    return { valid: errors.length === 0, errors };
  } catch (error) {
    return { valid: false, errors: [`JSON parsing error: ${error}`] };
  }
}

// Main validation function
function validateTranslations() {
  console.log('🔍 Validating translation files...\n');
  
  let hasErrors = false;
  const allTranslations: Record<string, TranslationKeys> = {};
  
  // Validate each translation file
  for (const locale of SUPPORTED_LOCALES) {
    console.log(`📝 Validating ${locale.toUpperCase()}...`);
    
    const { valid, errors } = validateTranslationFile(locale);
    
    if (valid) {
      console.log(`✅ ${locale.toUpperCase()}: Valid`);
      // Load for interpolation validation
      const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
      const content = fs.readFileSync(filePath, 'utf-8');
      allTranslations[locale] = JSON.parse(content);
    } else {
      hasErrors = true;
      console.log(`❌ ${locale.toUpperCase()}: Invalid`);
      errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('');
  }
  
  // Validate interpolation consistency
  if (Object.keys(allTranslations).length > 1) {
    console.log('🔗 Validating interpolation consistency...');
    const interpolationErrors = validateInterpolationConsistency(allTranslations);
    
    if (interpolationErrors.length > 0) {
      hasErrors = true;
      console.log('❌ Interpolation inconsistencies found:');
      interpolationErrors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ All interpolation variables are consistent');
    }
  }
  
  if (!hasErrors) {
    console.log('\n🎉 All translation files are valid!');
  } else {
    console.log('\n⚠️  Translation validation failed. Please fix the errors above.');
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  validateTranslations();
}

export { validateTranslations };