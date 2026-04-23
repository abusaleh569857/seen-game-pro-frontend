'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Sparkles, BookOpen, Users, LogOut, Plus, CircleDot, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { isRtlLanguage } from '@/lib/languages';
import { buildLocalizedPath, stripLocaleFromPathname } from '@/lib/i18n-settings';
import { logoutUser } from '@/store/slices/authSlice';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, href: '/admin', labelKey: 'nav.admin_panel' },
  { icon: Sparkles, href: '/admin/ai-generator', labelKey: 'admin.ai_generator_nav' },
  { icon: BookOpen, href: '/admin/questions', labelKey: 'admin.questions_management' },
  { icon: Users, href: '/admin/users', labelKey: 'admin.user_management' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const normalizedPath = stripLocaleFromPathname(pathname || '/');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useI18n();

  const { user } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);
  const initials = user?.username?.slice(0, 2).toUpperCase() || 'AD';

  const localizedItems = useMemo(
    () =>
      SIDEBAR_ITEMS.map((item) => ({
        ...item,
        localizedHref: buildLocalizedPath(item.href, selectedLang),
      })),
    [selectedLang]
  );

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-admin-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await dispatch(logoutUser());
    router.push(buildLocalizedPath('/login', selectedLang));
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return normalizedPath === '/admin';
    }
    return normalizedPath.startsWith(href);
  };

  return (
    <>
      {isOpen ? (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[48]"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed z-[49] bg-white transition-transform duration-300 ${
          isRTL
            ? `${isOpen ? 'translate-x-0' : 'translate-x-full'} right-0 border-l border-gray-100`
            : `${isOpen ? 'translate-x-0' : '-translate-x-full'} left-0 border-r border-gray-100`
        } lg:translate-x-0 top-[76px] h-[calc(100vh-76px)] w-[220px] lg:w-[260px] flex flex-col overflow-y-auto`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={`lg:hidden absolute top-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 ${
            isRTL ? 'left-3' : 'right-3'
          }`}
        >
          <Plus className="w-5 h-5 rotate-45" />
        </button>

        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-linear-to-br from-[#6248FF] to-[#486CFF] border border-white/10 shadow-md">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white/80">
              <CircleDot className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-black text-gray-900 leading-none">{t('nav.brand_name')}</p>
            <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block tracking-wide">{t('admin.admin_panel_badge')}</span>
          </div>
        </div>

        <div className="mx-3 mt-4 mb-2 rounded-xl bg-linear-to-br from-violet-50 to-indigo-50 border border-violet-100 p-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400 mb-0.5">{t('admin.management_control')}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-black text-gray-900 leading-tight">{t('nav.admin_panel')}</span>
              <p className="text-[10px] text-gray-500 mt-0.5">{t('admin.modules_count', { count: SIDEBAR_ITEMS.length })}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-black text-xs flex items-center justify-center">
              {(t('admin.admin_panel_badge') || 'A').charAt(0)}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-2">
          <p className="px-2 mb-2 text-[9px] font-black uppercase tracking-[0.12em] text-gray-400">
            {t('admin.management_control')}
          </p>
          {localizedItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.localizedHref}
                onClick={() => setIsOpen(false)}
                className={`relative mb-0.5 flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-violet-600' : 'text-gray-400'}`} />
                <span className={`text-[12px] font-semibold ${active ? 'font-bold' : ''}`}>{t(item.labelKey)}</span>
                {active ? <div className={`w-1 h-4 rounded-full bg-violet-600 absolute ${isRTL ? 'left-0' : 'right-0'}`} /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <div className={`w-full flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-gray-50 transition group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-[12px] font-bold text-gray-800 leading-none truncate max-w-[90px]">{user?.username || t('admin.default_admin_name')}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{t('nav.admin_panel')}</p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 text-red-600 py-2 text-[12px] font-bold hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
