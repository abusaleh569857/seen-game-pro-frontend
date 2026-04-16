'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '@/lib/i18n';
import { updateUserBalance } from '@/store/slices/authSlice';

function PaymentSuccessContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { t } = useI18n();

  const qeem = Number.parseInt(searchParams.get('qeem') || '0', 10);

  useEffect(() => {
    if (!user || !qeem) {
      return;
    }

    const nextBalance = Number(user.qeemBalance ?? user.qeem_balance ?? 0) + qeem;
    dispatch(updateUserBalance(nextBalance));
    Cookies.set(
      'user',
      JSON.stringify({
        ...user,
        qeemBalance: nextBalance,
        qeem_balance: nextBalance,
      }),
      { expires: 7 },
    );
  }, [dispatch, qeem, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-green-700 bg-gray-900 p-10 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="mb-2 text-2xl font-bold text-green-400">{t('payment.success_title')}</h1>
        <p className="mb-6 text-gray-400">{t('payment.success_subtitle', { qeem })}</p>
        <Link
          href="/shop"
          className="block w-full rounded-xl bg-purple-600 py-3 font-bold text-white transition hover:bg-purple-500"
        >
          {t('common.back_to_shop')}
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessFallback() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
      {t('common.loading')}
    </div>
  );
}
