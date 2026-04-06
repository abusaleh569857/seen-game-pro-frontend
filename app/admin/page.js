'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchAdminStats } from '@/store/slices/adminSlice';

function AdminContent() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers,
      icon: '??',
      color: 'border-blue-700 bg-blue-900/20',
    },
    {
      label: 'Questions',
      value: stats?.totalQuestions,
      icon: '?',
      color: 'border-purple-700 bg-purple-900/20',
    },
    {
      label: 'Games Played',
      value: stats?.totalGames,
      icon: '??',
      color: 'border-green-700 bg-green-900/20',
    },
    {
      label: 'Revenue (KWD)',
      value: Number.parseFloat(stats?.totalRevenue || 0).toFixed(2),
      icon: '??',
      color: 'border-yellow-700 bg-yellow-900/20',
    },
  ];

  const navLinks = [
    {
      href: '/admin/ai-generator',
      icon: '??',
      label: 'AI Generator',
      desc: 'Generate questions with GPT-4o',
    },
    {
      href: '/admin/questions',
      icon: '?',
      label: 'Questions',
      desc: 'Edit and delete questions',
    },
    {
      href: '/admin/users',
      icon: '??',
      label: 'Users',
      desc: 'Manage and ban users',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">?? Admin Dashboard</h1>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className={`rounded-xl border p-4 text-center ${card.color}`}>
              <p className="mb-2 text-3xl">{card.icon}</p>
              <p className="text-2xl font-black">{statsLoading ? '...' : card.value ?? '0'}</p>
              <p className="mt-1 text-xs text-gray-400">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-gray-700 bg-gray-900 p-6 transition-all hover:border-purple-500"
            >
              <p className="mb-3 inline-block text-4xl transition-transform group-hover:scale-110">
                {link.icon}
              </p>
              <p className="text-lg font-bold">{link.label}</p>
              <p className="mt-1 text-sm text-gray-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </main>
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

