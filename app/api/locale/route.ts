import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'];

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();
    
    if (!locale || !locales.includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      );
    }
    
    const response = NextResponse.json({ success: true, locale });
    
    // Set the locale cookie
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Error setting locale:', error);
    return NextResponse.json(
      { error: 'Failed to set locale' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const currentLocale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : 'en';
  
  return NextResponse.json({ locale: currentLocale });
}