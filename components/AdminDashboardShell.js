'use client';

import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { useSelector } from 'react-redux';
import { isRtlLanguage } from '@/lib/languages';
import { useI18n } from '@/lib/i18n';

export default function AdminDashboardShell({ children }) {
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);
  const { t } = useI18n();

  const triggerAdminSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'));
  };

  return (
    <>
      <Navbar />
      <AdminSidebar />

      <button
        type="button"
        onClick={triggerAdminSidebar}
        className={`lg:hidden fixed top-[92px] z-[47] w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm ${
          isRTL ? 'right-4' : 'left-4'
        }`}
        aria-label={t('admin.toggle_sidebar')}
      >
        <span className="sr-only">{t('admin.toggle_sidebar')}</span>
        <div className="mx-auto flex w-4 flex-col gap-1">
          <span className="h-0.5 w-4 rounded bg-gray-700" />
          <span className="h-0.5 w-4 rounded bg-gray-700" />
          <span className="h-0.5 w-3 rounded bg-gray-700" />
        </div>
      </button>

      <div className={`min-h-screen bg-gray-50 pt-[92px] pb-8 ${isRTL ? 'lg:pr-[260px]' : 'lg:pl-[260px]'}`}>
        {children}
      </div>
    </>
  );
}
