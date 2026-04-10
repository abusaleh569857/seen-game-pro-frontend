'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getLanguageByCode, SUPPORTED_LANGUAGES } from '@/lib/languages';
import { logoutUser } from '@/store/slices/authSlice';
import { setSelectedLang } from '@/store/slices/quizSlice';
import { CircleDot } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const activeLanguage = getLanguageByCode(selectedLang);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  const handleLanguageChange = (languageCode) => {
    dispatch(setSelectedLang(languageCode));
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#180A50] h-[76px] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at top right, #240E6A 0%, transparent 60%),
            radial-gradient(circle at bottom left, #110B33 0%, transparent 50%)
          `,
        }}
      />
      
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-10 h-full flex items-center justify-between relative z-10">
        {/* Left Area: Logo & Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#6248FF] to-[#486CFF] shadow-lg border border-white/10">
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white/80">
              <CircleDot className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-[17px] font-black uppercase leading-none tracking-tight text-white mb-1">
              Seen Game Pro
            </h1>
            <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[1.5px] leading-none text-white/50">
              Quiz Platform
            </p>
          </div>
        </Link>

        {/* Right Area: Actions */}
        <div className="relative z-10 flex items-center gap-3 lg:gap-5">
        {/* Languages (Hidden on very small mobile) */}
        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                  activeLanguage.code === lang.code
                    ? 'bg-white/10 border-white/20 text-white shadow-sm'
                    : 'bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80 hover:border-white/20'
                }`}
              >
                <div className="h-[9px] w-[13px] overflow-hidden rounded-[1.5px] shadow-sm">
                  <img src={lang.flag} alt={lang.englishLabel} className="h-full w-full object-cover" />
                </div>
                <span>{lang.shortLabel}</span>
              </button>
            ))}
          </div>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span className="text-white/80 text-[12px] font-bold mr-1.5">Qeem Balance:</span>
              <span className="text-[#FFD700] text-[13px] font-black">{user?.qeemBalance ?? user?.qeem_balance ?? 0}</span>
            </Link>

            <Link
              href="/profile"
              className="hidden sm:block text-white/70 hover:text-white text-[13px] font-semibold transition"
            >
              {user?.username}
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center justify-center px-3 h-[34px] rounded-lg border border-[#6248FF]/50 bg-[#6248FF]/10 text-[#A78BFA] text-[12px] font-bold hover:bg-[#6248FF]/20 transition"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-4 h-[38px] rounded-lg border border-white/10 bg-transparent text-white text-[13px] font-semibold hover:bg-white/5 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 lg:gap-3">
            <Link href="/login">
              <button className="flex items-center justify-center px-4 lg:px-5 h-[38px] rounded-lg border border-white/10 bg-transparent text-white text-[12px] lg:text-[13px] font-semibold hover:bg-white/5 transition">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button 
                className="flex items-center justify-center px-4 lg:px-5 h-[38px] rounded-lg text-white text-[12px] lg:text-[13px] font-bold tracking-wide hover:brightness-110 transition shadow-lg shadow-[#4E5BFF]/20"
                style={{ background: 'linear-gradient(90deg, #6248FF 0%, #486CFF 100%)' }}
              >
                Sign Up Free
              </button>
            </Link>
          </div>
        )}
      </div>
      </div>
    </nav>
  );
}
