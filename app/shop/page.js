'use client';

import { useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  ShieldCheck,
  ShoppingCart,
  SkipForward,
  Sparkles,
  Scissors,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import {
  buyJokerStock,
  clearCheckoutUrl,
  clearJokerPurchaseResult,
  fetchPackages,
  createCharge,
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
    label: 'Skip',
    descriptionKey: 'quiz.jump_next_question',
    icon: SkipForward,
    cost: 1,
    cardClass: 'from-[#244d80] to-[#1b3b61] border-sky-500/30',
    buttonClass: 'from-[#4985f5] to-[#3f74d7]',
    badgeClass: 'bg-sky-200/20 text-sky-100',
  },
  time: {
    label: 'Time',
    descriptionKey: 'quiz.add_extra_time',
    icon: Clock3,
    cost: 1,
    cardClass: 'from-[#36510d] to-[#243b07] border-lime-500/30',
    buttonClass: 'from-[#79b70f] to-[#65a30d]',
    badgeClass: 'bg-lime-200/20 text-lime-100',
  },
  reveal: {
    label: 'Reveal',
    descriptionKey: 'quiz.show_correct_answer',
    icon: Eye,
    cost: 2,
    cardClass: 'from-[#6b3a14] to-[#4f290b] border-orange-500/30',
    buttonClass: 'from-[#f97316] to-[#ea580c]',
    badgeClass: 'bg-orange-200/20 text-orange-100',
  },
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
  const { user } = useSelector((state) => state.auth);
  const { inventory } = useSelector((state) => state.quiz);
  const {
    packages,
    packagesLoading,
    loadingPackage,
    loadingJoker,
    checkoutUrl,
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
    if (!checkoutUrl) {
      return;
    }

    window.location.href = checkoutUrl;
    dispatch(clearCheckoutUrl());
  }, [checkoutUrl, dispatch]);

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
    dispatch(createCharge(packageKey));
  };

  const handleJokerPurchase = (jokerType) => {
    dispatch(buyJokerStock(jokerType));
  };

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <PageHeader pageName={t('shop.page_title')} breadcrumbs={[]} />

      <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 lg:px-8 lg:pb-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-slate-900">{t('shop.title')}</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {t('shop.subtitle')}
            </p>
          </div>

          <div className="rounded-[20px] border border-violet-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
              {t('common.qeem_balance')}
            </p>
            <div className="mt-1 flex items-center justify-between gap-6">
              <div>
                <p className="text-[34px] font-black leading-none text-slate-900">{qeemBalance}</p>
                <p className="mt-1 text-xs text-slate-500">{t('common.available_coins')}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl">
                🪙
              </div>
            </div>
          </div>
        </div>

        <div className="mb-7 rounded-[26px] bg-gradient-to-r from-[#17345a] via-[#174172] to-[#2456a1] p-5 text-white shadow-[0_24px_60px_rgba(23,65,114,0.24)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/15 bg-white/10">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-lg font-black">{t('shop.secured_tap')}</p>
                <p className="mt-1 text-sm text-white/70">
                  All transactions processed securely in KWD currency via Tap Payment Integration
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                {t('shop.kwd_currency')}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                {t('shop.instant_topup')}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
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
          <div className="mb-5">
            <h2 className="text-[30px] font-black tracking-tight text-slate-900">{t('shop.qeem_packages')}</h2>
            <p className="mt-1 text-sm text-slate-500">
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
                    className={`relative rounded-[28px] border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${pkg.borderClass} ${
                      pkg.highlight ? 'ring-2 ring-violet-400/40' : 'border-white/80'
                    }`}
                  >
                    {pkg.highlight ? (
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 px-4 py-1 text-xs font-black text-white shadow-md">
                        ✨ {pkg.highlight}
                      </div>
                    ) : null}

                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-lg">
                      🪙
                    </div>

                    <h3 className="mt-4 text-center text-[28px] font-black text-slate-900">{pkg.label}</h3>

                    <div className={`mt-4 rounded-[18px] px-4 py-4 text-center ${pkg.badgeClass}`}>
                      <p className="text-[42px] font-black leading-none">{pkg.qeem}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em]">{t('common.qeem')}</p>
                    </div>

                    <p className="mt-4 text-center text-[34px] font-black text-slate-900">
                      {pkg.price} KWD
                    </p>
                    <p className="mt-2 text-center text-sm text-slate-500">
                      {pkg.helperText ? (
                        <span className="font-black text-emerald-500">{pkg.helperText}</span>
                      ) : null}{' '}
                      {pkg.helperText ? '— ' : ''}
                      {pkg.rate} KWD per Qeem
                    </p>

                    <button
                      type="button"
                      onClick={() => handlePackagePurchase(packageKey)}
                      disabled={loadingPackage === packageKey}
                      className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r ${pkg.buttonClass} px-4 py-3 text-sm font-black text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {loadingPackage === packageKey ? t('common.redirecting') : t('common.buy')}
                    </button>
                  </article>
                ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-[30px] font-black tracking-tight text-slate-900">{t('shop.joker_system')}</h2>
            <p className="mt-1 text-sm text-slate-500">
              50/50, Skip, Time, Reveal — deduct from inventory or balance
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
                  className={`rounded-[28px] border bg-gradient-to-br ${meta.cardClass} p-5 text-white shadow-[0_22px_50px_rgba(15,23,42,0.16)]`}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${meta.badgeClass}`}>
                      {isEmpty ? t('shop.empty') : t('shop.in_stock', { count: stock })}
                    </span>
                  </div>

                  <h3 className="text-[28px] font-black">{meta.label}</h3>
                  <p className="mt-3 min-h-[44px] text-sm leading-6 text-white/65">{t(meta.descriptionKey)}</p>
                  <p className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                    {t('shop.qeem_each', { count: meta.cost })}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleJokerPurchase(jokerType)}
                    disabled={loadingJoker === jokerType}
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r ${meta.buttonClass} px-4 py-3 text-sm font-black text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <BadgeDollarSign className="h-4 w-4" />
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
