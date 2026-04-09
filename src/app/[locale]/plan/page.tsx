import { setRequestLocale } from 'next-intl/server';
import { TripPlanner } from '@/components/plan/TripPlanner';

type Props = { params: Promise<{ locale: string }> };

export default async function PlanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TripPlanner />;
}
