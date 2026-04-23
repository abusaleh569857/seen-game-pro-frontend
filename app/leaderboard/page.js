'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookOpen,
  Brush,
  Building2,
  Car,
  Coffee,
  Flame,
  Gamepad2,
  Globe2,
  Info,
  Microscope,
  Monitor,
  Music,
  Pizza,
  Play,
  Trophy,
  User,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';
import { fetchLeaderboard } from '@/store/slices/quizSlice';
import { normalizeLanguageCode } from '@/lib/languages';
import Link from 'next/link';
import Image from 'next/image';

// === HELPER FUNCTIONS ===
function getInitials(username) {
  return username?.slice(0, 2).toUpperCase() || 'U';
}

function containsArabicScript(value) {
  return /[\u0600-\u06FF]/.test(String(value || ''));
}

function getLocalizedCategoryLabel(categoryObj, lang, fallbackLabel) {
  const localized = categoryObj?.[lang];
  const english = categoryObj?.en;

  if (lang === 'ar') {
    return localized || english || fallbackLabel;
  }

  if (localized && !containsArabicScript(localized)) {
    return localized;
  }

  return english || localized || fallbackLabel;
}

function getCategoryDisplayLabel(categoryObj, lang, t, fallbackLabel) {
  const base = getLocalizedCategoryLabel(categoryObj, lang, fallbackLabel);
  if (lang !== 'es') return base;

  const source = String(categoryObj?.en || base || '').trim().toLowerCase();
  const esCategoryKeyMap = {
    sports: 'leaderboard.category_sports',
    history: 'leaderboard.category_history',
    games: 'leaderboard.category_games',
    entertainment: 'leaderboard.category_entertainment',
    business: 'leaderboard.category_business',
    general: 'leaderboard.category_general',
  };

  const i18nKey = esCategoryKeyMap[source];
  return i18nKey ? t(i18nKey) : base;
}

function getBadgesV2(entry, t, lang) {
  const badges = [];
  const topRanker = t('leaderboard.badge_top_ranker');
  const quizMaster = t('leaderboard.badge_quiz_master');
  const growthHacker = t('leaderboard.badge_growth_hacker');
  const fastLearner = t('leaderboard.badge_fast_learner');
  const topDesigner = t('leaderboard.badge_top_designer');
  const mrNumber = t('leaderboard.badge_mr_number');
  const codeStreak = t('leaderboard.badge_code_streak');
  const topCategory = getCategoryDisplayLabel(entry.favorite_category, lang, t, t('leaderboard.category_general'));

  if (entry.rank === 1) badges.push({ label: topRanker, className: 'bg-[#FFF8E6] text-[#D99A1A] border border-[#FDECB1]' });
  if (entry.rank <= 3) badges.push({ label: t('leaderboard.badge_top_category', { category: topCategory }), className: 'bg-[#EBF5FF] text-[#1D74E8] border border-[#BFDBFE]' });
  if (entry.rank >= 4 && entry.rank <= 6) badges.push({ label: topDesigner, className: 'bg-[#EBF5FF] text-[#1D74E8] border border-[#BFDBFE]' });
  if (entry.best_streak >= 5 && badges.length < 2) badges.push({ label: quizMaster, className: 'bg-[#FDF2F8] text-[#DB2777] border border-[#FBCFE8]' });
  if (entry.games_played >= 10 && badges.length < 2) badges.push({ label: mrNumber, className: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]' });
  if (entry.games_played >= 20 && badges.length < 2) badges.push({ label: growthHacker, className: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]' });
  if (entry.points >= 500 && badges.length < 2) badges.push({ label: codeStreak, className: 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]' });
  if (badges.length === 0) badges.push({ label: fastLearner, className: 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]' });
  if (badges.length < 2 && entry.best_streak >= 3) badges.push({ label: quizMaster, className: 'bg-[#FDF2F8] text-[#DB2777] border border-[#FBCFE8]' });

  return badges;
}

const CATEGORY_ICON_META = {
  Sports: { icon: Gamepad2, className: 'text-emerald-500' },
  History: { icon: BookOpen, className: 'text-amber-600' },
  Science: { icon: Microscope, className: 'text-teal-500' },
  Geography: { icon: Globe2, className: 'text-blue-500' },
  Culture: { icon: Coffee, className: 'text-violet-500' },
  Arts: { icon: Brush, className: 'text-pink-500' },
  Entertainment: { icon: Play, className: 'text-rose-500' },
  Nature: { icon: Flame, className: 'text-emerald-500' },
  Technology: { icon: Monitor, className: 'text-blue-600' },
  Food: { icon: Pizza, className: 'text-amber-500' },
  Cars: { icon: Car, className: 'text-red-500' },
  Business: { icon: Building2, className: 'text-purple-500' },
  Games: { icon: Gamepad2, className: 'text-emerald-500' },
  Music: { icon: Music, className: 'text-pink-500' },
  General: { icon: User, className: 'text-slate-500' },
};

function getFavCategoryMeta(catName) {
  return CATEGORY_ICON_META[catName] || CATEGORY_ICON_META.General;
}

// === COMPONENTS ===

function TopCard({ entry, lang, t, isRTL }) {
  const initials = getInitials(entry.username);
  const badges = getBadgesV2(entry, t, lang);
  const rankColors = {
    1: { bg: 'bg-[#FFB800]', text: 'text-white' },
    2: { bg: 'bg-[#94A3B8]', text: 'text-white' },
    3: { bg: 'bg-[#D97706]', text: 'text-white' }
  };
  
  const avatarColors = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500'];
  const avatarColor = avatarColors[(entry.rank - 1) % 3];
  const rankPill = rankColors[entry.rank] || { bg: 'bg-gray-900', text: 'text-white' };

  return (
    <article className="bg-white rounded-2xl flex flex-col p-4 shadow-sm border border-gray-100 flex-1 relative h-full pb-10">
      {/* Rank (top-right) */}
      <div
        className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} ${rankPill.bg} ${rankPill.text} px-2.5 py-1 rounded-xl text-[12px] font-black shadow-sm`}
        aria-label={t('leaderboard.rank_aria', { rank: entry.rank })}
      >
        #{entry.rank}
      </div>

      {/* Points (bottom-right) */}
      <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-[13px] font-black text-gray-800">{entry.points?.toLocaleString()}</span>
      </div>

      <div className="flex justify-between items-start w-full mb-4">
        <div className="relative">
          <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-lg font-black text-white`}>
            {initials}
          </div>
        </div>
      </div>

      <div className="mb-3 flex-1">
        <p className="text-[15px] font-black text-gray-900">{entry.username}</p>
        <p className="text-[11px] font-medium text-gray-400 mt-0.5">
          {t('leaderboard.games_count', { count: entry.games_played })} &bull; <Flame className="w-3 h-3 inline text-orange-500" />{' '}
          {t('leaderboard.streak_wins', { count: entry.best_streak })}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {badges.slice(0, 2).map((b, i) => (
          <span key={i} className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full ${b.className}`}>
            {b.label}
          </span>
        ))}
        {badges.length > 2 && (
          <span className="inline-flex items-center px-2 py-0.5 text-[9px] bg-gray-100 text-gray-600 font-bold rounded-full">
            +{badges.length - 2}
          </span>
        )}
      </div>
    </article>
  );
}

function ListRow({ entry, lang, t, isRTL }) {
  const badges = getBadgesV2(entry, t, lang);
  const initials = getInitials(entry.username);
  const avatarColors = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500'];
  const avatarColor = avatarColors[entry.rank % avatarColors.length];
  
  const hasPlayed = Number(entry.games_played || 0) > 0;
  const categoryName = hasPlayed
    ? getCategoryDisplayLabel(entry.favorite_category, lang, t, t('leaderboard.category_general'))
    : t('leaderboard.no_games_played');
  const categoryMeta = getFavCategoryMeta(entry.favorite_category?.en || 'General');
  const CategoryIcon = categoryMeta.icon;

  const whoLabel = entry.isCurrentUser ? t('common.you') : entry.username;

  return (
    <div className={`grid grid-cols-12 items-center px-4 py-3 border-b border-gray-100/60 transition-colors last:border-0 ${entry.isCurrentUser ? 'bg-indigo-50/50' : 'hover:bg-gray-50/50'}`}>
      <div className={`col-span-1 text-[13px] font-bold text-gray-500 ${isRTL ? 'pr-2 text-right' : 'pl-2'}`}>
        {entry.rank}
      </div>
      <div className="col-span-3 lg:col-span-3 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
          {initials}
        </div>
        <p className={`text-[13px] font-black truncate ${entry.isCurrentUser ? 'text-indigo-600' : 'text-gray-900'}`}>
          {whoLabel}
        </p>
      </div>
      <div className="col-span-3 lg:col-span-2 flex items-center gap-2">
        {hasPlayed ? <CategoryIcon className={`h-4 w-4 ${categoryMeta.className}`} /> : null}
        <span className="text-[12px] font-semibold text-gray-600 truncate">{categoryName}</span>
      </div>
      <div className="col-span-2 flex items-center">
        <span className="inline-flex items-center gap-1 bg-[#FFFBEB] text-[#D97706] px-2 py-0.5 rounded text-[11px] font-bold border border-[#FDE68A]">
          <Trophy className="w-3 h-3 text-amber-500" /> {t('leaderboard.streak_wins', { count: entry.best_streak })}
        </span>
      </div>
      <div className="col-span-2 lg:col-span-3 flex flex-wrap gap-1.5 hidden md:flex">
        {badges.slice(0, 2).map((b, i) => (
          <span key={i} className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full ${b.className} whitespace-nowrap`}>
            {b.label}
          </span>
        ))}
        {badges.length > 2 && (
          <span className="inline-flex px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-600 font-bold rounded-full">
            +{badges.length - 2}
          </span>
        )}
      </div>
      <div className={`col-span-3 lg:col-span-1 flex items-center gap-1.5 ${isRTL ? 'justify-start pl-2' : 'justify-end pr-2'}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        <span className="text-[13px] font-black text-gray-800">{entry.points?.toLocaleString()}</span>
      </div>
    </div>
  );
}

function StickyFooter({ currentUserRankData, lang, t, isRTL }) {
  if (!currentUserRankData) return null;
  const initials = getInitials(currentUserRankData.username);
  const hasPlayed = Number(currentUserRankData.games_played || 0) > 0;
  const categoryName = hasPlayed
    ? getCategoryDisplayLabel(currentUserRankData.favorite_category, lang, t, t('leaderboard.category_general'))
    : t('leaderboard.no_games_played');
  const categoryMeta = getFavCategoryMeta(currentUserRankData.favorite_category?.en || 'General');
  const CategoryIcon = categoryMeta.icon;
  
  const hasComparisonRank = Number(currentUserRankData.rank) > 1 || Number(currentUserRankData.rank) === 1;
  const previousRankDiff = Number(currentUserRankData.diffFromPrevious ?? 0);
  const previousRankDiffAbs = Math.abs(previousRankDiff);
  const previousRankDiffSign = previousRankDiff > 0 ? '+' : previousRankDiff < 0 ? '-' : '';
  const previousRankDiffClass = previousRankDiff > 0 ? 'text-emerald-500' : previousRankDiff < 0 ? 'text-rose-500' : 'text-gray-500';
  const isTop10 = currentUserRankData.rank <= 10;

  return (
    <div className={`w-full bg-white lg:rounded-2xl border-t lg:border border-gray-100 px-6 py-4 flex items-center justify-between mb-8 shadow-sm overflow-x-auto min-w-[800px] ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`hidden md:flex flex-col items-center ${isRTL ? 'border-l border-gray-200 pl-5' : 'border-r border-gray-200 pr-5'}`}>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('leaderboard.your_rank')}</span>
            <span className="text-xl font-black text-indigo-500">#{currentUserRankData.rank}</span>
          </div>
          <div className={`hidden md:flex flex-col items-center ${isRTL ? 'border-l border-gray-200 pl-5' : 'border-r border-gray-200 pr-5'}`}>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('leaderboard.your_points')}</span>
            <span className="text-xl font-black text-indigo-500">{currentUserRankData.points}</span>
          </div>
        </div>
        
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white shrink-0`}>
            {initials}
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-black text-gray-900">{t('common.you')}</p>
            <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
              {hasPlayed ? <CategoryIcon className={`h-3.5 w-3.5 ${categoryMeta.className}`} /> : null}
              {categoryName} &bull; <Flame className="w-3 h-3 text-orange-500" />{' '}
              {t('leaderboard.streak_wins', { count: currentUserRankData.best_streak })}
            </p>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`hidden lg:flex items-center gap-6 divide-gray-100 ${isRTL ? 'divide-x-reverse divide-x flex-row-reverse' : 'divide-x'}`}>
          <div className={`flex flex-col items-center ${isRTL ? 'pr-6' : 'pl-6'}`}>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('leaderboard.vs_previous_rank')}</span>
            <span className={`text-[13px] font-black ${previousRankDiffClass}`}>
              {hasComparisonRank ? `${previousRankDiffSign}${previousRankDiffAbs} ${t('leaderboard.points_short')}` : '-'}
            </span>
          </div>
          <div className={`flex flex-col items-center ${isRTL ? 'pr-6' : 'pl-6'}`}>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('leaderboard.top_10')}</span>
            <span className={`text-[13px] font-black ${isTop10 ? 'text-emerald-500' : 'text-gray-400'}`}>
              {isTop10 ? t('leaderboard.inside_top') : '-'}
            </span>
          </div>
          <div className={`flex flex-col items-center ${isRTL ? 'pl-6 pr-0' : 'pl-6 pr-6'}`}>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t('leaderboard.table_badges')}</span>
            <span className="text-[13px] font-black text-indigo-500">{getBadgesV2(currentUserRankData, t, lang).length}</span>
          </div>
        </div>
        
        <Link href="/play/active" className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-[12px] font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2">
          <span aria-hidden="true">&gt;</span> {t('leaderboard.play_now')}
        </Link>
      </div>
    </div>
  );
}

// === MAIN RENDER ===

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboard, leaderboardLoading, leaderboardSummary, selectedLang } = useSelector((state) => state.quiz);
  const { user } = useSelector((state) => state.auth);
  const [period, setPeriod] = useState('all');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  const lang = normalizeLanguageCode(selectedLang);
  const isRTL = lang === 'ar';
  const { t } = useI18n();
  const periodLabel =
    period === 'week'
      ? t('leaderboard.period_week')
      : period === 'month'
        ? t('leaderboard.period_month')
        : t('leaderboard.period_all');

  useEffect(() => {
    dispatch(fetchLeaderboard({ period, lang }));
  }, [dispatch, period, lang]);

  // Dynamic Deadline Countdown Calculation
  useEffect(() => {
    if (!leaderboardSummary?.deadlineAt) return;
    const deadlineStr = leaderboardSummary.deadlineAt;
    
    const calculateTimeLeft = () => {
      const difference = +new Date(deadlineStr) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // update every minute
    return () => clearInterval(timer);
  }, [leaderboardSummary]);

  // Formatting and enriching data
  const formattedLeaderboard = useMemo(() => {
    return leaderboard.map(entry => ({
      ...entry,
      isCurrentUser: user?.id && entry.id === user.id
    }));
  }, [leaderboard, user]);

  const topThree = formattedLeaderboard.slice(0, 3);
  const restOfPlayers = formattedLeaderboard.slice(3);
  
  const currentUserRankData = useMemo(() => {
    const me = formattedLeaderboard.find(e => e.isCurrentUser);
    if (!me) return null;
    
    // Point difference against comparison rank:
    // - rank > 1: compare with rank - 1
    // - rank = 1: compare with rank 2
    let gapToNext = 0;
    let diffFromPrevious = 0;
    const comparisonRank = me.rank > 1 ? me.rank - 1 : 2;
    const comparisonPlayer = formattedLeaderboard.find(e => e.rank === comparisonRank);
    if (comparisonPlayer) {
      gapToNext = comparisonPlayer.points - me.points;
      diffFromPrevious = me.points - comparisonPlayer.points;
    }

    // Dynamic stats for the Hero section
    let targetRank = me.rank > 10 ? 10 : (me.rank > 3 ? 3 : 1);
    let gapToTargetRank = 0;
    if (me.rank > 1) {
       const targetPerson = formattedLeaderboard.find(e => e.rank === targetRank);
       if (targetPerson) {
         gapToTargetRank = Math.max(0, targetPerson.points - me.points);
       }
    }

    return { ...me, gapToNext, diffFromPrevious, targetRank, gapToTargetRank };
  }, [formattedLeaderboard]);

  const topCategories = leaderboardSummary?.topCategories || [];
  const fallbackTopCategories = useMemo(
    () => [
      { key: 'Entertainment', label: t('leaderboard.category_entertainment') },
      { key: 'General', label: t('leaderboard.badge_quiz_master') },
      { key: 'Games', label: t('leaderboard.category_games') },
      { key: 'Sports', label: t('leaderboard.category_sports') },
      { key: 'History', label: t('leaderboard.category_history') },
      { key: 'Business', label: t('leaderboard.category_business') },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader pageName={t('leaderboard.page_title')} />

      <main className="mx-auto max-w-7xl px-4 lg:px-6 pb-8">
        {/* Dynamic Header & Period Selection */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">{t('leaderboard.global_title')}</h2>
            <p className="text-[11px] text-gray-500 font-medium">
              {t('leaderboard.updated_line', { players: leaderboardSummary?.totalPlayers || 0 })} &bull; {periodLabel}
            </p>
          </div>
          
          <div className="bg-gray-100/80 p-1 flex items-center rounded-xl overflow-hidden">
            {['week', 'month', 'all'].map((p) => {
              const labels = {
                week: t('leaderboard.period_week'),
                month: t('leaderboard.period_month'),
                all: t('leaderboard.period_all'),
              };
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    period === p ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {labels[p]}
                </button>
              )
            })}
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          {/* Left Hero Card - Restructured */}
          <div className="lg:col-span-8 bg-linear-to-r from-[#170E3A] to-[#25175B] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[160px] shadow-lg">
            {/* Text Content */}
            <div className="relative z-10 w-full md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-white text-xl font-black mb-2">{t('leaderboard.hero_title')}</h2>
              <p className={`text-white/80 text-[11px] font-medium leading-relaxed mb-4 ${isRTL ? 'pl-4' : 'pr-4'}`}>
                {t('leaderboard.hero_subtitle_ss', { points: currentUserRankData?.gapToTargetRank ?? 9 })}
              </p>
              <Link href="/play/active" className="inline-flex bg-white text-[#170E3A] text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-max">
                {t('leaderboard.play_game')}
              </Link>
            </div>

            {/* Structured Category Grid - Enhanced Visibility */}
            <div className="relative z-10 w-full md:w-[45%] lg:w-[42%] grid grid-cols-2 sm:grid-cols-3 gap-3 self-start md:mt-2">
              {(topCategories.length > 0 ? topCategories : fallbackTopCategories).slice(0, 9).map((cat, idx) => {
                const catLabel = getCategoryDisplayLabel(cat.name, lang, t, cat.label || t('leaderboard.category_general'));
                const iconKey = cat.key || cat.name?.en || 'General';
                const iconMeta = getFavCategoryMeta(iconKey);
                const HeroCategoryIcon = iconMeta.icon;

                return (
                <div
                  key={idx} 
                  className="bg-white/15 backdrop-blur-md text-white py-2 px-2.5 rounded-xl text-[11px] font-extrabold border border-white/30 flex items-center justify-center text-center truncate shadow-sm hover:bg-white/25 hover:scale-105 transition-all cursor-default"
                >
                  <HeroCategoryIcon className={`mr-1.5 h-3.5 w-3.5 ${iconMeta.className}`} />
                  {catLabel}
                </div>
              )})}
            </div>
            
            {/* Subtle background glow */}
            <div className={`absolute top-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -mt-32 rounded-full ${isRTL ? 'left-0 -ml-32' : 'right-0 -mr-32'}`}></div>
          </div>

          {/* Right Hero Card - Dynamic Countdown */}
          <div className="lg:col-span-4 bg-linear-to-br from-[#FFFAEB] to-[#FFF3E6] border border-[#FEF3C7] rounded-2xl p-6 shadow-sm relative flex flex-col justify-center min-h-[160px]">
            <h3 className="text-gray-800 font-bold text-[14px]">{t('leaderboard.remaining_time')}</h3>
            
            <div className="flex items-center gap-4 mt-3 mb-3">
              <div className="flex flex-col items-center min-w-[32px]">
                <span className="text-3xl font-black text-gray-900 leading-none">{timeLeft.days}</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase mt-1">{t('leaderboard.days')}</span>
              </div>
              <span className="text-xl font-bold text-gray-400 mb-4">:</span>
              <div className="flex flex-col items-center min-w-[32px]">
                <span className="text-3xl font-black text-gray-900 leading-none">{timeLeft.hours}</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase mt-1">{t('leaderboard.hours')}</span>
              </div>
              <span className="text-xl font-bold text-gray-400 mb-4">:</span>
              <div className="flex flex-col items-center min-w-[32px]">
                <span className="text-3xl font-black text-gray-900 leading-none">{timeLeft.minutes}</span>
                <span className="text-[8px] font-bold text-gray-500 uppercase mt-1">{t('leaderboard.minutes')}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500 relative z-10">
              <Info className="w-3 h-3" />
              <span className="text-[10px] font-medium leading-tight max-w-[80%]">{t('leaderboard.prize_note')}</span>
            </div>
            
            <div className={`absolute top-1/2 -translate-y-[55%] opacity-30 select-none pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
              <Image src="/icons/trophy.png" alt="Champion Trophy" width={74} height={74} className="h-[74px] w-[74px] object-contain" />
            </div>
          </div>
        </div>

        {/* TOP 3 GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {leaderboardLoading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={`top-${i}`} className="h-40 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse"></div>
             ))
          ) : topThree.length > 0 ? (
             topThree.map(entry => <TopCard key={entry.id} entry={entry} lang={lang} t={t} isRTL={isRTL} />)
          ) : (
            <div className="col-span-3 text-center text-sm font-bold text-gray-400 py-10">{t('leaderboard.empty')}</div>
          )}
        </div>

        {/* FULL RANKINGS LIST */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-100 p-5 pb-3">
            <h3 className="text-[14px] font-black text-gray-900">{t('leaderboard.full_rankings')}</h3>
            <p className="text-[11px] text-gray-400 font-medium">
              {t('leaderboard.positions_line', { from: 4, to: Math.max(4, leaderboard.length) })} &bull; {periodLabel}
            </p>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[700px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 px-4 py-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-white">
                <div className={`col-span-1 ${isRTL ? 'pr-2 text-right' : 'pl-2'}`}>{t('leaderboard.table_rank')}</div>
                <div className="col-span-3">{t('leaderboard.table_user')}</div>
                <div className="col-span-3 lg:col-span-2">{t('leaderboard.table_category')}</div>
                <div className="col-span-2">{t('leaderboard.table_streak')}</div>
                <div className="col-span-2 lg:col-span-3">{t('leaderboard.table_badges')}</div>
                <div className={`col-span-1 lg:col-span-1 ${isRTL ? 'text-left pl-2' : 'text-right pr-2'}`}>{t('leaderboard.table_points')}</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col">
                {leaderboardLoading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                     <div key={`list-${i}`} className="h-14 border-b border-gray-50 flex items-center px-4 animate-pulse bg-gray-50/30"></div>
                   ))
                ) : restOfPlayers.length > 0 ? (
                  restOfPlayers.map(entry => <ListRow key={entry.id} entry={entry} lang={lang} t={t} isRTL={isRTL} />)
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm font-medium">{t('leaderboard.empty')}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <StickyFooter currentUserRankData={currentUserRankData} lang={lang} t={t} isRTL={isRTL} />
        </div>
      </main>
    </div>
  );
}
