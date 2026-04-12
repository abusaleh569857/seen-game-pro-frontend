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
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import { fetchAdminStats } from '@/store/slices/adminSlice';

function AdminContent() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector((state) => state.admin);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statCards = [
    {
      label: t('admin.total_users'),
      value: stats?.totalUsers,
      icon: <Users className="w-8 h-8 text-blue-400" />,
      color: 'border-blue-700 bg-blue-900/20',
    },
    {
      label: t('admin.questions_total'),
      value: stats?.totalQuestions,
      icon: <BookOpen className="w-8 h-8 text-purple-400" />,
      color: 'border-purple-700 bg-purple-900/20',
    },
    {
      label: t('admin.games_played'),
      value: stats?.totalGames,
      icon: <Gamepad2 className="w-8 h-8 text-green-400" />,
      color: 'border-green-700 bg-green-900/20',
    },
    {
      label: t('admin.revenue_kwd'),
      value: Number.parseFloat(stats?.totalRevenue || 0).toFixed(2),
      icon: <CreditCard className="w-8 h-8 text-yellow-400" />,
      color: 'border-yellow-700 bg-yellow-900/20',
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
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-5xl px-4 py-12">
          {/* Header */}
          <div className="mb-12 flex items-center gap-4">
            <div className="bg-purple-600/20 p-3 rounded-2xl border border-purple-500/30">
              <LayoutDashboard className="w-10 h-10 text-purple-500" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{t('admin.dashboard_title')}</h1>
              <p className="text-gray-400 mt-1">{t('admin.dashboard_subtitle')}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div 
                key={card.label} 
                className={`rounded-3xl border p-6 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-${card.color.split(' ')[1]}/20 ${card.color}`}
              >
                <div className="mb-4 p-3 bg-black/40 rounded-2xl border border-white/5">
                  {card.icon}
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black tabular-nums tracking-tighter">
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
          <h2 className="mb-8 text-sm font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-4">
            {t('admin.management_control')}
            <div className="h-[1px] flex-grow bg-gray-800"></div>
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative overflow-hidden rounded-[2.5rem] border border-gray-800 bg-gray-900/30 p-10 transition-all duration-300 hover:border-purple-500/50 hover:bg-gray-900/80 active:scale-95"
              >
                <div className="mb-6 flex justify-center transition-all duration-500 group-hover:scale-125 group-hover:-rotate-3">
                  <div className="relative">
                    {link.icon}
                    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-2xl font-bold tracking-tight mb-2 group-hover:text-purple-400 transition-colors">
                  {link.label}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {link.desc}
                </p>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
