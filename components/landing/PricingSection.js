'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useSelector } from 'react-redux';
import { isRtlLanguage } from '@/lib/languages';

const PACKAGES = [
  {
    id: 'small',
    nameKey: 'landing.package_small',
    qeem: '5',
    price: '1.5 KWD',
    descKey: 'landing.perfect_for_jokers',
    popular: false,
    icons: '🪙',
    bgColor: '#1D1A33',
    borderColor: '#302D4F',
  },
  {
    id: 'medium',
    nameKey: 'landing.package_medium',
    qeem: '10',
    price: '2.5 KWD',
    descKey: 'landing.great_for_challenges',
    popular: false,
    icons: '🪙 🪙',
    bgColor: '#2E105C',
    borderColor: '#4A1C94',
  },
  {
    id: 'large',
    nameKey: 'landing.package_large',
    qeem: '25',
    price: '5 KWD',
    descKey: 'landing.best_value',
    popular: true,
    icons: '🪙 🪙 🪙',
    bgColor: '#0F204C',
    borderColor: '#1D3B8C',
  },
  {
    id: 'giant',
    nameKey: 'landing.package_giant',
    qeem: '50',
    price: '9 KWD',
    descKey: 'landing.serious_competitors',
    popular: false,
    icons: '🪙 💼',
    bgColor: '#3F1235',
    borderColor: '#691D58',
  },
];

export default function PricingSection() {
  const router = useRouter();
  const { t } = useI18n();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const isRTL = isRtlLanguage(selectedLang);
  const [mobilePackageIndex, setMobilePackageIndex] = useState(0);
  const currentMobilePackage = PACKAGES[mobilePackageIndex];

  const handleBuyViaTap = () => {
    router.push(isLoggedIn ? '/shop' : '/login');
  };

  const handleMobilePrev = () => {
    setMobilePackageIndex((current) => (current === 0 ? PACKAGES.length - 1 : current - 1));
  };

  const handleMobileNext = () => {
    setMobilePackageIndex((current) => (current + 1) % PACKAGES.length);
  };

  return (
    <section className="w-full pt-0 pb-12 px-4 lg:px-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center lg:items-start">
        <p className={`text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-3 text-center w-full ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          {t('landing.qeem_packages')}
        </p>

        <h2 className={`text-[32px] sm:text-[40px] lg:text-[44px] font-black tracking-tight text-white mb-4 leading-[1.1] text-center w-full ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          {t('landing.power_up_your_play')}
        </h2>

        <p className={`text-[14px] lg:text-[15px] font-medium text-white/50 max-w-[600px] mb-12 text-center w-full leading-relaxed ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
          {t('landing.pricing_subtitle')}
        </p>

        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`relative flex flex-col p-6 lg:p-8 rounded-[24px] overflow-hidden border ${
                pkg.popular
                  ? 'shadow-[0_8px_32px_rgba(98,72,255,0.15)] transform lg:-translate-y-2'
                  : 'hover:brightness-110 transition-all'
              }`}
              style={{ backgroundColor: pkg.bgColor, borderColor: pkg.borderColor }}
            >
              {pkg.popular ? (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-[11px] font-bold tracking-wide px-5 py-1.5 rounded-b-[8px] z-10 flex items-center gap-1 shadow-md">
                  <span>★</span> {t('landing.most_popular')}
                </div>
              ) : null}

              <p className={`text-[12px] font-bold tracking-widest text-white/50 uppercase mb-2 ${pkg.popular ? 'mt-4' : ''}`}>
                {t(pkg.nameKey)}
              </p>

              <div className="text-[18px] mb-4">{pkg.icons}</div>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[42px] lg:text-[48px] font-black text-white leading-none">{pkg.qeem}</span>
                <span className="text-[14px] font-bold tracking-wide text-white/60">{t('common.qeem')}</span>
              </div>

              <div className="mb-6 lg:mb-8">
                <span className="text-[16px] lg:text-[18px] font-black text-[#FFD700]">{pkg.price}</span>
              </div>

              <p className="text-[12px] font-medium text-white/40 mb-6 lg:mb-8 mt-auto">
                {t(pkg.descKey)}
              </p>

              <button
                type="button"
                onClick={handleBuyViaTap}
                className={`w-full py-4 rounded-[14px] text-[13px] font-bold transition-all ${
                  pkg.popular
                    ? 'bg-linear-to-r from-[#6248FF] to-[#486CFF] text-white shadow-hero hover:shadow-[0_4px_24px_rgba(98,72,255,0.4)]'
                    : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('common.buy_via_tap')}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="w-full block sm:hidden pt-1">
          <motion.div
            key={currentMobilePackage.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className={`w-full relative flex flex-col ${isRTL ? 'py-6 pl-8 pr-12' : 'py-6 pl-12 pr-8'} rounded-[24px] overflow-hidden border ${
              currentMobilePackage.popular ? 'shadow-[0_8px_32px_rgba(98,72,255,0.15)]' : ''
            }`}
            style={{
              backgroundColor: currentMobilePackage.bgColor,
              borderColor: currentMobilePackage.borderColor,
            }}
          >
              <button
                type="button"
                onClick={handleMobilePrev}
                className="absolute left-3 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/85 backdrop-blur transition hover:bg-black/40 hover:text-white"
                aria-label={t('landing.previous_package')}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleMobileNext}
                className="absolute right-3 top-1/2 z-10 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white/85 backdrop-blur transition hover:bg-black/40 hover:text-white"
                aria-label={t('landing.next_package')}
              >
                <ChevronRight className="h-4 w-4" />
              </button>

            {currentMobilePackage.popular ? (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-[11px] font-bold tracking-wide px-4 py-1.5 rounded-b-[8px] z-10 flex items-center gap-1 shadow-md">
                <span>★</span> {t('landing.most_popular')}
              </div>
            ) : null}

            <p className={`text-[12px] font-bold tracking-widest text-white/50 uppercase mb-2 ${currentMobilePackage.popular ? 'mt-4' : ''}`}>
              {t(currentMobilePackage.nameKey)}
            </p>

            <div className="text-[18px] mb-4">{currentMobilePackage.icons}</div>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-[42px] font-black text-white leading-none">{currentMobilePackage.qeem}</span>
              <span className="text-[14px] font-bold tracking-wide text-white/60">{t('common.qeem')}</span>
            </div>

            <div className="mb-6">
              <span className="text-[16px] font-black text-[#FFD700]">{currentMobilePackage.price}</span>
            </div>

            <p className="text-[12px] font-medium text-white/40 mb-6 mt-auto">{t(currentMobilePackage.descKey)}</p>

            <button
              type="button"
              onClick={handleBuyViaTap}
              className={`flex w-full items-center justify-center whitespace-nowrap px-4 py-2.5 rounded-[11px] text-[11px] font-bold leading-none text-center transition-all ${
                currentMobilePackage.popular
                  ? 'bg-linear-to-r from-[#6248FF] to-[#486CFF] text-white shadow-hero'
                  : 'bg-white/5 text-white/80 border border-white/10'
              }`}
            >
              {t('common.buy_via_tap')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
