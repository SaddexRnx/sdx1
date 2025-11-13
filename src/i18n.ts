import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';
import arTranslation from './locales/ar/translation.json';
import frTranslation from './locales/fr/translation.json';
import esTranslation from './locales/es/translation.json';
import deTranslation from './locales/de/translation.json';
import jaTranslation from './locales/ja/translation.json';
import ptTranslation from './locales/pt/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      zh: { translation: zhTranslation },
      ar: { translation: arTranslation },
      fr: { translation: frTranslation },
      es: { translation: esTranslation },
      de: { translation: deTranslation },
      ja: { translation: jaTranslation },
      pt: { translation: ptTranslation },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
  });

export default i18n;
