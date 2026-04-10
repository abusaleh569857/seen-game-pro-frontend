export const DEFAULT_LANGUAGE = 'ar';
export const RTL_LANGUAGES = ['ar'];
export const LANGUAGE_STORAGE_KEY = 'seen-game-pro-language';

export const SUPPORTED_LANGUAGES = [
  {
    code: 'ar',
    shortLabel: 'AR',
    nativeLabel: 'العربية',
    englishLabel: 'Arabic',
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/KW.svg',
    direction: 'rtl',
  },
  {
    code: 'en',
    shortLabel: 'EN',
    nativeLabel: 'English',
    englishLabel: 'English',
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg',
    direction: 'ltr',
  },
  {
    code: 'fr',
    shortLabel: 'FR',
    nativeLabel: 'Français',
    englishLabel: 'French',
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg',
    direction: 'ltr',
  },
  {
    code: 'es',
    shortLabel: 'ES',
    nativeLabel: 'Español',
    englishLabel: 'Spanish',
    flag: 'https://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg',
    direction: 'ltr',
  },
];

export function normalizeLanguageCode(language) {
  const code = String(language || DEFAULT_LANGUAGE).toLowerCase();
  return SUPPORTED_LANGUAGES.some((item) => item.code === code)
    ? code
    : DEFAULT_LANGUAGE;
}

export function getLanguageByCode(language) {
  const normalized = normalizeLanguageCode(language);
  return (
    SUPPORTED_LANGUAGES.find((item) => item.code === normalized) ||
    SUPPORTED_LANGUAGES[0]
  );
}

export function isRtlLanguage(language) {
  return RTL_LANGUAGES.includes(normalizeLanguageCode(language));
}

export function getLocalizedCategoryName(category, language) {
  if (!category) {
    return 'Quiz';
  }

  const normalized = normalizeLanguageCode(language);
  const fieldName = `name_${normalized}`;

  return (
    category[fieldName] ||
    category.name_en ||
    category.name_ar ||
    category.name_fr ||
    category.name_es ||
    'Quiz'
  );
}
