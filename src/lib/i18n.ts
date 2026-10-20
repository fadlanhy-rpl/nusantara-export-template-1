import { LocaleCode } from '@/types/export-config';

export const LOCALES: LocaleCode[] = ['en', 'ar', 'zh', 'id'];
export const DEFAULT_LOCALE: LocaleCode = 'en';

export const LOCALE_LABELS: Record<LocaleCode, { label: string; nativeName: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  ar: { label: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  zh: { label: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', dir: 'ltr' },
  id: { label: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
};

export function isRtl(locale: string): boolean {
  return locale === 'ar';
}

export function isValidLocale(locale: string): locale is LocaleCode {
  return LOCALES.includes(locale as LocaleCode);
}
