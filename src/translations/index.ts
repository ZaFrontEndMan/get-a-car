
import en from './en';
import ar from './ar';

export type SupportedLanguage = 'en' | 'ar';

export type TranslationKey = keyof typeof en;

export const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en,
  ar,
};
