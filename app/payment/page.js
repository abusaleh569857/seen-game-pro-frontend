'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Crown,
  Lock,
  Shield,
  ShieldCheck,
  WalletCards,
  Zap,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import { isRtlLanguage, normalizeLanguageCode } from '@/lib/languages';
import { clearCheckoutUrl, createCharge, fetchPackages } from '@/store/slices/shopSlice';

const PAYMENT_METHODS = [
  { key: 'knet', labelKey: 'payment.method_knet' },
  { key: 'visa', labelKey: 'payment.method_visa' },
  { key: 'mastercard', labelKey: 'payment.method_mastercard' },
  { key: 'apple_pay', labelKey: 'payment.method_apple_pay' },
];

function renderPackageVisual(packageKey) {
  if (packageKey === 'giant') {
    return <Crown className="h-4 w-4 text-amber-500 md:h-4.5 md:w-4.5" />;
  }

  const coinCountByPackage = {
    small: 1,
    medium: 2,
    large: 3,
  };
  const coinCount = coinCountByPackage[packageKey] || 1;

  return (
    <span className="inline-flex items-center">
      {Array.from({ length: coinCount }).map((_, index) => (
        <span
          key={`${packageKey}-coin-${index}`}
          className={`inline-flex items-center justify-center ${index > 0 ? '-ml-1.5' : ''}`}
        >
          <Image src="/icons/coin.png" alt="Qeem coin" width={15} height={15} className="h-[15px] w-[15px] rounded-full border border-slate-200 bg-white" />
        </span>
      ))}
    </span>
  );
}

function PaymentGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { t } = useI18n();

  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const lang = normalizeLanguageCode(selectedLang);
  const isRTL = isRtlLanguage(lang);

  const { user } = useSelector((state) => state.auth);
  const { packages, packagesLoading, loadingPackage, checkoutUrl, error } = useSelector((state) => state.shop);

  const packageList = useMemo(() => Object.values(packages || {}), [packages]);
  const [manualSelection, setManualSelection] = useState({ packageKey: null, queryContext: '__no_query__' });
  const [method, setMethod] = useState('knet');
  const [billingMatchesAccount, setBillingMatchesAccount] = useState(true);
  const queryPackageKey = useMemo(() => {
    const key = searchParams?.get('package');
    return key ? key.toLowerCase() : null;
  }, [searchParams]);

  const qeemBalance = Number(user?.qeemBalance ?? user?.qeem_balance ?? 0);
  const queryContext = queryPackageKey || '__no_query__';
  const activePackageKey = useMemo(() => {
    if (manualSelection.packageKey && manualSelection.queryContext === queryContext) {
      return manualSelection.packageKey;
    }
    if (queryPackageKey && packageList.some((pkg) => pkg.key === queryPackageKey)) {
      return queryPackageKey;
    }
    return packageList[0]?.key || null;
  }, [manualSelection, packageList, queryContext, queryPackageKey]);

  const selectedPackage = useMemo(
    () => packageList.find((pkg) => pkg.key === activePackageKey) || packageList[0] || null,
    [activePackageKey, packageList],
  );
  const selectedPackageLabel = selectedPackage
    ? t(`shop.package_${selectedPackage.key}`, { defaultValue: selectedPackage.label || '--' })
    : '--';

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  useEffect(() => {
    if (!checkoutUrl) {
      return;
    }

    window.location.href = checkoutUrl;
    dispatch(clearCheckoutUrl());
  }, [checkoutUrl, dispatch]);

  const handlePay = () => {
    if (!selectedPackage?.key) {
      return;
    }
    dispatch(createCharge(selectedPackage.key));
  };

  const renderCurrency = (value) => `${Number(value || 0).toFixed(3)} ${t('payment.kwd_currency')}`;

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <PageHeader
        pageName={t('payment.gateway_page_title')}
        breadcrumbs={[
          { label: t('shop.page_title'), href: '/shop' },
          { label: t('payment.gateway_page_title'), href: '/payment' },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-2 lg:max-w-[1700px] lg:px-8 xl:max-w-[1820px]">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <section className="xl:col-span-4">
            <div className="rounded-[22px] bg-gradient-to-br from-[#21135a] via-[#2a196b] to-[#1f1658] p-5 text-white shadow-[0_24px_60px_rgba(34,26,92,0.3)]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{t('payment.your_order')}</p>
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">{t('payment.selected_package')}</p>
              <div className="mt-1 flex items-center gap-2">
                {renderPackageVisual(selectedPackage?.key)}
                <h2 className="text-2xl font-black">
                  {selectedPackageLabel} - {selectedPackage?.qeem || 0} {t('common.qeem')}
                </h2>
              </div>
              <p className="mt-1 text-xs text-white/70">{t('payment.instant_delivery')}</p>

              <div className="mt-5 space-y-2 rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/65">{t('shop.qeem_packages')}</span>
                  <span className="font-bold">{selectedPackageLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/65">{t('payment.current_balance')}</span>
                  <span className="font-bold">{qeemBalance} {t('common.qeem')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/65">{t('payment.balance_after')}</span>
                  <span className="font-bold text-emerald-300">{qeemBalance + Number(selectedPackage?.qeem || 0)} {t('common.qeem')}</span>
                </div>
                <div className="border-t border-white/15 pt-2 text-right text-2xl font-black">
                  {renderCurrency(selectedPackage?.price)}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-white/80 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('payment.change_package')}</p>
              <div className="mt-3 space-y-2">
                {packageList.map((pkg) => (
                  <button
                    key={pkg.key}
                    type="button"
                    onClick={() => setManualSelection({ packageKey: pkg.key, queryContext })}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                      activePackageKey === pkg.key
                        ? 'border-violet-300 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-violet-200'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <span className="inline-flex items-center gap-2 font-semibold">
                      {renderPackageVisual(pkg.key)}
                      <span>
                        {t(`shop.package_${pkg.key}`, { defaultValue: pkg.label })} - {pkg.qeem} {t('common.qeem')}
                      </span>
                    </span>
                    <span className="font-black">{pkg.price} {t('payment.kwd_currency')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                <div className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1.5 text-[10px] font-black text-slate-700">{t('payment.security_ssl_encrypted')}</p>
                <p className="text-[9px] text-slate-400">{t('payment.security_ssl_tls')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                <div className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1.5 text-[10px] font-black text-slate-700">{t('payment.security_tap_verified')}</p>
                <p className="text-[9px] text-slate-400">{t('payment.security_pci_dss')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                <div className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <p className="mt-1.5 text-[10px] font-black text-slate-700">{t('payment.security_instant')}</p>
                <p className="text-[9px] text-slate-400">{t('payment.security_balance_update')}</p>
              </div>
            </div>
          </section>

          <section className="xl:col-span-8">
            <div className="rounded-[22px] border border-white/80 bg-white shadow-sm">
              <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-[#0f2a63] to-[#173f90] px-5 py-4 text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={isRTL ? 'text-right' : ''}>
                  <h1 className="text-lg font-black">{t('payment.gateway_title')}</h1>
                  <p className="text-xs text-white/70">{t('payment.gateway_subtitle')}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-black">
                  <Lock className="h-3.5 w-3.5" />
                  {t('payment.ssl_secured')}
                </span>
              </div>

              <div className="p-5">
                {error ? (
                  <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                    {error}
                  </div>
                ) : null}

                <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">{t('payment.selected_package')}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderPackageVisual(selectedPackage?.key)}
                      <p className="text-base font-black text-slate-900">
                        {selectedPackageLabel} - {selectedPackage?.qeem || 0} {t('common.qeem')}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-indigo-600">{renderCurrency(selectedPackage?.price)}</p>
                  </div>
                </div>

                <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600">{t('payment.payment_method')}</p>
                <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {PAYMENT_METHODS.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setMethod(item.key)}
                      className={`rounded-xl border px-3 py-3 text-sm font-black shadow-sm transition ${
                        method === item.key
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                          : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-300'
                      }`}
                    >
                      <span className="flex flex-col items-center gap-2">
                        {item.key === 'knet' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#0f6cb8] px-2.5 py-1 text-xs font-extrabold text-white">
                            <span className="h-2 w-2 rounded-full border border-white/90 bg-white/25" />
                            {t('payment.method_knet')}
                          </span>
                        ) : null}
                        {item.key === 'visa' ? (
                          <span className="rounded-md bg-[#1a1f71] px-2.5 py-1 text-xs font-extrabold text-white">{t('payment.method_visa')}</span>
                        ) : null}
                        {item.key === 'mastercard' ? (
                          <span className="inline-flex items-center">
                            <span className="h-3.5 w-3.5 rounded-full bg-[#ea001b]" />
                            <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[#ff9f1c]" />
                          </span>
                        ) : null}
                        {item.key === 'apple_pay' ? (
                          <span className="rounded-md bg-black px-2.5 py-1 text-xs font-extrabold text-white">{t('payment.method_apple_pay')}</span>
                        ) : null}
                        <span className="text-[13px] font-extrabold leading-none text-slate-900 md:text-[16px]">{t(item.labelKey)}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600">{t('payment.card_details')}</p>
                <div className="rounded-2xl bg-gradient-to-r from-[#172749] to-[#0f1c36] p-5 text-white">
                  <div className="mb-6 flex items-center justify-between">
                    <WalletCards className="h-5 w-5 text-amber-300" />
                    <span className="text-xs font-black text-white/75">{t('payment.expiry_short')}</span>
                  </div>
                  <p className="text-lg font-black tracking-[0.28em]">**** **** **** 1234</p>
                  <p className="mt-2 text-xs text-white/60">{user?.username || t('payment.card_holder_fallback')}</p>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t('payment.form_card_number_label')}</label>
                    <input
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                      placeholder={t('payment.card_number')}
                      defaultValue="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t('payment.form_cardholder_label')}</label>
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                        placeholder={t('payment.cardholder')}
                        defaultValue={user?.username || ''}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t('payment.form_expiry_label')}</label>
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                        placeholder={t('payment.expiry')}
                        defaultValue="12/28"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">{t('payment.form_cvv_label')}</label>
                    <input
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                      placeholder={t('payment.cvv')}
                      defaultValue="123"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <label className="inline-flex cursor-pointer items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={billingMatchesAccount}
                      onChange={(event) => setBillingMatchesAccount(event.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-violet-600"
                    />
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className={`h-3.5 w-3.5 ${billingMatchesAccount ? 'text-violet-600' : 'text-slate-400'}`} />
                      {t('payment.billing_note')}
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={!selectedPackage || !!loadingPackage || packagesLoading}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white transition ${
                    loadingPackage
                      ? 'cursor-not-allowed bg-indigo-300'
                      : 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  {loadingPackage ? t('common.redirecting') : t('payment.pay_securely', { amount: renderCurrency(selectedPackage?.price) })}
                  <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4" />
                    <p>{t('payment.security_note')}</p>
                  </div>
                </div>

                <div className={`mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-700 md:text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-semibold">{t('payment.accepted')}:</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#0f6cb8] px-2.5 py-1 font-extrabold text-white">
                    <span className="h-2 w-2 rounded-full border border-white/90 bg-white/25" />
                    {t('payment.method_knet')}
                  </span>
                  <span className="rounded-md bg-[#1a1f71] px-2.5 py-1 font-extrabold text-white">{t('payment.method_visa')}</span>
                  <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#ea001b]" />
                    <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-[#ff9f1c]" />
                  </span>
                  <span className="rounded-md bg-black px-2.5 py-1 font-extrabold text-white">{t('payment.method_apple_pay')}</span>
                  <span className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 font-semibold">{t('payment.accepted_ssl_pci')}</span>
                  <span className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 font-semibold">{t('payment.kwd_currency')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <ProtectedRoute>
      <PaymentGatewayContent />
    </ProtectedRoute>
  );
}
