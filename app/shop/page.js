'use client';

import { useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  ShieldCheck,
  ShoppingCart,
  SkipForward,
  Scissors,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import {
  buyJokerStock,
  clearJokerPurchaseResult,
  fetchPackages,
} from '@/store/slices/shopSlice';
import { updateUserBalance } from '@/store/slices/authSlice';
import { fetchJokerInventory } from '@/store/slices/quizSlice';

const JOKER_META = {
  fifty_fifty: {
    label: '50 / 50',
    descriptionKey: 'quiz.remove_wrong_answers',
    icon: Scissors,
    cost: 1,
    cardClass: 'from-[#4c2e9f] to-[#3a247a] border-violet-500/30',
    buttonClass: 'from-[#7c5cff] to-[#6d4eff]',
    badgeClass: 'bg-violet-200/20 text-violet-100',
  },
  skip: {
    labelKey: 'shop.skip_label',
    descriptionKey: 'quiz.jump_next_question',
    icon: SkipForward,
    cost: 1,
    cardClass: 'from-[#244d80] to-[#1b3b61] border-sky-500/30',
    buttonClass: 'from-[#4985f5] to-[#3f74d7]',
    badgeClass: 'bg-sky-200/20 text-sky-100',
  },
  time: {
    labelKey: 'shop.time_label',
    descriptionKey: 'quiz.add_extra_time',
    icon: Clock3,
    cost: 1,
    cardClass: 'from-[#36510d] to-[#243b07] border-lime-500/30',
    buttonClass: 'from-[#79b70f] to-[#65a30d]',
    badgeClass: 'bg-lime-200/20 text-lime-100',
  },
  reveal: {
    labelKey: 'shop.reveal_label',
    descriptionKey: 'quiz.show_correct_answer',
    icon: Eye,
    cost: 2,
    cardClass: 'from-[#6b3a14] to-[#4f290b] border-orange-500/30',
    buttonClass: 'from-[#f97316] to-[#ea580c]',
    badgeClass: 'bg-orange-200/20 text-orange-100',
  },
};

const PACKAGE_COIN_ICON_SIZE = {
  small: 16,
  medium: 20,
  large: 24,
  giant: 28,
};

function persistUserBalance(user, balance) {
  if (!user) {
    return;
  }

  Cookies.set(
    'user',
    JSON.stringify({
      ...user,
      qeemBalance: balance,
      qeem_balance: balance,
    }),
    { expires: 7 },
  );
}

function ShopContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { inventory } = useSelector((state) => state.quiz);
  const {
    packages,
    packagesLoading,
    loadingPackage,
    loadingJoker,
    jokerPurchaseResult,
    error,
  } = useSelector((state) => state.shop);
  const { t } = useI18n();

  const qeemBalance = user?.qeemBalance ?? user?.qeem_balance ?? 0;
  const packageList = useMemo(() => Object.entries(packages), [packages]);

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchJokerInventory());
  }, [dispatch]);

  useEffect(() => {
    if (!jokerPurchaseResult?.success) {
      return;
    }

    dispatch(updateUserBalance(jokerPurchaseResult.balance));
    persistUserBalance(user, jokerPurchaseResult.balance);
    dispatch(fetchJokerInventory());
    dispatch(clearJokerPurchaseResult());
  }, [dispatch, jokerPurchaseResult, user]);

  const handlePackagePurchase = (packageKey) => {
    router.push(`/payment?package=${encodeURIComponent(packageKey)}`);
  };

  const handleJokerPurchase = (jokerType) => {
    dispatch(buyJokerStock(jokerType));
  };

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <PageHeader pageName={t('shop.page_title')} breadcrumbs={[]} />

      <div className="mx-auto max-w-[1440px] px-3 pb-20 pt-3 lg:px-8 lg:pb-10 lg:pt-4">
        <div className="mb-4 flex flex-col gap-3 lg:mb-6 lg:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[20px] font-black tracking-tight text-slate-900 lg:text-[32px]">{t('shop.title')}</h1>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 lg:mt-1 lg:text-sm">
              {t('shop.subtitle')}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:rounded-[20px] lg:border-violet-100 lg:px-5 lg:py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500 lg:text-[10px] lg:tracking-[0.2em] lg:text-violet-400">
              {t('common.qeem_balance')}
            </p>
            <div className="mt-1 flex items-center justify-between gap-4 lg:gap-6">
              <div>
                <p className="text-[30px] font-black leading-none text-orange-500 lg:text-[34px] lg:text-slate-900">{qeemBalance}</p>
                <p className="mt-1 text-[10px] text-slate-500 lg:text-xs">{t('common.available_coins')}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 lg:h-11 lg:w-11 lg:text-xl">
                <Image src="/icons/coin.png" alt={t('common.qeem')} width={26} height={26} className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-[18px] bg-gradient-to-r from-[#17345a] via-[#174172] to-[#2456a1] p-3.5 text-white shadow-[0_16px_30px_rgba(23,65,114,0.2)] lg:mb-7 lg:rounded-[26px] lg:p-5 lg:shadow-[0_24px_60px_rgba(23,65,114,0.24)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 lg:h-14 lg:w-14 lg:rounded-[18px]">
                <ShieldCheck className="h-4 w-4 text-emerald-300 lg:h-6 lg:w-6" />
              </div>
              <div>
                <p className="text-sm font-black lg:text-lg">{t('shop.secured_tap')}</p>
                <p className="mt-0.5 text-[11px] text-white/70 lg:mt-1 lg:text-sm">
                  {t('shop.secured_subtitle')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] lg:px-4 lg:py-2 lg:text-xs lg:tracking-[0.18em]">
                {t('shop.kwd_currency')}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] lg:px-4 lg:py-2 lg:text-xs lg:tracking-[0.18em]">
                {t('shop.instant_topup')}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] lg:px-4 lg:py-2 lg:text-xs lg:tracking-[0.18em]">
                {t('shop.tap_integration')}
              </span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : null}

        <section>
          <div className="mb-3 lg:mb-5">
            <h2 className="text-[18px] font-black tracking-tight text-slate-900 lg:text-[30px]">{t('shop.qeem_packages')}</h2>
            <p className="mt-0.5 text-[11px] text-slate-500 lg:mt-1 lg:text-sm">
              {t('shop.choose_package')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {packagesLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`pkg-skeleton-${index}`}
                    className="h-[270px] animate-pulse rounded-[28px] border border-white/80 bg-white shadow-sm"
                  />
                ))
              : packageList.map(([packageKey, pkg]) => (
                  <article
                    key={packageKey}
                    className={`relative rounded-2xl border bg-white p-3.5 shadow-sm transition md:rounded-[28px] md:p-5 md:hover:-translate-y-1 md:hover:shadow-lg ${pkg.borderClass} ${
                      pkg.highlight ? 'ring-2 ring-violet-400/40' : 'border-white/80'
                    }`}
                  >
                    {pkg.highlight ? (
                      <div className="absolute right-2 top-2 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-black text-white shadow-md md:left-1/2 md:right-auto md:top-0 md:-translate-x-1/2 md:-translate-y-1/2 md:px-4 md:py-1 md:text-xs">
                        {t('shop.most_popular')}
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-3 md:block">
                      <div className="flex items-center gap-2.5 md:block md:text-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 md:mx-auto md:h-11 md:w-11 md:rounded-[14px] md:text-lg">
                          <Image
                            src="/icons/coin.png"
                            alt={t('common.qeem')}
                            width={PACKAGE_COIN_ICON_SIZE[packageKey] || 16}
                            height={PACKAGE_COIN_ICON_SIZE[packageKey] || 16}
                          />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-black text-slate-900 md:mt-4 md:text-center md:text-[28px]">
                            {t(`shop.package_${packageKey}`, { defaultValue: pkg.label })}
                          </h3>
                          <p className="text-[10px] text-slate-400 md:hidden">
                            {pkg.qeem} {t('common.qeem')}
                          </p>
                        </div>
                      </div>
                      <p className="text-[24px] font-black text-slate-900 md:hidden">{pkg.price} KWD</p>
                    </div>

                    <div className={`mt-3 hidden rounded-[18px] px-4 py-4 text-center md:block ${pkg.badgeClass}`}>
                      <p className="text-[42px] font-black leading-none">{pkg.qeem}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em]">{t('common.qeem')}</p>
                    </div>

                    <p className="mt-3 hidden text-center text-[34px] font-black text-slate-900 md:block md:mt-4">
                      {pkg.price} KWD
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 md:mt-2 md:text-center md:text-sm">
                      {pkg.helperText ? <span className="font-black text-emerald-500">{t('shop.best_value')}</span> : null}{' '}
                      {pkg.helperText ? '- ' : ''}
                      {t('shop.rate_per_qeem', { rate: pkg.rate })}
                    </p>

                    <button
                      type="button"
                      onClick={() => handlePackagePurchase(packageKey)}
                      disabled={loadingPackage === packageKey}
                      className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${pkg.buttonClass} px-3 py-2 text-[11px] font-black text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 md:mt-6 md:gap-2 md:rounded-[16px] md:px-4 md:py-3 md:text-sm`}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {loadingPackage === packageKey ? t('common.redirecting') : t('common.buy')}
                    </button>
                  </article>
                ))}
          </div>
        </section>

        <section className="mt-6 lg:mt-8">
          <div className="mb-3 lg:mb-5">
            <h2 className="text-[18px] font-black tracking-tight text-slate-900 lg:text-[30px]">{t('shop.joker_system')}</h2>
            <p className="mt-0.5 text-[11px] text-slate-500 lg:mt-1 lg:text-sm">
              {t('shop.joker_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(JOKER_META).map(([jokerType, meta]) => {
              const Icon = meta.icon;
              const stock = inventory?.[jokerType] ?? 0;
              const isEmpty = stock <= 0;

              return (
                <article
                  key={jokerType}
                  className={`rounded-2xl border bg-gradient-to-br ${meta.cardClass} p-3.5 text-white shadow-[0_14px_24px_rgba(15,23,42,0.16)] md:rounded-[28px] md:p-5 md:shadow-[0_22px_50px_rgba(15,23,42,0.16)]`}
                >
                  <div className="mb-3 flex items-start justify-between md:mb-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 md:h-12 md:w-12 md:rounded-[16px]">
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black md:px-3 md:text-xs ${meta.badgeClass}`}>
                      {isEmpty ? t('shop.empty') : t('shop.in_stock', { count: stock })}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-black md:text-[28px]">{meta.labelKey ? t(meta.labelKey) : meta.label}</h3>
                  <p className="mt-1 min-h-[30px] text-[11px] leading-5 text-white/70 md:mt-3 md:min-h-[44px] md:text-sm md:leading-6 md:text-white/65">{t(meta.descriptionKey)}</p>
                  <p className="mt-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-amber-200 md:mt-5 md:px-3 md:text-xs md:tracking-[0.18em]">
                    {t('shop.qeem_each', { count: meta.cost })}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleJokerPurchase(jokerType)}
                    disabled={loadingJoker === jokerType}
                    className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${meta.buttonClass} px-3 py-2 text-[11px] font-black text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 md:mt-6 md:gap-2 md:rounded-[16px] md:px-4 md:py-3 md:text-sm`}
                  >
                    <Image src="/icons/coin.png" alt={t('common.qeem')} width={16} height={16} className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    {loadingJoker === jokerType ? t('common.loading') : t('common.buy')}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <ProtectedRoute>
      <ShopContent />
    </ProtectedRoute>
  );
}

