'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ChevronRight, Clock3, Lightbulb, Scissors, SkipForward, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { getLocalizedCategoryName, normalizeLanguageCode } from '@/lib/languages';
import {
  eliminateOptions,
  fetchCategories,
  fetchJokerInventory,
  fetchLeaderboard,
  nextQuestion,
  resetQuiz,
  selectAnswer,
  startQuiz,
  submitQuiz,
  useJoker as triggerJokerAction,
} from '@/store/slices/quizSlice';

const BASE_TIME_SECONDS = 17;
const EXTRA_TIME_SECONDS = 15;

const JOKER_ITEMS = [
  {
    type: 'fifty_fifty',
    label: '50/50',
    subtitleKey: 'quiz.remove_wrong_answers',
    icon: Scissors,
    cost: 1,
    cardClass: 'from-violet-500/35 via-violet-500/20 to-violet-900/30 border-violet-300/30',
  },
  {
    type: 'skip',
    labelKey: 'shop.skip_label',
    subtitleKey: 'quiz.jump_next_question',
    icon: SkipForward,
    cost: 1,
    cardClass: 'from-blue-500/30 via-blue-500/20 to-blue-900/30 border-blue-300/30',
  },
  {
    type: 'time',
    labelKey: 'shop.time_label',
    subtitleKey: 'quiz.add_extra_time',
    icon: Clock3,
    cost: 2,
    cardClass: 'from-amber-500/30 via-orange-500/20 to-orange-900/30 border-orange-300/30',
  },
  {
    type: 'reveal',
    labelKey: 'shop.reveal_label',
    subtitleKey: 'quiz.show_correct_answer',
    icon: Lightbulb,
    cost: 3,
    cardClass: 'from-emerald-500/30 via-emerald-500/15 to-emerald-900/30 border-emerald-300/30',
  },
];

const LIVE_COLORS = ['bg-amber-500', 'bg-violet-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500'];

function jokerTitle(item, t) {
  return item.labelKey ? t(item.labelKey) : item.label;
}

function ActiveJokerDockPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useI18n();

  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const lang = normalizeLanguageCode(selectedLang);
  const isRTL = lang === 'ar';

  const { user } = useSelector((state) => state.auth);
  const {
    sessionId,
    questions,
    currentIndex,
    answers,
    selectedOption,
    eliminatedOptions,
    quizStatus,
    result,
    error,
    inventory,
    categories,
    leaderboard,
  } = useSelector((state) => state.quiz);

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(BASE_TIME_SECONDS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [answerMetaByQuestionId, setAnswerMetaByQuestionId] = useState({});
  const [jokerSource, setJokerSource] = useState(null);

  const currentQuestion = questions[currentIndex] || null;
  const currentQuestionMeta = currentQuestion ? answerMetaByQuestionId[currentQuestion.id] || null : null;

  const currentCategory = useMemo(
    () => categories.find((item) => String(item.id) === String(activeCategoryId)),
    [categories, activeCategoryId],
  );
  const categoryName = getLocalizedCategoryName(currentCategory, lang);
  const totalQuestions = questions.length;
  const currentQuestionNumber = totalQuestions ? currentIndex + 1 : 0;
  const progressPercent = totalQuestions ? (currentQuestionNumber / totalQuestions) * 100 : 0;
  const totalBalance = Number(user?.qeemBalance ?? user?.qeem_balance ?? 0);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchLeaderboard());
    dispatch(fetchJokerInventory());
  }, [dispatch]);

  useEffect(() => {
    if (!categories.length || activeCategoryId) {
      return;
    }

    const fromUrl =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('categoryId')
        : null;
    const fromStorage =
      typeof window !== 'undefined' ? window.localStorage.getItem('lastPlayedCategoryId') : null;

    const categoryFromQuery = categories.find((cat) => String(cat.id) === String(fromUrl));
    const categoryFromStorage = categories.find((cat) => String(cat.id) === String(fromStorage));
    const fallbackCategory = categoryFromQuery || categoryFromStorage || categories[0];

    if (fallbackCategory?.id) {
      setActiveCategoryId(fallbackCategory.id);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('lastPlayedCategoryId', String(fallbackCategory.id));
      }
    }
  }, [activeCategoryId, categories]);

  useEffect(() => {
    if (!activeCategoryId) {
      return;
    }

    dispatch(resetQuiz());
    setAnswerMetaByQuestionId({});
    setElapsedSeconds(0);
    setJokerSource(null);
    dispatch(startQuiz({ categoryId: activeCategoryId, lang }));
  }, [activeCategoryId, dispatch, lang]);

  useEffect(() => {
    setTimeLeft(BASE_TIME_SECONDS);
    setIsCheckingAnswer(false);
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (quizStatus !== 'playing' || !currentQuestion || isCheckingAnswer) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentQuestion, isCheckingAnswer, quizStatus, timeLeft]);

  useEffect(() => {
    if (quizStatus !== 'playing' || !currentQuestion || isCheckingAnswer || timeLeft <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentQuestion, isCheckingAnswer, quizStatus, timeLeft]);

  const handleAnswerSelect = useCallback(
    async (optionKey) => {
      if (!currentQuestion || quizStatus !== 'playing' || isCheckingAnswer || selectedOption) {
        return;
      }

      setIsCheckingAnswer(true);
      try {
        const normalizedSelected = String(optionKey).toUpperCase();
        const { data } = await api.post('/quiz/answer-check', {
          sessionId,
          questionId: currentQuestion.id,
          selected: normalizedSelected,
        });

        setAnswerMetaByQuestionId((current) => ({
          ...current,
          [currentQuestion.id]: data,
        }));
        dispatch(selectAnswer(data.selected));
      } catch (requestError) {
        window.alert(requestError.response?.data?.message || t('quiz.answer_check_failed'));
      } finally {
        setIsCheckingAnswer(false);
      }
    },
    [currentQuestion, dispatch, isCheckingAnswer, quizStatus, selectedOption, sessionId, t],
  );

  useEffect(() => {
    if (timeLeft === 0 && quizStatus === 'playing' && currentQuestion && !isCheckingAnswer) {
      handleAnswerSelect('TIMEOUT');
    }
  }, [currentQuestion, handleAnswerSelect, isCheckingAnswer, quizStatus, timeLeft]);

  useEffect(() => {
    if (error && quizStatus === 'idle') {
      window.alert(error);
      router.push('/categories');
    }
  }, [error, quizStatus, router]);

  const stats = useMemo(() => {
    const orderedResults = questions
      .map((question) => answerMetaByQuestionId[question.id])
      .filter(Boolean);

    const correctCount = orderedResults.filter((item) => item.isCorrect).length;
    const wrongCount = orderedResults.filter((item) => !item.isCorrect).length;
    let streak = 0;
    let rollingStreak = 0;

    orderedResults.forEach((item) => {
      if (item.isCorrect) {
        rollingStreak += 1;
      } else {
        rollingStreak = 0;
      }
      streak = rollingStreak;
    });

    return {
      correctCount,
      wrongCount,
      streak,
      score: correctCount * 10,
    };
  }, [answerMetaByQuestionId, questions]);

  useEffect(() => {
    if (quizStatus === 'finished' && result) {
      router.push(
        `/result?score=${result.score}&total=${result.total}&points=${result.earnedPoints}&category=${encodeURIComponent(categoryName)}&time=${elapsedSeconds}&streak=${stats.streak}`,
      );
    }
  }, [categoryName, elapsedSeconds, quizStatus, result, router, stats.streak]);

  const questionStatuses = useMemo(
    () =>
      questions.map((question, index) => {
        const resultForQuestion = answerMetaByQuestionId[question.id];
        if (resultForQuestion) {
          return resultForQuestion.isCorrect ? 'correct' : 'wrong';
        }
        if (index === currentIndex && quizStatus !== 'finished') {
          return 'active';
        }
        return 'pending';
      }),
    [answerMetaByQuestionId, currentIndex, questions, quizStatus],
  );

  const liveRankings = useMemo(() => {
    const meName = user?.username || t('common.you');
    const list = (leaderboard || []).slice(0, 8).map((entry, index) => ({
      id: entry.id,
      name: entry.username,
      points: Number(entry.points || 0),
      isYou: entry.username === meName,
      color: LIVE_COLORS[index % LIVE_COLORS.length],
    }));

    if (!list.some((entry) => entry.isYou) && user) {
      list.push({
        id: 'you-local',
        name: meName,
        points: stats.score,
        isYou: true,
        color: 'bg-violet-600',
      });
    } else {
      list.forEach((entry) => {
        if (entry.isYou) {
          entry.points = Math.max(entry.points, stats.score);
        }
      });
    }

    return list
      .sort((left, right) => right.points - left.points)
      .slice(0, 5)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        initials: entry.name?.slice(0, 1).toUpperCase() || 'U',
      }));
  }, [leaderboard, stats.score, t, user]);

  const handleNext = useCallback(() => {
    if (quizStatus !== 'answered') {
      return;
    }

    setTimeLeft(BASE_TIME_SECONDS);
    setJokerSource(null);

    const isLastQuestion = currentIndex + 1 >= questions.length;
    if (isLastQuestion) {
      dispatch(submitQuiz({ sessionId, answers }));
      return;
    }
    dispatch(nextQuestion());
  }, [answers, currentIndex, dispatch, questions.length, quizStatus, sessionId]);

  const applyJokerEffect = useCallback(
    (type) => {
      if (type === 'time') {
        setTimeLeft((current) => current + EXTRA_TIME_SECONDS);
        return;
      }

      if (type === 'skip') {
        handleAnswerSelect('SKIP');
        return;
      }

      if (type === 'fifty_fifty') {
        const optionKeys = Object.keys(currentQuestion.options || {}).filter(
          (key) => !eliminatedOptions.includes(key) && key !== selectedOption,
        );
        dispatch(eliminateOptions(optionKeys.slice(0, 2)));
        return;
      }

      if (type === 'reveal') {
        const availableOptions = Object.keys(currentQuestion.options || {}).filter(
          (key) => !eliminatedOptions.includes(key),
        );
        const suggestedOption = availableOptions[0];
        if (suggestedOption) {
          window.alert(t('quiz.hint_option', { option: suggestedOption }));
        }
      }
    },
    [currentQuestion, dispatch, eliminatedOptions, handleAnswerSelect, selectedOption, t],
  );

  const handleJoker = useCallback(
    async (type) => {
      if (!currentQuestion || quizStatus !== 'playing' || isCheckingAnswer) {
        return;
      }

      const action = await dispatch(triggerJokerAction(type));
      if (!triggerJokerAction.fulfilled.match(action)) {
        setJokerSource('insufficient');
        return;
      }

      const { data } = action.payload;
      if (!data.success) {
        setJokerSource('insufficient');
        if (data.message === 'insufficient_balance') {
          const shouldRedirect = window.confirm(t('quiz.not_enough_qeem'));
          if (shouldRedirect) {
            router.push('/shop');
          }
        }
        return;
      }

      setJokerSource(data.source === 'inventory' ? 'inventory' : 'balance');
      applyJokerEffect(type);
    },
    [applyJokerEffect, currentQuestion, dispatch, isCheckingAnswer, quizStatus, router, t],
  );

  const getOptionStyle = useCallback(
    (optionKey) => {
      if (!currentQuestionMeta) {
        return selectedOption === optionKey
          ? 'border-violet-400 bg-violet-500/20 text-white'
          : 'border-white/15 bg-white/[0.06] text-white/90 hover:border-violet-300 hover:bg-violet-500/10';
      }

      if (currentQuestionMeta.correct === optionKey) {
        return 'border-emerald-300 bg-emerald-500/20 text-emerald-100';
      }

      if (currentQuestionMeta.selected === optionKey && !currentQuestionMeta.isCorrect) {
        return 'border-rose-300 bg-rose-500/20 text-rose-100';
      }

      return 'border-white/10 bg-white/[0.04] text-white/40';
    },
    [currentQuestionMeta, selectedOption],
  );

  const loadingView = !currentQuestion || quizStatus === 'loading' || !activeCategoryId;

  return (
    <div className="min-h-screen bg-[#050426]">
      <PageHeader
        pageName={t('quiz.page_title')}
        breadcrumbs={[{ label: `${t('quiz.page_title')} - ${t('quiz.joker_dock')}`, href: '/play/active' }]}
      />

      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-2 lg:px-8">
        {loadingView ? (
          <div className="flex min-h-[72vh] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-violet-300/20 border-t-violet-400" />
            <p className="text-sm font-bold text-white/70">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#08063c] via-[#0b0a52] to-[#09062a] p-4 shadow-[0_30px_80px_rgba(10,12,50,0.55)] lg:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">
                  {categoryName}
                </span>
                <span className="text-sm font-semibold text-white/75">
                  {t('quiz.question_progress', { current: currentQuestionNumber, total: totalQuestions })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-black text-white">
                  {t('quiz.score')} {stats.score}
                </span>
                <span className="rounded-2xl border border-amber-300/40 bg-amber-500/10 px-3 py-1.5 text-sm font-black text-amber-300">
                  {timeLeft} {t('quiz.seconds_short')}
                </span>
              </div>
            </div>

            <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <section className="mx-auto max-w-[920px]">
              <p className="mx-auto mb-3 w-fit rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-bold text-white/85">
                {categoryName} - {t('quiz.question_progress', { current: currentQuestionNumber, total: totalQuestions })}
              </p>
              <h2 className="mb-6 text-center text-2xl font-black leading-[1.4] text-white lg:text-[38px]">
                {currentQuestion.questionText}
              </h2>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
                  if (eliminatedOptions.includes(key)) {
                    return null;
                  }
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleAnswerSelect(key)}
                      disabled={quizStatus !== 'playing' || isCheckingAnswer}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition ${getOptionStyle(key)}`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-black text-white/80">
                        {key}
                      </div>
                      <span className={`flex-1 text-sm font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{value}</span>
                      {currentQuestionMeta?.correct === key ? <Check className="h-4 w-4 text-emerald-300" /> : null}
                      {currentQuestionMeta?.selected === key && !currentQuestionMeta?.isCorrect ? (
                        <X className="h-4 w-4 text-rose-300" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold">
                <span className={`rounded-full border px-3 py-1 ${jokerSource === 'inventory' ? 'border-emerald-300/70 bg-emerald-400/15 text-emerald-200' : 'border-white/20 bg-white/5 text-white/65'}`}>
                  * {t('quiz.deducted_inventory')}
                </span>
                <span className={`rounded-full border px-3 py-1 ${jokerSource === 'balance' ? 'border-amber-300/70 bg-amber-400/15 text-amber-200' : 'border-white/20 bg-white/5 text-white/65'}`}>
                  * {t('quiz.deducted_balance')}
                </span>
                <span className={`rounded-full border px-3 py-1 ${jokerSource === 'insufficient' ? 'border-rose-300/70 bg-rose-400/15 text-rose-200' : 'border-white/20 bg-white/5 text-white/65'}`}>
                  * {t('quiz.insufficient')}
                </span>
              </div>
            </section>

            <section className="mt-7 rounded-[24px] border border-white/15 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-white/80">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em]">{t('quiz.jokers')}</p>
                    <p className="mt-2 text-xs text-white/50">{t('quiz.tap_to_activate')}</p>
                  </div>

                  {JOKER_ITEMS.map((joker) => {
                    const Icon = joker.icon;
                    const qty = Number(inventory?.[joker.type] || 0);
                    const empty = qty <= 0;
                    return (
                      <button
                        key={joker.type}
                        type="button"
                        onClick={() => handleJoker(joker.type)}
                        disabled={quizStatus !== 'playing' || isCheckingAnswer}
                        className={`relative rounded-2xl border bg-gradient-to-b p-3 text-white transition hover:-translate-y-0.5 disabled:opacity-60 ${joker.cardClass}`}
                      >
                        <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} rounded-full border-2 border-[#100b3b] bg-violet-600 px-2 py-0.5 text-[10px] font-black`}>
                          {empty ? t('shop.empty_short') : `x${qty}`}
                        </div>
                        <Icon className="mx-auto mb-2 h-5 w-5" />
                        <p className="text-sm font-black">{jokerTitle(joker, t)}</p>
                        <p className="mt-1 min-h-[30px] text-[10px] text-white/60">
                          {joker.subtitleKey ? t(joker.subtitleKey) : ''}
                        </p>
                        <p className="mt-2 rounded-full bg-black/20 px-2 py-1 text-[10px] font-black text-amber-200">
                          {empty ? t('quiz.from_balance_cost', { cost: joker.cost }) : t('quiz.from_inventory')}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 xl:w-[220px]">
                  <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-200">{t('common.qeem')}</p>
                    <p className="mt-1 text-2xl font-black text-amber-300">{totalBalance}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={quizStatus !== 'answered'}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                      quizStatus === 'answered'
                        ? 'bg-violet-600 text-white hover:bg-violet-500'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {currentQuestionNumber >= totalQuestions ? t('quiz.finish_quiz') : t('quiz.next')}
                    <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 lg:col-span-1">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">{t('quiz.question_map')}</p>
                  <span className="text-xs font-bold text-white/60">
                    {t('quiz.question_progress', { current: currentQuestionNumber, total: totalQuestions })}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {questionStatuses.map((status, index) => (
                    <div
                      key={questions[index]?.id || index}
                      className={`flex aspect-square items-center justify-center rounded-xl border text-xs font-black ${
                        status === 'correct'
                          ? 'border-emerald-300/70 bg-emerald-500/20 text-emerald-200'
                          : status === 'wrong'
                          ? 'border-rose-300/70 bg-rose-500/20 text-rose-200'
                          : status === 'active'
                          ? 'border-violet-300/80 bg-violet-500/25 text-violet-100'
                          : 'border-white/15 bg-white/[0.03] text-white/45'
                      }`}
                    >
                      {status === 'correct' ? 'OK' : status === 'wrong' ? 'X' : index + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">{t('quiz.live_ranking')}</p>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-300">
                    * {t('common.live')}
                  </span>
                </div>
                <div className="space-y-2">
                  {liveRankings.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                        player.isYou
                          ? 'border-violet-300/50 bg-violet-500/15'
                          : 'border-white/10 bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-4 text-xs font-black text-white/45">{player.rank}</span>
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-white ${player.color}`}>
                          {player.initials}
                        </div>
                        <p className={`text-sm font-bold ${player.isYou ? 'text-violet-200' : 'text-white/90'}`}>
                          {player.name} {player.isYou ? `(${t('common.you')})` : ''}
                        </p>
                      </div>
                      <p className={`text-sm font-black ${player.isYou ? 'text-violet-200' : 'text-white/85'}`}>
                        {player.points}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActiveQuizPage() {
  return (
    <ProtectedRoute>
      <ActiveJokerDockPage />
    </ProtectedRoute>
  );
}
