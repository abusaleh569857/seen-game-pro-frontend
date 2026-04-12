'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isRtlLanguage,
  normalizeLanguageCode,
} from '@/lib/languages';
import { detectBrowserLanguage } from '@/lib/i18n';
import { setSelectedLang } from '@/store/slices/quizSlice';

export default function LanguageSync() {
  const dispatch = useDispatch();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const nextLanguage = storedLanguage
      ? normalizeLanguageCode(storedLanguage)
      : detectBrowserLanguage();

    if (nextLanguage !== selectedLang) {
      dispatch(setSelectedLang(nextLanguage));
    }

    hasHydrated.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!hasHydrated.current) {
      return;
    }

    const normalizedLanguage = normalizeLanguageCode(selectedLang);
    const rtl = isRtlLanguage(normalizedLanguage);

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    document.documentElement.lang = normalizedLanguage;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.body.dir = rtl ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', rtl);
  }, [selectedLang]);

  return null;
}
