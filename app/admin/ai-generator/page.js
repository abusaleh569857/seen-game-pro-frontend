'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearGenerateResult, generateQuestions } from '@/store/slices/adminSlice';
import { fetchCategories } from '@/store/slices/quizSlice';

const LANGS = [
  { code: 'ar', label: 'Arabic (???????)' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ur', label: 'Urdu (????)' },
];

function AIGeneratorContent() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.quiz);
  const { generateLoading, generateResult } = useSelector((state) => state.admin);
  const [form, setForm] = useState({ categoryId: '', language: 'ar', count: 10 });

  useEffect(() => {
    dispatch(fetchCategories());

    return () => {
      dispatch(clearGenerateResult());
    };
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((current) => ({ ...current, categoryId: categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const handleGenerate = () => {
    if (!form.categoryId) {
      return;
    }

    dispatch(generateQuestions(form));
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">?? AI Question Generator</h1>

        <div className="space-y-5 rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Category</label>
            <select
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 transition focus:border-purple-500 focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name_en} / {category.name_ar}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Language</label>
            <select
              value={form.language}
              onChange={(event) => setForm({ ...form, language: event.target.value })}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 transition focus:border-purple-500 focus:outline-none"
            >
              {LANGS.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Number of questions
              <span className="ml-1 text-gray-600">(5-20)</span>
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={form.count}
              onChange={(event) =>
                setForm({ ...form, count: Number.parseInt(event.target.value || '10', 10) })
              }
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 transition focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateLoading || !form.categoryId}
            className="w-full rounded-xl bg-purple-600 py-3.5 font-bold transition active:scale-95 hover:bg-purple-500 disabled:opacity-50"
          >
            {generateLoading ? 'Generating... (30-60 seconds)' : 'Generate Questions'}
          </button>

          {generateResult ? (
            <div
              className={`rounded-xl border p-4 text-sm ${
                generateResult.success
                  ? 'border-green-700 bg-green-900/50 text-green-300'
                  : 'border-red-700 bg-red-900/50 text-red-300'
              }`}
            >
              {generateResult.success ? '? ' : '? '}
              {generateResult.message}
            </div>
          ) : null}
        </div>
      </main>
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

