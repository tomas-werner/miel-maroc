import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

export type Locale = 'fr' | 'ar';
export type TranslationKey = keyof typeof fr;

const translations = {
  fr,
  ar,
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  let translation = getTranslation(locale, key);

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{${param}}`, String(value));
    });
  }

  return translation;
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export const locales: Locale[] = ['fr', 'ar'];
export const defaultLocale: Locale = 'fr';
