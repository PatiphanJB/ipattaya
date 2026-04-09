import { setRequestLocale } from 'next-intl/server';
import { CategoryPage } from '@/components/category/CategoryPage';
import { mockLiving, categoryFilters } from '@/data/mock-categories';

type Props = { params: Promise<{ locale: string }> };

export default async function LivingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CategoryPage categoryKey="living" iconColor="text-teal-400" items={mockLiving} filters={categoryFilters.living} />;
}
