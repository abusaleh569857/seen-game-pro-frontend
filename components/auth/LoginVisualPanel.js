"use client";

import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";
import { useI18n } from "@/lib/i18n";
import { isRtlLanguage, normalizeLanguageCode } from "@/lib/languages";

const CATEGORIES = [
  { key: "geography", icon: "🌍" },
  { key: "science", icon: "🔬" },
  { key: "history", icon: "📜" },
  { key: "technology", icon: "💻" },
  { key: "music", icon: "🎵" },
  { key: "sports", icon: "⚽" },
  { key: "games", icon: "🎮" },
  { key: "arts", icon: "🎨" },
  { key: "food", icon: "🍽️" },
  { key: "cars", icon: "🚗" },
];

const CATEGORY_LABELS = {
  en: {
    geography: "Geography",
    science: "Science",
    history: "History",
    technology: "Technology",
    music: "Music",
    sports: "Sports",
    games: "Games",
    arts: "Arts",
    food: "Food",
    cars: "Cars",
  },
  ar: {
    geography: "الجغرافيا",
    science: "العلوم",
    history: "التاريخ",
    technology: "التقنية",
    music: "الموسيقى",
    sports: "الرياضة",
    games: "الألعاب",
    arts: "الفنون",
    food: "الطعام",
    cars: "السيارات",
  },
  fr: {
    geography: "Géographie",
    science: "Science",
    history: "Histoire",
    technology: "Technologie",
    music: "Musique",
    sports: "Sports",
    games: "Jeux",
    arts: "Arts",
    food: "Cuisine",
    cars: "Voitures",
  },
  es: {
    geography: "Geografía",
    science: "Ciencia",
    history: "Historia",
    technology: "Tecnología",
    music: "Música",
    sports: "Deportes",
    games: "Juegos",
    arts: "Artes",
    food: "Comida",
    cars: "Coches",
  },
};

export default function LoginVisualPanel() {
  const { t } = useI18n();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);
  const activeLang = normalizeLanguageCode(selectedLang);
  const labels = CATEGORY_LABELS[activeLang] || CATEGORY_LABELS.en;

  const stats = [
    { value: "15", label: t("landing.categories") },
    { value: t("common.language_count"), label: t("landing.languages") },
    { value: "∞", label: t("common.ai_questions") },
    { value: "KWD", label: t("common.prizes_via_tap") },
  ];

  return (
    <div className="relative flex h-auto w-full flex-col overflow-hidden bg-dark-1 px-4 pb-8 pt-10 text-white lg:h-full lg:px-10 lg:py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at bottom left, #240E6A 0%, transparent 60%),
            radial-gradient(circle at top right, #240E6A 0%, transparent 60%),
            radial-gradient(circle at top left, #110B33 0%, transparent 50%),
            radial-gradient(circle at bottom right, #110B33 0%, transparent 50%)
          `,
        }}
      />

      <AnimatedDotBackground opacityClass="opacity-15" />

      <div className={`relative z-10 mx-auto flex h-full w-full max-w-[560px] flex-col items-center text-center ${isRTL ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'}`}>
        <div className="mb-6 w-full shrink-0 lg:mb-0">
          <Link href="/" className="hidden flex-col justify-center gap-3 transition-opacity hover:opacity-90 lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-gradient-brand shadow-hero">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/60">
                <CircleDot className="h-4 w-4 text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h2 className="text-[18px] font-black uppercase leading-none tracking-tight text-white xl:text-[22px]">{t("nav.brand_name")}</h2>
              <p className="mt-1 text-[11px] font-[700] uppercase leading-snug tracking-[1px] text-white/50 xl:text-[14px] xl:tracking-[1.6px]">
                {t("nav.brand_tagline")}
              </p>
            </div>
          </Link>

          <Link href="/" className="mx-auto flex items-center justify-center gap-3.5 transition-opacity hover:opacity-90 lg:hidden">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-[#4E5BFF] shadow-hero">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-white/80">
                <CircleDot className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center">
              <h2 className="mb-0.5 text-[20px] font-black uppercase leading-tight tracking-tight text-white">{t("nav.brand_name")}</h2>
              <p className="text-[10px] font-bold uppercase leading-none tracking-[1.5px] text-white/60">{t("nav.brand_tagline")}</p>
            </div>
          </Link>
        </div>

        <div className="mb-6 mt-3 flex w-full flex-1 flex-col justify-center lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
          <div className="hidden w-full grid-cols-5 gap-3 lg:grid xl:gap-5">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group flex aspect-square w-full flex-col items-center justify-center rounded-[16px] border border-white/10 bg-white/5 py-5 shadow-sm transition-all hover:border-white/20 hover:bg-white/10 xl:rounded-[20px]"
              >
                <div className="mb-2 text-[26px] drop-shadow-md xl:text-[32px]">{cat.icon}</div>
                <span className="text-[10px] font-semibold tracking-wide text-white/80 xl:text-[11px]">
                  {labels[cat.key] || CATEGORY_LABELS.en[cat.key]}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex w-full flex-nowrap items-center justify-center gap-1.5 px-0.5 lg:hidden">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <div key={cat.key} className="flex shrink-0 items-center gap-1 rounded-[10px] border border-white/10 bg-white/5 px-2 py-1">
                <span className="text-[11px]">{cat.icon}</span>
                <span className="whitespace-nowrap text-[9.5px] font-bold text-white/90">{labels[cat.key] || CATEGORY_LABELS.en[cat.key]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex w-full shrink-0 flex-col items-center lg:mt-0 lg:items-start">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mb-2 text-center text-[18px] font-bold leading-[1.2] tracking-[-0.02em] text-white lg:mb-4 lg:text-[36px] lg:font-black lg:leading-[1.1] xl:text-[46px] ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
          >
            {t("landing.hero_title_line1")} <br className="hidden lg:block" />
            {t("landing.hero_title_line2")}
          </motion.h3>

          <p className="mb-8 hidden max-w-[400px] text-[13px] font-medium leading-relaxed text-blue-100/50 lg:mb-10 lg:block xl:text-[15px]">
            {t("landing.hero_subtitle")}
          </p>

          <p className="block max-w-[280px] text-center text-[11px] font-medium leading-relaxed text-blue-100/60 lg:hidden">
            {t("landing.hero_subtitle")}
          </p>

          <div className="mt-4 hidden w-full gap-x-6 lg:mt-6 lg:flex xl:mt-8 xl:gap-x-8">
            {stats.map((s, idx) => (
              <div key={s.label} className="relative flex-1">
                {idx !== stats.length - 1 ? (
                  <div className="absolute top-1/2 h-8 w-[1px] -translate-y-1/2 bg-white/10 [inset-inline-end:-12px] xl:[inset-inline-end:-16px]" />
                ) : null}
                <p className="text-[20px] font-black leading-none text-white xl:text-[28px]">{s.value}</p>
                <p className="mt-1 text-[10px] font-medium text-white/50 xl:text-[12px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
