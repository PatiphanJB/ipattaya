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
    <div className="max-w-5xl mx-auto px-4 py-4 lg:py-8 space-y-5 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-text lg:hidden">iPattaya</h1>
          <h1 className="hidden lg:block text-2xl font-bold text-text">Welcome to Pattaya</h1>
          <p className="text-xs lg:text-sm text-text-muted mt-0.5">Your Pattaya, All in One</p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Search */}
      <SearchBar />

      {/* Desktop: 2-column layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5 lg:space-y-6">
          {/* Live Dashboard */}
          <LiveDashboard />

          {/* Trending */}
          <TrendingSection />

          {/* Deals */}
          <DealsSection />
        </div>

        {/* Sidebar on desktop */}
        <div className="space-y-5 lg:space-y-6 mt-5 lg:mt-0">
          {/* Services Grid */}
          <ServiceGrid />

          {/* News */}
          <NewsSection />
        </div>
      </div>
    </div>
  );
}
