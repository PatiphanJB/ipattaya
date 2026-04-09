import { setRequestLocale } from 'next-intl/server';
import { Bookmark } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export default async function SavedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Bookmark size={32} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold text-text mb-2">Saved Places</h1>
        <p className="text-sm text-text-muted max-w-sm">
          Save your favorite restaurants, hotels, and attractions to access them anytime.
        </p>
        <div className="mt-6 px-4 py-2 rounded-full bg-bg-elevated border border-border text-xs text-text-muted">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
