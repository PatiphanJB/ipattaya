import { setRequestLocale } from 'next-intl/server';
import { CategoryPage } from '@/components/category/CategoryPage';
import { mockHotels, categoryFilters } from '@/data/mock-categories';

type Props = { params: Promise<{ locale: string }> };

export default async function HotelsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CategoryPage categoryKey="hotels" iconColor="text-cyan-400" items={mockHotels} filters={categoryFilters.hotels} />;
}
