'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  Trash2, 
  Inbox, 
  Layers,
  Globe,
  Trophy,
  CheckCircle2,
  PencilLine
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboardShell from '@/components/AdminDashboardShell';
import { useConfirm } from '@/components/ConfirmProvider';
import { useI18n } from '@/lib/i18n';
import { buildLocalizedPath } from '@/lib/i18n-settings';
import { SUPPORTED_LANGUAGES, getLocalizedCategoryName, normalizeLanguageCode } from '@/lib/languages';
import { deleteQuestion, fetchAdminQuestions, updateQuestion } from '@/store/slices/adminSlice';
import { fetchCategories } from '@/store/slices/quizSlice';

function EditQuestionModal({ open, t, form, setForm, onClose, onSave, saving }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/45 p-4 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-lg font-black text-gray-900">{t('admin.edit_question')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            {t('profile.cancel')}
          </button>
        </div>

        <div className="space-y-4 p-5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">{t('admin.question_text_label')}</label>
            <textarea
              value={form.question_text}
              onChange={(event) => setForm((prev) => ({ ...prev, question_text: event.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {['a', 'b', 'c', 'd'].map((letter) => (
              <div key={letter}>
                <label className="mb-1 block text-sm font-bold text-gray-700">{t(`admin.option_${letter}_label`)}</label>
                <input
                  value={form[`option_${letter}`]}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, [`option_${letter}`]: event.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">{t('admin.correct_answer_label')}</label>
              <select
                value={form.correct_answer}
                onChange={(event) => setForm((prev) => ({ ...prev, correct_answer: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                {['A', 'B', 'C', 'D'].map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">{t('admin.difficulty_label')}</label>
              <select
                value={form.difficulty}
                onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option value="easy">{t('admin.difficulty_easy')}</option>
                <option value="medium">{t('admin.difficulty_medium')}</option>
                <option value="hard">{t('admin.difficulty_hard')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="w-full rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60"
          >
            {saving ? t('common.loading') : t('admin.save_changes')}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionsContent() {
  const dispatch = useDispatch();
  const { questions, questionsLoading, questionsTotal } = useSelector((state) => state.admin);
  const { categories, categoriesLoading } = useSelector((state) => state.quiz);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const activeLang = normalizeLanguageCode(selectedLang);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedQuestionLanguage, setSelectedQuestionLanguage] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editForm, setEditForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    difficulty: 'medium',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const { t } = useI18n();
  const confirm = useConfirm();
  const withLocale = (path) => buildLocalizedPath(path, activeLang);
  const selectedCategory = useMemo(
    () => categories.find((category) => String(category.id) === String(selectedCategoryId)) || null,
    [categories, selectedCategoryId]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedCategoryId || !selectedQuestionLanguage) return;
    dispatch(
      fetchAdminQuestions({
        categoryId: selectedCategoryId,
        language: selectedQuestionLanguage,
        page: 1,
        limit: 500,
      })
    );
  }, [dispatch, selectedCategoryId, selectedQuestionLanguage]);

  const handleDelete = async (id) => {
    const shouldDelete = await confirm({
      message: t('admin.delete_confirm'),
      confirmLabel: t('admin.delete'),
      tone: 'danger',
    });
    if (shouldDelete) {
      dispatch(deleteQuestion(id));
    }
  };

  const openEditModal = (question) => {
    setEditingQuestionId(question.id);
    setEditForm({
      question_text: question.question_text || '',
      option_a: question.option_a || '',
      option_b: question.option_b || '',
      option_c: question.option_c || '',
      option_d: question.option_d || '',
      correct_answer: String(question.correct_answer || 'A').toUpperCase(),
      difficulty: question.difficulty || 'medium',
    });
  };

  const closeEditModal = () => {
    setEditingQuestionId(null);
    setSavingEdit(false);
  };

  const handleUpdate = async () => {
    const payload = {
      question_text: editForm.question_text.trim(),
      option_a: editForm.option_a.trim(),
      option_b: editForm.option_b.trim(),
      option_c: editForm.option_c.trim(),
      option_d: editForm.option_d.trim(),
      correct_answer: editForm.correct_answer,
      difficulty: editForm.difficulty,
    };

    if (
      !payload.question_text ||
      !payload.option_a ||
      !payload.option_b ||
      !payload.option_c ||
      !payload.option_d
    ) {
      toast.error(t('admin.fill_all_fields'));
      return;
    }

    setSavingEdit(true);
    try {
      await dispatch(updateQuestion({ id: editingQuestionId, payload })).unwrap();
      toast.success(t('admin.update_success'));
      closeEditModal();
    } catch (error) {
      toast.error(error || t('admin.update_failed'));
      setSavingEdit(false);
    }
  };

  return (
    <AdminDashboardShell>
      <main className="mx-auto max-w-6xl px-4 py-8 text-gray-900">
          {/* Header */}
          <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-violet-50 p-3 rounded-2xl border border-violet-100">
                <BookOpen className="w-7 h-7 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">
                  {selectedCategoryId && selectedQuestionLanguage
                    ? t('admin.questions_heading', { count: questionsTotal })
                    : t('admin.questions_management')}
                </h1>
                <p className="text-gray-500 mt-1">{t('admin.questions_subtitle')}</p>
              </div>
            </div>
            
            <Link 
              href={withLocale('/admin/ai-generator')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-3 text-white text-sm font-bold transition hover:brightness-110 active:scale-95"
            >
              <Layers className="w-5 h-5" />
              {t('admin.generate_more')}
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-600" />
                <h2 className="text-sm font-black uppercase tracking-wider text-gray-700">
                  {t('admin.select_category')}
                </h2>
              </div>
              {categoriesLoading ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((category) => {
                    const active = String(selectedCategoryId) === String(category.id);
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategoryId(String(category.id));
                          setSelectedQuestionLanguage('');
                        }}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                          active
                            ? 'border-violet-300 bg-violet-50 text-violet-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {getLocalizedCategoryName(category, activeLang)}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-600" />
                <h2 className="text-sm font-black uppercase tracking-wider text-gray-700">
                  {t('admin.target_language')}
                </h2>
              </div>
              {!selectedCategoryId ? (
                <p className="text-sm text-gray-500">{t('admin.select_category_first')}</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const active = selectedQuestionLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedQuestionLanguage(lang.code)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                          active
                            ? 'border-violet-300 bg-violet-50 text-violet-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {t(`admin.lang_${lang.code}`)}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {selectedCategoryId && selectedQuestionLanguage ? (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">
              <CheckCircle2 className="w-4 h-4 text-violet-600" />
              <span className="font-semibold">
                {t('admin.current_filter', {
                  category: selectedCategory ? getLocalizedCategoryName(selectedCategory, activeLang) : '-',
                  language: t(`admin.lang_${selectedQuestionLanguage}`),
                  count: questionsTotal,
                })}
              </span>
            </div>
          ) : null}

          {/* List Content */}
          {!selectedCategoryId || !selectedQuestionLanguage ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-gray-300 bg-white">
              <div className="bg-gray-100 p-5 rounded-full mb-5">
                <BookOpen className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">{t('admin.select_category_and_language')}</h3>
              <p className="mt-2 text-gray-500 max-w-md">{t('admin.select_category_and_language_desc')}</p>
            </div>
          ) : questionsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-28 rounded-2xl bg-white animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-gray-300 bg-white">
              <div className="bg-gray-100 p-5 rounded-full mb-5">
                <Inbox className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">{t('admin.no_questions_found')}</h3>
              <p className="mt-2 text-gray-500 max-w-xs">{t('admin.no_questions_desc')}</p>
              <Link 
                href={withLocale('/admin/ai-generator')} 
                className="mt-6 text-violet-700 font-bold hover:underline"
              >
                {t('admin.go_to_ai_generator')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-sm"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                        <Layers className="w-3 h-3" />
                        {question.category_name}
                      </span>
                      <span className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        <Globe className="w-3 h-3" />
                        {question.language}
                      </span>
                      <span className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        <Trophy className="w-3 h-3" />
                        {question.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(question)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 active:scale-90"
                      >
                        <PencilLine className="w-4 h-4" />
                        {t('admin.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(question.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t('admin.delete')}
                      </button>
                    </div>
                  </div>

                  <p className="mb-5 text-lg font-bold leading-snug text-gray-900" dir="auto">
                    {question.question_text}
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { k: 'A', v: question.option_a },
                      { k: 'B', v: question.option_b },
                      { k: 'C', v: question.option_c },
                      { k: 'D', v: question.option_d },
                    ].map(({ k, v }) => (
                      <div
                        key={k}
                        className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
                          question.correct_answer === k
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          question.correct_answer === k ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {k}
                        </div>
                        <span className="text-sm font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>

      <EditQuestionModal
        open={Boolean(editingQuestionId)}
        t={t}
        form={editForm}
        setForm={setEditForm}
        onClose={closeEditModal}
        onSave={handleUpdate}
        saving={savingEdit}
      />
    </AdminDashboardShell>
  );
}

export default function QuestionsPage() {
  return (
    <ProtectedRoute adminOnly>
      <QuestionsContent />
    </ProtectedRoute>
  );
}

