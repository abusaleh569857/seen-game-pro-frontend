'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import JokerDock from '@/components/JokerDock';
import ProtectedRoute from '@/components/ProtectedRoute';
import TimerBar from '@/components/TimerBar';
import {
  eliminateOptions,
  fetchJokerInventory,
  nextQuestion,
  resetQuiz,
  selectAnswer,
  startQuiz,
  submitQuiz,
  useJoker,
} from '@/store/slices/quizSlice';

function QuizGame() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categoryId } = useParams();
  const [lang, setLang] = useState('ar');
  const isRTL = lang === 'ar' || lang === 'ur';
  const [timerDuration, setTimerDuration] = useState(30);

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
  } = useSelector((state) => state.quiz);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setLang(params.get('lang') || 'ar');
    }
  }, []);

  useEffect(() => {
    dispatch(resetQuiz());
    dispatch(fetchJokerInventory());
    dispatch(startQuiz({ categoryId, lang }));
  }, [categoryId, dispatch, lang]);

  useEffect(() => {
    setTimerDuration(30);
  }, [currentIndex]);

  useEffect(() => {
    if (error && quizStatus === 'idle') {
      window.alert(error);
      router.push('/');
    }
  }, [error, quizStatus, router]);

  useEffect(() => {
    if (quizStatus !== 'answered') {
      return undefined;
    }

    const isLastQuestion = currentIndex + 1 >= questions.length;
    const timer = setTimeout(() => {
      if (isLastQuestion) {
        dispatch(submitQuiz({ sessionId, answers }));
      } else {
        dispatch(nextQuestion());
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [answers, currentIndex, dispatch, questions.length, quizStatus, sessionId]);

  useEffect(() => {
    if (quizStatus === 'finished' && result) {
      router.push(
        `/result?score=${result.score}&total=${result.total}&points=${result.earnedPoints}`
      );
    }
  }, [quizStatus, result, router]);

  const handleAnswer = useCallback(
    (option) => {
      if (quizStatus !== 'playing') {
        return;
      }

      dispatch(selectAnswer(option));
    },
    [dispatch, quizStatus]
  );

  const handleJoker = useCallback(
    async (type) => {
      if (quizStatus !== 'playing') {
        return;
      }

      const action = await dispatch(useJoker(type));

      if (!useJoker.fulfilled.match(action)) {
        return;
      }

      const { data } = action.payload;

      if (!data.success) {
        if (data.message === 'insufficient_balance') {
          const shouldRedirect = window.confirm('Not enough Qeem! Go to shop?');
          if (shouldRedirect) {
            router.push('/shop');
          }
        }
        return;
      }

      if (type === 'fifty_fifty') {
        const options = ['A', 'B', 'C', 'D'];
        const available = options.filter(
          (option) => !eliminatedOptions.includes(option) && option !== selectedOption
        );
        dispatch(eliminateOptions(available.slice(0, 2)));
      }

      if (type === 'skip') {
        dispatch(selectAnswer('SKIP'));
      }

      if (type === 'time') {
        setTimerDuration((current) => current + 10);
      }

      if (type === 'reveal') {
        const options = Object.keys(questions[currentIndex]?.options || {});
        const hint = options.find(
          (option) => !eliminatedOptions.includes(option) && option !== selectedOption
        );

        if (hint) {
          window.alert(`Hint: consider option ${hint}`);
        }
      }
    },
    [currentIndex, dispatch, eliminatedOptions, questions, quizStatus, router, selectedOption]
  );

  const handleTimeout = useCallback(() => {
    if (quizStatus === 'playing') {
      dispatch(selectAnswer('TIMEOUT'));
    }
  }, [dispatch, quizStatus]);

  if (quizStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl animate-bounce">🎯</div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizStatus === 'submitting' || quizStatus === 'finished') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl animate-spin">⏳</div>
          <p className="text-gray-400">Submitting results...</p>
        </div>
      </div>
    );
  }

  if (!questions.length || quizStatus === 'idle') {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-gray-950 px-4 py-6 pb-32"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <button
            type="button"
            onClick={() => {
              const shouldQuit = window.confirm('Quit this quiz?');
              if (shouldQuit) {
                dispatch(resetQuiz());
                router.push('/');
              }
            }}
            className="text-sm text-gray-600 transition hover:text-gray-400"
          >
            ✕ Quit
          </button>
        </div>

        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-2 rounded-full bg-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <TimerBar
          key={`${currentIndex}-${timerDuration}`}
          duration={timerDuration}
          onExpire={handleTimeout}
          paused={quizStatus === 'answered' || quizStatus === 'submitting'}
        />

        <div className="mb-6 flex min-h-[130px] items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 p-6 text-center">
          <p className="text-lg font-medium leading-relaxed">{currentQuestion.questionText}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            if (eliminatedOptions.includes(key)) {
              return null;
            }

            let buttonClass =
              'w-full rounded-xl border px-5 py-4 text-start font-medium transition-all ';

            if (selectedOption === key) {
              buttonClass += 'scale-[0.99] border-purple-500 bg-purple-700 text-white';
            } else if (quizStatus === 'answered') {
              buttonClass += 'cursor-not-allowed border-gray-700 bg-gray-800 text-gray-500';
            } else {
              buttonClass +=
                'cursor-pointer border-gray-700 bg-gray-900 text-gray-100 hover:border-purple-500 hover:bg-gray-800';
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleAnswer(key)}
                disabled={quizStatus !== 'playing'}
                className={buttonClass}
              >
                <span className="mr-3 font-black text-purple-400">{key}.</span>
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <JokerDock onUse={handleJoker} disabled={quizStatus !== 'playing'} />
    </div>
  );
}

export default function PlayPage() {
  return (
    <ProtectedRoute>
      <QuizGame />
    </ProtectedRoute>
  );
}