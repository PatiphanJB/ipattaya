import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Shield, BarChart3, AlertTriangle,
  CheckCircle2, Clock, TrendingUp, Users, FileText,
} from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const budgetItems = [
  { category: 'Infrastructure', amount: 2450, percent: 32, color: 'bg-primary' },
  { category: 'Education', amount: 1200, percent: 16, color: 'bg-emerald-500' },
  { category: 'Public Health', amount: 980, percent: 13, color: 'bg-rose-500' },
  { category: 'Environment', amount: 750, percent: 10, color: 'bg-lime-500' },
  { category: 'Public Safety', amount: 680, percent: 9, color: 'bg-amber-500' },
  { category: 'Tourism', amount: 520, percent: 7, color: 'bg-purple-500' },
  { category: 'Administration', amount: 450, percent: 6, color: 'bg-sky-500' },
  { category: 'Other', amount: 520, percent: 7, color: 'bg-gray-400' },
];

const recentProblems = [
  { id: '1', title: 'Broken streetlight on Soi 6', status: 'resolved', reporter: 'Anonymous', time: '2d ago', votes: 34 },
  { id: '2', title: 'Flooding on Sukhumvit near Tesco', status: 'in_progress', reporter: 'John K.', time: '3d ago', votes: 67 },
  { id: '3', title: 'Illegal dumping at Naklua beach', status: 'open', reporter: 'CleanPattaya', time: '5d ago', votes: 89 },
  { id: '4', title: 'Pothole on Second Road near Soi 8', status: 'resolved', reporter: 'RiderSafe', time: '1w ago', votes: 45 },
  { id: '5', title: 'Noise complaint — construction at night', status: 'in_progress', reporter: 'NightOwl', time: '1w ago', votes: 23 },
];

const statusColors: Record<string, string> = {
  open: 'text-danger bg-danger/10',
  in_progress: 'text-warning bg-warning/10',
  resolved: 'text-success bg-success/10',
};

const statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export default async function CivicPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const totalBudget = budgetItems.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-text">Civic Transparency</h1>
          <p className="text-[10px] text-text-muted">Pattaya City Municipal Data</p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
        {/* Budget Section */}
        <div className="p-4 rounded-2xl bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-text">Municipal Budget 2026</h2>
          </div>
          <p className="text-2xl font-bold text-text mb-1">{(totalBudget).toLocaleString()} M THB</p>
          <p className="text-[10px] text-text-muted mb-4">Total annual budget allocation</p>

          {/* Budget bar */}
          <div className="flex rounded-full overflow-hidden h-3 mb-4">
            {budgetItems.map((item) => (
              <div key={item.category} className={`${item.color}`} style={{ width: `${item.percent}%` }} title={item.category} />
            ))}
          </div>

          {/* Budget items */}
          <div className="space-y-2">
            {budgetItems.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs text-text-secondary">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-text">{item.amount.toLocaleString()}M</span>
                  <span className="text-[10px] text-text-muted w-8 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Problems Reported', value: '1,247', icon: AlertTriangle, color: 'text-warning' },
              { label: 'Resolved', value: '892', icon: CheckCircle2, color: 'text-success' },
              { label: 'Avg Resolution', value: '4.2 days', icon: Clock, color: 'text-primary' },
              { label: 'Active Citizens', value: '8.5K', icon: Users, color: 'text-info' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-3 rounded-xl bg-bg-card border border-border">
                <Icon size={16} className={`${color} mb-2`} />
                <p className="text-lg font-bold text-text">{value}</p>
                <p className="text-[10px] text-text-muted">{label}</p>
              </div>
            ))}
          </div>

          {/* Report button */}
          <button className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
            <AlertTriangle size={16} />
            Report a Problem
          </button>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Recent Reports</h2>
          <button className="text-xs text-primary font-medium">View All</button>
        </div>
        <div className="space-y-2">
          {recentProblems.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text truncate">{p.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[p.status]}`}>
                    {statusLabels[p.status]}
                  </span>
                  <span className="text-[10px] text-text-muted">{p.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <TrendingUp size={12} />
                {p.votes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
