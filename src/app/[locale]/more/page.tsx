import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  FileText, MessageCircle, TrendingUp, Building2,
  Users, Shield, HelpCircle, Info,
} from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const moreItems = [
  { label: 'Pattaya News', href: '/news', icon: FileText, color: 'text-primary' },
  { label: 'Community Forum', href: '/community', icon: MessageCircle, color: 'text-emerald-500' },
  { label: 'Property & Real Estate', href: '/property', icon: Building2, color: 'text-amber-500' },
  { label: 'Business Directory', href: '/business', icon: TrendingUp, color: 'text-purple-500' },
  { label: 'Civic & Government', href: '/civic', icon: Shield, color: 'text-blue-500' },
  { label: 'Expat Community', href: '/expats', icon: Users, color: 'text-rose-500' },
  { label: 'Help & FAQ', href: '/help', icon: HelpCircle, color: 'text-text-muted' },
  { label: 'About iPattaya', href: '/about', icon: Info, color: 'text-text-muted' },
];

export default async function MorePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-lg font-bold text-text mb-4">More</h1>
      <div className="space-y-1.5">
        {moreItems.map(({ label, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <Icon size={20} className={color} />
            <span className="text-sm font-medium text-text">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
