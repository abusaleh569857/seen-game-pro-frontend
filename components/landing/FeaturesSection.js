'use client';
import { motion } from 'framer-motion';
import { Trophy, Zap, Coins, Layers, Globe, Shield, Crown, Bot } from 'lucide-react';

const FEATURES = [
  {
    icon: <Trophy size={18} className="text-yellow-500" />,
    bg: 'bg-yellow-500/10',
    title: 'Live Tournaments',
    desc: 'Scheduled group competitions across all 15 categories. Free entry, real Qeem prizes paid via Tap Payment.',
  },
  {
    icon: <Zap size={18} className="text-purple-400" />,
    bg: 'bg-purple-500/10',
    title: '1v1 Challenge System',
    desc: 'Challenge pro friends or a random wager. Pay entry in Qeem, winner takes some until winner is declared.',
  },
  {
    icon: <Coins size={18} className="text-orange-400" />,
    bg: 'bg-orange-500/10',
    title: 'Qeem Coin Economy',
    desc: 'Buy Qeem, wager on challenges, earn tournament prizes. Secure payments via Tap Gateway in KWD.',
  },
  {
    icon: <Layers size={18} className="text-green-400" />,
    bg: 'bg-green-500/10',
    title: 'Joker Power-Ups',
    desc: '50/50, Skip, Time and Reveal jokers — from your inventory first, then Qeem balance. Strategy is key.',
  },
  {
    icon: <Globe size={18} className="text-cyan-400" />,
    bg: 'bg-cyan-500/10',
    title: '4 Languages · RTL',
    desc: 'Arabic (default), English, French, Spanish. Flawless RTL layout for Arabic — designed Mobile-First from the ground up.',
  },
  {
    icon: <Shield size={18} className="text-red-400" />,
    bg: 'bg-red-500/10',
    title: 'Clan & Group Play',
    desc: 'Join QuizClans or create your own clan. Aggregate scores, rule the group leaderboards and dominate rivals.',
  },
  {
    icon: <Crown size={18} className="text-pink-400" />,
    bg: 'bg-pink-500/10',
    title: 'VIP Subscription',
    desc: 'Monthly token allowance, 5-10% Qeem match back, exclusive badges, frames and leaderboard priority.',
  },
  {
    icon: <Bot size={18} className="text-blue-400" />,
    bg: 'bg-blue-500/10',
    title: 'AI Question Engine',
    desc: 'Admin generates 10 fresh questions per category per batch via OpenAI. Content always culturally appropriate.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full pt-4 pb-12 px-4 lg:px-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-start sm:items-center">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-3 text-left sm:text-center w-full sm:w-auto">
          Everything You Need
        </p>

        <h2 className="hidden sm:block text-[32px] sm:text-[40px] lg:text-[44px] font-black tracking-tight text-white mb-4 leading-[1.1] text-center w-full">
          Built for competitive players
        </h2>
        <p className="hidden sm:block text-[14px] lg:text-[15px] font-medium text-white/50 max-w-[600px] mb-16 text-center leading-relaxed">
          From casual quizzes to high-stakes tournaments — Seen Game Pro has everything you need to compete and earn.
        </p>

        <h2 className="block sm:hidden text-[32px] font-black tracking-tight text-white mb-4 leading-[1.1] text-left w-full">
          Built to win
        </h2>
        <p className="block sm:hidden text-[14px] font-medium text-white/50 max-w-[600px] mb-12 text-left leading-relaxed w-full">
          From casual quizzes to live tournaments —<br/>compete and earn.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col p-6 rounded-[20px] bg-gray-900 border border-white/5 hover:brightness-125 transition-all"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${feat.bg} mb-5`}>
                {feat.icon}
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2 leading-snug tracking-tight">
                {feat.title}
              </h3>
              <p className="text-[13px] font-medium text-white/50 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
