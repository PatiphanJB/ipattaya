'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SearchBar() {
  const t = useTranslations('home');

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        placeholder={t('search')}
        className="w-full pl-11 pr-4 py-3 bg-bg-elevated border border-border rounded-2xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
      />
    </div>
  );
}
