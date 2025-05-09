import { NextRequest, NextResponse } from "next/server";
import { auth0 } from '@/lib/auth0';

export async function middleware(request: NextRequest) {
  try {
    // First, let Auth0 handle any authentication-related middleware tasks
    const res = await auth0.middleware(request);
    
    // If Auth0 handled the request, return its response
    if (res) return res;
    
    // Otherwise, do our custom route protection
    const { pathname } = request.nextUrl;
    const protectedRoutes = ['/dashboard', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute) {
      // Use Auth0's middleware to verify the session
      try {
        // Get the session using Auth0
        const session = await auth0.getSession(request);
        
        // If there's no valid session, redirect to login
        if (!session) {
          return NextResponse.redirect(new URL('/api/auth/login', request.url));
        }
      } catch (error) {
        console.error('Auth middleware error:', error);
        // On any error, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/dashboard/:path*', 
    '/settings/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};