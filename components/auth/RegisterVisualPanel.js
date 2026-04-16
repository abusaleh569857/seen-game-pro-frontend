"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CircleDot } from "lucide-react";
import { useSelector } from "react-redux";
import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";
import { useI18n } from "@/lib/i18n";
import { extractLocaleFromPathname, isRtlLocale } from "@/lib/i18n-settings";

const FEATURE_ITEMS = [
  {
    icon: "/icons/earth.png",
    titleKey: "auth.visual_feature_categories_title",
    descriptionKey: "auth.visual_feature_categories_desc",
  },
  {
    icon: "/icons/coin.png",
    titleKey: "auth.visual_feature_prizes_title",
    descriptionKey: "auth.visual_feature_prizes_desc",
  },
  {
    icon: "/icons/bolt.png",
    titleKey: "auth.visual_feature_challenge_title",
    descriptionKey: "auth.visual_feature_challenge_desc",
  },
  {
    icon: "/icons/trophy.png",
    titleKey: "landing.live_tournaments",
    descriptionKey: "landing.live_tournaments_desc",
  },
  {
    icon: "/icons/globe.png",
    titleKey: "auth.visual_feature_languages_title",
    descriptionKey: "auth.visual_feature_languages_desc",
  },
];

const COMMUNITY = ["L", "G", "D", "M", "+"];
const COMMUNITY_COLORS = ["#F59E0B", "#2DD4BF", "#FB7185", "#06B6D4", "#64748B"];

function BrandMark() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-gradient-brand shadow-hero">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/60">
        <CircleDot className="h-4 w-4 text-white" strokeWidth={3} />
      </div>
    </div>
  );
}

export default function RegisterVisualPanel() {
  const { t, i18n } = useI18n();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const pathname = usePathname();
  const localeFromPath = extractLocaleFromPathname(pathname || "");
  const activeLocale = String(i18n?.resolvedLanguage || i18n?.language || selectedLang || "en").split("-")[0];
  const documentDir = typeof document !== "undefined" ? document.documentElement?.dir : "";
  const isRTL = isRtlLocale(localeFromPath || activeLocale || selectedLang) || documentDir === "rtl";

  return (
    <aside className="relative flex h-auto w-full shrink-0 flex-col overflow-hidden bg-dark-1 px-4 pb-6 pt-8 text-white lg:h-full lg:flex lg:px-10 lg:py-12">
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

      <div className={`relative z-10 mx-auto flex h-full w-full max-w-[560px] flex-col items-center text-center ${isRTL ? 'lg:ml-auto lg:mr-0 lg:items-end lg:text-right' : 'lg:mr-auto lg:ml-0 lg:items-start lg:text-left'}`}>
        <Link href="/" className="mb-6 hidden w-full shrink-0 items-center gap-4 transition-opacity hover:opacity-90 lg:mb-0 lg:flex">
          <BrandMark />
          <div>
            <h2 className="text-[18px] font-black uppercase leading-none tracking-tight text-white lg:text-[20px] xl:text-[22px]">
              {t("nav.brand_name")}
            </h2>
            <p className="mt-0.5 text-[11px] font-[700] uppercase leading-snug tracking-[1px] text-white/50 lg:mt-1 lg:text-[12px] xl:text-[14px] xl:leading-[21px] xl:tracking-[1.6px]">
              {t("auth.visual_brand_subtitle")}
            </p>
          </div>
        </Link>

        <Link href="/" className="mx-auto mb-5 flex w-full shrink-0 items-center justify-center gap-3.5 transition-opacity hover:opacity-90 lg:hidden">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-[#4E5BFF] shadow-hero">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-[2px] border-white/80">
              <CircleDot className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="mb-0.5 text-[18px] font-black uppercase leading-tight tracking-tight text-white">
              {t("nav.brand_name")}
            </h2>
            <p className="text-[10px] font-medium leading-none text-white/80">{t("auth.visual_brand_subtitle_mobile")}</p>
          </div>
        </Link>

        <div className="mx-auto grid w-full max-w-[300px] grid-cols-2 gap-2 lg:hidden">
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">🌍</span>
            <span className="text-[9px] font-bold text-white/90">{t("auth.visual_feature_categories_title")}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">💎</span>
            <span className="text-[9px] font-bold text-white/90">{t("auth.visual_feature_prizes_title")}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">⚡</span>
            <span className="text-[9px] font-bold text-white/90">{t("auth.visual_feature_challenge_title")}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">🌐</span>
            <span className="text-[9px] font-bold text-white/90">{t("auth.visual_feature_languages_title")}</span>
          </div>
        </div>

        <div className={`relative z-10 mt-16 hidden w-full flex-1 flex-col space-y-8 lg:flex xl:mt-20 xl:space-y-10 ${isRTL ? 'items-end pr-2' : 'items-start'}`}>
          {FEATURE_ITEMS.map((item) => (
            isRTL ? (
              <div key={item.titleKey} className="flex w-full max-w-[420px] items-start justify-end gap-5 ml-auto [direction:ltr]">
                <div className="w-full max-w-[300px] pt-1 text-right">
                  <h3 className="text-[14px] font-black tracking-tight text-white xl:text-[16px]">{t(item.titleKey)}</h3>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-white/50 xl:mt-1.5 xl:text-[13px] xl:leading-[21px]">
                    {t(item.descriptionKey)}
                  </p>
                </div>
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <Image src={item.icon} alt={t(item.titleKey)} width={32} height={32} className="relative z-10 object-contain drop-shadow-md" />
                </div>
              </div>
            ) : (
              <div key={item.titleKey} className="flex w-full max-w-[360px] items-start gap-5">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-white/5 shadow-sm transition-all hover:border-white/20 hover:bg-white/10">
                  <Image src={item.icon} alt={t(item.titleKey)} width={32} height={32} className="relative z-10 object-contain drop-shadow-md" />
                </div>
                <div className="w-full max-w-[240px] pt-1 xl:max-w-[280px]">
                  <h3 className="text-[14px] font-black tracking-tight text-white xl:text-[16px]">{t(item.titleKey)}</h3>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-white/50 xl:mt-1.5 xl:text-[13px] xl:leading-[21px]">
                    {t(item.descriptionKey)}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="relative z-10 mt-10 hidden w-full shrink-0 border-t border-white/10 pt-8 lg:block">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {COMMUNITY.map((item, index) => (
                <div
                  key={item}
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dark-1 text-[12px] font-black text-white shadow-md transition-transform hover:z-20 hover:scale-110"
                  style={{ backgroundColor: COMMUNITY_COLORS[index] }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="min-w-0">
              <p className="overflow-visible whitespace-nowrap text-[12px] font-[800] uppercase leading-snug tracking-[1.2px] text-white xl:text-[14px] xl:leading-[21px] xl:tracking-[1.6px]">
                {t("auth.visual_community_title")}
              </p>
              <p className="mt-0.5 overflow-visible whitespace-nowrap text-[11px] font-medium text-white/50 xl:mt-1 xl:text-[13px]">
                {t("auth.visual_community_subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
