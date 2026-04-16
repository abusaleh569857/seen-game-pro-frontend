'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useI18n } from '@/lib/i18n';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { initialized, isLoggedIn, user } = useSelector((state) => state.auth);
  const { t } = useI18n();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    if (adminOnly && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [adminOnly, initialized, isLoggedIn, router, user]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        {t('common.loading')}
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (adminOnly && user?.role !== 'admin') {
    return null;
  }

  return children;
}

