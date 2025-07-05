// Example usage of generated i18n types

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
  return `${namespace}.${String(key)}`;
}

// Usage:
const key1 = getTranslationKey('common', 'convert'); // ✅ Valid
// const key2 = getTranslationKey('common', 'invalid'); // ❌ TypeScript error
