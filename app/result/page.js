'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart3,
  Check,
  Clock3,
  Flame,
  Play,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import { fetchLeaderboard, resetQuiz } from '@/store/slices/quizSlice';

const RANKING_COLORS = [
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500',
];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function buildResultRanking(leaderboard, user, earnedPoints) {
  const userBasePoints = Number(user?.points || 0);
  const currentUsername = user?.username || 'You';
  const rows = (leaderboard || []).slice(0, 8).map((entry, index) => ({
    id: entry.id,
    name: entry.username,
    points: Number(entry.points || 0),
    isYou: entry.username === currentUsername,
    color: RANKING_COLORS[index % RANKING_COLORS.length],
  }));

  const nextUserPoints = userBasePoints + earnedPoints;
  const existingIndex = rows.findIndex((entry) => entry.isYou);

  if (existingIndex >= 0) {
    rows[existingIndex] = {
      ...rows[existingIndex],
      points: Math.max(rows[existingIndex].points, nextUserPoints),
    };
  } else if (user) {
    rows.push({
      id: 'current-user',
      name: currentUsername,
      points: nextUserPoints,
      isYou: true,
      color: 'bg-violet-600',
    });
  }

  return rows
    .sort((left, right) => right.points - left.points)
    .slice(0, 5)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      initials: entry.name?.slice(0, 1).toUpperCase() || 'U',
      color: entry.isYou ? 'bg-violet-600' : entry.color,
    }));
}

function formatDisplayName(username) {
  if (!username) {
    return 'Player';
  }

  return username.length > 15 ? `${username.slice(0, 15)}...` : username;
}

function ResultContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useSelector((state) => state.auth);
  const { result, leaderboard } = useSelector((state) => state.quiz);
  const { t } = useI18n();

  const score = Number.parseInt(searchParams.get('score') || `${result?.score || 0}`, 10);
  const total = Number.parseInt(searchParams.get('total') || `${result?.total || 0}`, 10);
  const earnedPoints = Number.parseInt(searchParams.get('points') || `${result?.earnedPoints || 0}`, 10);
  const categoryName = searchParams.get('category') || t('quiz.page_title');
  const timeSpent = Number.parseInt(searchParams.get('time') || '0', 10);
  const bestStreak = Number.parseInt(searchParams.get('streak') || '0', 10);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrongAnswers = Math.max(0, total - score);
  const displayName = formatDisplayName(user?.username);
  const ranking = useMemo(
    () => buildResultRanking(leaderboard, user, earnedPoints),
    [earnedPoints, leaderboard, user],
  );
  const yourRank = ranking.find((entry) => entry.isYou)?.rank || '-';

  const questionMapStatuses = useMemo(() => {
    const results = result?.results || [];

    return Array.from({ length: total }, (_, index) => {
      const item = results[index];

      if (!item) {
        return 'pending';
      }

      if (item.selected === 'SKIP') {
        return 'joker';
      }

      return item.isCorrect ? 'correct' : 'wrong';
    });
  }, [result?.results, total]);

  const summaryRows = [
    {
      key: 'correct',
      label: t('result.correct_answers'),
      detail: t('result.answers_each', { score }),
      amount: `+${earnedPoints}`,
      tone: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      icon: Check,
    },
    {
      key: 'streak',
      label: t('result.streak_bonus'),
      detail: t('result.streak_achieved', { streak: bestStreak }),
      amount: '+0',
      tone: 'text-amber-600 bg-amber-50 border-amber-100',
      icon: Flame,
    },
    {
      key: 'speed',
      label: t('result.speed_bonus'),
      detail: t('result.finished_in', { time: formatTime(timeSpent) }),
      amount: '+0',
      tone: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      icon: Clock3,
    },
    {
      key: 'wrong',
      label: t('result.wrong_answers'),
      detail: t('result.answers_missed', { count: wrongAnswers }),
      amount: '0',
      tone: 'text-rose-600 bg-rose-50 border-rose-100',
      icon: X,
    },
  ];

  const handlePlayAgain = () => {
    dispatch(resetQuiz());
    router.push('/categories');
  };

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <PageHeader
        pageName={t('result.page_title')}
        breadcrumbs={[
          { label: t('categoriesPage.title'), href: '/categories' },
          { label: t('quiz.page_title'), href: '/categories' },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 lg:px-8">
        {/* Full-width Score Summary Header */}
        <div className="mb-6 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#2b155d] via-[#32206b] to-[#274e9d] p-5 text-white shadow-[0_28px_70px_rgba(49,46,129,0.24)] lg:mb-8 lg:p-6 lg:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4 lg:gap-6">
              <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[24px] border border-amber-300/20 bg-white/10 text-5xl shadow-inner shadow-amber-200/10">
                🏆
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-black uppercase tracking-[0.24em] text-white/55">
                  {t('result.score_summary')}
                </p>
                <h1 className="mt-2 text-[24px] font-black leading-[1.1] lg:text-[28px]">
                  {t('result.well_done', { name: displayName })}
                </h1>
                <p className="mt-2 text-sm text-white/70 lg:text-[15px]">
                  {t('result.completed_quiz', { category: categoryName, total })}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white/90">
                  <Trophy className="h-4 w-4 text-amber-300" />
                  {categoryName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 xl:min-w-[450px]">
              <div className="rounded-[22px] border border-white/10 bg-white/10 px-3 py-3 text-center sm:px-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{t('result.score')}</p>
                <p className="mt-2 text-3xl font-black sm:text-[38px]">{earnedPoints}</p>
                <p className="mt-1 text-xs text-white/55">{t('result.pts_earned')}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/10 px-3 py-3 text-center sm:px-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{t('result.your_rank')}</p>
                <p className="mt-2 text-3xl font-black text-amber-300 sm:text-[38px]">#{yourRank}</p>
                <p className="mt-1 text-xs text-white/55">{t('result.this_session')}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/10 px-3 py-3 text-center sm:px-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">{t('result.accuracy')}</p>
                <p className="mt-2 text-3xl font-black text-emerald-300 sm:text-[38px]">{accuracy}%</p>
                <p className="mt-1 text-xs text-white/55">
                  {t('result.of_right', { score, total })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-8">
            <div className="flex flex-col gap-5">

              <div className="grid grid-cols-2 gap-3 rounded-[28px] border border-white/80 bg-white p-4 shadow-sm md:grid-cols-5">
                <div className="rounded-[22px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-center">
                  <Check className="mx-auto h-5 w-5 text-emerald-500" />
                  <p className="mt-2 text-3xl font-black text-emerald-600">{score}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{t('quiz.correct')}</p>
                </div>
                <div className="rounded-[22px] border border-rose-100 bg-rose-50 px-4 py-4 text-center">
                  <X className="mx-auto h-5 w-5 text-rose-500" />
                  <p className="mt-2 text-3xl font-black text-rose-600">{wrongAnswers}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{t('quiz.wrong')}</p>
                </div>
                <div className="rounded-[22px] border border-amber-100 bg-amber-50 px-4 py-4 text-center">
                  <Flame className="mx-auto h-5 w-5 text-amber-500" />
                  <p className="mt-2 text-3xl font-black text-amber-600">{bestStreak}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{t('quiz.streak')}</p>
                </div>
                <div className="rounded-[22px] border border-violet-100 bg-violet-50 px-4 py-4 text-center">
                  <Target className="mx-auto h-5 w-5 text-violet-500" />
                  <p className="mt-2 text-3xl font-black text-violet-600">{accuracy}%</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{t('result.accuracy')}</p>
                </div>
                <div className="rounded-[22px] border border-cyan-100 bg-cyan-50 px-4 py-4 text-center">
                  <Clock3 className="mx-auto h-5 w-5 text-cyan-500" />
                  <p className="mt-2 text-3xl font-black text-cyan-600">{formatTime(timeSpent)}</p>
                  <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{t('result.time')}</p>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/80 bg-white p-5 shadow-sm lg:p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-black text-slate-900">{t('result.points_earned')}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t('result.points_subtitle')}</p>
                </div>

                <div className="space-y-2.5">
                  {summaryRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        className="flex items-center justify-between rounded-[22px] border border-slate-100 px-4 py-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${row.tone}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{row.label}</p>
                            <p className="mt-1 text-xs text-slate-500">{row.detail}</p>
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-4 py-2 text-sm font-black ${
                            row.key === 'wrong'
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {row.amount}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className="mt-4 lg:mt-5 inline-flex w-full items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3.5 text-base font-black text-white shadow-[0_18px_45px_rgba(99,102,241,0.24)] transition hover:from-violet-500 hover:to-blue-400"
                >
                  <Play className="h-4 w-4 fill-white" />
                  {t('result.play_again')}
                </button>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 lg:self-start">
            <div className="flex flex-col gap-5">
              <div className="rounded-[28px] border border-white/80 bg-white p-4 lg:p-5 lg:pb-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('result.question_map')}</p>
                  <span className="text-sm font-semibold text-slate-500">
                    {score}/{total}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 lg:gap-2">
                  {questionMapStatuses.map((status, index) => {
                    const styles =
                      status === 'correct'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                        : status === 'wrong'
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : status === 'joker'
                        ? 'border-amber-300 bg-amber-50 text-amber-600'
                        : 'border-slate-200 bg-slate-50 text-slate-400';

                    return (
                      <div
                        key={`result-map-${index + 1}`}
                        className={`flex aspect-square items-center justify-center rounded-[18px] border text-sm font-black ${styles}`}
                      >
                        {status === 'correct' ? <Check className="h-4 w-4" /> : null}
                        {status === 'wrong' ? <X className="h-4 w-4" /> : null}
                        {status === 'joker' ? 'J' : null}
                        {status === 'pending' ? index + 1 : null}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    {t('quiz.correct')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    {t('quiz.wrong')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Joker
                  </span>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/80 bg-white p-4 lg:p-5 lg:pt-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('result.live_ranking')}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.18em] text-rose-500">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    {t('common.live')}
                  </span>
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  {ranking.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between rounded-[20px] px-3 py-1.5 lg:py-2 ${
                        player.isYou ? 'bg-violet-50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-4 text-xs font-black text-slate-400">{player.rank}</span>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white ${player.color}`}
                        >
                          {player.initials}
                        </div>
                        <p className={`text-sm font-bold ${player.isYou ? 'text-violet-700' : 'text-slate-800'}`}>
                          {player.name}
                          {player.isYou ? ' (You)' : ''}
                        </p>
                      </div>
                      <p className={`text-sm font-black ${player.isYou ? 'text-violet-700' : 'text-slate-900'}`}>
                        {player.points}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/leaderboard')}
                  className="mt-3 lg:mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100"
                >
                  <BarChart3 className="h-4 w-4" />
                  {t('result.leaderboard')}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <ProtectedRoute>
      <ResultContent />
    </ProtectedRoute>
  );
}
