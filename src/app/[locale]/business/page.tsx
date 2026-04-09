import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Building2, Star, MapPin, Phone as PhoneIcon, Globe, Search } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const mockBusinesses = [
  { id: '1', name: 'Pattaya Legal Advisors', category: 'Legal', rating: 4.7, reviews: 89, address: 'Central Pattaya', phone: '+66 38 123 456', verified: true },
  { id: '2', name: 'Siam Construction Co.', category: 'Construction', rating: 4.3, reviews: 45, address: 'East Pattaya', phone: '+66 38 234 567', verified: true },
  { id: '3', name: 'Blue Ocean Diving', category: 'Tours & Activities', rating: 4.8, reviews: 230, address: 'South Pattaya', phone: '+66 38 345 678', verified: true },
  { id: '4', name: 'Thai Translation Service', category: 'Services', rating: 4.5, reviews: 67, address: 'North Pattaya', phone: '+66 38 456 789', verified: false },
  { id: '5', name: 'Pattaya Web Design', category: 'IT & Digital', rating: 4.6, reviews: 34, address: 'Jomtien', verified: true },
  { id: '6', name: 'Green Clean Laundry', category: 'Services', rating: 4.2, reviews: 120, address: 'Central Pattaya', phone: '+66 38 567 890', verified: false },
  { id: '7', name: 'Sunrise Real Estate', category: 'Property', rating: 4.4, reviews: 78, address: 'Pratumnak', phone: '+66 38 678 901', verified: true },
  { id: '8', name: 'Pattaya Pet Care', category: 'Pets', rating: 4.9, reviews: 156, address: 'South Pattaya', phone: '+66 38 789 012', verified: true },
];

export default async function BusinessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Business Directory</h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder="Search businesses..." className="w-full pl-9 pr-4 py-2.5 bg-bg-elevated border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'Legal', 'Construction', 'Tours', 'Services', 'IT', 'Property', 'Pets'].map((c, i) => (
          <button key={c} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${i === 0 ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-secondary'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {mockBusinesses.map((biz) => (
          <div key={biz.id} className="p-4 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text truncate">{biz.name}</h3>
                  {biz.verified && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-medium">Verified</span>}
                </div>
                <span className="text-[10px] text-primary font-medium">{biz.category}</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-accent fill-accent" />
                    <span className="text-[10px] font-medium text-accent">{biz.rating}</span>
                    <span className="text-[10px] text-text-muted">({biz.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={9} className="text-text-muted" />
                    <span className="text-[10px] text-text-muted">{biz.address}</span>
                  </div>
                </div>
                {biz.phone && (
                  <div className="flex items-center gap-1 mt-1">
                    <PhoneIcon size={9} className="text-text-muted" />
                    <span className="text-[10px] text-primary">{biz.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
