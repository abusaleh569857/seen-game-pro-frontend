'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchHistory } from '@/store/slices/quizSlice';

function ProfileContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { history } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-900 p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-800 text-4xl">
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <h1 className="mb-1 text-2xl font-bold">{user?.username}</h1>
          <p className="mb-5 text-sm text-gray-500">{user?.email}</p>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-black text-purple-400">{user?.points ?? 0}</p>
              <p className="mt-1 text-xs text-gray-500">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-yellow-400">
                {user?.qeemBalance ?? user?.qeem_balance ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">Qeem Balance</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-green-400">{history.length}</p>
              <p className="mt-1 text-xs text-gray-500">Games Played</p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Game History</h2>
          <Link href="/shop" className="text-sm text-yellow-400 hover:underline">
            Buy Qeem ??
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="mb-3 text-4xl">??</p>
            <p>No games played yet.</p>
            <Link href="/" className="mt-2 block text-sm text-purple-400 hover:underline">
              Start playing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((game) => {
              const percent = Math.round((game.score / game.total_questions) * 100);

              return (
                <div
                  key={game.id}
                  className="flex items-center justify-between rounded-xl border border-gray-700 bg-gray-900 px-5 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {game.icon} {game.name_en}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {new Date(game.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-400">
                      {game.score}/{game.total_questions}
                    </p>
                    <p className="text-xs text-gray-500">{percent}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

