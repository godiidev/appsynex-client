import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/auth/sign-in', '/about', '/contact'];

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth/sign-in', '/auth/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get('appsynex_token')?.value;
  const isAuthenticated = !!token;

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    // Store the attempted URL to redirect after login
    const url = new URL('/auth/sign-in', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // For API routes, ensure proper authentication
  if (pathname.startsWith('/api/')) {
    if (!isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
