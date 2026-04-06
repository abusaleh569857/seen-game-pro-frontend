'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchAdminUsers, toggleBanUser } from '@/store/slices/adminSlice';

function UsersContent() {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAdminUsers(''));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchAdminUsers(search));
  };

  const handleBan = (id) => {
    dispatch(toggleBanUser(id));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">?? User Management</h1>

        <div className="mb-5 flex gap-2">
          <input
            placeholder="Search by username or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 transition focus:border-purple-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium transition hover:bg-purple-500"
          >
            Search
          </button>
        </div>

        {usersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between rounded-xl border px-5 py-4 ${
                  user.is_banned ? 'border-red-800 bg-red-900/10' : 'border-gray-700 bg-gray-900'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-bold">{user.username}</p>
                    {user.role === 'admin' ? (
                      <span className="rounded-full bg-red-900 px-2 py-0.5 text-xs text-red-300">
                        admin
                      </span>
                    ) : null}
                    {user.is_banned ? (
                      <span className="rounded-full bg-red-900 px-2 py-0.5 text-xs text-red-300">
                        banned
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-sm text-gray-400">{user.email}</p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    {user.points} pts · {user.qeem_balance} Qeem
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleBan(user.id)}
                  disabled={user.role === 'admin'}
                  className={`ml-3 rounded-lg px-4 py-1.5 text-sm font-bold transition disabled:opacity-30 ${
                    user.is_banned
                      ? 'bg-green-800 text-green-200 hover:bg-green-700'
                      : 'bg-red-800 text-red-200 hover:bg-red-700'
                  }`}
                >
                  {user.is_banned ? 'Unban' : 'Ban'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute adminOnly>
      <UsersContent />
    </ProtectedRoute>
  );
}

