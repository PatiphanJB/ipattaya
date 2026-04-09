import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Star } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const mockProperties = [
  { id: '1', title: 'Luxury Condo at The Base', type: 'Condo', area: 'Central Pattaya', price: '3.2M', priceUnit: 'THB', beds: 1, baths: 1, sqm: 35, rating: 4.5, forRent: false },
  { id: '2', title: 'Beachfront Villa with Pool', type: 'Villa', area: 'Jomtien', price: '15.5M', priceUnit: 'THB', beds: 4, baths: 3, sqm: 280, rating: 4.8, forRent: false },
  { id: '3', title: 'Modern Studio for Rent', type: 'Condo', area: 'Pratumnak', price: '15K', priceUnit: 'THB/mo', beds: 0, baths: 1, sqm: 28, rating: 4.2, forRent: true },
  { id: '4', title: 'Family House in East Pattaya', type: 'House', area: 'East Pattaya', price: '6.8M', priceUnit: 'THB', beds: 3, baths: 2, sqm: 150, rating: 4.3, forRent: false },
  { id: '5', title: 'Sea View Penthouse', type: 'Condo', area: 'Wongamat', price: '28M', priceUnit: 'THB', beds: 3, baths: 3, sqm: 180, rating: 4.9, forRent: false },
  { id: '6', title: 'Cozy Apartment near Terminal 21', type: 'Condo', area: 'North Pattaya', price: '12K', priceUnit: 'THB/mo', beds: 1, baths: 1, sqm: 32, rating: 4.1, forRent: true },
];

export default async function PropertyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Property & Real Estate</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'For Sale', 'For Rent', 'Condo', 'Villa', 'House', 'Land'].map((f, i) => (
          <button key={f} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockProperties.map((p) => (
          <div key={p.id} className="rounded-xl bg-bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors">
            <div className="h-40 bg-gradient-to-br from-primary/15 to-accent/10 relative flex items-center justify-center">
              <MapPin size={32} className="text-text-muted/20" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-text">{p.type}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.forRent ? 'bg-accent/90 text-white' : 'bg-primary/90 text-white'}`}>
                  {p.forRent ? 'For Rent' : 'For Sale'}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-text">{p.title}</h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} className="text-text-muted" />
                <span className="text-[10px] text-text-muted">{p.area}</span>
                <Star size={10} className="text-accent fill-accent ml-2" />
                <span className="text-[10px] text-accent">{p.rating}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-text-secondary">
                {p.beds > 0 && <span className="flex items-center gap-1"><Bed size={11} />{p.beds}</span>}
                <span className="flex items-center gap-1"><Bath size={11} />{p.baths}</span>
                <span className="flex items-center gap-1"><Maximize size={11} />{p.sqm} sqm</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-base font-bold text-primary">{p.price} <span className="text-[10px] font-normal text-text-muted">{p.priceUnit}</span></span>
                <button className="text-[10px] px-3 py-1.5 rounded-lg bg-primary text-white font-medium">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
