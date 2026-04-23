'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  BookOpen, 
  Gamepad2, 
  CreditCard, 
  Sparkles, 
  LayoutDashboard 
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardShell from '@/components/AdminDashboardShell';
import { useI18n } from '@/lib/i18n';
import { isRtlLanguage, normalizeLanguageCode } from '@/lib/languages';
import { buildLocalizedPath } from '@/lib/i18n-settings';
import { fetchAdminStats } from '@/store/slices/adminSlice';

function AdminContent() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector((state) => state.admin);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const activeLang = normalizeLanguageCode(selectedLang);
  const isRTL = isRtlLanguage(activeLang);
  const { t } = useI18n();
  const withLocale = (path) => buildLocalizedPath(path, activeLang);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statCards = [
    {
      label: t('admin.total_users'),
      value: stats?.totalUsers,
      icon: <Users className="w-7 h-7 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50',
    },
    {
      label: t('admin.questions_total'),
      value: stats?.totalQuestions,
      icon: <BookOpen className="w-7 h-7 text-violet-600" />,
      color: 'border-violet-200 bg-violet-50',
    },
    {
      label: t('admin.games_played'),
      value: stats?.totalGames,
      icon: <Gamepad2 className="w-7 h-7 text-green-600" />,
      color: 'border-green-200 bg-green-50',
    },
    {
      label: t('admin.revenue_kwd'),
      value: Number.parseFloat(stats?.totalRevenue || 0).toFixed(2),
      icon: <CreditCard className="w-7 h-7 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50',
    },
  ];

  const navLinks = [
    {
      href: '/admin/ai-generator',
      icon: <Sparkles className="w-10 h-10 text-pink-500" />,
      label: t('admin.ai_generator_nav'),
      desc: t('admin.ai_generator_desc'),
    },
    {
      href: '/admin/questions',
      icon: <BookOpen className="w-10 h-10 text-purple-400" />,
      label: t('admin.questions_management'),
      desc: t('admin.questions_management_desc'),
    },
    {
      href: '/admin/users',
      icon: <Users className="w-10 h-10 text-blue-400" />,
      label: t('admin.user_management'),
      desc: t('admin.user_management_desc'),
    },
  ];

  return (
    <AdminDashboardShell>
      <main className="mx-auto max-w-6xl px-4 py-8 text-gray-900">
          {/* Header */}
          <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-violet-50 p-3 border border-violet-100">
                <LayoutDashboard className="w-8 h-8 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">{t('admin.dashboard_title')}</h1>
                <p className="text-gray-500 mt-1 text-sm">{t('admin.dashboard_subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div 
                key={card.label} 
                className={`rounded-2xl border p-5 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${card.color}`}
              >
                <div className="mb-3 p-2.5 bg-white rounded-xl border border-white shadow-sm">
                  {card.icon}
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black tabular-nums tracking-tight text-gray-900">
                    {statsLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      card.value ?? '0'
                    )}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    {card.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Management Selection */}
          <h2 className="mb-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-4">
            {t('admin.management_control')}
            <div className="h-[1px] flex-grow bg-gray-200"></div>
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={withLocale(link.href)}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md active:scale-95"
              >
                <div className="mb-5 flex justify-center transition-all duration-300 group-hover:scale-110">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                    {link.icon}
                  </div>
                </div>
                <p className="text-2xl font-black tracking-tight mb-2 text-gray-900 group-hover:text-violet-700 transition-colors">
                  {link.label}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {link.desc}
                </p>
                
                {/* Visual Accent */}
                <div className={`absolute top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${isRTL ? 'left-0' : 'right-0'}`}>
                  <Sparkles className="w-12 h-12 text-violet-500" />
                </div>
              </Link>
            ))}
          </div>
      </main>
    </AdminDashboardShell>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
