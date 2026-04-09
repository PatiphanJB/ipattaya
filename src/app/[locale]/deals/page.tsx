import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Tag, Clock, Star, Percent, Flame } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const mockDeals = [
  { id: '1', title: 'Hilton Pattaya - Ocean View Suite', business: 'Hilton Pattaya', discount: '-40%', original: 5200, deal: 3120, category: 'Hotel', expires: '3 days', hot: true, rating: 4.6 },
  { id: '2', title: 'Ramayana Water Park Day Pass', business: 'Ramayana Water Park', discount: '-25%', original: 1200, deal: 900, category: 'Activity', expires: '5 days', hot: true, rating: 4.6 },
  { id: '3', title: 'Thai Cooking Class + Market Tour', business: 'Pattaya Cooking Academy', discount: '-30%', original: 2500, deal: 1750, category: 'Experience', expires: '1 week', hot: false, rating: 4.8 },
  { id: '4', title: 'Spa Package - Full Body + Facial', business: 'Oasis Spa', discount: '-35%', original: 3500, deal: 2275, category: 'Wellness', expires: '4 days', hot: false, rating: 4.7 },
  { id: '5', title: 'Koh Larn Speedboat + Lunch', business: 'Pattaya Boat Tours', discount: '-20%', original: 1800, deal: 1440, category: 'Tour', expires: '2 weeks', hot: false, rating: 4.4 },
  { id: '6', title: 'Tiffany Show VIP Seats', business: 'Tiffany Show', discount: '-15%', original: 2000, deal: 1700, category: 'Entertainment', expires: '1 week', hot: true, rating: 4.6 },
  { id: '7', title: 'Scuba Diving Certification', business: 'Blue Ocean Diving', discount: '-20%', original: 12000, deal: 9600, category: 'Activity', expires: '2 weeks', hot: false, rating: 4.8 },
  { id: '8', title: 'Dusit Thani Weekend Package', business: 'Dusit Thani', discount: '-45%', original: 8500, deal: 4675, category: 'Hotel', expires: '5 days', hot: true, rating: 4.5 },
];

export default async function DealsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Special Deals</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'Hotels', 'Activities', 'Tours', 'Wellness', 'Food', 'Entertainment'].map((f, i) => (
          <button key={f} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Deals grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockDeals.map((deal) => (
          <div key={deal.id} className="rounded-xl bg-bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors">
            <div className="h-36 bg-gradient-to-br from-primary/15 to-accent/10 relative flex items-center justify-center">
              <Tag size={32} className="text-text-muted/20" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent text-xs font-bold text-white">
                {deal.discount}
              </span>
              {deal.hot && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-danger text-[10px] font-bold text-white flex items-center gap-0.5">
                  <Flame size={10} /> Hot Deal
                </span>
              )}
            </div>
            <div className="p-4">
              <span className="text-[10px] font-medium text-primary">{deal.category}</span>
              <h3 className="text-sm font-semibold text-text mt-0.5">{deal.title}</h3>
              <p className="text-[10px] text-text-muted mt-0.5">{deal.business}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star size={10} className="text-accent fill-accent" />
                <span className="text-[10px] font-medium text-accent">{deal.rating}</span>
                <div className="flex items-center gap-0.5 ml-auto">
                  <Clock size={10} className="text-text-muted" />
                  <span className="text-[10px] text-text-muted">Expires {deal.expires}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted line-through">{deal.original.toLocaleString()}</span>
                  <span className="text-lg font-bold text-accent">{deal.deal.toLocaleString()}</span>
                  <span className="text-[10px] text-text-muted">THB</span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
