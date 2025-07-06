import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const response = createIntlMiddleware({
    locales: ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'],
    defaultLocale: 'en',
    localePrefix: 'never'
  })(request);

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
};