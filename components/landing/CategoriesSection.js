'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchCategories } from '@/store/slices/quizSlice';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { getLocalizedCategoryName, isRtlLanguage } from '@/lib/languages';

const TOP_COLORS = [
  '#ef4444', '#f59e0b', '#3b82f6', '#eab308', '#8b5cf6',
  '#ec4899', '#10b981', '#14b8a6', '#6366f1', '#f43f5e',
];

export default function CategoriesSection() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories, categoriesLoading, selectedLang } = useSelector((state) => state.quiz);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const isRTL = isRtlLanguage(selectedLang);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handlePlay = (categoryId) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    router.push(`/play/${categoryId}?lang=${selectedLang}`);
  };

  const displayCats = categories && categories.length > 0 ? categories : [];

  return (
    <section className="relative w-full pt-20 pb-12 px-4 lg:px-10">
      <div className={`w-full max-w-6xl mx-auto flex flex-col items-center ${isRTL ? 'lg:items-end text-center lg:text-right' : 'lg:items-start text-center lg:text-left'}`}>
        <p className="text-[12px] font-bold tracking-[2px] uppercase text-white/50 mb-3">
          {t('landing.fifteen_categories')}
        </p>

        <h2 className="text-[32px] sm:text-[40px] lg:text-[46px] font-black tracking-tight text-white mb-4 leading-[1.1]">
          {t('landing.what_will_you_master')}
        </h2>

        <p className="text-[14px] lg:text-[15px] font-medium text-white/60 max-w-[600px] mb-12">
          {t('landing.categories_subtitle')}
        </p>

        {categoriesLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4 w-full">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-[120px] rounded-xl bg-[#1A0A40] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : displayCats.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4 w-full">
            {displayCats.map((cat, i) => {
              const topColor = TOP_COLORS[i % TOP_COLORS.length];
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => handlePlay(cat.id)}
                  className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 bg-gray-900 hover:bg-[#150D3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A78BFA] overflow-hidden"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: topColor }}
                  />

                  <span className="text-[32px] lg:text-[38px] mb-3 drop-shadow-md group-hover:scale-110 transition-transform">
                    {cat.icon || '🎯'}
                  </span>

                  <span className="text-[13px] font-bold text-white tracking-wide mb-1 transition-colors group-hover:text-white">
                    {getLocalizedCategoryName(cat, selectedLang)}
                  </span>
                  <span className="text-[10px] font-medium text-white/40">
                    {cat.name_en}
                  </span>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="w-full p-8 text-center rounded-2xl border border-white/10 bg-white/5 text-white/60">
            {t('landing.no_categories')}
          </div>
        )}
      </div>
    </section>
  );
}
