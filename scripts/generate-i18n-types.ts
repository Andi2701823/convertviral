#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

function generateTypeFromObject(obj: TranslationObject, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let result = '{\n';
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result += `${spaces}  '${key}': string;\n`;
    } else {
      result += `${spaces}  '${key}': ${generateTypeFromObject(value, indent + 1)};\n`;
    }
  }
  
  result += `${spaces}}`;
  return result;
}

function extractKeys(obj: TranslationObject, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      keys.push(fullKey);
    } else {
      keys.push(...extractKeys(value, fullKey));
    }
  }
  
  return keys;
}

function generateTranslationTypes(): void {
  try {
    const messagesDir = path.join(__dirname, '..', 'messages');
    const enFilePath = path.join(messagesDir, 'en.json');
    
    if (!fs.existsSync(enFilePath)) {
      console.error('❌ English translation file not found:', enFilePath);
      process.exit(1);
    }
    
    console.log('🔍 Reading English translations...');
    const enTranslations: TranslationObject = JSON.parse(
      fs.readFileSync(enFilePath, 'utf-8')
    );
    
    console.log('🏗️  Generating TypeScript types...');
    
    // Generate the main translation interface
    const translationType = generateTypeFromObject(enTranslations);
    
    // Extract all translation keys for union type
    const allKeys = extractKeys(enTranslations);
    const keysUnionType = allKeys.map(key => `'${key}'`).join(' | ');
    
    // Generate the complete type definition file
    const typeDefinition = `// This file is auto-generated. Do not edit manually.
// Run 'npm run i18n:types' to regenerate.

/**
 * Translation keys available in the application
 */
export type TranslationKey = ${keysUnionType};

/**
 * Structure of translation messages
 */
export interface Messages ${translationType}

/**
 * Namespaces available for useTranslations hook
 */
export type TranslationNamespace = ${Object.keys(enTranslations).map(key => `'${key}'`).join(' | ')};

/**
 * Type-safe translation function
 */
export interface TypedTranslations {
  (key: TranslationKey, values?: Record<string, any>): string;
}

/**
 * Utility type to get keys for a specific namespace
 */
export type NamespaceKeys<T extends TranslationNamespace> = 
  T extends keyof Messages ? keyof Messages[T] : never;

/**
 * Type for translation values (strings or nested objects)
 */
export type TranslationValue = string | { [key: string]: TranslationValue };

/**
 * Supported locales
 */
export type Locale = 'en' | 'de' | 'es' | 'fr' | 'pt' | 'it' | 'ja' | 'ko';

/**
 * Locale configuration
 */
export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

/**
 * Available locale configurations
 */
export const LOCALES: LocaleConfig[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', dir: 'ltr' }
];

/**
 * Default locale
 */
export const DEFAULT_LOCALE: Locale = 'en';
`;
    
    // Write the type definition file
    const outputPath = path.join(__dirname, '..', 'types', 'i18n.ts');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, typeDefinition);
    
    console.log('✅ TypeScript types generated successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`🔑 Generated ${allKeys.length} translation key types`);
    console.log(`📦 Generated ${Object.keys(enTranslations).length} namespace types`);
    
    // Generate usage examples
    const examplePath = path.join(__dirname, '..', 'types', 'i18n-examples.ts');
    const examples = `// Example usage of generated i18n types

import { useTranslations } from 'next-intl';
import type { TranslationNamespace, NamespaceKeys, Locale } from './i18n';

// ✅ Type-safe namespace usage
function ExampleComponent() {
  const t = useTranslations('common' satisfies TranslationNamespace);
  
  return (
    <div>
      {/* ✅ TypeScript will autocomplete and validate these keys */}
      <h1>{t('convert')}</h1>
      <p>{t('upload')}</p>
    </div>
  );
}

// ✅ Type-safe locale handling
function LanguageSwitcher() {
  const handleLocaleChange = (locale: Locale) => {
    // TypeScript ensures only valid locales are used
    console.log('Switching to:', locale);
  };
  
  return (
    <select onChange={(e) => handleLocaleChange(e.target.value as Locale)}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}

// ✅ Type-safe key extraction for specific namespace
type CommonKeys = NamespaceKeys<'common'>; // 'convert' | 'upload' | 'download' | ...
type HomepageKeys = NamespaceKeys<'homepage'>; // 'hero_title' | 'hero_subtitle' | ...

// ✅ Utility function with type safety
function getTranslationKey<T extends TranslationNamespace>(
  namespace: T,
  key: NamespaceKeys<T>
): string {
  return \`\${namespace}.\${String(key)}\`;
}

// Usage:
const key1 = getTranslationKey('common', 'convert'); // ✅ Valid
// const key2 = getTranslationKey('common', 'invalid'); // ❌ TypeScript error
`;
    
    fs.writeFileSync(examplePath, examples);
    console.log(`📝 Usage examples: ${examplePath}`);
    
  } catch (error) {
    console.error('❌ Error generating translation types:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTranslationTypes();
}

export { generateTranslationTypes };