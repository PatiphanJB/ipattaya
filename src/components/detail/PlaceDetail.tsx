'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Star, MapPin, Clock, Phone as PhoneIcon, Globe,
  Navigation, Bookmark, Share2, ChevronRight, Camera,
  MessageSquare, ThumbsUp,
} from 'lucide-react';
import { clsx } from 'clsx';

export type PlaceData = {
  id: string;
  name: string;
  nameLocal?: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  distance: string;
  isOpen: boolean;
  openHours: string;
  phone?: string;
  website?: string;
  priceRange?: string;
  tags: string[];
  photos: string[];
  reviews: ReviewData[];
  highlights: string[];
  coordinates?: { lat: number; lng: number };
};

export type ReviewData = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
};

type PlaceDetailProps = {
  place: PlaceData;
  categoryKey: string;
  backHref: string;
};

export function PlaceDetail({ place, categoryKey, backHref }: PlaceDetailProps) {
  const tc = useTranslations('common');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero image area */}
      <div className="relative h-56 lg:h-80 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera size={48} className="text-text-muted/30" />
        </div>
        {/* Back button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link href={backHref} className="p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
            <ArrowLeft size={20} className="text-text" />
          </Link>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
              <Bookmark size={20} className="text-text" />
            </button>
            <button className="p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
              <Share2 size={20} className="text-text" />
            </button>
          </div>
        </div>
        {/* Photo count */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs">
          <Camera size={12} />
          <span>{place.photos.length} {tc('photos')}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Title section */}
          <div className="py-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-text">{place.name}</h1>
                {place.nameLocal && (
                  <p className="text-sm text-text-muted mt-0.5">{place.nameLocal}</p>
                )}
              </div>
              {place.priceRange && (
                <span className="text-sm font-medium text-text-secondary bg-bg-elevated px-2 py-1 rounded-lg">
                  {place.priceRange}
                </span>
              )}
            </div>

            {/* Rating + tags */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-accent fill-accent" />
                <span className="text-sm font-semibold text-accent">{place.rating}</span>
                <span className="text-xs text-text-muted">({place.reviewCount} {tc('reviews')})</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} className={place.isOpen ? 'text-success' : 'text-danger'} />
                <span className={clsx('text-xs font-medium', place.isOpen ? 'text-success' : 'text-danger')}>
                  {place.isOpen ? tc('open') : tc('closed')}
                </span>
                <span className="text-xs text-text-muted">{place.openHours}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {place.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2 py-4 border-b border-border">
            {[
              { label: tc('call'), icon: PhoneIcon, color: 'text-success' },
              { label: tc('directions'), icon: Navigation, color: 'text-primary' },
              { label: tc('save'), icon: Bookmark, color: 'text-accent' },
              { label: tc('share'), icon: Share2, color: 'text-info' },
            ].map(({ label, icon: Icon, color }) => (
              <button key={label} className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-bg-elevated transition-colors">
                <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center">
                  <Icon size={18} className={color} />
                </div>
                <span className="text-[10px] font-medium text-text-secondary">{label}</span>
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text mb-2">About</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{place.longDescription}</p>
          </div>

          {/* Highlights */}
          {place.highlights.length > 0 && (
            <div className="py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text mb-3">Highlights</h2>
              <div className="grid grid-cols-2 gap-2">
                {place.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-xs text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text">{tc('reviews')} ({place.reviewCount})</h2>
              <button className="text-xs text-primary font-medium flex items-center gap-0.5">
                See All <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {place.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="p-3 rounded-xl bg-bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-text">{review.author}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={9} className={i < review.rating ? 'text-accent fill-accent' : 'text-border'} />
                        ))}
                        <span className="text-[10px] text-text-muted ml-1">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors">
                      <ThumbsUp size={10} /> {review.helpful}
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors">
                      <MessageSquare size={10} /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            {/* Info card */}
            <div className="p-4 rounded-xl bg-bg-card border border-border space-y-3">
              <h3 className="text-sm font-semibold text-text">Information</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-text-secondary">{place.address}</span>
                </div>
                {place.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon size={14} className="text-text-muted flex-shrink-0" />
                    <span className="text-xs text-primary">{place.phone}</span>
                  </div>
                )}
                {place.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-text-muted flex-shrink-0" />
                    <span className="text-xs text-primary truncate">{place.website}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-text-muted flex-shrink-0" />
                  <span className="text-xs text-text-secondary">{place.openHours}</span>
                </div>
              </div>
            </div>

            {/* Map preview placeholder */}
            <div className="h-48 rounded-xl bg-bg-elevated border border-border flex items-center justify-center">
              <div className="text-center">
                <MapPin size={24} className="text-text-muted mx-auto mb-1" />
                <span className="text-[10px] text-text-muted">{place.distance} away</span>
              </div>
            </div>

            {/* Book button */}
            <button className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
              {tc('book')}
            </button>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-border px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            {place.priceRange && <span className="text-xs text-text-muted">{place.priceRange}</span>}
            <div className="flex items-center gap-1">
              <Star size={12} className="text-accent fill-accent" />
              <span className="text-sm font-semibold">{place.rating}</span>
            </div>
          </div>
          <button className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
            {tc('book')}
          </button>
        </div>
      </div>
    </div>
  );
}
