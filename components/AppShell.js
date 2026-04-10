'use client';

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import AppSidebar from '@/components/AppSidebar';
import AppBottomNav from '@/components/AppBottomNav';
import { isRtlLanguage } from '@/lib/languages';

// These pages never show any nav
const NO_NAV_PATHS = new Set(['/login', '/register']);

// Landing page — ALWAYS shows original Top Navbar (logged in or out)
const LANDING_PATH = '/';

// Admin pages — no sidebar, no top navbar (admin layouts are self-contained)
const ADMIN_PREFIX = '/admin';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);

  const isNoNav = NO_NAV_PATHS.has(pathname);
  const isLanding = pathname === LANDING_PATH;
  const isAdmin = pathname.startsWith(ADMIN_PREFIX);
  const isAdminUser = user?.role === 'admin';

  // 1. Login / Register: no nav at all
  if (isNoNav) {
    return <main className="min-h-screen">{children}</main>;
  }

  // 2. Admin pages (/admin/*): no sidebar, self-contained
  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  // 3. Landing page (/): always show original Top Navbar regardless of login state
  if (isLanding) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-[76px]">{children}</main>
      </>
    );
  }

  // 4. Logged-in + normal user (not admin): show Sidebar + Bottom Nav
  if (isLoggedIn && !isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Left Sidebar */}
        <AppSidebar />
        {/* Main content — pushed right on desktop, balanced padding on mobile */}
        <main className={`${isRTL ? 'lg:mr-[260px]' : 'lg:ml-[260px]'} min-h-screen pb-[66px] lg:pb-0`}>
          {children}
        </main>
        {/* Mobile Bottom Navigation */}
        <AppBottomNav />
      </div>
    );
  }

  // 5. Logged-in admin OR logged-out user on any other page: original Top Navbar
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[76px]">{children}</main>
    </>
  );
}
