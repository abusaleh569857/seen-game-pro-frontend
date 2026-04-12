'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bell,
  ChevronDown as ChevronDownIcon,
  ChevronRight,
  Globe,
  Home,
} from 'lucide-react';
import {
  getLanguageByCode,
  isRtlLanguage,
  SUPPORTED_LANGUAGES,
} from '@/lib/languages';
import { setSelectedLang } from '@/store/slices/quizSlice';

export default function PageHeader({ pageName, breadcrumbs = [] }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const [showLangs, setShowLangs] = useState(false);
  const langRef = useRef(null);
  const currentLanguage = getLanguageByCode(selectedLang);
  const isRTL = isRtlLanguage(selectedLang);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  const handleLanguageChange = (languageCode) => {
    dispatch(setSelectedLang(languageCode));
    setShowLangs(false);

    if (pathname.startsWith('/play/')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', languageCode);
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={triggerSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-50"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="h-0.5 w-4 rounded-full bg-gray-600" />
              <span className="h-0.5 w-4 rounded-full bg-gray-600" />
              <span className="h-0.5 w-3 rounded-full bg-gray-600" />
            </div>
          </button>

          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-[15px] font-black leading-tight text-gray-900">{pageName}</h1>
            <p className="text-[11px] font-medium text-gray-400">Stats, Game History & Qeem Balance</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangs((current) => !current)}
              className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 text-[11px] font-black text-gray-600"
            >
              <Globe className="h-3.5 w-3.5 text-gray-500" />
              {currentLanguage.shortLabel}
              <ChevronDownIcon
                className={`h-3 w-3 text-gray-400 transition-transform ${showLangs ? 'rotate-180' : ''}`}
              />
            </button>

            {showLangs ? (
              <div className={`absolute top-full z-50 mt-2 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ${isRTL ? 'left-0' : 'right-0'}`}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-[12px] font-semibold transition ${
                      currentLanguage.code === lang.code ? 'bg-violet-50 text-violet-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative h-[10px] w-[14px] overflow-hidden rounded-[2px] shadow-sm">
                      <Image src={lang.flag} alt={lang.englishLabel} fill className="object-cover" />
                    </div>
                    <span>{lang.nativeLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white hover:bg-gray-50">
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-black text-white shadow-sm">
            {user?.username?.slice(0, 2).toUpperCase() || 'UN'}
          </div>
        </div>
      </div>

      <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-8 py-4 lg:flex">
        <div className={`flex items-center gap-2 text-sm text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link href="/" className="flex items-center gap-1 hover:text-gray-600">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={crumb.href} className="hover:text-gray-600">
                {crumb.label}
              </Link>
            </div>
          ))}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-gray-700">{pageName}</span>
        </div>

        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangs((current) => !current)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <Globe className="h-3.5 w-3.5 text-gray-500" />
              {currentLanguage.shortLabel}
              <ChevronDownIcon
                className={`h-3 w-3 text-gray-400 transition-transform ${showLangs ? 'rotate-180' : ''}`}
              />
            </button>

            {showLangs ? (
              <div className={`absolute top-full z-50 mt-2 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg ${isRTL ? 'left-0' : 'right-0'}`}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-[12px] font-semibold transition ${
                      currentLanguage.code === lang.code ? 'bg-violet-50 text-violet-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative h-[10px] w-[14px] overflow-hidden rounded-[2px] shadow-sm">
                      <Image src={lang.flag} alt={lang.englishLabel} fill className="object-cover" />
                    </div>
                    <span>{lang.nativeLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[12px] font-black text-white">
            {user?.username?.slice(0, 2).toUpperCase() || 'UN'}
          </div>
        </div>
      </div>
    </>
  );
}
