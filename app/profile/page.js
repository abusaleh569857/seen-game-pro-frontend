'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Gamepad2,
  Target,
  Flame,
  BarChart2,
  Pencil,
  Globe,
  Bell,
  ChevronDown as ChevronDownIcon,
  Trophy as TrophyIcon,
  ShoppingBag,
  ChevronRight,
  Home,
  Zap,
  Clock,
  Eye,
  Divide,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchHistory, fetchJokerInventory } from '@/store/slices/quizSlice';

// ─── Helper: Avatar Circle ───────────────────────────────────────────────────
function Avatar({ username, size = 'lg' }) {
  const initials = username?.slice(0, 2).toUpperCase() || 'UN';
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black shrink-0 ring-4 ring-white/20`}
    >
      {initials}
    </div>
  );
}

// ─── Helper: Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, value, label, borderColor }) {
  return (
    <div className={`bg-white rounded-2xl border-t-2 ${borderColor} p-4 flex flex-col items-center gap-2 shadow-sm`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
      <p className={`text-2xl font-black ${iconColor}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    </div>
  );
}

// ─── Helper: Achievement Badge ────────────────────────────────────────────────
function AchievementBadge({ emoji, label, color, isMobile }) {
  if (isMobile) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm">
        <span>{emoji}</span>
        {label}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${color}`}>
      <span>{emoji}</span>
      {label}
    </span>
  );
}

// ─── Helper: Joker Row ────────────────────────────────────────────────────────
function JokerRow({ icon: Icon, iconBg, label, count, isEmpty }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] font-semibold text-gray-700">{label}</span>
      </div>
      <span className={`text-[13px] font-black ${isEmpty ? 'text-red-500' : 'text-gray-800'}`}>
        × {count}
      </span>
    </div>
  );
}

// ─── Main Profile Content ─────────────────────────────────────────────────────
function ProfileContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { history, inventory } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchJokerInventory());
  }, [dispatch]);

  const qeemBalance = user?.qeemBalance ?? user?.qeem_balance ?? 0;
  const points = user?.points ?? 0;
  const gamesPlayed = history?.length ?? 0;
  const avgAccuracy =
    gamesPlayed > 0
      ? Math.round(
          (history.reduce((acc, g) => acc + g.score / (g.total_questions || 10), 0) / gamesPlayed) * 100
        )
      : 0;

  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(user.created_at))
    : 'Recently';

  const ACHIEVEMENTS = [
    { emoji: '🧠', label: 'Quiz Master', color: 'bg-purple-100 text-purple-700' },
    { emoji: '⚡', label: 'Fast Learner', color: 'bg-yellow-100 text-yellow-700' },
    { emoji: '🔥', label: '15-Day Streak', color: 'bg-orange-100 text-orange-700' },
    { emoji: '🌍', label: 'Geography Expert', color: 'bg-green-100 text-green-700' },
  ];

  const JOKERS = [
    { icon: Divide, iconBg: 'bg-blue-500', label: '50/50', key: 'fifty_fifty' },
    { icon: ChevronRight, iconBg: 'bg-indigo-500', label: 'Skip', key: 'skip' },
    { icon: Clock, iconBg: 'bg-green-500', label: 'Time', key: 'time' },
    { icon: Eye, iconBg: 'bg-red-500', label: 'Reveal', key: 'reveal' },
  ];

  const getResultLabel = (score, total) => {
    return score >= total * 0.5 ? 'Win' : 'Loss';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader pageName="My Profile" />

      <div className="px-4 lg:px-8 pb-8 max-w-[1440px] mx-auto">
        {/* ── Hero Banner ── */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1E1260] via-[#2D1B8E] to-[#1A0F6B] p-6 mb-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-16 w-24 h-24 rounded-full bg-violet-300 blur-2xl" />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Desktop & Mobile Combined Logic */}
            <div className="flex flex-col gap-6">
              {/* Profile Main Info */}
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <Avatar username={user?.username} size="lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-[#1E1260] shadow-lg">
                    <TrophyIcon className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>

                {/* Name & Edit (Mobile: Stacked/Right) */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="min-w-0">
                    <h2 className="text-xl lg:text-3xl font-black text-white break-words overflow-hidden leading-tight">
                      {user?.username}
                    </h2>
                    <p className="text-[11px] lg:text-[13px] text-white/60 mt-0.5 font-medium">
                      Member since {memberSince} · Rank #5
                    </p>
                  </div>
                  
                  {/* Edit Button - Consistent with Screenshot */}
                  <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[12px] font-bold px-5 py-2 rounded-xl transition w-fit backdrop-blur-sm">
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Achievement Badges - Mobile Horizontal Scroll/Wrap */}
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {ACHIEVEMENTS.map((a) => (
                  <AchievementBadge key={a.label} {...a} isMobile />
                ))}
              </div>
            </div>

            {/* Right Side: Qeem Balance - DESKTOP ONLY */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center min-w-[160px]">
              <p className="text-[12px] font-bold uppercase tracking-widest text-white/50 mb-1">QEEM BALANCE</p>
              <p className="text-5xl font-black text-white">{qeemBalance}</p>
              <p className="text-[12px] text-white/40 mt-1">Available coins</p>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={Star}
            iconColor="text-violet-600"
            value={points.toLocaleString()}
            label="Total Points"
            borderColor="border-violet-400"
          />
          <StatCard
            icon={Gamepad2}
            iconColor="text-green-600"
            value={gamesPlayed}
            label="Games Played"
            borderColor="border-green-400"
          />
          <StatCard
            icon={Target}
            iconColor="text-teal-600"
            value={`${avgAccuracy}%`}
            label="Avg Accuracy"
            borderColor="border-teal-400"
          />
          <StatCard
            icon={Flame}
            iconColor="text-orange-500"
            value="15"
            label="Day Streak"
            borderColor="border-orange-400"
          />
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              icon={BarChart2}
              iconColor="text-red-500"
              value="#5"
              label="Global Rank"
              borderColor="border-red-400"
            />
          </div>
        </div>

        {/* ── Bottom Section: Game History + Joker Inventory ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game History */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div>
                <h2 className="text-[15px] font-black text-gray-900">Game History</h2>
                <p className="text-[11px] text-gray-400">Last {Math.min(history.length, 6)} sessions</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Gamepad2 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-[13px] text-gray-500 font-medium">No games played yet</p>
                <Link
                  href="/play"
                  className="mt-3 text-[12px] text-violet-600 font-bold hover:underline"
                >
                  Start Playing →
                </Link>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-6 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50">
                  <span className="col-span-2">Category</span>
                  <span>Score</span>
                  <span>Correct</span>
                  <span>Result</span>
                  <span>Date</span>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-50">
                  {history.slice(0, 6).map((game) => {
                    const result = getResultLabel(game.score, game.total_questions);
                    const isWin = result === 'Win';
                    const date = new Date(game.created_at);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const dateLabel = isToday
                      ? 'Today'
                      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                      <div key={game.id} className="px-6 py-3">
                        {/* Desktop row */}
                        <div className="hidden lg:grid grid-cols-6 items-center">
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                              {game.icon || '🎯'}
                            </div>
                            <span className="text-[13px] font-semibold text-gray-800">{game.name_en}</span>
                          </div>
                          <span className="text-[13px] font-black text-violet-600">
                            {(game.score * 100).toLocaleString()}
                          </span>
                          <span className="text-[13px] font-semibold text-gray-700">
                            {game.score}/{game.total_questions}
                          </span>
                          <span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                isWin
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {result}
                            </span>
                          </span>
                          <span className="text-[12px] text-gray-400">{dateLabel}</span>
                        </div>

                        {/* Mobile row */}
                        <div className="lg:hidden flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-base shrink-0">
                              {game.icon || '🎯'}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-gray-800">{game.name_en}</p>
                              <p className="text-[11px] text-gray-400">
                                {game.score}/{game.total_questions} correct · 🔥 streak
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-black text-gray-900">
                              {(game.score * 100).toLocaleString()} pts
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isWin
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {result}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Joker Inventory */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 pb-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-black text-gray-900">Joker Inventory</h2>
              <Link
                href="/shop"
                className="text-[11px] font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full hover:bg-violet-100 transition"
              >
                Buy Jokers
              </Link>
            </div>

            <div>
              {JOKERS.map((joker) => {
                const count = inventory?.[joker.key] ?? 0;
                return (
                  <JokerRow
                    key={joker.key}
                    icon={joker.icon}
                    iconBg={joker.iconBg}
                    label={joker.label}
                    count={count}
                    isEmpty={count === 0}
                  />
                );
              })}
            </div>

            {/* Quick buy CTA */}
            <Link
              href="/shop"
              className="mt-2 lg:mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[13px] font-bold py-3 rounded-2xl hover:brightness-110 transition shadow-lg shadow-violet-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              Go to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
