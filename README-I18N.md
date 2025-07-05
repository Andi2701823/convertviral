# Internationalization (i18n) Management

This document describes the internationalization setup and management tools for ConvertViral.

## Supported Languages

ConvertViral supports 8 languages:
- 🇺🇸 English (en) - Default
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇵🇹 Portuguese (pt)
- 🇮🇹 Italian (it)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)

## Translation Files Structure

Translation files are located in the `messages/` directory:

```
messages/
├── en.json     # English (reference)
├── de.json     # German
├── es.json     # Spanish
├── fr.json     # French
├── pt.json     # Portuguese
├── it.json     # Italian
├── ja.json     # Japanese
├── ko.json     # Korean
└── cookies/    # Cookie consent translations
    ├── en.json
    └── de.json
```

### Translation Key Structure

Translations are organized by feature/namespace:

```json
{
  "common": {
    "convert": "Convert",
    "upload": "Upload",
    "download": "Download"
  },
  "homepage": {
    "hero_title": "Convert Anything, Share Everything!",
    "hero_subtitle": "Join {userCount} users who converted {fileCount} files"
  },
  "formats": {
    "pdf": "PDF Document",
    "jpg": "JPEG Image"
  },
  "gamification": {
    "level": "Level",
    "points": "Points",
    "achievements": "Achievements"
  }
}
```

## Usage in Components

### Basic Usage

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('homepage');
  
  return (
    <div>
      <h1>{t('hero_title')}</h1>
      <p>{t('hero_subtitle', { userCount: 1000, fileCount: 50000 })}</p>
    </div>
  );
}
```

### Navigation Links

```tsx
import { Link } from '../navigation';
import { useTranslations } from 'next-intl';

function Navigation() {
  const t = useTranslations('common');
  
  return (
    <nav>
      <Link href="/">{t('home')}</Link>
      <Link href="/convert">{t('convert')}</Link>
    </nav>
  );
}
```

### Language Switching

```tsx
import { useRouter, useLocale } from 'next-intl';

function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  
  const handleLanguageChange = async (newLocale: string) => {
    // Set locale cookie
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale })
    });
    
    // Refresh page to apply new locale
    window.location.reload();
  };
  
  return (
    <select value={locale} onChange={(e) => handleLanguageChange(e.target.value)}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      {/* ... other languages */}
    </select>
  );
}
```

## Management Scripts

We provide several npm scripts to help manage translations:

### 1. Check Missing Translations

```bash
npm run i18n:missing
```

This script:
- Compares all translation files
- Identifies missing keys in each language
- Shows translation coverage statistics
- Reports which keys are missing where

**Example Output:**
```
🔍 Checking for missing translations...

📊 Total unique translation keys: 465

❌ Missing translations in DE:
   - homepage.new_feature
   - footer.subscribe_button
   Total missing: 210

📈 Translation Coverage:
✅ EN: 100.0% (465/465)
⚠️ DE: 54.8% (255/465)
❌ ES: 48.2% (224/465)
```

### 2. Validate Translation Files

```bash
npm run i18n:validate
```

This script:
- Validates JSON syntax in all translation files
- Checks for empty translations
- Validates interpolation variable consistency
- Detects potential HTML injection issues
- Identifies possibly untranslated English text

**Example Output:**
```
🔍 Validating translation files...

📝 Validating EN...
✅ EN: Valid

📝 Validating DE...
❌ DE: Invalid
   - Empty translation: homepage.subtitle
   - Possibly untranslated English text: footer.blog = "Blog"

🔗 Validating interpolation consistency...
❌ Interpolation inconsistencies found:
   - DE: Missing interpolation variables in "homepage.hero_subtitle": userCount
```

### 3. Extract Translation Keys from Code

```bash
npm run i18n:extract
```

This script:
- Scans all TypeScript/JavaScript files
- Extracts translation keys used in code
- Identifies missing translations
- Finds potentially unused translation keys
- Shows usage statistics

**Example Output:**
```
🔍 Extracting translation keys from codebase...

📁 Scanning 156 files...

📊 Found 184 unique translation keys in codebase

❌ Missing translations found:

EN:
  - new_feature.title
  - new_feature.description
  Total: 2

📋 Translation key usage by file:
  components/Header.tsx: 8 keys
    - common.home
    - common.convert
    - common.tools

🔍 Checking for unused translations...

⚠️ Potentially unused translations found:

EN:
  - old_feature.title
  - deprecated.message
  Total: 15

💡 Note: Some keys might be used dynamically and not detected by static analysis.
```

### 4. Run All Checks

```bash
npm run i18n:check
```

Runs both validation and missing translation checks.

## Translation Workflow

### Adding New Translation Keys

1. **Add to English first** (reference language):
   ```json
   // messages/en.json
   {
     "new_feature": {
       "title": "New Feature",
       "description": "This is a new feature with {count} items"
     }
   }
   ```

2. **Use in your component**:
   ```tsx
   const t = useTranslations('new_feature');
   return <h1>{t('title')}</h1>;
   ```

3. **Check for missing translations**:
   ```bash
   npm run i18n:missing
   ```

4. **Add translations to other languages**:
   ```json
   // messages/de.json
   {
     "new_feature": {
       "title": "Neue Funktion",
       "description": "Dies ist eine neue Funktion mit {count} Elementen"
     }
   }
   ```

5. **Validate all translations**:
   ```bash
   npm run i18n:validate
   ```

### Best Practices

1. **Use descriptive key names**:
   ```json
   // ✅ Good
   "homepage.hero_title": "Convert Anything"
   
   // ❌ Bad
   "title1": "Convert Anything"
   ```

2. **Group related keys**:
   ```json
   {
     "auth": {
       "login": "Login",
       "logout": "Logout",
       "signup": "Sign Up"
     }
   }
   ```

3. **Use interpolation for dynamic content**:
   ```json
   {
     "welcome": "Welcome back, {username}!",
     "file_count": "You have {count, plural, =0 {no files} =1 {one file} other {# files}}"
   }
   ```

4. **Keep translations consistent**:
   - Use the same terminology across the app
   - Maintain consistent tone and style
   - Follow platform-specific conventions

5. **Test translations**:
   - Switch languages in development
   - Check for layout issues with longer text
   - Verify interpolation works correctly

## Configuration Files

### i18n.ts
Main internationalization configuration:
```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

### navigation.js
Navigation configuration:
```javascript
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'];
export const localePrefix = 'never';
export const defaultLocale = 'en';

export const { Link, redirect, usePathname, useRouter } = 
  createSharedPathnamesNavigation({ locales, localePrefix });
```

### middleware.ts
Handles locale detection and routing:
```typescript
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'never'
});
```

## Troubleshooting

### Common Issues

1. **Missing translation warnings**:
   - Run `npm run i18n:missing` to identify gaps
   - Add missing keys to translation files

2. **Interpolation errors**:
   - Run `npm run i18n:validate` to check consistency
   - Ensure all locales have the same interpolation variables

3. **Layout issues with translations**:
   - Test with longer languages (German, Spanish)
   - Use CSS that accommodates text expansion
   - Consider text truncation for space-constrained areas

4. **Dynamic translation keys not detected**:
   - The extraction script uses static analysis
   - Manually verify dynamic keys are translated
   - Consider using constants for dynamic keys

### Performance Considerations

1. **Bundle size**: Only the current locale's translations are loaded
2. **Caching**: Translation files are cached by Next.js
3. **Lazy loading**: Consider splitting large translation files by route

## Contributing Translations

When contributing new translations:

1. Follow the existing key structure
2. Maintain consistent terminology
3. Test your translations in the UI
4. Run validation scripts before submitting
5. Consider cultural context and local conventions

For questions about translations or i18n setup, please refer to the [next-intl documentation](https://next-intl-docs.vercel.app/).