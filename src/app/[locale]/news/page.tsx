import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Clock, TrendingUp, Eye } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const mockNews = [
  { id: '1', title: 'Pattaya announces new beach cleanup initiative for 2026 season', category: 'City', source: 'Pattaya Mail', time: '2h ago', views: 1240, featured: true },
  { id: '2', title: 'Songkran festival preparations begin across Walking Street area', category: 'Events', source: 'The Pattaya News', time: '4h ago', views: 890 },
  { id: '3', title: 'New ferry route connects Pattaya to Hua Hin starting May 2026', category: 'Transport', source: 'Bangkok Post', time: '6h ago', views: 2100 },
  { id: '4', title: 'Central Pattaya Beach Road renovation project enters phase 2', category: 'Development', source: 'Pattaya City', time: '8h ago', views: 1560 },
  { id: '5', title: 'Local food vendors adapt to new hygiene regulations', category: 'Food', source: 'Pattaya Mail', time: '12h ago', views: 780 },
  { id: '6', title: 'Pattaya real estate market sees 15% growth in Q1 2026', category: 'Property', source: 'Property Guru', time: '1d ago', views: 3400 },
  { id: '7', title: 'Water safety campaign launched ahead of high season', category: 'Safety', source: 'Pattaya City', time: '1d ago', views: 650 },
  { id: '8', title: 'New international school opening in East Pattaya', category: 'Education', source: 'The Pattaya News', time: '2d ago', views: 1890 },
];

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featured = mockNews.find(n => n.featured);
  const regular = mockNews.filter(n => !n.featured);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Pattaya News</h1>
      </div>

      {/* Featured */}
      {featured && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
          <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Featured</span>
          <h2 className="text-lg font-bold text-text mt-2 leading-snug">{featured.title}</h2>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-primary font-medium">{featured.source}</span>
            <div className="flex items-center gap-1 text-xs text-text-muted"><Clock size={10} />{featured.time}</div>
            <div className="flex items-center gap-1 text-xs text-text-muted"><Eye size={10} />{featured.views.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'City', 'Events', 'Transport', 'Property', 'Food', 'Safety', 'Education'].map((cat, i) => (
          <button key={cat} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-secondary hover:border-primary/30'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="space-y-3">
        {regular.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0 flex items-center justify-center">
              <TrendingUp size={20} className="text-text-muted/30" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-medium text-primary">{item.category}</span>
              <h3 className="text-sm font-medium text-text mt-0.5 line-clamp-2 leading-snug">{item.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-text-muted">{item.source}</span>
                <div className="flex items-center gap-1 text-[10px] text-text-muted"><Clock size={9} />{item.time}</div>
                <div className="flex items-center gap-1 text-[10px] text-text-muted"><Eye size={9} />{item.views.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
