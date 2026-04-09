import { setRequestLocale } from 'next-intl/server';
import { CategoryPage } from '@/components/category/CategoryPage';
import { mockBeaches, categoryFilters } from '@/data/mock-categories';

type Props = { params: Promise<{ locale: string }> };

export default async function BeachesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CategoryPage categoryKey="beaches" iconColor="text-sky-400" items={mockBeaches} filters={categoryFilters.beaches} />;
}
