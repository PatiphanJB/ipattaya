'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Search, SlidersHorizontal, MapPin, Star, Clock,
  UtensilsCrossed, Hotel, Umbrella, Camera, Wine, Bus,
  Heart, CalendarDays, ShoppingBag, Bike, Home, Phone,
} from 'lucide-react';

const iconMap: Record<string, typeof UtensilsCrossed> = {
  food: UtensilsCrossed, hotels: Hotel, beaches: Umbrella, attractions: Camera,
  nightlife: Wine, transport: Bus, wellness: Heart, events: CalendarDays,
  shopping: ShoppingBag, activities: Bike, living: Home, emergency: Phone,
};

export type CategoryItem = {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  isOpen: boolean;
  tags: string[];
  priceRange?: string;
};

type CategoryPageProps = {
  categoryKey: string;
  iconColor: string;
  items: CategoryItem[];
  filters?: string[];
};

export function CategoryPage({ categoryKey, iconColor, items, filters }: CategoryPageProps) {
  const Icon = iconMap[categoryKey] || UtensilsCrossed;
  const t = useTranslations('services');
  const tc = useTranslations('common');
  const tf = useTranslations('category');

  return (
    <div className="max-w-lg mx-auto min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-bg/90 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
            <ArrowLeft size={20} className="text-text-secondary" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Icon size={20} className={iconColor} />
            <h1 className="text-base font-semibold text-text">{t(categoryKey)}</h1>
          </div>
          <span className="text-xs text-text-muted">{items.length} {tf('places')}</span>
        </div>

        {/* Search within category */}
        <div className="px-4 pb-3">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder={`${tf('searchIn')} ${t(categoryKey)}...`}
                className="w-full pl-9 pr-3 py-2 bg-bg-elevated border border-border rounded-xl text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <button className="p-2 rounded-xl bg-bg-elevated border border-border hover:border-primary/30 transition-colors">
              <SlidersHorizontal size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        {filters && filters.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
            <button className="flex-shrink-0 px-3 py-1 rounded-full bg-primary text-[11px] font-medium text-bg">
              {tf('all')}
            </button>
            {filters.map((filter) => (
              <button
                key={filter}
                className="flex-shrink-0 px-3 py-1 rounded-full bg-bg-elevated border border-border text-[11px] font-medium text-text-secondary hover:border-primary/30 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listing */}
      <div className="px-4 py-3 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 p-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors"
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex-shrink-0 flex items-center justify-center">
              <Icon size={24} className={`${iconColor} opacity-50`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-text truncate">{item.name}</h3>
                {item.priceRange && (
                  <span className="text-[10px] text-text-muted flex-shrink-0">{item.priceRange}</span>
                )}
              </div>
              <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{item.description}</p>

              {/* Rating + Location */}
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-accent fill-accent" />
                  <span className="text-[10px] font-medium text-accent">{item.rating}</span>
                  <span className="text-[10px] text-text-muted">({item.reviewCount})</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MapPin size={9} className="text-text-muted" />
                  <span className="text-[10px] text-text-muted">{item.distance}</span>
                </div>
              </div>

              {/* Tags + Status */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1">
                  <Clock size={9} className={item.isOpen ? 'text-success' : 'text-danger'} />
                  <span className={`text-[10px] font-medium ${item.isOpen ? 'text-success' : 'text-danger'}`}>
                    {item.isOpen ? tc('open') : tc('closed')}
                  </span>
                </div>
                {item.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-bg-elevated text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
