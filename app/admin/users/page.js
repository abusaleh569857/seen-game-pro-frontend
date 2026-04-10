'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  UserPlus, 
  UserMinus, 
  Coins, 
  Trophy,
  ArrowLeft,
  Mail,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
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
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-5xl px-4 py-12">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
                <p className="text-gray-400 mt-1">Search, monitor and manage platform members</p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="mb-10 relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              placeholder="Search by username or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              className="w-full rounded-[2rem] border border-gray-800 bg-gray-900/50 pl-14 pr-32 py-5 text-lg transition focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/5 backdrop-blur-xl"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-purple-600 px-8 py-3 font-bold transition hover:bg-purple-500 active:scale-95 shadow-xl shadow-purple-500/20"
            >
              Search
            </button>
          </div>

          {/* User List */}
          {usersLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-24 rounded-3xl bg-gray-900 animate-pulse border border-gray-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col sm:flex-row items-center justify-between rounded-3xl border p-6 transition-all hover:bg-gray-900/40 ${
                    user.is_banned 
                      ? 'border-red-900/30 bg-red-900/5' 
                      : 'border-gray-800 bg-gray-900/20'
                  }`}
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xl font-black ${
                      user.is_banned ? 'border-red-800 bg-red-900/20 text-red-500' : 'border-gray-700 bg-gray-800 text-gray-400'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="truncate text-xl font-bold tracking-tight">{user.username}</p>
                        {user.role === 'admin' && (
                          <span className="flex items-center gap-1 rounded-full bg-red-600/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                        {user.is_banned && (
                          <span className="flex items-center gap-1 rounded-full bg-red-900/50 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-red-300 border border-red-800">
                             Banned
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500/80">
                          <Trophy className="w-3.5 h-3.5" />
                          {user.points} pts
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500/80">
                          <Coins className="w-3.5 h-3.5" />
                          {user.qeem_balance} Qeem
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleBan(user.id)}
                      disabled={user.role === 'admin'}
                      className={`w-full sm:w-32 flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition-all disabled:opacity-20 ${
                        user.is_banned
                          ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/20'
                          : 'bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      {user.is_banned ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Unban
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Ban
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
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
