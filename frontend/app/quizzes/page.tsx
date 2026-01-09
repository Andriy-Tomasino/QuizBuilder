'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizListItem } from '@/types/quiz';
import { api } from '@/lib/api';

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed')) {
        setQuizzes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Ви впевнені, що хочете видалити цей квіз?')) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err) {
      console.error('Помилка при видаленні квізу:', err);
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      console.error(`Помилка при видаленні квізу: ${message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowAnswers = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/quizzes/${id}/answers`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-400">Завантаження квізів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Всі квізи</h1>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Поки що немає квізів</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-700 relative"
              onClick={() => router.push(`/quizzes/${quiz.id}`)}
            >
              <div className="p-6 flex flex-col h-full relative">
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    type="button"
                    onClick={(e) => handleShowAnswers(quiz.id, e)}
                    className="text-gray-400 hover:text-gray-200 flex-shrink-0"
                    title="Показати правильні відповіді"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(quiz.id, e);
                    }}
                    disabled={deletingId === quiz.id}
                    className="text-red-400 hover:text-red-300 flex-shrink-0 disabled:opacity-50"
                    title="Видалити квіз"
                  >
                    {deletingId === quiz.id ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl font-semibold text-gray-100 mb-4 line-clamp-2">
                    {quiz.title}
                  </h2>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-400 text-sm">
                      Питань: {quiz.questionCount}
                    </p>
                    {quiz.createdAt && (
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(quiz.createdAt).toLocaleDateString('uk-UA')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
