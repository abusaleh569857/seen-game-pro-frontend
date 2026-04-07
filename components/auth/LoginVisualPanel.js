"use client";
import { motion } from "framer-motion";
import { CircleDot } from "lucide-react";
import Link from "next/link";
import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";

const CATEGORIES = [
  { name: "Geography", icon: "🌍" },
  { name: "Science", icon: "🔬" },
  { name: "History", icon: "📜" },
  { name: "Technology", icon: "💻" },
  { name: "Music", icon: "🎵" },
  { name: "Sports", icon: "⚽" },
  { name: "Games", icon: "🎮" },
  { name: "Arts", icon: "🎨" },
  { name: "Food", icon: "🍽️" },
  { name: "Cars", icon: "🚗" },
];

const STATS = [
  { value: "15", label: "Categories" },
  { value: "4", label: "Languages" },
  { value: "∞", label: "Questions" },
  { value: "KWD", label: "Prizes" },
];

export default function LoginVisualPanel() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden bg-dark-1 text-white h-auto lg:h-full lg:px-10 lg:py-12 pt-10 pb-8 px-4">
      <div
        className="absolute inset-0 pointer-events-none"
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

      <div className="relative z-10 flex h-full w-full max-w-[560px] mx-auto flex-col items-center lg:items-start text-center lg:text-left">
        
        {/* Logo Section */}
        <div className="shrink-0 mb-6 lg:mb-0 w-full">
          <Link href="/" className="flex lg:items-center justify-center lg:justify-start gap-3 lg:gap-4 flex-col lg:flex-row hidden lg:flex hover:opacity-90 transition-opacity">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-brand shadow-hero border border-white/10">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/60">
                <CircleDot className="h-4 w-4 text-white" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h2 className="text-[18px] xl:text-[22px] font-black uppercase leading-none tracking-tight text-white">
                Seen Game Pro
              </h2>
              <p className="mt-1 text-[11px] xl:text-[14px] font-[700] uppercase tracking-[1px] xl:tracking-[1.6px] leading-snug text-white/50">
                Multilingual Quiz Platform
              </p>
            </div>
          </Link>

          <Link href="/" className="flex items-center justify-center gap-3.5 lg:hidden mx-auto hover:opacity-90 transition-opacity">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-[#4E5BFF] shadow-hero border border-white/10 shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-white/80">
                <CircleDot className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-[20px] font-black uppercase leading-tight tracking-tight text-white mb-0.5">
                Seen Game Pro
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] leading-none text-white/60">
                Multilingual Quiz
              </p>
            </div>
          </Link>
        </div>

        {/* Categories Section */}
        <div className="w-full flex-1 flex flex-col justify-center lg:flex-row lg:items-center mt-3 mb-6 lg:mt-0 lg:mb-0">
          <div className="hidden lg:grid grid-cols-5 gap-3 xl:gap-5 w-full">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group flex w-full flex-col items-center justify-center rounded-[16px] xl:rounded-[20px] border border-white/10 bg-white/5 aspect-square xl:aspect-[4/4.5] py-5 transition-all hover:bg-white/10 hover:border-white/20 shadow-sm"
              >
                <div className="text-[26px] xl:text-[32px] drop-shadow-md mb-2">
                  {cat.icon}
                </div>
                <span className="text-[10px] xl:text-[11px] font-semibold tracking-wide text-white/80">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex lg:hidden flex-nowrap w-full items-center justify-center gap-1.5 px-0.5">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex shrink-0 items-center gap-1 rounded-[10px] border border-white/10 bg-white/5 px-2 py-1">
                <span className="text-[11px] grayscale lg:grayscale-0">{cat.icon}</span>
                <span className="text-[9.5px] font-bold text-white/90 whitespace-nowrap">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="shrink-0 w-full flex flex-col items-center lg:items-start lg:mt-0 mt-2">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2 lg:mb-4 text-[18px] lg:text-[36px] xl:text-[46px] font-bold lg:font-black leading-[1.2] lg:leading-[1.1] tracking-[-0.02em] text-center lg:text-left text-white"
          >
            Compete. Learn. <br className="hidden lg:block"/>Rise to #1.
          </motion.h3>

          <p className="hidden lg:block mb-8 lg:mb-10 max-w-[400px] text-[13px] xl:text-[15px] font-medium leading-relaxed text-blue-100/50">
            15 categories, 4 languages, live tournaments, 1v1
            <br />
            challenges and Qeem rewards — all in one platform.
          </p>

          <p className="block lg:hidden text-[11px] font-medium leading-relaxed text-blue-100/60 max-w-[280px] text-center">
            15 categories · 4 languages · Qeem prizes ·<br />Live tournaments
          </p>

          <div className="hidden lg:flex w-full mt-4 lg:mt-6 xl:mt-8 gap-x-6 xl:gap-x-8">
            {STATS.map((s, idx) => (
              <div key={s.label} className="relative flex-1">
                {idx !== STATS.length - 1 && (
                  <div className="absolute right-[-12px] xl:right-[-16px] top-1/2 h-8 w-[1px] -translate-y-1/2 bg-white/10" />
                )}
                <p className="text-[20px] lg:text-[20px] xl:text-[28px] font-black leading-none text-white">
                  {s.value}
                </p>
                <p className="mt-1 lg:mt-1 text-[10px] lg:text-[10px] xl:text-[12px] font-medium text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
