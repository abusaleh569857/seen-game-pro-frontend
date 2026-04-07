'use client';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";

export default function HeroSection() {
  const router = useRouter();

  const handleStartPlay = () => {
    router.push('/login');
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-16 pb-16 lg:pt-24 lg:pb-24 px-4 overflow-hidden bg-[#180A50]">
      {/* Background with glowing effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 55%),
            radial-gradient(circle at top right, #240E6A 0%, transparent 60%),
            radial-gradient(circle at top left, #110B33 0%, transparent 50%)
          `
        }}
      />
      
      {/* Dynamic Animated Dots from Auth Panel */}
      <AnimatedDotBackground opacityClass="opacity-20" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="text-[14px] leading-none text-[#A78BFA]">✦</span>
          <span className="text-[10px] lg:text-[11px] font-bold text-white/70 uppercase tracking-widest">
            Multilingual Quiz Platform • Arabic (Default) • EN • FR • UR
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[42px] sm:text-[56px] lg:text-[72px] font-black leading-[1.05] tracking-tight text-white mb-6"
        >
          Compete. Learn.<br className="hidden sm:block" />
          Rise to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E5BFF] to-[#34D399]">#1.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-[700px] text-[14px] lg:text-[16px] font-medium leading-relaxed text-blue-100/60 mb-10"
        >
          15 quiz categories. Live tournaments. 1v1 wagers. Qeem coin prizes. Play in Arabic, English, French or Urdu — all in one platform.
        </motion.p>

        {/* Language Selection Chips (Visual Only) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 mb-10 w-full"
        >
           <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[12px] font-bold text-white/80">
            <div className="h-[10px] w-[14px] overflow-hidden rounded-[1.5px] shadow-sm"><img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg" alt="EN" className="h-full w-full object-cover" /></div> Play in English
           </div>
           <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#4E5BFF]/30 bg-[#4E5BFF]/10 text-[12px] font-bold text-white shadow-[0_0_15px_rgba(78,91,255,0.2)]">
            <div className="h-[10px] w-[14px] overflow-hidden rounded-[1.5px] shadow-sm"><img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/KW.svg" alt="AR" className="h-full w-full object-cover" /></div> العب بالعربية
           </div>
           <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 text-[12px] font-bold text-white/60 hover:bg-white/5 transition">
            <div className="h-[10px] w-[14px] overflow-hidden rounded-[1.5px] shadow-sm"><img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg" alt="FR" className="h-full w-full object-cover" /></div> Jouer en français
           </div>
           <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 text-[12px] font-bold text-white/60 hover:bg-white/5 transition">
            <div className="h-[10px] w-[14px] overflow-hidden rounded-[1.5px] shadow-sm"><img src="https://purecatamphetamine.github.io/country-flag-icons/3x2/PK.svg" alt="UR" className="h-full w-full object-cover" /></div> اردو میں کھیلیں
           </div>
        </motion.div>

        {/* Call to Action Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleStartPlay}
          className="group flex items-center gap-3 px-8 lg:px-10 py-4 rounded-[16px] text-white font-black tracking-wide bg-gradient-to-r from-[#6248FF] to-[#486CFF] shadow-hero hover:shadow-[0_8px_40px_rgba(98,72,255,0.6)] transition-all hover:-translate-y-1"
        >
          <Play fill="currentColor" size={16} />
          Start Playing — Free
        </motion.button>
      </div>

      {/* Stats Banner at bottom of Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-12 lg:mt-16 flex flex-row items-stretch justify-around lg:justify-between rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">15</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">Categories</p>
        </div>
        
        <div className="w-[1px] bg-white/10 block" />
        
        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">4</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">Languages</p>
        </div>
        
        <div className="w-[1px] bg-white/10 hidden sm:block" />
        
        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6 hidden sm:flex">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">10</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40 mt-0.5 leading-tight">
            Questions /<br/>Round
          </p>
        </div>
        
        <div className="w-[1px] bg-white/10 hidden lg:block" />
        
        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6 hidden lg:flex">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">∞</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">AI Questions</p>
        </div>
        
        <div className="w-[1px] bg-white/10 block" />
        
        <div className="flex flex-col items-center justify-center flex-1 text-center px-1 sm:px-2 py-4 sm:py-6">
          <p className="text-[20px] lg:text-[34px] font-black text-white leading-none mb-1.5">KWD</p>
          <p className="text-[8px] lg:text-[10px] tracking-widest font-bold uppercase text-white/40">Prizes via Tap</p>
        </div>
      </motion.div>
    </section>
  );
}
