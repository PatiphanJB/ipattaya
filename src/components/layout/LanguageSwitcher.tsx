'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, localeFlags, localeNames, Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-bg-elevated border border-border text-sm text-text-secondary hover:text-text transition-colors"
      >
        <Globe size={16} />
        <span className="font-medium">{localeFlags[locale]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in min-w-[140px]">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={clsx(
                  'w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors',
                  l === locale
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text'
                )}
              >
                <span className="font-mono text-xs w-5">{localeFlags[l]}</span>
                <span>{localeNames[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
