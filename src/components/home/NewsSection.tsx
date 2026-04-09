'use client';

import { useTranslations } from 'next-intl';
import { Newspaper, ChevronRight, Clock } from 'lucide-react';

type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
};

const mockNews: NewsItem[] = [
  { id: '1', title: 'Pattaya announces new beach cleanup initiative for 2026', source: 'Pattaya Mail', time: '2h' },
  { id: '2', title: 'Songkran festival preparations begin across Walking Street', source: 'The Pattaya News', time: '4h' },
  { id: '3', title: 'New ferry route connects Pattaya to Hua Hin starting May', source: 'Bangkok Post', time: '6h' },
];

export function NewsSection() {
  const t = useTranslations('sections');

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-text">{t('latestNews')}</h2>
        </div>
        <button className="flex items-center gap-0.5 text-xs text-primary font-medium">
          {t('seeAll')}
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2">
        {mockNews.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 p-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-text line-clamp-2 leading-relaxed">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-primary font-medium">{item.source}</span>
                <div className="flex items-center gap-0.5 text-[10px] text-text-muted">
                  <Clock size={9} />
                  {item.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
