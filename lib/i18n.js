import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n-client';
import { getLanguageByCode } from '@/lib/languages';
import { DEFAULT_LANGUAGE, normalizeLocale } from '@/lib/i18n-settings';

export function detectBrowserLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const candidates = [
    ...(window.navigator.languages || []),
    window.navigator.language,
    window.navigator.userLanguage,
  ].filter(Boolean);

  for (const candidate of candidates) {
    return normalizeLocale(String(candidate).toLowerCase().split('-')[0]);
  }

  return DEFAULT_LANGUAGE;
}

export function translate(locale, key, params = {}) {
  return i18n.getFixedT(normalizeLocale(locale), 'common')(key, params);
}

export function useI18n() {
  const locale = normalizeLocale(useSelector((state) => state.quiz.selectedLang));
  const language = getLanguageByCode(locale);
  const { t, i18n: instance } = useTranslation('common');

  return useMemo(
    () => ({
      locale: language.code,
      language,
      i18n: instance,
      t: (key, params) => t(key, params),
    }),
    [instance, language, t],
  );
}
