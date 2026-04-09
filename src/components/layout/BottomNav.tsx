'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Compass, Map, CalendarDays, Bookmark, Menu } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { key: 'explore', href: '/', icon: Compass },
  { key: 'map', href: '/map', icon: Map },
  { key: 'plan', href: '/plan', icon: CalendarDays },
  { key: 'saved', href: '/saved', icon: Bookmark },
  { key: 'more', href: '/more', icon: Menu },
] as const;

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          {navItems.map(({ key, href, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={clsx(
                  'flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors',
                  isActive ? 'text-primary' : 'text-text-muted'
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{t(key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar nav */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 w-56 bg-bg-card border-r border-border flex-col py-6">
        <div className="px-5 mb-8">
          <h1 className="text-xl font-bold text-primary">iPattaya</h1>
          <p className="text-[10px] text-text-muted mt-0.5">Your Pattaya, All in One</p>
        </div>
        <div className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map(({ key, href, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-elevated hover:text-text'
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{t(key)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
