'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Check,
  ChevronRight,
  Clock3,
  Eye,
  Flame,
  Lightbulb,
  Scissors,
  SkipForward,
  Trophy,
  X,
} from 'lucide-react';
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
  setSelectedLang,
  selectAnswer,
  startQuiz,
  submitQuiz,
  useJoker as triggerJokerAction,
} from '@/store/slices/quizSlice';

const BASE_TIME_SECONDS = 18;

const RANKING_COLORS = [
  'bg-amber-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-teal-500',
  'bg-pink-500',
];

const POWER_UPS = [
  {
    type: 'fifty_fifty',
    title: '50 / 50',
    subtitle: 'Remove 2 wrong answers',
    accent: 'from-violet-500/30 to-violet-700/20',
    border: 'border-violet-400/30',
    icon: Scissors,
    qeemCost: 1,
  },
  {
    type: 'skip',
    title: 'Skip',
    subtitle: 'Jump to the next question',
    accent: 'from-sky-500/30 to-sky-700/20',
    border: 'border-sky-400/30',
    icon: SkipForward,
    qeemCost: 1,
  },
  {
    type: 'time',
    title: '+10 Sec',
    subtitle: 'Add extra time to clock',
    accent: 'from-emerald-500/30 to-emerald-700/20',
    border: 'border-emerald-400/30',
    icon: Clock3,
    qeemCost: 1,
  },
  {
    type: 'reveal',
    title: 'Reveal',
    subtitle: 'Show the correct answer',
    accent: 'from-rose-500/20 to-rose-700/10',
    border: 'border-rose-400/20',
    icon: Lightbulb,
    qeemCost: 2,
  },
];

function buildLiveRanking(leaderboard, user, score) {
  const userBasePoints = Number(user?.points || 0);
  const youName = user?.username || 'You';
  const rows = (leaderboard || []).slice(0, 8).map((entry, index) => ({
    id: entry.id,
    name: entry.username,
    points: Number(entry.points || 0),
    isYou: entry.username === youName,
    color: RANKING_COLORS[index % RANKING_COLORS.length],
  }));

  const currentUserPoints = userBasePoints + score;
  const existingUserIndex = rows.findIndex((entry) => entry.isYou);

  if (existingUserIndex >= 0) {
    rows[existingUserIndex] = {
      ...rows[existingUserIndex],
      points: Math.max(rows[existingUserIndex].points, currentUserPoints),
    };
  } else if (user) {
    rows.push({
      id: 'current-user',
      name: youName,
      points: currentUserPoints,
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

function ActiveQuizContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categoryId } = useParams();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const lang = normalizeLanguageCode(searchParams.get('lang') || selectedLang);
  const { t } = useI18n();

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

  const [timeLeft, setTimeLeft] = useState(BASE_TIME_SECONDS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [answerMetaByQuestionId, setAnswerMetaByQuestionId] = useState({});

  const currentQuestion = questions[currentIndex] || null;
  const currentQuestionMeta = currentQuestion
    ? answerMetaByQuestionId[currentQuestion.id] || null
    : null;
  const currentCategory = useMemo(
    () => categories.find((item) => String(item.id) === String(categoryId)),
    [categories, categoryId],
  );

  const categoryName = getLocalizedCategoryName(currentCategory, lang);
  const progressPercent = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchLeaderboard());
    dispatch(fetchJokerInventory());
  }, [dispatch]);

  useEffect(() => {
    if (lang !== selectedLang) {
      dispatch(setSelectedLang(lang));
    }
  }, [dispatch, lang, selectedLang]);

  useEffect(() => {
    dispatch(resetQuiz());
    setAnswerMetaByQuestionId({});
    setElapsedSeconds(0);
    dispatch(startQuiz({ categoryId, lang }));
  }, [categoryId, dispatch, lang]);

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
    if (quizStatus !== 'playing' || !currentQuestion || isCheckingAnswer) {
      return undefined;
    }

    if (timeLeft <= 0) {
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
        window.alert(
          requestError.response?.data?.message || t('quiz.answer_check_failed'),
        );
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
    let bestStreak = 0;
    let rollingStreak = 0;

    orderedResults.forEach((item) => {
      if (item.isCorrect) {
        rollingStreak += 1;
        bestStreak = Math.max(bestStreak, rollingStreak);
      } else {
        rollingStreak = 0;
      }
    });

    for (let index = orderedResults.length - 1; index >= 0; index -= 1) {
      if (!orderedResults[index].isCorrect) {
        break;
      }
      streak += 1;
    }

    return {
      correctCount,
      wrongCount,
      streak,
      bestStreak,
      score: correctCount * 10,
    };
  }, [answerMetaByQuestionId, questions]);

  useEffect(() => {
    if (quizStatus === 'finished' && result) {
      router.push(
        `/result?score=${result.score}&total=${result.total}&points=${result.earnedPoints}&category=${encodeURIComponent(categoryName)}&time=${elapsedSeconds}&streak=${stats.bestStreak}`,
      );
    }
  }, [categoryName, elapsedSeconds, quizStatus, result, router, stats.bestStreak]);

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

  const liveRankings = useMemo(
    () => buildLiveRanking(leaderboard, user, stats.score),
    [leaderboard, stats.score, user],
  );

  const handleNext = useCallback(() => {
    if (quizStatus !== 'answered') {
      return;
    }

    setTimeLeft(BASE_TIME_SECONDS);
    setIsCheckingAnswer(false);

    const isLastQuestion = currentIndex + 1 >= questions.length;
    if (isLastQuestion) {
      dispatch(submitQuiz({ sessionId, answers }));
      return;
    }

    dispatch(nextQuestion());
  }, [answers, currentIndex, dispatch, questions.length, quizStatus, sessionId]);

  const handleQuit = useCallback(() => {
      const shouldQuit = window.confirm(t('quiz.leave_quiz_confirm'));
    if (!shouldQuit) {
      return;
    }

    dispatch(resetQuiz());
    router.push('/categories');
  }, [dispatch, router, t]);

  const handleJoker = useCallback(
    async (type) => {
      if (!currentQuestion || quizStatus !== 'playing' || isCheckingAnswer) {
        return;
      }

      const action = await dispatch(triggerJokerAction(type));
      if (!triggerJokerAction.fulfilled.match(action)) {
        return;
      }

      const { data } = action.payload;

      if (!data.success) {
        if (data.message === 'insufficient_balance') {
          const shouldRedirect = window.confirm(t('quiz.not_enough_qeem'));
          if (shouldRedirect) {
            router.push('/shop');
          }
        }
        return;
      }

      if (type === 'time') {
        setTimeLeft((current) => current + 10);
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
    [
      currentQuestion,
      dispatch,
      eliminatedOptions,
      handleAnswerSelect,
      isCheckingAnswer,
      quizStatus,
      router,
      selectedOption,
      t,
    ],
  );

  const getOptionStyle = useCallback(
    (optionKey) => {
      if (!currentQuestionMeta) {
        return selectedOption === optionKey
          ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]'
          : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50';
      }

      if (currentQuestionMeta.correct === optionKey) {
        return 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]';
      }

      if (currentQuestionMeta.selected === optionKey && !currentQuestionMeta.isCorrect) {
        return 'border-rose-400 bg-rose-50 text-rose-700 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]';
      }

      return 'border-slate-200 bg-slate-50 text-slate-400';
    },
    [currentQuestionMeta, selectedOption],
  );

  const loadingView = !currentQuestion || quizStatus === 'loading';

  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <PageHeader
        pageName={t('quiz.page_title')}
        breadcrumbs={[{ label: t('categoriesPage.title'), href: '/categories' }]}
      />

      <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 lg:px-8 lg:pb-10 lg:pt-2">
        {loadingView ? (
          <div className="flex min-h-[65vh] flex-col items-center justify-center rounded-[32px] border border-white/70 bg-white/70 text-center shadow-sm">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="text-lg font-bold text-slate-700">{t('common.loading')}</p>
            <p className="mt-2 text-sm text-slate-500">Fetching the latest questions for {categoryName}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <section className="lg:col-span-8">
              <div className="flex flex-col gap-4">
                <div className="rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                      <span className="h-2 w-2 rounded-full bg-violet-500" />
                      {categoryName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-500">
                         {t('quiz.question_progress', { current: currentIndex + 1, total: questions.length })}
                      </span>
                      <button
                        type="button"
                        onClick={handleQuit}
                        className="text-sm font-semibold text-slate-400 transition hover:text-slate-700"
                      >
                         {t('quiz.quit')}
                      </button>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-[24px] border border-white/80 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-amber-500/20">
                        <span className="text-lg font-black text-amber-600">{timeLeft}</span>
                      </div>
                      <div>
                         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.time_left')}</p>
                        <p className="text-2xl font-black text-slate-900">{timeLeft}s</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/80 bg-white p-4 text-center shadow-sm">
                     <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.score')}</p>
                    <p className="mt-2 text-4xl font-black text-slate-900">{stats.score}</p>
                  </div>

                  <div className="rounded-[24px] border border-white/80 bg-white p-4 text-center shadow-sm">
                     <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.correct')}</p>
                    <p className="mt-2 text-4xl font-black text-emerald-500">{stats.correctCount}</p>
                  </div>

                  <div className="rounded-[24px] border border-white/80 bg-white p-4 text-center shadow-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.wrong')}</p>
                        <p className="mt-2 text-3xl font-black text-rose-500">{stats.wrongCount}</p>
                      </div>
                      <div>
                         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.streak')}</p>
                        <p className="mt-2 flex items-center justify-center gap-1 text-3xl font-black text-amber-500">
                          <Flame className="h-5 w-5" />
                          {stats.streak}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/80 bg-white px-6 py-10 text-center shadow-sm lg:px-10">
                  <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-violet-600">
                     {t('quiz.question_label', { number: String(currentIndex + 1).padStart(2, '0') })}
                  </span>
                  <h2 className="mx-auto mt-6 max-w-3xl text-2xl font-black leading-[1.45] text-slate-900 lg:text-[32px]">
                    {currentQuestion.questionText}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(currentQuestion.options || {}).map(([key, value]) => {
                    if (eliminatedOptions.includes(key)) {
                      return null;
                    }

                    const isAnswered = quizStatus === 'answered';
                    const optionStyle = getOptionStyle(key);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleAnswerSelect(key)}
                        disabled={quizStatus !== 'playing' || isCheckingAnswer}
                        className={`flex items-center gap-4 rounded-[22px] border-2 px-5 py-4 text-left transition-all ${optionStyle}`}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-600">
                          {key}
                        </div>
                        <div className="flex flex-1 items-center justify-between gap-3">
                          <span className="text-base font-bold">{value}</span>
                          {isAnswered && currentQuestionMeta?.correct === key ? (
                            <Check className="h-5 w-5 text-emerald-500" />
                          ) : null}
                          {isAnswered &&
                          currentQuestionMeta?.selected === key &&
                          !currentQuestionMeta?.isCorrect ? (
                            <X className="h-5 w-5 text-rose-500" />
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1f164f] via-[#23185f] to-[#10183f] p-4 text-white shadow-[0_24px_60px_rgba(49,46,129,0.24)] sm:p-5 lg:min-h-[154px] lg:p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col gap-2 xl:min-w-[150px]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-black">
                          🪙
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-amber-300">
                          {user?.qeemBalance ?? user?.qeem_balance ?? 0}
                        </span>
                      </div>
                      <div>
                        <p className="text-lg font-black tracking-wide">POWER-UPS</p>
                        <p className="mt-0.5 text-xs text-white/55">Use wisely</p>
                      </div>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-4">
                      {POWER_UPS.map((powerUp) => {
                        const Icon = powerUp.icon;
                        const quantity = inventory?.[powerUp.type] ?? 0;
                        const isEmpty = quantity <= 0;

                        return (
                          <button
                            key={powerUp.type}
                            type="button"
                            onClick={() => handleJoker(powerUp.type)}
                            disabled={quizStatus !== 'playing' || isCheckingAnswer}
                            className={`relative min-h-[120px] rounded-[20px] border bg-gradient-to-b ${powerUp.accent} ${powerUp.border} px-3 py-3 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            <span className="absolute -right-2 -top-2 rounded-full border-2 border-[#1c1350] bg-violet-500 px-2 py-0.5 text-[10px] font-black text-white">
                              {isEmpty ? 'EMPTY' : quantity}
                            </span>
                            <Icon className="mb-3 h-5 w-5 text-white/85" />
                            <p className="text-[13px] font-black">{powerUp.title}</p>
                            <p className="mt-1 min-h-[34px] text-[10px] leading-4 text-white/55">
                              {powerUp.subtitle}
                            </p>
                            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">
                              {quantity > 0 ? `x ${quantity}` : `${powerUp.qeemCost} Qeem`}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={quizStatus !== 'answered'}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-[20px] px-6 py-4 text-sm font-black transition sm:w-auto sm:min-w-[132px] xl:min-w-[138px] ${
                        quizStatus === 'answered'
                          ? 'bg-violet-500 text-white shadow-[0_18px_45px_rgba(139,92,246,0.32)] hover:bg-violet-400'
                          : 'bg-white/10 text-white/35'
                      }`}
                    >
                          {currentIndex + 1 >= questions.length ? t('quiz.finish_quiz') : t('quiz.next')}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-4">
              <div className="flex flex-col gap-5">
                <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.question_map')}</p>
                    <span className="text-xs font-semibold text-slate-500">
                      {currentIndex + 1}/{questions.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2.5">
                    {questionStatuses.map((status, index) => {
                      const baseStyle =
                        status === 'correct'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                          : status === 'wrong'
                          ? 'border-rose-300 bg-rose-50 text-rose-600'
                          : status === 'active'
                          ? 'border-violet-400 bg-violet-50 text-violet-600 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]'
                          : 'border-slate-200 bg-slate-50 text-slate-400';

                      return (
                        <div
                          key={questions[index]?.id || index}
                          className={`flex aspect-square items-center justify-center rounded-[18px] border text-[13px] font-black ${baseStyle}`}
                        >
                          {status === 'correct' ? <Check className="h-4 w-4" /> : null}
                          {status === 'wrong' ? <X className="h-4 w-4" /> : null}
                          {status === 'active' || status === 'pending' ? index + 1 : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('quiz.live_ranking')}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-500">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                       {t('common.live')}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {liveRankings.map((player) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between rounded-[18px] px-3 py-2.5 ${
                          player.isYou ? 'bg-violet-50' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-4 text-[11px] font-black text-slate-400">{player.rank}</span>
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-white ${player.color}`}
                          >
                            {player.initials}
                          </div>
                          <p className={`text-[12px] font-bold ${player.isYou ? 'text-violet-700' : 'text-slate-800'}`}>
                            {player.name}
                            {player.isYou ? ' (You)' : ''}
                          </p>
                        </div>
                        <p className={`text-[12px] font-black ${player.isYou ? 'text-violet-700' : 'text-slate-900'}`}>
                          {player.points}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-violet-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                       {t('quiz.joker_inventory')}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {POWER_UPS.map((powerUp) => {
                      const Icon = powerUp.icon;
                      const quantity = inventory?.[powerUp.type] ?? 0;

                      return (
                        <div
                          key={powerUp.type}
                          className={`flex items-center justify-between rounded-[18px] px-3 py-2.5 ${
                            powerUp.type === 'reveal' ? 'text-rose-500' : 'text-slate-700'
                          } bg-slate-50`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-3.5 w-3.5" />
                            <span className="text-[12px] font-semibold">{powerUp.title}</span>
                          </div>
                          <span className="text-[12px] font-black">x {quantity}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/shop')}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-[12px] font-black text-violet-700 transition hover:bg-violet-100"
                  >
                    <Eye className="h-4 w-4" />
                     {t('common.buy_more_jokers')}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <ProtectedRoute>
      <ActiveQuizContent />
    </ProtectedRoute>
  );
}
