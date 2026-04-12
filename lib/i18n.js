import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DEFAULT_LANGUAGE, getLanguageByCode, normalizeLanguageCode } from '@/lib/languages';
import { messages } from '@/lib/messages';
import { messageOverrides } from '@/lib/messages-extra';

function getValue(object, key) {
  return key.split('.').reduce((current, part) => current?.[part], object);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isObject(base)) {
    return isObject(override) ? { ...override } : base;
  }

  const result = { ...base };
  if (!isObject(override)) {
    return result;
  }

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = result[key];
    result[key] = isObject(baseValue) && isObject(overrideValue)
      ? deepMerge(baseValue, overrideValue)
      : overrideValue;
  }

  return result;
}

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
    const base = String(candidate).toLowerCase().split('-')[0];
    const normalized = normalizeLanguageCode(base);
    if (normalized === base) {
      return normalized;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function translate(locale, key, params = {}) {
  const normalized = normalizeLanguageCode(locale);
  const localeMessages = deepMerge(
    messages[normalized] || messages[DEFAULT_LANGUAGE] || {},
    messageOverrides[normalized] || {},
  );
  const fallbackMessages = messages.en || {};
  let template = getValue(localeMessages, key);

  if (template == null) {
    template = getValue(fallbackMessages, key) ?? key;
  }

  if (typeof template !== 'string') {
    return template;
  }

  return Object.entries(params).reduce((result, [paramKey, value]) => {
    return result.replaceAll(`{${paramKey}}`, String(value));
  }, template);
}

export function useI18n() {
  const locale = useSelector((state) => state.quiz.selectedLang);
  const language = getLanguageByCode(locale);

  return useMemo(
    () => ({
      locale: language.code,
      language,
      t: (key, params) => translate(language.code, key, params),
    }),
    [language],
  );
}
