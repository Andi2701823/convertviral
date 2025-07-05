import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { Redis } from '@upstash/redis';

// Initialize Redis for edge rate limiting
let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.error('Failed to initialize Redis for edge middleware:', error);
}

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'never'
});

// Enhanced rate limiting function for edge middleware with plan-based limits
async function rateLimit(
  request: NextRequest,
  userPlan: 'free' | 'premium' | 'enterprise' = 'free',
  action: string = 'api'
): Promise<{ limited: boolean; remaining: number; resetTime: number; error?: string }> {
  if (!redis) return { limited: false, remaining: 100, resetTime: 0 };
  
  // Get client IP and user ID (if available)
  const ip = request.ip || 'unknown';
  const userId = request.cookies.get('userId')?.value || ip;
  
  // Determine rate limit based on user plan
  const limits = {
    free: { requests: 100, windowMs: 60000 }, // 100 per minute
    premium: { requests: 1000, windowMs: 60000 }, // 1000 per minute
    enterprise: { requests: 10000, windowMs: 60000 } // 10000 per minute
  };
  
  const { requests: maxRequests, windowMs } = limits[userPlan];
  const key = `edgeratelimit:${userPlan}:${userId}:${action}:${request.nextUrl.pathname}`;
  
  try {
    // Get current count and timestamp
    const currentData = await redis.get<string>(key);
    const now = Date.now();
    let currentCount = 0;
    let windowStart = now;
    
    if (currentData) {
      const [count, timestamp] = currentData.split(':').map(Number);
      currentCount = count;
      windowStart = timestamp;
      
      // Reset if window expired
      if (now - windowStart > windowMs) {
        currentCount = 0;
        windowStart = now;
      }
    }
    
    // Check if rate limit exceeded
    if (currentCount >= maxRequests) {
      const resetTime = windowStart + windowMs;
      return { 
        limited: true, 
        remaining: 0, 
        resetTime,
        error: 'Rate limit exceeded'
      };
    }
    
    // Increment count and update
    currentCount++;
    await redis.set(key, `${currentCount}:${windowStart}`, { ex: Math.ceil(windowMs / 1000) });
    
    return { 
      limited: false, 
      remaining: maxRequests - currentCount,
      resetTime: windowStart + windowMs
    };
  } catch (error) {
    console.error('Edge rate limiting error:', error);
    // Fail open for better user experience
    return { limited: false, remaining: maxRequests, resetTime: Date.now() + windowMs };
  }
}

function isGermanUser(request: NextRequest): boolean {
  // Check country from geo headers (prioritize this)
  const country = request.geo?.country || '';
  const isGermany = country.toLowerCase() === 'de' || country.toLowerCase() === 'at' || country.toLowerCase() === 'ch';
  
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLanguage = acceptLanguage.split(',')[0].trim().split('-')[0].toLowerCase();
  const prefersGerman = preferredLanguage === 'de';
  
  // Check if URL already indicates a language preference
  const pathname = request.nextUrl.pathname;
  const urlLocale = pathname.split('/')[1];
  const hasGermanUrlLocale = urlLocale === 'de';
  
  return isGermany || prefersGerman || hasGermanUrlLocale;
}

function isEUUser(request: NextRequest): boolean {
  const euCountries = ['at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se'];
  const country = request.geo?.country?.toLowerCase() || '';
  return euCountries.includes(country);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Common security headers for all responses
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  };

  // Handle locale-specific routes manually
  const locales = ['en', 'de', 'es', 'fr', 'pt', 'it', 'ja', 'ko'];
  const pathSegments = pathname.split('/');
  const firstSegment = pathSegments[1];
  
  if (locales.includes(firstSegment)) {
    // Extract the locale and the rest of the path
    const locale = firstSegment;
    const restOfPath = pathSegments.slice(2).join('/') || '';
    
    // Rewrite to the root path with locale in headers
    const url = request.nextUrl.clone();
    url.pathname = '/' + restOfPath;
    
    const response = NextResponse.rewrite(url);
    
    // Set the locale in headers for next-intl
    response.headers.set('x-locale', locale);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Set EU status for cookie consent
    response.headers.set('x-is-eu', isEUUser(request) ? 'true' : 'false');
    
    return response;
  }
  
  // For root routes without locale prefix, detect locale from cookie or headers
  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    // Get locale from cookie first
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    let detectedLocale = 'en'; // default
    
    if (cookieLocale && locales.includes(cookieLocale)) {
      detectedLocale = cookieLocale;
    } else {
      // Fallback to Accept-Language header
      const acceptLanguage = request.headers.get('accept-language') || '';
      const preferredLanguage = acceptLanguage.split(',')[0].trim().split('-')[0].toLowerCase();
      if (locales.includes(preferredLanguage)) {
        detectedLocale = preferredLanguage;
      }
    }
    
    const response = NextResponse.next();
    
    // Set the detected locale in headers for next-intl
    response.headers.set('x-locale', detectedLocale);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Set EU status for cookie consent
    response.headers.set('x-is-eu', isEUUser(request) ? 'true' : 'false');
    
    return response;
  }

  // Handle API routes
  if (pathname.startsWith('/api')) {
    // Determine user plan from cookies or session
    let userPlan: 'free' | 'premium' | 'enterprise' = 'free';
    
    // Check for premium cookie/header
    const isPremium = request.cookies.get('isPremium')?.value === 'true' || 
                     request.headers.get('x-user-premium') === 'true';
    
    // Check for enterprise cookie/header
    const isEnterprise = request.cookies.get('isEnterprise')?.value === 'true' || 
                        request.headers.get('x-user-enterprise') === 'true';
    
    if (isEnterprise) {
      userPlan = 'enterprise';
    } else if (isPremium) {
      userPlan = 'premium';
    }
    
    // Determine API action type from path
    let action = 'api';
    if (pathname.includes('/upload')) {
      action = 'upload';
    } else if (pathname.includes('/convert')) {
      action = 'convert';
    } else if (pathname.includes('/download')) {
      action = 'download';
    }
    
    // Apply rate limiting for API routes with plan-based limits
    const { limited, remaining, resetTime, error } = await rateLimit(request, userPlan, action);
    
    if (limited) {
      // Calculate retry-after in seconds
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      return new NextResponse(JSON.stringify({ 
        error: error || 'Too many requests',
        retryAfter,
        plan: userPlan
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': userPlan === 'free' ? '100' : userPlan === 'premium' ? '1000' : '10000',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
          'Retry-After': retryAfter.toString(),
        },
      });
    }
    
    // Continue with the request
    const response = NextResponse.next();
    
    // Add rate limit headers
    const rateLimit = userPlan === 'free' ? '100' : userPlan === 'premium' ? '1000' : '10000';
    response.headers.set('X-RateLimit-Limit', rateLimit);
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());
    
    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Set EU status for cookie consent
    response.headers.set('x-is-eu', isEUUser(request) ? 'true' : 'false');
    
    // Set user plan for downstream processing
    response.headers.set('x-user-plan', userPlan);

    if (request.method === 'OPTIONS') {
      const optionsResponse = new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
      return optionsResponse;
    }

    return response;
  }
  
  // For non-API routes, continue with normal processing
  const response = NextResponse.next();
  
  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Set EU status for cookie consent
  response.headers.set('x-is-eu', isEUUser(request) ? 'true' : 'false');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|.*\..*).*)',
    '/api/:path*'
  ],
};