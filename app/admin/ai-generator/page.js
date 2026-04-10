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
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { clearGenerateResult, generateQuestions } from '@/store/slices/adminSlice';
import { fetchCategories } from '@/store/slices/quizSlice';

function AIGeneratorContent() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.quiz);
  const { generateLoading, generateResult } = useSelector((state) => state.admin);
  const [form, setForm] = useState({ categoryId: '', language: 'ar', count: 10 });
  const selectedCategoryId = form.categoryId || categories[0]?.id || '';

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
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <main className="mx-auto max-w-2xl px-4 py-12">
          {/* Breadcrumb / Back */}
          <Link 
            href="/admin" 
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-10 flex items-center gap-4">
            <div className="bg-pink-600/20 p-3 rounded-2xl border border-pink-500/30">
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">AI Question Generator</h1>
              <p className="text-gray-400 mt-1">Harness Gemini AI to create high-quality quiz content</p>
            </div>
          </div>

          <div className="space-y-8 rounded-[2.5rem] border border-gray-800 bg-gray-900/30 p-8 md:p-10 backdrop-blur-xl">
            {/* Category Select */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                <Settings2 className="w-4 h-4" />
                Select Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                className="w-full rounded-2xl border border-gray-700 bg-gray-800/50 px-5 py-4 text-lg transition focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/10 appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-gray-900">
                    {category.name_en} / {category.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                <Languages className="w-4 h-4" />
                Target Language
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setForm({ ...form, language: lang.code })}
                    className={`rounded-2xl border p-4 text-center transition-all ${
                      form.language === lang.code 
                        ? 'border-purple-500 bg-purple-500/10 text-white font-bold' 
                        : 'border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700'
                    }`}
                  >
                    {lang.englishLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Count Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                <ListOrdered className="w-4 h-4" />
                Question Count
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
                  className="w-full rounded-2xl border border-gray-700 bg-gray-800/50 px-5 py-4 text-lg transition focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                  questions
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generateLoading || !selectedCategoryId}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-[2px] font-bold transition-all active:scale-[0.98] hover:shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50"
            >
              <div className="flex h-full w-full items-center justify-center gap-3 rounded-2xl bg-black/20 px-6 py-4 backdrop-blur-sm group-hover:bg-transparent transition-colors">
                {generateLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>AI is Thinking...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5" />
                    <span>Generate Now</span>
                  </>
                )}
              </div>
            </button>

            {/* Feedback Messages */}
            {generateResult ? (
              <div
                className={`flex items-center gap-4 rounded-2xl border p-5 transition-all animate-in fade-in slide-in-from-top-4 ${
                  generateResult.success
                    ? 'border-green-800/30 bg-green-900/10 text-green-400'
                    : 'border-red-800/30 bg-red-900/10 text-red-400'
                }`}
              >
                {generateResult.success ? (
                  <CheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{generateResult.success ? 'Success!' : 'Generation Failed'}</p>
                  <p className="text-sm opacity-80">{generateResult.message}</p>
                </div>
              </div>
            ) : null}
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Note: Process may take 30-60 seconds depending on API response.
          </p>
        </main>
      </div>
    </>
  );
}

export default function AIGeneratorPage() {
  return (
    <ProtectedRoute adminOnly>
      <AIGeneratorContent />
    </ProtectedRoute>
  );
}
