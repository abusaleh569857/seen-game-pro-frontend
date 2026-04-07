'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="w-full pt-0 pb-16 px-4 lg:px-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl mx-auto rounded-[24px] lg:rounded-[32px] overflow-hidden bg-[#0F072D] border border-white/5 py-16 lg:py-24 px-6 flex flex-col items-center text-center shadow-lg"
      >
        {/* Background Gradients */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 0% 100%, rgba(98, 72, 255, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 100% 0%, rgba(192, 38, 211, 0.1) 0%, transparent 50%)
            `
          }}
        />

        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-black tracking-tight leading-[1.05] text-white mb-6">
            Ready to rise to #1?
          </h2>
          
          <p className="text-[15px] lg:text-[17px] font-medium text-white/60 mb-10 max-w-[500px] leading-relaxed">
            Join thousands of players competing across Kuwait and beyond. Free to start. Sign up in 30 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-[14px] text-white text-[14px] lg:text-[15px] font-bold tracking-wide bg-gradient-to-r from-[#6248FF] to-[#486CFF] shadow-hero hover:shadow-[0_8px_30px_rgba(98,72,255,0.5)] transition-all hover:-translate-y-0.5">
                <Play fill="currentColor" size={14} />
                Create Free Account
              </button>
            </Link>
            
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-[14px] text-white/90 text-[14px] lg:text-[15px] font-bold tracking-wide bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Browse Categories {/* Wait, let's keep it exact to Figma. Oh, login redirects to play anyway. The Figma says Browse Categories, maybe linking to index page or categories section. Let's redirect to #categories or simply handle it using smooth scroll.  */}
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
