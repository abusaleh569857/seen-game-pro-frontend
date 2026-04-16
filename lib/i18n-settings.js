export const LANGUAGES = ['en', 'fr', 'es', 'ar'];
export const DEFAULT_LANGUAGE = 'en';
export const RTL_LANGUAGES = ['ar'];
export const LOCALE_COOKIE_NAME = 'seen-game-pro-language';

export function normalizeLocale(locale) {
  const value = String(locale || DEFAULT_LANGUAGE).toLowerCase();
  return LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
}

export function isRtlLocale(locale) {
  return RTL_LANGUAGES.includes(normalizeLocale(locale));
}

export function extractLocaleFromPathname(pathname = '/') {
  const firstSegment = pathname.split('/')[1];
  return LANGUAGES.includes(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPathname(pathname = '/') {
  const locale = extractLocaleFromPathname(pathname);

  if (!locale) {
    return pathname || '/';
  }

  const stripped = pathname.slice(locale.length + 1) || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function buildLocalizedPath(pathname = '/', locale = DEFAULT_LANGUAGE) {
  const normalizedLocale = normalizeLocale(locale);
  const cleanPath = stripLocaleFromPathname(pathname);

  if (cleanPath === '/') {
    return `/${normalizedLocale}`;
  }

  return `/${normalizedLocale}${cleanPath}`;
}
