'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  Star,
  Gamepad2,
  Target,
  Flame,
  BarChart2,
  Pencil,
  Trophy as TrophyIcon,
  ShoppingBag,
  ChevronRight,
  Clock,
  Eye,
  Divide,
  X,
  Mail,
  Lock,
  UserCircle,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import { getLocalizedCategoryName, isRtlLanguage, normalizeLanguageCode } from '@/lib/languages';
import { fetchHistory, fetchJokerInventory, fetchUserStats } from '@/store/slices/quizSlice';
import { updateProfileUser } from '@/store/slices/authSlice';

// ─── Helper: Avatar Circle ───────────────────────────────────────────────────
function Avatar({ username, size = 'lg' }) {
  const initials = username?.slice(0, 2).toUpperCase() || 'UN';
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${sizeClass} rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black shrink-0 ring-4 ring-white/20`}
    >
      {initials}
    </div>
  );
}

// ─── Helper: Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, value, label, borderColor }) {
  return (
    <div className={`bg-white rounded-2xl border-t-2 ${borderColor} p-4 flex flex-col items-center gap-2 shadow-sm`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
      <p className={`text-2xl font-black ${iconColor}`}>{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 whitespace-nowrap">{label}</p>
    </div>
  );
}

// ─── Helper: Achievement Badge ────────────────────────────────────────────────
function AchievementBadge({ emoji, label, color, isMobile }) {
  if (isMobile) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap leading-none bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm">
        <span>{emoji}</span>
        {label}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${color}`}>
      <span>{emoji}</span>
      {label}
    </span>
  );
}

// ─── Helper: Joker Row ────────────────────────────────────────────────────────
function JokerRow({ icon: Icon, iconBg, label, count, isEmpty }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] font-semibold text-gray-700">{label}</span>
      </div>
      <span className={`text-[13px] font-black ${isEmpty ? 'text-red-500' : 'text-gray-800'}`}>
        × {count}
      </span>
    </div>
  );
}

// ─── Main Profile Content ─────────────────────────────────────────────────────
function EditProfileModal({
  isOpen,
  isRTL,
  t,
  form,
  onChange,
  onClose,
  onSubmit,
  saving,
  emailError,
  passwordError,
  confirmPasswordError,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] my-auto flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-[16px] font-black text-gray-900">{t('profile.edit_modal_title')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
            aria-label={t('profile.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-[12px] font-bold text-gray-700">{t('profile.username_label')}</label>
            <div className="relative mt-1.5">
              <UserCircle className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={form.username}
                onChange={(event) => onChange('username', event.target.value)}
                className={`w-full h-11 rounded-xl border px-10 text-[14px] outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 ${
                  form.username.trim().length < 3 ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('profile.username_placeholder')}
              />
            </div>
            {form.username.trim().length > 0 && form.username.trim().length < 3 ? (
              <p className="mt-1 text-[11px] text-red-500">{t('profile.username_min')}</p>
            ) : null}
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-700">{t('auth.email_address')}</label>
            <div className="relative mt-1.5">
              <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange('email', event.target.value)}
                className={`w-full h-11 rounded-xl border px-10 text-[14px] outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 ${
                  emailError ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('profile.email_placeholder')}
              />
            </div>
            {emailError ? <p className="mt-1 text-[11px] text-red-500">{emailError}</p> : null}
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-700">{t('profile.current_password_label')}</label>
            <div className="relative mt-1.5">
              <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="password"
                value={form.currentPassword}
                onChange={(event) => onChange('currentPassword', event.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 px-10 text-[14px] outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500"
                placeholder={t('profile.current_password_placeholder')}
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-700">{t('profile.new_password_label')}</label>
            <div className="relative mt-1.5">
              <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="password"
                value={form.newPassword}
                onChange={(event) => onChange('newPassword', event.target.value)}
                className={`w-full h-11 rounded-xl border px-10 text-[14px] outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 ${
                  passwordError ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('profile.new_password_placeholder')}
              />
            </div>
            {passwordError ? <p className="mt-1 text-[11px] text-red-500">{passwordError}</p> : null}
          </div>

          <div>
            <label className="text-[12px] font-bold text-gray-700">{t('profile.confirm_new_password_label')}</label>
            <div className="relative mt-1.5">
              <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => onChange('confirmPassword', event.target.value)}
                className={`w-full h-11 rounded-xl border px-10 text-[14px] outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 ${
                  confirmPasswordError ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('profile.confirm_new_password_placeholder')}
              />
            </div>
            {confirmPasswordError ? <p className="mt-1 text-[11px] text-red-500">{confirmPasswordError}</p> : null}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-50"
            >
              {t('profile.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-[13px] font-bold text-white disabled:opacity-60"
            >
              {saving ? t('common.loading') : t('profile.save_changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileContent() {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const {
    history = [],
    inventory = {},
    userStats,
    leaderboard = [],
  } = useSelector((state) => state.quiz);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const activeLang = normalizeLanguageCode(selectedLang);
  const isRTL = isRtlLanguage(activeLang);
  const { t } = useI18n();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchJokerInventory());
    dispatch(fetchUserStats());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    setEditForm((prev) => ({
      ...prev,
      username: user.username || '',
      email: user.email || '',
    }));
  }, [user]);

  const qeemBalance = user?.qeemBalance ?? user?.qeem_balance ?? 0;
  const points = userStats?.totalPoints ?? user?.points ?? 0;
  const gamesPlayed = userStats?.totalGames ?? history.length ?? 0;
  const avgAccuracy = userStats?.avgAccuracy ?? 0;
  const bestStreak = userStats?.bestStreak ?? 0;
  const dayStreak = userStats?.dayStreak ?? 0;
  const rankFromLeaderboard =
    leaderboard.find((entry) => Number(entry.id) === Number(user?.id) || entry.username === user?.username)?.rank ?? '-';
  const globalRank = userStats?.globalRank && userStats?.globalRank !== '-' ? userStats.globalRank : rankFromLeaderboard;

  const createdAtRaw = userStats?.memberSinceAt || user?.createdAt || user?.created_at || null;
  const createdDate = createdAtRaw ? new Date(createdAtRaw) : null;
  const memberSince =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? new Intl.DateTimeFormat(activeLang, { month: 'long', year: 'numeric' }).format(createdDate)
      : '-';

  const emailError = useMemo(() => {
    const value = String(editForm.email || '').trim();
    if (!value) return t('auth.invalid_email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return t('auth.invalid_email');
    return '';
  }, [editForm.email, t]);

  const passwordError = useMemo(() => {
    const value = String(editForm.newPassword || '');
    if (!value) return '';
    if (value.length < 6) return t('auth.password_min_length');
    if (!/[a-z]/.test(value)) return t('auth.password_require_lowercase');
    if (!/[A-Z]/.test(value)) return t('auth.password_require_uppercase');
    if (!/[^A-Za-z0-9]/.test(value)) return t('auth.password_require_special');
    return '';
  }, [editForm.newPassword, t]);

  const confirmPasswordError = useMemo(() => {
    if (!editForm.newPassword && !editForm.confirmPassword) return '';
    if (editForm.newPassword !== editForm.confirmPassword) return t('auth.passwords_do_not_match');
    return '';
  }, [editForm.newPassword, editForm.confirmPassword, t]);

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetEditSensitiveFields = () => {
    setEditForm((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (editForm.username.trim().length < 3) {
      toast.error(t('profile.username_min'));
      return;
    }

    if (emailError) {
      toast.error(emailError);
      return;
    }

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (confirmPasswordError) {
      toast.error(confirmPasswordError);
      return;
    }

    if (editForm.newPassword && !editForm.currentPassword) {
      toast.error(t('profile.current_password_required'));
      return;
    }

    const hasBasicChange =
      editForm.username.trim() !== String(user?.username || '') ||
      editForm.email.trim().toLowerCase() !== String(user?.email || '').toLowerCase();
    const hasPasswordChange = Boolean(editForm.newPassword);

    if (!hasBasicChange && !hasPasswordChange) {
      toast.info(t('profile.no_changes'));
      return;
    }

    try {
      const result = await dispatch(
        updateProfileUser({
          username: editForm.username.trim(),
          email: editForm.email.trim(),
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword,
        })
      ).unwrap();

      toast.success(t('profile.update_success'));
      if (result?.passwordChanged) {
        toast.info(t('profile.password_changed_notice'));
      }
      setIsEditOpen(false);
      resetEditSensitiveFields();
    } catch (error) {
      toast.error(error || t('profile.update_failed'));
    }
  };

  const ACHIEVEMENTS = [
    { emoji: '🧠', label: t('profile.total_points'), color: 'bg-purple-100 text-purple-700' },
    { emoji: '⚡', label: t('profile.avg_accuracy'), color: 'bg-yellow-100 text-yellow-700' },
    { emoji: '🔥', label: t('profile.day_streak'), color: 'bg-orange-100 text-orange-700' },
    { emoji: '🌍', label: t('profile.global_rank'), color: 'bg-green-100 text-green-700' },
  ];

  const JOKERS = [
    { icon: Divide, iconBg: 'bg-blue-500', label: '50/50', key: 'fifty_fifty' },
    { icon: ChevronRight, iconBg: 'bg-indigo-500', label: t('shop.skip_label'), key: 'skip' },
    { icon: Clock, iconBg: 'bg-green-500', label: t('shop.time_label'), key: 'time' },
    { icon: Eye, iconBg: 'bg-red-500', label: t('shop.reveal_label'), key: 'reveal' },
  ];

  const getResultLabel = (score, total) => {
    return score >= total * 0.5 ? t('profile.win') : t('profile.loss');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader pageName={t('profile.page_title')} />

      <div className="px-4 lg:px-8 pb-8 max-w-[1440px] mx-auto">
        {/* ── Hero Banner ── */}
        <div className="rounded-3xl bg-linear-to-br from-[#1E1260] via-[#2D1B8E] to-[#1A0F6B] p-6 mb-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className={`absolute top-4 w-32 h-32 rounded-full bg-white blur-3xl ${isRTL ? 'left-8' : 'right-8'}`} />
            <div className={`absolute bottom-0 w-24 h-24 rounded-full bg-violet-300 blur-2xl ${isRTL ? 'right-16' : 'left-16'}`} />
          </div>

          <div className={`relative flex flex-col lg:items-start lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
            {/* Desktop & Mobile Combined Logic */}
            <div className="flex flex-col gap-6">
              {/* Profile Main Info */}
              <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className="relative">
                  <Avatar username={user?.username} size="lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-[#1E1260] shadow-lg">
                    <TrophyIcon className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>

                {/* Name & Edit (Mobile: Stacked/Right) */}
                <div className={`flex flex-col gap-2 min-w-0 flex-1 ${isRTL ? 'text-right items-end' : ''}`}>
                  <div className="min-w-0">
                    <h2 className="text-xl lg:text-3xl font-black text-white break-words overflow-hidden leading-tight">
                      {user?.username}
                    </h2>
                    <p className="text-[11px] lg:text-[13px] text-white/60 mt-0.5 font-medium">
                      {t('profile.member_since', { date: memberSince, rank: globalRank })}
                    </p>
                  </div>
                  
                  {/* Edit Button - Consistent with Screenshot */}
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[12px] font-bold px-5 py-2 rounded-xl transition w-fit backdrop-blur-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t('profile.edit_profile')}
                  </button>
                </div>
              </div>

              {/* Achievement Badges - Mobile Horizontal Scroll/Wrap */}
              <div className={`flex flex-wrap gap-2 lg:gap-3 ${isRTL ? 'justify-end' : ''}`}>
                {ACHIEVEMENTS.map((a) => (
                  <AchievementBadge key={a.label} {...a} isMobile />
                ))}
              </div>
            </div>

            {/* Right Side: Qeem Balance - DESKTOP ONLY */}
            <div className="hidden lg:block bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center min-w-[160px]">
              <p className="text-[12px] font-bold uppercase tracking-widest text-white/50 mb-1">{t('common.qeem_balance')}</p>
              <p className="text-5xl font-black text-white">{qeemBalance}</p>
              <p className="text-[12px] text-white/40 mt-1">{t('common.available_coins')}</p>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={Star}
            iconColor="text-violet-600"
            value={points.toLocaleString()}
              label={t('profile.total_points')}
            borderColor="border-violet-400"
          />
          <StatCard
            icon={Gamepad2}
            iconColor="text-green-600"
            value={gamesPlayed}
              label={t('profile.games_played')}
            borderColor="border-green-400"
          />
          <StatCard
            icon={Target}
            iconColor="text-teal-600"
            value={`${avgAccuracy}%`}
              label={t('profile.avg_accuracy')}
            borderColor="border-teal-400"
          />
          <StatCard
            icon={Flame}
            iconColor="text-orange-500"
            value={dayStreak}
              label={t('profile.day_streak')}
            borderColor="border-orange-400"
          />
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              icon={BarChart2}
              iconColor="text-red-500"
              value={`#${globalRank}`}
               label={t('profile.global_rank')}
              borderColor="border-red-400"
            />
          </div>
        </div>

        {/* ── Bottom Section: Game History + Joker Inventory ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game History */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <div>
                <h2 className="text-[15px] font-black text-gray-900">{t('profile.game_history')}</h2>
                <p className="text-[11px] text-gray-400">{t('profile.last_sessions', { count: Math.min(history.length, 6) })}</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Gamepad2 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-[13px] text-gray-500 font-medium">{t('profile.no_games')}</p>
                <Link
                  href="/play"
                  className="mt-3 text-[12px] text-violet-600 font-bold hover:underline"
                >
                  {t('profile.start_playing')}
                </Link>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-6 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50">
                  <span className="col-span-2">{t('profile.category')}</span>
                  <span>{t('quiz.score')}</span>
                  <span>{t('quiz.correct')}</span>
                  <span>{t('profile.result')}</span>
                  <span>{t('profile.date')}</span>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-50">
                  {history.slice(0, 6).map((game) => {
                    const result = getResultLabel(game.score, game.total_questions);
                    const isWin = result === t('profile.win');
                    const date = new Date(game.created_at);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const dateLabel = isToday
                      ? t('profile.today')
                      : date.toLocaleDateString(activeLang, { month: 'short', day: 'numeric' });
                    const localizedCategoryName = getLocalizedCategoryName(game, activeLang);

                    return (
                      <div key={game.id} className="px-6 py-3">
                        {/* Desktop row */}
                        <div className="hidden lg:grid grid-cols-6 items-center">
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                              {game.icon || '🎯'}
                            </div>
                            <span className="text-[13px] font-semibold text-gray-800">{localizedCategoryName}</span>
                          </div>
                          <span className="text-[13px] font-black text-violet-600">
                            {(game.score * 10).toLocaleString()}
                          </span>
                          <span className="text-[13px] font-semibold text-gray-700">
                            {game.score}/{game.total_questions}
                          </span>
                          <span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                isWin
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {result}
                            </span>
                          </span>
                          <span className="text-[12px] text-gray-400">{dateLabel}</span>
                        </div>

                        {/* Mobile row */}
                        <div className="lg:hidden flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-base shrink-0">
                              {game.icon || '🎯'}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-gray-800">{localizedCategoryName}</p>
                              <p className="text-[11px] text-gray-400">
                                {game.score}/{game.total_questions} {t('quiz.correct').toLowerCase()} · 🔥 {t('quiz.streak').toLowerCase()}
                              </p>
                            </div>
                          </div>
                          <div className={isRTL ? 'text-left' : 'text-right'}>
                            <p className="text-[14px] font-black text-gray-900">
                              {(game.score * 10).toLocaleString()} {t('admin.points_unit')}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isWin
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {result}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Joker Inventory */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 pb-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-black text-gray-900">{t('profile.joker_inventory')}</h2>
              <Link
                href="/shop"
                className="text-[11px] font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full hover:bg-violet-100 transition"
              >
                {t('common.buy')}
              </Link>
            </div>

            <div>
              {JOKERS.map((joker) => {
                const count = inventory?.[joker.key] ?? 0;
                return (
                  <JokerRow
                    key={joker.key}
                    icon={joker.icon}
                    iconBg={joker.iconBg}
                    label={joker.label}
                    count={count}
                    isEmpty={count === 0}
                  />
                );
              })}
            </div>

            {/* Quick buy CTA */}
            <Link
              href="/shop"
              className="mt-2 lg:mt-4 w-full flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-[13px] font-bold py-3 rounded-2xl hover:brightness-110 transition shadow-lg shadow-violet-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('shop.title')}
            </Link>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        isRTL={isRTL}
        t={t}
        form={editForm}
        onChange={handleEditChange}
        onClose={() => {
          setIsEditOpen(false);
          resetEditSensitiveFields();
        }}
        onSubmit={handleEditSubmit}
        saving={authLoading}
        emailError={emailError}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
      />
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
