import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import knTranslations from './locales/kn.json';
import mlTranslations from './locales/ml.json';
import mrTranslations from './locales/mr.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      kn: { translation: knTranslations },
      ml: { translation: mlTranslations },
      mr: { translation: mrTranslations },
      ta: { translation: taTranslations },
      te: { translation: teTranslations },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
