'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function PaymentFailedPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-red-700 bg-gray-900 p-10 text-center">
        <div className="mb-4 text-6xl">❌</div>
        <h1 className="mb-2 text-2xl font-bold text-red-400">{t('payment.failed_title')}</h1>
        <p className="mb-6 text-gray-400">{t('payment.failed_subtitle')}</p>
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
