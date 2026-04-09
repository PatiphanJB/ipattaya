export const locales = ['th', 'en', 'zh', 'ko', 'ja'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'th';

export const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ko: '한국어',
  ja: '日本語',
};

export const localeFlags: Record<Locale, string> = {
  th: 'TH',
  en: 'EN',
  zh: 'CN',
  ko: 'KR',
  ja: 'JP',
};
