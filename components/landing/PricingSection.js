'use client';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

const PACKAGES = [
  {
    id: 'small',
    name: 'SMALL',
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
    name: 'MEDIUM',
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
    name: 'LARGE',
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
    name: 'GIANT',
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
  const { t } = useI18n();

  return (
    <section className="w-full pt-0 pb-12 px-4 lg:px-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center lg:items-start">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-3 text-center lg:text-left w-full">
          {t('landing.qeem_packages')}
        </p>

        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-black tracking-tight text-white mb-4 leading-[1.1] text-center lg:text-left w-full">
          {t('landing.power_up_your_play')}
        </h2>

        <p className="text-[14px] lg:text-[15px] font-medium text-white/50 max-w-[600px] mb-12 text-center lg:text-left w-full leading-relaxed">
          {t('landing.pricing_subtitle')}
        </p>

        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.95 }}
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
                {pkg.name}
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
                className={`w-full py-4 rounded-[14px] text-[13px] font-bold transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-[#6248FF] to-[#486CFF] text-white shadow-hero hover:shadow-[0_4px_24px_rgba(98,72,255,0.4)]'
                    : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t('common.buy_via_tap')}
              </button>
            </motion.div>
          ))}
        </div>

        <div
          className="w-full overflow-hidden relative block sm:hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex gap-4 w-max pt-1"
          >
            {[...PACKAGES, ...PACKAGES].map((pkg, i) => (
              <div
                key={`${pkg.id}-${i}`}
                className={`w-[260px] shrink-0 relative flex flex-col p-6 rounded-[24px] overflow-hidden border ${
                  pkg.popular ? 'shadow-[0_8px_32px_rgba(98,72,255,0.15)]' : ''
                }`}
                style={{ backgroundColor: pkg.bgColor, borderColor: pkg.borderColor }}
              >
                {pkg.popular ? (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-[11px] font-bold tracking-wide px-4 py-1.5 rounded-b-[8px] z-10 flex items-center gap-1 shadow-md">
                    <span>★</span> {t('landing.most_popular')}
                  </div>
                ) : null}

                <p className={`text-[12px] font-bold tracking-widest text-white/50 uppercase mb-2 ${pkg.popular ? 'mt-4' : ''}`}>
                  {pkg.name}
                </p>

                <div className="text-[18px] mb-4">{pkg.icons}</div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-[42px] font-black text-white leading-none">{pkg.qeem}</span>
                  <span className="text-[14px] font-bold tracking-wide text-white/60">{t('common.qeem')}</span>
                </div>

                <div className="mb-6">
                  <span className="text-[16px] font-black text-[#FFD700]">{pkg.price}</span>
                </div>

                <p className="text-[12px] font-medium text-white/40 mb-6 mt-auto">{t(pkg.descKey)}</p>

                <button
                  className={`w-full py-4 rounded-[14px] text-[13px] font-bold transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-[#6248FF] to-[#486CFF] text-white shadow-hero'
                      : 'bg-white/5 text-white/80 border border-white/10'
                  }`}
                >
                  {t('common.buy_via_tap')}
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
