'use client';

import { useDispatch, useSelector } from 'react-redux';
import { createCharge } from '@/store/slices/shopSlice';
import { useI18n } from '@/lib/i18n';

export default function PackageCard({ packageKey, pkg }) {
  const dispatch = useDispatch();
  const { loadingPackage } = useSelector((state) => state.shop);
  const isLoading = loadingPackage === packageKey;
  const { t } = useI18n();

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border bg-linear-to-b p-6 text-center transition-transform hover:scale-105 ${pkg.color}`}
    >
      <h3 className="text-xl font-bold">{pkg.label}</h3>
      <p className="text-5xl font-black text-yellow-300">{pkg.qeem}</p>
      <p className="text-sm font-medium text-gray-300">{t('common.qeem')}</p>
      <p className="text-2xl font-bold text-white">{pkg.price} KWD</p>

      <button
        type="button"
        onClick={() => dispatch(createCharge(packageKey))}
        disabled={isLoading}
        className="w-full rounded-xl bg-white py-2.5 font-bold text-gray-900 transition active:scale-95 hover:bg-gray-100 disabled:opacity-50"
      >
        {isLoading ? t('common.loading') : t('common.buy')}
      </button>
    </div>
  );
}

