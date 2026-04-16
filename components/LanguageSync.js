'use client';

import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEFAULT_LANGUAGE,
  buildLocalizedPath,
  extractLocaleFromPathname,
  isRtlLocale,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
} from '@/lib/i18n-settings';
import { detectBrowserLanguage } from '@/lib/i18n';
import i18n from '@/lib/i18n-client';
import { setSelectedLang } from '@/store/slices/quizSlice';

export default function LanguageSync({ initialLanguage = DEFAULT_LANGUAGE }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const hasHydrated = useRef(false);
  const lastUrlRef = useRef('');

  useEffect(() => {
    const localeFromPath = typeof window !== 'undefined'
      ? extractLocaleFromPathname(window.location.pathname)
      : null;
    const storedLanguage = Cookies.get(LOCALE_COOKIE_NAME);
    const nextLanguage = normalizeLocale(
      localeFromPath || storedLanguage || initialLanguage || detectBrowserLanguage(),
    );

    if (nextLanguage !== selectedLang) {
      dispatch(setSelectedLang(nextLanguage));
    }

    i18n.changeLanguage(nextLanguage);
    hasHydrated.current = true;
  }, [dispatch, initialLanguage, pathname]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    const normalizedLanguage = normalizeLocale(selectedLang);
    const rtl = isRtlLocale(normalizedLanguage);
    const search = searchParams?.toString();
    const nextPath = buildLocalizedPath(pathname || '/', normalizedLanguage);
    const nextUrl = `${nextPath}${search ? `?${search}` : ''}`;

    Cookies.set(LOCALE_COOKIE_NAME, normalizedLanguage, {
      expires: 365,
      sameSite: 'lax',
    });
    i18n.changeLanguage(normalizedLanguage);
    document.documentElement.lang = normalizedLanguage;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.body.dir = rtl ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', rtl);

    if (typeof window !== 'undefined') {
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (currentUrl !== nextUrl && lastUrlRef.current !== nextUrl) {
        lastUrlRef.current = nextUrl;
        router.replace(nextUrl);
        return;
      }
    }

    lastUrlRef.current = nextUrl;
  }, [pathname, router, searchParams, selectedLang]);

  return null;
}
