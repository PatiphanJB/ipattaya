import { setRequestLocale } from 'next-intl/server';
import { SearchBar } from '@/components/home/SearchBar';
import { LiveDashboard } from '@/components/home/LiveDashboard';
import { ServiceGrid } from '@/components/home/ServiceGrid';
import { TrendingSection } from '@/components/home/TrendingSection';
import { NewsSection } from '@/components/home/NewsSection';
import { DealsSection } from '@/components/home/DealsSection';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">iPattaya</h1>
          <p className="text-xs text-text-muted mt-0.5">Your Pattaya, All in One</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Search */}
      <SearchBar />

      {/* Live Dashboard */}
      <LiveDashboard />

      {/* Services Grid */}
      <ServiceGrid />

      {/* Trending */}
      <TrendingSection />

      {/* Deals */}
      <DealsSection />

      {/* News */}
      <NewsSection />
    </div>
  );
}
