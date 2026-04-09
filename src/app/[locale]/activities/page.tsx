import { setRequestLocale } from 'next-intl/server';
import { CategoryPage } from '@/components/category/CategoryPage';
import { mockActivities, categoryFilters } from '@/data/mock-categories';

type Props = { params: Promise<{ locale: string }> };

export default async function ActivitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CategoryPage categoryKey="activities" iconColor="text-lime-400" items={mockActivities} filters={categoryFilters.activities} />;
}
