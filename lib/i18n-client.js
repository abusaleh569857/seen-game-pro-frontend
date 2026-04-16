'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arCommon from '@/public/locales/ar/common.json';
import enCommon from '@/public/locales/en/common.json';
import esCommon from '@/public/locales/es/common.json';
import frCommon from '@/public/locales/fr/common.json';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
} from '@/lib/i18n-settings';

const resources = {
  en: { common: enCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
  ar: { common: arCommon },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: LANGUAGES,
      lng: DEFAULT_LANGUAGE,
      resources,
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      load: 'languageOnly',
      initImmediate: false,
    });
}

export default i18n;
