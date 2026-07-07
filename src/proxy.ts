import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const authPages = ['/login', '/register', '/forgot-password'];

const protectedRoutes = ['/dashboard', '/profile', '/settings'];

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const pathname = req.nextUrl.pathname.replace(/^\/(en|ar)/, '');

  const isAuthPage = authPages.some((route) => pathname.startsWith(route));

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url);

    loginUrl.searchParams.set(
      'returnUrl',
      req.nextUrl.pathname + req.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
