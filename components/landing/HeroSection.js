'use client';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";
import { useI18n } from '@/lib/i18n';
import { getLanguageByCode, SUPPORTED_LANGUAGES } from '@/lib/languages';
import { setSelectedLang } from '@/store/slices/quizSlice';

export default function HeroSection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useI18n();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const activeLanguage = getLanguageByCode(selectedLang);

  const handleStartPlay = () => {
    router.push(isLoggedIn ? '/categories' : '/login');
  };

  const handleLanguageSelect = (languageCode) => {
    dispatch(setSelectedLang(languageCode));
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-16 pb-16 lg:pt-24 lg:pb-24 px-4 overflow-hidden bg-[#180A50]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 55%),
            radial-gradient(circle at top right, #240E6A 0%, transparent 60%),
            radial-gradient(circle at top left, #110B33 0%, transparent 50%)
          `,
        }}
      />

      <AnimatedDotBackground opacityClass="opacity-20" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="text-[14px] leading-none text-[#A78BFA]">✦</span>
          <span className="text-[9px] lg:text-[10px] font-bold text-white/70 uppercase tracking-wide whitespace-nowrap">
            {t('landing.top_badge')}
          </span>
        </motion.div>

        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[42px] sm:text-[56px] lg:text-[72px] font-black leading-[1.05] tracking-tight text-white mb-6"
        >
          {t('landing.hero_title_line1')}<br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E5BFF] to-[#34D399]">{t('landing.hero_title_line2')}</span>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-[700px] text-[14px] lg:text-[16px] font-medium leading-relaxed text-blue-100/60 mb-10"
        >
          {t('landing.hero_subtitle')}
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 mb-10 w-full"
        >
          {SUPPORTED_LANGUAGES.map((langItem) => {
            const isActive = activeLanguage.code === langItem.code;
            const label =
              langItem.code === 'ar'
                ? langItem.nativeLabel
                : langItem.code === 'en'
                ? t('landing.play_in_english')
                : langItem.code === 'fr'
                ? t('landing.play_in_french')
                : t('landing.play_in_spanish');

            return (
              <button
                key={langItem.code}
                type="button"
                onClick={() => handleLanguageSelect(langItem.code)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-[12px] font-bold transition ${
                  isActive
                    ? 'border-[#4E5BFF]/30 bg-[#4E5BFF]/10 text-white shadow-[0_0_15px_rgba(78,91,255,0.2)]'
                    : 'border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <div className="h-[10px] w-[14px] overflow-hidden rounded-[1.5px] shadow-sm">
                  <img src={langItem.flag} alt={langItem.shortLabel} className="h-full w-full object-cover" />
                </div>
                {label}
              </button>
            );
          })}
        </motion.div>

        <motion.button
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleStartPlay}
          className="group flex items-center gap-3 px-8 lg:px-10 py-4 rounded-[16px] text-white font-black tracking-wide bg-gradient-to-r from-[#6248FF] to-[#486CFF] shadow-hero hover:shadow-[0_8px_40px_rgba(98,72,255,0.6)] transition-all hover:-translate-y-1"
        >
          <Play fill="currentColor" size={16} />
          {t('landing.start_playing')}
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-12 lg:mt-16 flex flex-row items-stretch justify-around lg:justify-between rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">15</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">{t('landing.categories')}</p>
        </div>

        <div className="w-[1px] bg-white/10 block" />

        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">{t('common.language_count')}</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">{t('landing.languages')}</p>
        </div>

        <div className="w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6 hidden sm:flex">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">10</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40 mt-0.5 leading-tight">
            {t('common.questions_per_round')}
          </p>
        </div>

        <div className="w-[1px] bg-white/10 hidden lg:block" />

        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6 hidden lg:flex">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">∞</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">{t('common.ai_questions')}</p>
        </div>

        <div className="w-[1px] bg-white/10 block" />

        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">KWD</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">{t('common.prizes_via_tap')}</p>
        </div>
      </motion.div>
    </section>
  );
}
