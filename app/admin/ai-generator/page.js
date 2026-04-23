'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Sparkles, 
  Settings2, 
  Languages, 
  ListOrdered, 
  BrainCircuit,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardShell from '@/components/AdminDashboardShell';
import { useI18n } from '@/lib/i18n';
import { SUPPORTED_LANGUAGES, isRtlLanguage, normalizeLanguageCode } from '@/lib/languages';
import { buildLocalizedPath } from '@/lib/i18n-settings';
import { clearGenerateResult, generateQuestions } from '@/store/slices/adminSlice';
import { fetchCategories } from '@/store/slices/quizSlice';

function AIGeneratorContent() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.quiz);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const activeLang = normalizeLanguageCode(selectedLang);
  const isRTL = isRtlLanguage(activeLang);
  const { generateLoading, generateResult } = useSelector((state) => state.admin);
  const [form, setForm] = useState({ categoryId: '', language: 'ar', count: 10 });
  const selectedCategoryId = form.categoryId || categories[0]?.id || '';
  const { t } = useI18n();
  const withLocale = (path) => buildLocalizedPath(path, activeLang);

  useEffect(() => {
    dispatch(fetchCategories());

    return () => {
      dispatch(clearGenerateResult());
    };
  }, [dispatch]);

  const handleGenerate = () => {
    if (!selectedCategoryId) return;
    dispatch(generateQuestions({ ...form, categoryId: selectedCategoryId }));
  };

  return (
    <AdminDashboardShell>
      <main className="mx-auto max-w-4xl px-4 py-8 text-gray-900">
          {/* Breadcrumb / Back */}
          <Link 
            href={withLocale('/admin')} 
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {t('admin.back_to_dashboard')}
          </Link>

          {/* Header */}
          <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-violet-50 p-3 rounded-2xl border border-violet-100">
                <Sparkles className="w-7 h-7 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">{t('admin.ai_generator')}</h1>
                <p className="text-gray-500 mt-1">{t('admin.ai_generator_subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-7 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
            {/* Category Select */}
            <div className="space-y-3">
              <label className={`flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ${isRTL ? 'mr-1' : 'ml-1'}`}>
                <Settings2 className="w-4 h-4" />
                {t('admin.select_category')}
              </label>
              <select
                value={selectedCategoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-white">
                    {category.name_en} / {category.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="space-y-3">
              <label className={`flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ${isRTL ? 'mr-1' : 'ml-1'}`}>
                <Languages className="w-4 h-4" />
                {t('admin.target_language')}
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setForm({ ...form, language: lang.code })}
                    className={`rounded-2xl border p-4 text-center transition-all ${
                      form.language === lang.code 
                        ? 'border-violet-300 bg-violet-50 text-violet-700 font-bold' 
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {lang.englishLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Count Input */}
            <div className="space-y-3">
              <label className={`flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] ${isRTL ? 'mr-1' : 'ml-1'}`}>
                <ListOrdered className="w-4 h-4" />
                {t('admin.question_count')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="20"
                  value={form.count}
                  onChange={(event) =>
                    setForm({ ...form, count: Number.parseInt(event.target.value || '10', 10) })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
                <span className={`absolute top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium ${isRTL ? 'left-4' : 'right-4'}`}>
                  {t('admin.questions')}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generateLoading || !selectedCategoryId}
              className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-4 text-white font-bold transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-50"
            >
              <div className="flex h-full w-full items-center justify-center gap-3">
                {generateLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                     <span>{t('admin.thinking')}</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5" />
                     <span>{t('admin.generate_now')}</span>
                  </>
                )}
              </div>
            </button>

            {/* Feedback Messages */}
            {generateResult ? (
              <div
                className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${
                  generateResult.success
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {generateResult.success ? (
                  <CheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{generateResult.success ? t('admin.success') : t('admin.failed')}</p>
                  <p className="text-sm opacity-80">{generateResult.message}</p>
                </div>
              </div>
            ) : null}
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            {t('admin.note')}
          </p>
      </main>
    </AdminDashboardShell>
  );
}

export default function AIGeneratorPage() {
  return (
    <ProtectedRoute adminOnly>
      <AIGeneratorContent />
    </ProtectedRoute>
  );
}
