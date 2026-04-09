import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/i18n/config';
import '../globals.css';
import { BottomNav } from '@/components/layout/BottomNav';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8fafc',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    metadataBase: new URL('https://ipattaya.com'),
    alternates: {
      canonical: `https://ipattaya.com/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `https://ipattaya.com/${l}`])
      ),
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      siteName: 'iPattaya',
      locale: locale === 'th' ? 'th_TH' : locale === 'zh' ? 'zh_CN' : locale === 'ko' ? 'ko_KR' : locale === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <NextIntlClientProvider messages={messages}>
          <main className="flex-1 pb-20 lg:pb-0 lg:pl-56">
            {children}
          </main>
          <BottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
