'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  Trash2, 
  Search, 
  Inbox, 
  ArrowLeft,
  Filter,
  Layers,
  Globe,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useConfirm } from '@/components/ConfirmProvider';
import { useI18n } from '@/lib/i18n';
import { deleteQuestion, fetchAdminQuestions } from '@/store/slices/adminSlice';

function QuestionsContent() {
  const dispatch = useDispatch();
  const { questions, questionsLoading } = useSelector((state) => state.admin);
  const { t } = useI18n();
  const confirm = useConfirm();

  useEffect(() => {
    dispatch(fetchAdminQuestions());
  }, [dispatch]);

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-[76px] text-white">
        <main className="mx-auto max-w-5xl px-4 py-12">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600/20 p-3 rounded-2xl border border-purple-500/30">
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {t('admin.questions_heading', { count: questions.length })}
                </h1>
                <p className="text-gray-400 mt-1">{t('admin.questions_subtitle')}</p>
              </div>
            </div>
            
            <Link 
              href="/admin/ai-generator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 font-bold transition hover:bg-purple-500 active:scale-95"
            >
              <Layers className="w-5 h-5" />
              {t('admin.generate_more')}
            </Link>
          </div>

          {/* List Content */}
          {questionsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-32 rounded-3xl bg-gray-900 animate-pulse border border-gray-800" />
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-[3rem] border border-dashed border-gray-800 bg-gray-900/10">
              <div className="bg-gray-800/50 p-6 rounded-full mb-6">
                <Inbox className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">{t('admin.no_questions_found')}</h3>
              <p className="mt-2 text-gray-500 max-w-xs">{t('admin.no_questions_desc')}</p>
              <Link 
                href="/admin/ai-generator" 
                className="mt-8 text-purple-400 font-bold hover:underline"
              >
                {t('admin.go_to_ai_generator')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/30 p-6 transition-all hover:border-gray-700 hover:bg-gray-900/50"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        <Layers className="w-3 h-3" />
                        {question.category_name}
                      </span>
                      <span className="flex items-center gap-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <Globe className="w-3 h-3" />
                        {question.language}
                      </span>
                      <span className="flex items-center gap-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <Trophy className="w-3 h-3" />
                        {question.difficulty}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleDelete(question.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600/10 px-3 py-2 text-sm font-bold text-red-500 transition hover:bg-red-600/20 hover:text-red-400 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('admin.delete')}
                    </button>
                  </div>

                  <p className="mb-6 text-lg font-bold leading-snug" dir="auto">
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
                            ? 'border-green-500/30 bg-green-500/10 text-green-400'
                            : 'border-gray-800/50 bg-gray-800/10 text-gray-500'
                        }`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          question.correct_answer === k ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400'
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
      </div>
    </>
  );
}

export default function QuestionsPage() {
  return (
    <ProtectedRoute adminOnly>
      <QuestionsContent />
    </ProtectedRoute>
  );
}

