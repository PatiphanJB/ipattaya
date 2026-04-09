import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, HelpCircle, ChevronRight, MessageCircle, Mail, Phone as PhoneIcon } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const faqs = [
  { q: 'How do I save a place to my favorites?', a: 'Tap the bookmark icon on any place detail page to save it. You can view all saved places in the "Saved" tab.' },
  { q: 'Can I use iPattaya offline?', a: 'Yes! iPattaya works offline for previously viewed content. Maps and real-time data require an internet connection.' },
  { q: 'How are ratings calculated?', a: 'Ratings are based on verified user reviews. We use a weighted average that considers recency and helpfulness.' },
  { q: 'Is iPattaya available in my language?', a: 'iPattaya supports Thai, English, Chinese, Korean, and Japanese. Switch languages using the globe icon.' },
  { q: 'How do I report incorrect information?', a: 'Use the "Report" button on any place detail page, or contact us directly through the support channels below.' },
  { q: 'Are the deals and prices accurate?', a: 'We update prices regularly, but recommend confirming directly with the business as prices may change.' },
];

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Help & FAQ</h1>
      </div>

      {/* FAQ */}
      <div className="space-y-2 mb-8">
        {faqs.map(({ q, a }, i) => (
          <details key={i} className="group rounded-xl bg-bg-card border border-border overflow-hidden">
            <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-bg-elevated/50 transition-colors">
              <HelpCircle size={16} className="text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-text flex-1">{q}</span>
              <ChevronRight size={14} className="text-text-muted group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-4 pb-4 pl-11">
              <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
            </div>
          </details>
        ))}
      </div>

      {/* Contact */}
      <h2 className="text-sm font-semibold text-text mb-3">Contact Support</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {[
          { label: 'Live Chat', desc: 'Chat with our team', icon: MessageCircle, color: 'text-primary' },
          { label: 'Email', desc: 'support@ipattaya.com', icon: Mail, color: 'text-emerald-500' },
          { label: 'Phone', desc: '+66 33 000 000', icon: PhoneIcon, color: 'text-amber-500' },
        ].map(({ label, desc, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-sm font-medium text-text">{label}</p>
              <p className="text-[10px] text-text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
