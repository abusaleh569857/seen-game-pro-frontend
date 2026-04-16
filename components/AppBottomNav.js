'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, ShoppingBag, BarChart2, LayoutGrid, User } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const BOTTOM_NAV = [
  { icon: Play, labelKey: 'sidebar.active_quiz', href: '/play' },
  { icon: ShoppingBag, labelKey: 'sidebar.the_shop', href: '/shop' },
  { icon: BarChart2, labelKey: 'sidebar.leaderboard', href: '/leaderboard' },
  { icon: LayoutGrid, labelKey: 'quiz.question_map', href: '/categories' },
  { icon: User, labelKey: 'sidebar.my_profile', href: '/profile' },
];

export default function AppBottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const isActive = (href) => {
    if (href === '/play' && (pathname === '/play' || pathname.startsWith('/play/'))) return true;
    if (href !== '/play' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.labelKey}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[52px]"
            >
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all ${
                  active ? 'bg-violet-100' : 'bg-transparent'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-violet-600' : 'text-gray-400'
                  }`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  active ? 'text-violet-600' : 'text-gray-400'
                }`}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
