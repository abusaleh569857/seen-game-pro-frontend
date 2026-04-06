'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { deleteQuestion, fetchAdminQuestions } from '@/store/slices/adminSlice';

function QuestionsContent() {
  const dispatch = useDispatch();
  const { questions, questionsLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminQuestions());
  }, [dispatch]);

  const handleDelete = (id) => {
    const shouldDelete = window.confirm('Delete this question?');
    if (shouldDelete) {
      dispatch(deleteQuestion(id));
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">? Questions ({questions.length})</h1>
        </div>

        {questionsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-24 rounded-xl bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="mb-3 text-4xl">??</p>
            <p>No questions yet. Use the AI Generator to create some.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question) => (
              <div
                key={question.id}
                className="rounded-xl border border-gray-700 bg-gray-900 p-4"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-purple-700 bg-purple-900/50 px-2 py-0.5 text-xs text-purple-300">
                      {question.category_name}
                    </span>
                    <span className="rounded-full border border-gray-600 bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                      {question.language}
                    </span>
                    <span className="rounded-full border border-gray-600 bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                      {question.difficulty}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(question.id)}
                    className="ml-2 shrink-0 text-sm text-red-500 transition hover:text-red-400"
                  >
                    ??? Delete
                  </button>
                </div>

                <p className="mb-3 text-sm font-medium" dir="auto">
                  {question.question_text}
                </p>

                <div className="grid grid-cols-2 gap-1 text-xs">
                  {[
                    { k: 'A', v: question.option_a },
                    { k: 'B', v: question.option_b },
                    { k: 'C', v: question.option_c },
                    { k: 'D', v: question.option_d },
                  ].map(({ k, v }) => (
                    <div
                      key={k}
                      className={`rounded px-2 py-1 ${
                        question.correct_answer === k
                          ? 'border border-green-700 bg-green-900/50 text-green-300'
                          : 'text-gray-500'
                      }`}
                    >
                      <span className="mr-1 font-bold">{k}.</span>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
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

