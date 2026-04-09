import { setRequestLocale } from 'next-intl/server';
import { SavedPage as SavedView } from '@/components/saved/SavedView';

type Props = { params: Promise<{ locale: string }> };

export default async function SavedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SavedView />;
}
