'use client';

import { useState } from 'react';
import {
  Search, SlidersHorizontal, MapPin, Star, Navigation,
  UtensilsCrossed, Hotel, Umbrella, Camera, Wine, ShoppingBag,
  Layers, LocateFixed,
} from 'lucide-react';
import { clsx } from 'clsx';

const categories = [
  { key: 'all', label: 'All', icon: MapPin },
  { key: 'food', label: 'Food', icon: UtensilsCrossed },
  { key: 'hotels', label: 'Hotels', icon: Hotel },
  { key: 'beaches', label: 'Beaches', icon: Umbrella },
  { key: 'attractions', label: 'Attractions', icon: Camera },
  { key: 'nightlife', label: 'Nightlife', icon: Wine },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag },
];

const nearbyPlaces = [
  { id: '1', name: 'Mum Aroi', category: 'Restaurant', distance: '350m', rating: 4.6, isOpen: true },
  { id: '2', name: 'Central Festival', category: 'Shopping', distance: '500m', rating: 4.5, isOpen: true },
  { id: '3', name: 'Hilton Pattaya', category: 'Hotel', distance: '520m', rating: 4.6, isOpen: true },
  { id: '4', name: 'Pattaya Beach', category: 'Beach', distance: '200m', rating: 3.8, isOpen: true },
];

export function MapView() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="relative h-[calc(100vh-4rem)] lg:h-screen flex flex-col">
      {/* Map area */}
      <div className="flex-1 relative bg-[#e8f4f8]">
        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Fake roads */}
        <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-white/80" />
        <div className="absolute top-0 bottom-0 left-[40%] w-[3px] bg-white/80" />
        <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-white/60" />
        <div className="absolute top-0 bottom-0 left-[70%] w-[2px] bg-white/60" />

        {/* Place markers */}
        <div className="absolute top-[25%] left-[35%] flex flex-col items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-primary shadow-lg flex items-center justify-center">
            <UtensilsCrossed size={14} className="text-white" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-white shadow text-[9px] font-medium text-text whitespace-nowrap">Mum Aroi</div>
        </div>
        <div className="absolute top-[40%] left-[55%] flex flex-col items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-cyan-500 shadow-lg flex items-center justify-center">
            <Hotel size={14} className="text-white" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-white shadow text-[9px] font-medium text-text whitespace-nowrap">Hilton</div>
        </div>
        <div className="absolute top-[55%] left-[25%] flex flex-col items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-sky-500 shadow-lg flex items-center justify-center">
            <Umbrella size={14} className="text-white" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-white shadow text-[9px] font-medium text-text whitespace-nowrap">Pattaya Beach</div>
        </div>
        <div className="absolute top-[35%] left-[65%] flex flex-col items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-pink-500 shadow-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-white shadow text-[9px] font-medium text-text whitespace-nowrap">Central Festival</div>
        </div>

        {/* User location */}
        <div className="absolute top-[45%] left-[45%]">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          <div className="w-12 h-12 rounded-full bg-blue-500/20 absolute -top-4 -left-4 animate-ping" />
        </div>

        {/* Search overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search this area..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button className="p-2.5 rounded-xl bg-white border border-border shadow-sm hover:bg-bg-elevated transition-colors">
              <SlidersHorizontal size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="absolute top-[4.5rem] left-4 right-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-colors flex-shrink-0',
                  activeCategory === key
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary border border-border'
                )}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Map controls */}
        <div className="absolute right-4 bottom-48 lg:bottom-8 flex flex-col gap-2">
          <button className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-bg-elevated transition-colors">
            <Layers size={16} className="text-text-secondary" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center hover:bg-bg-elevated transition-colors">
            <LocateFixed size={16} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Bottom sheet - Nearby */}
      <div className="absolute bottom-16 lg:bottom-0 left-0 right-0 bg-white rounded-t-2xl border-t border-border shadow-lg max-h-[40%] overflow-y-auto">
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        <div className="px-4 pb-4">
          <h3 className="text-sm font-semibold text-text mb-3">Nearby Places</h3>
          <div className="space-y-2">
            {nearbyPlaces.map((place) => (
              <div key={place.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-elevated transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text">{place.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-text-muted">{place.category}</span>
                    <div className="flex items-center gap-0.5">
                      <Star size={9} className="text-accent fill-accent" />
                      <span className="text-[10px] text-accent">{place.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Navigation size={10} />
                  {place.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
