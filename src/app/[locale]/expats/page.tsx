import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Users, FileText, MessageCircle, Globe, Shield, Heart, BookOpen, Briefcase } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const guides = [
  { title: 'Visa & Immigration Guide', description: 'Types of visas, extensions, and requirements', icon: FileText, color: 'text-primary' },
  { title: 'Cost of Living Calculator', description: 'Monthly expenses breakdown for expats', icon: Briefcase, color: 'text-emerald-500' },
  { title: 'Healthcare & Insurance', description: 'Hospitals, clinics, and health insurance options', icon: Heart, color: 'text-rose-500' },
  { title: 'Housing Guide', description: 'Best areas, rental tips, and property buying', icon: BookOpen, color: 'text-amber-500' },
  { title: 'Legal & Tax Advice', description: 'Work permits, taxes, and legal matters', icon: Shield, color: 'text-purple-500' },
  { title: 'Language & Culture', description: 'Basic Thai, cultural etiquette, and tips', icon: Globe, color: 'text-sky-500' },
];

const groups = [
  { name: 'Pattaya Expats Club', members: 4200, description: 'General community for all expats', active: true },
  { name: 'Digital Nomads Pattaya', members: 1800, description: 'Remote workers and freelancers', active: true },
  { name: 'Pattaya Families', members: 960, description: 'Families with kids, schools, activities', active: true },
  { name: 'Retirees Thailand', members: 2300, description: 'Retirement visa, lifestyle, healthcare', active: false },
  { name: 'Business Networking', members: 780, description: 'Entrepreneurs and business owners', active: true },
];

export default async function ExpatsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="text-lg font-bold text-text">Expat Community</h1>
      </div>

      {/* Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 mb-6">
        <h2 className="text-base font-bold text-text">Welcome to Pattaya</h2>
        <p className="text-sm text-text-secondary mt-1">Everything you need to know about living, working, and thriving in Pattaya as an expatriate.</p>
        <div className="flex gap-3 mt-3">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">15K+</p>
            <p className="text-[10px] text-text-muted">Expat Members</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">50+</p>
            <p className="text-[10px] text-text-muted">Countries</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">6</p>
            <p className="text-[10px] text-text-muted">Guides</p>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Guides */}
        <div>
          <h2 className="text-sm font-semibold text-text mb-3">Essential Guides</h2>
          <div className="space-y-2">
            {guides.map(({ title, description, icon: Icon, color }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className={color} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-text">{title}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Groups */}
        <div>
          <h2 className="text-sm font-semibold text-text mb-3">Community Groups</h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.name} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text truncate">{group.name}</h3>
                    {group.active && <span className="w-1.5 h-1.5 rounded-full bg-success" />}
                  </div>
                  <p className="text-[10px] text-text-muted">{group.description}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{group.members.toLocaleString()} members</p>
                </div>
                <button className="text-[10px] px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
