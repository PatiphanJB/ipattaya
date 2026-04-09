import { setRequestLocale } from 'next-intl/server';
import { PlaceDetail } from '@/components/detail/PlaceDetail';
import { getPlaceBySlug, getAllPlaceSlugs } from '@/data/mock-places';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const slugs = getAllPlaceSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function PlacePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const place = getPlaceBySlug(slug);
  if (!place) notFound();

  return <PlaceDetail place={place} categoryKey="food" backHref="/" />;
}
