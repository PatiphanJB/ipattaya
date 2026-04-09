import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MessageCircle, ThumbsUp, Eye, Pin, Users } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

const mockThreads = [
  { id: '1', title: 'Best street food spots near Soi Buakhao?', author: 'NomadTom', avatar: 'NT', category: 'Food', replies: 24, views: 1560, likes: 18, pinned: true, time: '3h ago' },
  { id: '2', title: 'Is it safe to swim at Jomtien Beach right now?', author: 'BeachLover', avatar: 'BL', category: 'Safety', replies: 12, views: 890, likes: 8, time: '5h ago' },
  { id: '3', title: 'Recommendations for reliable motorbike rental?', author: 'RiderJake', avatar: 'RJ', category: 'Transport', replies: 31, views: 2100, likes: 22, time: '8h ago' },
  { id: '4', title: 'Monthly cost of living breakdown for expats', author: 'ThaiLife', avatar: 'TL', category: 'Living', replies: 56, views: 4500, likes: 45, time: '1d ago' },
  { id: '5', title: 'Songkran 2026 — where are the best parties?', author: 'PartyPat', avatar: 'PP', category: 'Events', replies: 19, views: 1230, likes: 15, time: '1d ago' },
  { id: '6', title: 'Pattaya traffic getting worse — any solutions?', author: 'CityWatch', avatar: 'CW', category: 'Civic', replies: 42, views: 3200, likes: 38, time: '2d ago' },
  { id: '7', title: 'Best co-working spaces with fast WiFi?', author: 'DigitalDan', avatar: 'DD', category: 'Work', replies: 15, views: 980, likes: 11, time: '2d ago' },
];

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/more" className="p-1 -ml-1 rounded-lg hover:bg-bg-elevated transition-colors">
            <ArrowLeft size={20} className="text-text-secondary" />
          </Link>
          <h1 className="text-lg font-bold text-text">Community Forum</h1>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium">New Post</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Members', value: '12.4K', icon: Users },
          { label: 'Posts', value: '3.2K', icon: MessageCircle },
          { label: 'Online', value: '148', icon: Eye },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-3 rounded-xl bg-bg-card border border-border text-center">
            <Icon size={16} className="text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-text">{value}</p>
            <p className="text-[10px] text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'Food', 'Safety', 'Transport', 'Living', 'Events', 'Civic', 'Work'].map((cat, i) => (
          <button key={cat} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-bg-elevated border border-border text-text-secondary'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Threads */}
      <div className="space-y-2">
        {mockThreads.map((thread) => (
          <div key={thread.id} className="p-3 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {thread.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {thread.pinned && <Pin size={10} className="text-accent" />}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{thread.category}</span>
                </div>
                <h3 className="text-sm font-medium text-text mt-1 line-clamp-2">{thread.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-text-muted">{thread.author}</span>
                  <span className="text-[10px] text-text-muted">{thread.time}</span>
                  <div className="flex items-center gap-1 text-[10px] text-text-muted"><MessageCircle size={9} />{thread.replies}</div>
                  <div className="flex items-center gap-1 text-[10px] text-text-muted"><ThumbsUp size={9} />{thread.likes}</div>
                  <div className="flex items-center gap-1 text-[10px] text-text-muted"><Eye size={9} />{thread.views}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
