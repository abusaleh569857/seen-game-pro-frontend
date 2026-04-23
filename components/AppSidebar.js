'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useI18n } from '@/lib/i18n';
import { logoutUser } from '@/store/slices/authSlice';
import { isRtlLanguage } from '@/lib/languages';
import { stripLocaleFromPathname } from '@/lib/i18n-settings';
import {
  Play,
  LayoutGrid,
  BarChart2,
  User,
  History,
  ShoppingBag,
  Users,
  Trophy,
  Bell,
  Settings,
  Plus,
  ChevronDown,
  CircleDot,
  LogOut,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    key: 'play',
    title: 'PLAY',
    items: [
      { icon: Play, label: 'Active Quiz', labelKey: 'active_quiz', href: '/play/active', activePrefix: '/play/' },
      { icon: LayoutGrid, label: 'Game Categories', labelKey: 'game_categories', href: '/categories' },
      { icon: BarChart2, label: 'Leaderboard', labelKey: 'leaderboard', href: '/leaderboard' },
    ],
  },
  {
    key: 'account',
    title: 'ACCOUNT',
    items: [
      { icon: User, label: 'My Profile', labelKey: 'my_profile', href: '/profile' },
      { icon: History, label: 'Game History', labelKey: 'game_history', href: '/profile#history' },
      { icon: ShoppingBag, label: 'The Shop', labelKey: 'the_shop', href: '/shop', badge: 'New', badgeColor: 'bg-green-500' },
    ],
  },
  {
    key: 'social',
    title: 'SOCIAL',
    items: [
      { icon: Users, label: 'Friends', labelKey: 'friends', href: '#', badge: '0', badgeColor: 'bg-blue-500', comingSoon: true },
      { icon: Trophy, label: 'Tournament', labelKey: 'tournament', href: '#', badge: 'Live', badgeColor: 'bg-red-500', comingSoon: true },
    ],
  },
  {
    key: 'settings',
    title: 'SETTINGS',
    items: [
      { icon: Bell, label: 'Notifications', labelKey: 'notifications', href: '#', badge: '0', badgeColor: 'bg-purple-500', comingSoon: true },
      { icon: Settings, label: 'Settings', labelKey: 'settings_item', href: '#', comingSoon: true },
      { icon: LogOut, label: 'Logout', labelKey: 'logout', href: '#', action: 'logout' },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const normalizedPathname = stripLocaleFromPathname(pathname || '/');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);
  const { t } = useI18n();

  const qeemBalance = user?.qeemBalance ?? user?.qeem_balance ?? 0;
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'UN';
  const comingSoonMessage = t('sidebar.coming_soon_message');

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  const isActive = (href, activePrefix) => {
    const cleanHref = href.split('#')[0];
    const cleanActivePrefix = activePrefix ? activePrefix.split('#')[0] : '';

    if (cleanActivePrefix && normalizedPathname.startsWith(cleanActivePrefix)) return true;
    if (cleanHref === '/play' && normalizedPathname === '/play') return true;
    if (cleanHref && cleanHref !== '/play' && cleanHref !== '#' && normalizedPathname.startsWith(cleanHref)) return true;
    return false;
  };

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  return (
    <>
      {/* Backdrop (Mobile Only) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[48] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 h-screen bg-white z-[50] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isRTL
            ? `${isOpen ? 'translate-x-0' : 'translate-x-full'} right-0 border-l border-gray-100`
            : `${isOpen ? 'translate-x-0' : '-translate-x-full'} left-0 border-r border-gray-100`
        } w-[220px] lg:w-[260px] flex flex-col overflow-y-auto`}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className={`lg:hidden absolute top-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 ${isRTL ? 'left-4' : 'right-4'}`}
        >
          <Plus className="w-5 h-5 rotate-45" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-linear-to-br from-[#6248FF] to-[#486CFF] border border-white/10 shadow-md">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white/80">
              <CircleDot className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-black text-gray-900 leading-none">{t('nav.brand_name')}</p>
            <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block tracking-wide">PRO</span>
          </div>
        </div>

        {/* Qeem Balance */}
        <div className="mx-3 mt-4 mb-2 rounded-xl bg-linear-to-br from-violet-50 to-indigo-50 border border-violet-100 p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">{t('common.qeem_balance')}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 leading-tight">{qeemBalance}</span>
              <p className="text-[9px] text-gray-400">{t('common.available_coins')}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] shadow-sm">🪙</div>
              <Link
                href="/shop"
                className="flex items-center gap-0.5 bg-violet-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-violet-700 transition"
              >
                <Plus className="w-2.5 h-2.5" />
                {t('common.buy')}
              </Link>
            </div>
          </div>
        </div>

        {/* Nav Sections */}
        <nav className="flex-1 px-2 py-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-3">
              <p className="px-2 mb-1 text-[9px] font-black uppercase tracking-[0.12em] text-gray-400">
                {t(`sidebar.${section.key}`)}
              </p>
              {section.items.map((item) => {
                const active = isActive(item.href, item.activePrefix);
                const isLogoutAction = item.action === 'logout';
                return (
                  isLogoutAction ? (
                    <button
                      key={item.label}
                      type="button"
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg mb-0.5 group transition-all text-red-600 hover:bg-red-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                      onClick={async () => {
                        setIsOpen(false);
                        await handleLogout();
                      }}
                    >
                      <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <item.icon className="w-4 h-4 shrink-0 text-red-500" />
                        <span className="text-[12px] font-semibold">{t(`nav.${item.labelKey}`)}</span>
                      </div>
                    </button>
                  ) : (
                    <Link
                     key={item.label}
                     href={item.href}
                     className={`relative flex items-center justify-between px-3 py-2 rounded-lg mb-0.5 group transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                        active
                          ? 'bg-violet-50 text-violet-700'
                          : item.comingSoon
                          ? 'text-gray-400 cursor-default hover:bg-gray-50'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                     }`}
                     onClick={
                       item.comingSoon
                          ? (e) => {
                              e.preventDefault();
                              toast.info(comingSoonMessage);
                            }
                          : () => {
                              setIsOpen(false);
                            }
                     }
                   >
                    <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <item.icon
                        className={`w-4 h-4 shrink-0 ${active ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                      />
                      <span className={`text-[12px] font-semibold ${active ? 'font-bold' : ''}`}>
                        {t(`sidebar.${item.labelKey}`)}
                      </span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge === 'New' ? t('sidebar.new') : item.badge === 'Live' ? t('sidebar.live') : item.badge}
                      </span>
                    )}
                    {active && <div className={`w-1 h-4 rounded-full bg-violet-600 absolute ${isRTL ? 'left-0' : 'right-0'}`} />}
                  </Link>
                  )
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-gray-50 transition group ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                {initials}
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-[12px] font-bold text-gray-800 leading-none truncate max-w-[90px]">
                  {user?.username}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {user?.points ?? 0} {t('leaderboard.points_short')}
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </aside>
    </>
  );
}
