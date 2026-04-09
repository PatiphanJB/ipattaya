import { setRequestLocale } from 'next-intl/server';
import { CategoryPage } from '@/components/category/CategoryPage';
import { mockAttractions, categoryFilters } from '@/data/mock-categories';

type Props = { params: Promise<{ locale: string }> };

export default async function AttractionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CategoryPage categoryKey="attractions" iconColor="text-emerald-400" items={mockAttractions} filters={categoryFilters.attractions} />;
}
