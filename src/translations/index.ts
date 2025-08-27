
import { enTranslations } from './en';
import { arTranslations } from './ar';

export type SupportedLanguage = 'en' | 'ar';

export type TranslationKey = keyof typeof enTranslations;

export const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  en: enTranslations,
  ar: arTranslations,
};
