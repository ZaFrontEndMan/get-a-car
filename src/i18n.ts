import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import ar from './translations/ar';

const getInitialLanguage = (): 'en' | 'ar' => {
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'ar') return saved;
    const nav = navigator.language?.toLowerCase();
    if (nav?.startsWith('ar')) return 'ar';
  } catch (_) {}
  return 'en';
};

const setDocumentDirection = (lng: string) => {
  const lang = lng === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

const initialLanguage = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en as Record<string, string> },
      ar: { translation: ar as Record<string, string> },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  .then(() => setDocumentDirection(i18n.language));

i18n.on('languageChanged', (lng) => {
  try { localStorage.setItem('language', lng); } catch (_) {}
  setDocumentDirection(lng);
});

export default i18n;