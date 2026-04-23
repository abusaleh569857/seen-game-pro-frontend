'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserMinus, 
  Coins, 
  Trophy,
  Mail,
  ShieldCheck
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardShell from '@/components/AdminDashboardShell';
import { useI18n } from '@/lib/i18n';
import { isRtlLanguage, normalizeLanguageCode } from '@/lib/languages';
import { fetchAdminUsers, toggleBanUser } from '@/store/slices/adminSlice';

function UsersContent() {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector((state) => state.admin);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(normalizeLanguageCode(selectedLang));
  const [search, setSearch] = useState('');
  const { t } = useI18n();

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
    <AdminDashboardShell>
      <main className="mx-auto max-w-6xl px-4 py-8 text-gray-900">
          {/* Header */}
          <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">{t('admin.users_heading')}</h1>
                <p className="text-gray-500 mt-1">{t('admin.users_subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="mb-8 relative group">
            <div className={`absolute inset-y-0 flex items-center pointer-events-none ${isRTL ? 'right-5' : 'left-5'}`}>
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
            </div>
            <input
              placeholder={t('admin.search_placeholder')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              className={`w-full rounded-3xl border border-gray-200 bg-white py-4 text-base text-gray-900 transition focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 ${isRTL ? 'pr-14 pl-32 text-right' : 'pl-14 pr-32'}`}
            />
            <button
              type="button"
              onClick={handleSearch}
              className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white px-7 py-2.5 text-sm font-bold transition hover:brightness-110 active:scale-95 ${isRTL ? 'left-3' : 'right-3'}`}
            >
              {t('admin.search')}
            </button>
          </div>

          {/* User List */}
          {usersLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-white animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col sm:flex-row items-center justify-between rounded-3xl border p-6 transition-all hover:bg-gray-50 ${
                    user.is_banned 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xl font-black ${
                      user.is_banned ? 'border-red-200 bg-red-100 text-red-600' : 'border-gray-200 bg-gray-100 text-gray-700'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="truncate text-xl font-bold tracking-tight">{user.username}</p>
                        {user.role === 'admin' && (
                          <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-red-600 border border-red-200">
                            <ShieldCheck className="w-3 h-3" />
                            {t('admin.admin_badge')}
                          </span>
                        )}
                        {user.is_banned && (
                          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-red-700 border border-red-200">
                             {t('admin.banned_badge')}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                          <Trophy className="w-3.5 h-3.5" />
                           {user.points} {t('admin.points_unit')}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                          <Coins className="w-3.5 h-3.5" />
                          {user.qeem_balance} {t('common.qeem')}
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
                          : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      {user.is_banned ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                           {t('admin.unban')}
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4" />
                           {t('admin.ban')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </AdminDashboardShell>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute adminOnly>
      <UsersContent />
    </ProtectedRoute>
  );
}
