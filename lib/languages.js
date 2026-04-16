export const DEFAULT_LANGUAGE = 'en';
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

const CATEGORY_NAME_FALLBACKS = {
  ar: {
    Sports: 'رياضة',
    History: 'تاريخ',
    Science: 'علوم',
    Geography: 'جغرافيا',
    Culture: 'ثقافة',
    Arts: 'فنون',
    Entertainment: 'ترفيه',
    Nature: 'طبيعة',
    Technology: 'تقنية',
    Food: 'طعام',
    Cars: 'سيارات',
    Business: 'أعمال',
    Games: 'ألعاب',
    Music: 'موسيقى',
    General: 'عام',
  },
  fr: {
    Sports: 'Sports',
    History: 'Histoire',
    Science: 'Science',
    Geography: 'Geographie',
    Culture: 'Culture',
    Arts: 'Arts',
    Entertainment: 'Divertissement',
    Nature: 'Nature',
    Technology: 'Technologie',
    Food: 'Cuisine',
    Cars: 'Voitures',
    Business: 'Business',
    Games: 'Jeux',
    Music: 'Musique',
    General: 'General',
  },
  es: {
    Sports: 'Deportes',
    History: 'Historia',
    Science: 'Ciencia',
    Geography: 'Geografia',
    Culture: 'Cultura',
    Arts: 'Artes',
    Entertainment: 'Entretenimiento',
    Nature: 'Naturaleza',
    Technology: 'Tecnologia',
    Food: 'Comida',
    Cars: 'Coches',
    Business: 'Negocios',
    Games: 'Juegos',
    Music: 'Musica',
    General: 'General',
  },
};

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
  const rawLocalized = category[fieldName];
  const hasArabicScript = (value) =>
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      String(value || ''),
    );
  const cleanedLocalized = String(rawLocalized || '').trim();
  const englishName = category.name_en || '';
  const fallbackName = CATEGORY_NAME_FALLBACKS[normalized]?.[englishName];
  const isSameAsEnglish =
    cleanedLocalized &&
    englishName &&
    cleanedLocalized.toLowerCase() === String(englishName).trim().toLowerCase();
  const hasWrongScript = normalized !== 'ar' && hasArabicScript(cleanedLocalized);

  if (normalized === 'fr' || normalized === 'es') {
    if (!cleanedLocalized || hasWrongScript || isSameAsEnglish) {
      return (
        fallbackName ||
        englishName ||
        category.name_ar ||
        category.name_fr ||
        category.name_es ||
        'Quiz'
      );
    }

    return cleanedLocalized;
  }

  return (
    (hasWrongScript ? '' : cleanedLocalized) ||
    fallbackName ||
    englishName ||
    category.name_ar ||
    category.name_fr ||
    category.name_es ||
    'Quiz'
  );
}
