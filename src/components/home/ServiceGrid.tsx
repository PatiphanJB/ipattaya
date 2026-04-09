'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  UtensilsCrossed, Hotel, Umbrella, Camera,
  Wine, Bus, Heart, CalendarDays,
  ShoppingBag, Bike, Home, Phone,
} from 'lucide-react';

const services = [
  { key: 'food', href: '/food', icon: UtensilsCrossed, color: 'text-orange-400' },
  { key: 'hotels', href: '/hotels', icon: Hotel, color: 'text-cyan-400' },
  { key: 'beaches', href: '/beaches', icon: Umbrella, color: 'text-sky-400' },
  { key: 'attractions', href: '/attractions', icon: Camera, color: 'text-emerald-400' },
  { key: 'nightlife', href: '/nightlife', icon: Wine, color: 'text-purple-400' },
  { key: 'transport', href: '/transport', icon: Bus, color: 'text-yellow-400' },
  { key: 'wellness', href: '/wellness', icon: Heart, color: 'text-rose-400' },
  { key: 'events', href: '/events', icon: CalendarDays, color: 'text-amber-400' },
  { key: 'shopping', href: '/shopping', icon: ShoppingBag, color: 'text-pink-400' },
  { key: 'activities', href: '/activities', icon: Bike, color: 'text-lime-400' },
  { key: 'living', href: '/living', icon: Home, color: 'text-teal-400' },
  { key: 'emergency', href: '/emergency', icon: Phone, color: 'text-red-400' },
] as const;

export function ServiceGrid() {
  const t = useTranslations('services');

  return (
    <div className="grid grid-cols-4 gap-3">
      {services.map(({ key, href, icon: Icon, color }) => (
        <Link
          key={key}
          href={href}
          className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-bg-elevated/50 hover:bg-bg-elevated border border-transparent hover:border-border transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center">
            <Icon size={20} className={color} />
          </div>
          <span className="text-[11px] font-medium text-text-secondary text-center leading-tight">
            {t(key)}
          </span>
        </Link>
      ))}
    </div>
  );
}
