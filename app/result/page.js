'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { resetQuiz } from '@/store/slices/quizSlice';

export default function ResultPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState({ score: 0, total: 10, points: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setResultData({
        score: Number.parseInt(params.get('score') || '0', 10),
        total: Number.parseInt(params.get('total') || '10', 10),
        points: Number.parseInt(params.get('points') || '0', 10),
      });
    }
  }, []);

  const { score, total, points } = resultData;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const emoji = percent >= 80 ? '🏆' : percent >= 60 ? '🎉' : percent >= 40 ? '👍' : '💪';
  const message =
    percent >= 80
      ? 'Excellent!'
      : percent >= 60
        ? 'Great job!'
        : percent >= 40
          ? 'Good effort!'
          : 'Keep practicing!';

  const handlePlayAgain = () => {
    dispatch(resetQuiz());
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-8 text-center">
        <div className="mb-3 text-6xl">{emoji}</div>
        <h1 className="mb-1 text-2xl font-bold">{message}</h1>
        <p className="mb-6 text-sm text-gray-400">Quiz Complete</p>

        <div className="mb-6 rounded-2xl bg-gray-800 p-6">
          <div className="mb-1 text-6xl font-black text-purple-400">
            {score}/{total}
          </div>
          <div className="mb-3 text-sm text-gray-400">{percent}% correct answers</div>
          <div className="text-lg font-bold text-yellow-400">+{points} points earned</div>
        </div>

        <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-3 rounded-full transition-all ${
              percent >= 60 ? 'bg-green-500' : 'bg-amber-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="w-full rounded-xl bg-purple-600 py-3 font-bold transition active:scale-95 hover:bg-purple-500"
          >
            Play Again
          </button>
          <Link
            href="/leaderboard"
            className="block w-full rounded-xl bg-gray-800 py-3 text-center font-bold transition hover:bg-gray-700"
          >
            View Leaderboard
          </Link>
          <Link href="/profile" className="text-sm text-gray-500 transition hover:text-gray-300">
            View my profile
          </Link>
        </div>
      </div>
    </div>
  );
}