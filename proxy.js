import { NextResponse } from 'next/server';
import {
  buildLocalizedPath,
  DEFAULT_LANGUAGE,
  extractLocaleFromPathname,
  LANGUAGES,
  LOCALE_COOKIE_NAME,
  stripLocaleFromPathname,
} from '@/lib/i18n-settings';

const PUBLIC_FILE = /\.(.*)$/;

function detectPreferredLocale(request) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (LANGUAGES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const header = request.headers.get('accept-language') || '';
  const values = header
    .split(',')
    .map((entry) => entry.trim().split(';')[0]?.toLowerCase())
    .filter(Boolean);

  for (const value of values) {
    const base = value.split('-')[0];
    if (LANGUAGES.includes(base)) {
      return base;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/backend-api') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const localeFromPath = extractLocaleFromPathname(pathname);

  if (!localeFromPath) {
    const locale = detectPreferredLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = buildLocalizedPath(pathname, locale);

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = stripLocaleFromPathname(pathname);

  const response = NextResponse.rewrite(rewriteUrl);
  response.cookies.set(LOCALE_COOKIE_NAME, localeFromPath, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
