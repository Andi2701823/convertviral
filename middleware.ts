import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
];

// List of paths that should redirect to dashboard if user is already authenticated
const authPaths = [
  '/login',
  '/signup',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected or an auth path
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  // If neither protected nor auth path, continue
  if (!isProtectedPath && !isAuthPath) {
    return NextResponse.next();
  }
  
  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect to login if accessing protected path without token
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if accessing auth path with token
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (except auth-related ones)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     */
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};