import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Globe, Users, MapPin, Shield, Heart, TrendingUp } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">About iPattaya</h1>
      </div>

      {/* Hero */}
      <div className="text-center py-8 mb-6">
        <h2 className="text-3xl font-bold text-primary mb-2">iPattaya</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          The all-in-one platform for Pattaya. Everything you need — from real-time weather and tide information
          to restaurants, hotels, events, civic data, and community forums — all in one place.
        </p>
      </div>

      {/* Mission cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {[
          { title: 'For Everyone', desc: 'Tourists, expats, locals, and businesses — iPattaya serves the entire Pattaya ecosystem in 5 languages.', icon: Globe, color: 'text-primary' },
          { title: 'Transparent City', desc: 'We believe in civic transparency. Track municipal budgets, report problems, and participate in building a better Pattaya.', icon: Shield, color: 'text-emerald-500' },
          { title: 'Community First', desc: 'Built by the community, for the community. Share reviews, tips, and local knowledge.', icon: Heart, color: 'text-rose-500' },
        ].map(({ title, desc, icon: Icon, color }) => (
          <div key={title} className="p-5 rounded-2xl bg-bg-card border border-border text-center">
            <Icon size={28} className={`${color} mx-auto mb-3`} />
            <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { value: '520+', label: 'Features' },
          { value: '5', label: 'Languages' },
          { value: '46', label: 'Categories' },
          { value: '2,750+', label: 'SEO Keywords' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center p-3 rounded-xl bg-bg-elevated">
            <p className="text-xl font-bold text-primary">{value}</p>
            <p className="text-[10px] text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Version */}
      <div className="text-center py-4 border-t border-border">
        <p className="text-xs text-text-muted">iPattaya v1.0.0</p>
        <p className="text-[10px] text-text-muted mt-1">Made with love for Pattaya</p>
      </div>
    </div>
  );
}
