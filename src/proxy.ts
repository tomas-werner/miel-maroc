import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/utils/translations';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the path is for admin or moderateur (no locale prefix)
  if (pathname.startsWith('/admin') || pathname.startsWith('/moderateur')) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin|moderateur).*)'],
};
