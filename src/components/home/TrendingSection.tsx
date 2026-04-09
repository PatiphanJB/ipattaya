'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, ChevronRight, Star, MapPin } from 'lucide-react';

type TrendingItem = {
  id: string;
  title: string;
  category: string;
  rating: number;
  location: string;
  image: string;
};

const mockTrending: TrendingItem[] = [
  { id: '1', title: 'Walking Street', category: 'Nightlife', rating: 4.5, location: 'South Pattaya', image: '' },
  { id: '2', title: 'Sanctuary of Truth', category: 'Attraction', rating: 4.7, location: 'Naklua', image: '' },
  { id: '3', title: 'Jomtien Beach', category: 'Beach', rating: 4.3, location: 'Jomtien', image: '' },
  { id: '4', title: 'Terminal 21', category: 'Shopping', rating: 4.6, location: 'North Pattaya', image: '' },
];

export function TrendingSection() {
  const t = useTranslations('sections');

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-text">{t('trending')}</h2>
        </div>
        <button className="flex items-center gap-0.5 text-xs text-primary font-medium">
          {t('seeAll')}
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {mockTrending.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-36 snap-start rounded-xl overflow-hidden bg-bg-card border border-border"
          >
            <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <MapPin size={24} className="text-text-muted" />
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-semibold text-text truncate">{item.title}</h3>
              <p className="text-[10px] text-text-muted mt-0.5">{item.category}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={10} className="text-accent fill-accent" />
                <span className="text-[10px] font-medium text-accent">{item.rating}</span>
                <span className="text-[10px] text-text-muted ml-auto truncate">{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
