import {getRequestConfig} from 'next-intl/server';
import {locales} from '../i18n';
import {headers} from 'next/headers';

export default getRequestConfig(async ({locale}) => {
  // Try to get locale from headers first (set by middleware)
  const headersList = headers();
  const headerLocale = headersList.get('x-locale');
  
  // Use header locale if available and valid, otherwise use the provided locale
  const finalLocale = (headerLocale && locales.includes(headerLocale)) ? headerLocale : locale;
  
  // Validate that the final locale is valid
  if (!locales.includes(finalLocale as any)) {
    return {
      locale: 'en',
      messages: (await import(`../messages/en.json`)).default
    };
  }

  return {
    locale: finalLocale as string,
    messages: (await import(`../messages/${finalLocale}.json`)).default
  };
});