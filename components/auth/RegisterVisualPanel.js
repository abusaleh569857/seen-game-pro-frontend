"use client";

import Image from "next/image";
import { CircleDot } from "lucide-react";
import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";

const FEATURE_ITEMS = [
  {
    icon: "/icons/earth.png",
    title: "15 Quiz Categories",
    description:
      "Sports, History, Science, Geography, Arts, Technology & 9 more — all skill levels welcome",
  },
  {
    icon: "/icons/coin.png",
    title: "Qeem Coins & Prizes",
    description:
      "Earn coins, buy Jokers, challenge friends for Qeem wagers, and win tournament prizes in KWD",
  },
  {
    icon: "/icons/bolt.png",
    title: "1v1 Challenge System",
    description:
      "Send challenges, set wagers, climb the global leaderboard — Frozen Balance logic ensures fair play",
  },
  {
    icon: "/icons/trophy.png",
    title: "Live Tournaments",
    description:
      "Compete in scheduled group competitions across all 15 categories — free entry, real Qeem prizes",
  },
  {
    icon: "/icons/globe.png",
    title: "4 Languages",
    description:
      "Arabic (default), English, French, Urdu — full RTL support for Arabic and Urdu speakers",
  },
];

const COMMUNITY = ["L", "G", "D", "M", "+"];
const COMMUNITY_COLORS = [
  "#F59E0B",
  "#2DD4BF",
  "#FB7185",
  "#06B6D4",
  "#64748B",
];

function BrandMark() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-brand shadow-hero border border-white/10">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/60">
        <CircleDot className="h-4 w-4 text-white" strokeWidth={3} />
      </div>
    </div>
  );
}

export default function RegisterVisualPanel() {
  return (
    <aside className="relative w-full flex-col overflow-hidden bg-dark-1 text-white flex lg:flex h-auto lg:h-full px-4 pt-8 pb-6 lg:px-10 lg:py-12 shrink-0">
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
        
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 w-full mb-6 lg:mb-0">
          <BrandMark />
          <div>
            <h2 className="text-[18px] lg:text-[20px] xl:text-[22px] font-black uppercase leading-none tracking-tight text-white">
              Seen Game Pro
            </h2>
            <p className="mt-0.5 lg:mt-1 text-[11px] lg:text-[12px] xl:text-[14px] font-[700] uppercase tracking-[1px] xl:tracking-[1.6px] leading-snug xl:leading-[21px] align-middle text-white/50">
              Free to Join · Start Playing
            </p>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex items-center justify-center gap-3.5 lg:hidden mx-auto shrink-0 w-full mb-5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#4E5BFF] shadow-hero border border-white/10 shrink-0">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-[2px] border-white/80">
              <CircleDot className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-[18px] font-black uppercase leading-tight tracking-tight text-white mb-0.5">
              Seen Game Pro
            </h2>
            <p className="text-[10px] font-medium leading-none text-white/80">
              Free to join - Start earning Qeem
            </p>
          </div>
        </div>

        {/* Mobile Pills Grid */}
        <div className="lg:hidden grid grid-cols-2 gap-2 w-full max-w-[300px] mx-auto">
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">🌍</span>
            <span className="text-[9px] font-bold text-white/90">15 Categories</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">💎</span>
            <span className="text-[9px] font-bold text-white/90">Qeem Prizes</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">⚡</span>
            <span className="text-[9px] font-bold text-white/90">1v1 Challenges</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
            <span className="text-[12px]">🌐</span>
            <span className="text-[9px] font-bold text-white/90">4 Languages</span>
          </div>
        </div>

      <div className="relative z-10 hidden lg:flex flex-1 mt-16 flex-col space-y-8 xl:mt-20 xl:space-y-10">
        {FEATURE_ITEMS.map((item, index) => (
          <div key={index} className="flex gap-5 items-start">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 shadow-sm overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all">
              <Image
                src={item.icon}
                alt={item.title}
                width={32}
                height={32}
                className="relative z-10 drop-shadow-md object-contain"
              />
            </div>

            <div className="pt-1 w-full max-w-[240px] xl:max-w-[280px]">
              <h3 className="text-[14px] xl:text-[16px] font-black text-white tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1 xl:mt-1.5 text-[11px] xl:text-[13px] font-medium leading-relaxed xl:leading-[21px] text-white/50">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 hidden lg:block shrink-0 mt-10 border-t border-white/10 pt-8 w-full">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {COMMUNITY.map((item, index) => (
              <div
                key={index}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dark-1 text-[12px] font-black text-white shadow-md relative z-10 hover:z-20 transition-transform hover:scale-110"
                style={{ backgroundColor: COMMUNITY_COLORS[index] }}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] xl:text-[14px] font-[800] uppercase tracking-[1.2px] xl:tracking-[1.6px] leading-snug xl:leading-[21px] text-white whitespace-nowrap overflow-visible">
              Join LearnMira, GrowthX & more
            </p>
            <p className="mt-0.5 xl:mt-1 text-[11px] xl:text-[13px] font-medium text-white/50 whitespace-nowrap overflow-visible">
              Growing community · Kuwait · Free
            </p>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
}
