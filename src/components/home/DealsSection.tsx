'use client';

import { useTranslations } from 'next-intl';
import { Percent, ChevronRight, Tag } from 'lucide-react';

type DealItem = {
  id: string;
  title: string;
  discount: string;
  originalPrice: number;
  dealPrice: number;
  category: string;
};

const mockDeals: DealItem[] = [
  { id: '1', title: 'Hilton Pattaya - Ocean View Suite', discount: '-40%', originalPrice: 5200, dealPrice: 3120, category: 'Hotel' },
  { id: '2', title: 'Ramayana Water Park Day Pass', discount: '-25%', originalPrice: 1200, dealPrice: 900, category: 'Activity' },
  { id: '3', title: 'Thai Cooking Class + Market Tour', discount: '-30%', originalPrice: 2500, dealPrice: 1750, category: 'Experience' },
];

export function DealsSection() {
  const t = useTranslations('sections');

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Percent size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-text">{t('deals')}</h2>
        </div>
        <button className="flex items-center gap-0.5 text-xs text-primary font-medium">
          {t('seeAll')}
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {mockDeals.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-52 snap-start rounded-xl overflow-hidden bg-bg-card border border-border"
          >
            <div className="h-28 bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center relative">
              <Tag size={24} className="text-text-muted" />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-[10px] font-bold text-bg">
                {item.discount}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[10px] text-primary font-medium">{item.category}</p>
              <h3 className="text-xs font-semibold text-text mt-0.5 line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-text-muted line-through">{item.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-bold text-accent">{item.dealPrice.toLocaleString()}</span>
                <span className="text-[10px] text-text-muted">THB</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
