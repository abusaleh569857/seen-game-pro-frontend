'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, Coins, Layers, Globe, Shield, Crown, Bot } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSelector } from 'react-redux';
import { isRtlLanguage } from '@/lib/languages';

const FEATURES = [
  {
    icon: <Trophy size={18} className="text-yellow-500" />,
    bg: 'bg-yellow-500/10',
    titleKey: 'landing.live_tournaments',
    descKey: 'landing.live_tournaments_desc',
  },
  {
    icon: <Zap size={18} className="text-purple-400" />,
    bg: 'bg-purple-500/10',
    titleKey: 'landing.challenge_system',
    descKey: 'landing.challenge_system_desc',
  },
  {
    icon: <Coins size={18} className="text-orange-400" />,
    bg: 'bg-orange-500/10',
    titleKey: 'landing.qeem_economy',
    descKey: 'landing.qeem_economy_desc',
  },
  {
    icon: <Layers size={18} className="text-green-400" />,
    bg: 'bg-green-500/10',
    titleKey: 'landing.joker_powerups',
    descKey: 'landing.joker_powerups_desc',
  },
  {
    icon: <Globe size={18} className="text-cyan-400" />,
    bg: 'bg-cyan-500/10',
    titleKey: 'landing.languages_rtl',
    descKey: 'landing.languages_rtl_desc',
  },
  {
    icon: <Shield size={18} className="text-red-400" />,
    bg: 'bg-red-500/10',
    titleKey: 'landing.clan_play',
    descKey: 'landing.clan_play_desc',
  },
  {
    icon: <Crown size={18} className="text-pink-400" />,
    bg: 'bg-pink-500/10',
    titleKey: 'landing.vip_subscription',
    descKey: 'landing.vip_subscription_desc',
  },
  {
    icon: <Bot size={18} className="text-blue-400" />,
    bg: 'bg-blue-500/10',
    titleKey: 'landing.ai_engine',
    descKey: 'landing.ai_engine_desc',
  },
];

export default function FeaturesSection() {
  const { t } = useI18n();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);

  return (
    <section className="w-full pb-12 pt-4 px-4 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start sm:items-center">
        <p className={`mb-3 w-full text-[11px] font-bold uppercase tracking-[2px] text-white/40 sm:w-auto sm:text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('landing.everything_you_need')}
        </p>

        <h2 className="mb-4 hidden w-full text-center text-[32px] font-black leading-[1.1] tracking-tight text-white sm:block sm:text-[40px] lg:text-[44px]">
          {t('landing.built_for_competitive_players')}
        </h2>
        <p className="mb-16 hidden max-w-[600px] text-center text-[14px] font-medium leading-relaxed text-white/50 sm:block lg:text-[15px]">
          {t('landing.built_for_competitive_players_subtitle')}
        </p>

        <h2 className={`mb-4 block w-full text-[32px] font-black leading-[1.1] tracking-tight text-white sm:hidden ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('landing.built_to_win')}
        </h2>
        <p className={`mb-12 block w-full max-w-[600px] text-[14px] font-medium leading-relaxed text-white/50 sm:hidden ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('landing.built_to_win_subtitle')}
        </p>

        <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col rounded-[20px] border border-white/5 bg-gray-900 p-6 transition-all hover:brightness-125"
            >
              <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full ${feature.bg}`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 text-[16px] font-bold leading-snug tracking-tight text-white">
                {t(feature.titleKey)}
              </h3>
              <p className="text-[13px] font-medium leading-relaxed text-white/50">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
