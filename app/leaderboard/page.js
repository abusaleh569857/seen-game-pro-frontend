'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import { fetchLeaderboard } from '@/store/slices/quizSlice';

const MEDALS = ['??', '??', '??'];

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboard, leaderboardLoading } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">?? Leaderboard</h1>

        {leaderboardLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No players yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-all ${
                  index === 0
                    ? 'border-yellow-600 bg-yellow-900/20'
                    : index === 1
                      ? 'border-gray-500 bg-gray-800/50'
                      : index === 2
                        ? 'border-amber-700 bg-amber-900/20'
                        : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <span className="w-10 text-center text-2xl">
                  {MEDALS[index] || (
                    <span className="text-base font-bold text-gray-500">#{index + 1}</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{player.username}</p>
                  <p className="text-xs text-gray-500">{player.games_played} games played</p>
                </div>
                <p className="text-lg font-black text-purple-400">{player.points}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

