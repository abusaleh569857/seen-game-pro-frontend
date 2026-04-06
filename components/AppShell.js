'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

const HIDE_NAV_PATHS = new Set(['/login', '/register']);

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAV_PATHS.has(pathname);

  return (
    <>
      {!hideNavbar ? <Navbar /> : null}
      <main className={hideNavbar ? 'min-h-screen' : 'min-h-screen pt-[76px]'}>{children}</main>
    </>
  );
}