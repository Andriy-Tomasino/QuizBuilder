'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Quiz, QuestionType } from '@/types/quiz';
import { api } from '@/lib/api';

export default function QuizAnswersPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadQuiz(Number(params.id));
    }
  }, [params.id]);

  const loadQuiz = async (id: number) => {
    try {
      setLoading(true);
      const data = await api.getQuiz(id);
      setQuiz(data);
    } catch (err) {
      router.push('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-400">Завантаження квізу...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Квіз не знайдено</p>
          <Link
            href="/quizzes"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Повернутися до списку квізів
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Правильні відповіді: {quiz.title}
        </h1>
        <p className="text-gray-400 mt-2">
          Кількість питань: {quiz.questions.length}
        </p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div
            key={question.id || index}
            className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                Питання {index + 1}: {question.text}
              </h3>
              <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded ml-2">
                {question.type === QuestionType.BOOLEAN && 'Boolean'}
                {question.type === QuestionType.INPUT && 'Текст'}
                {question.type === QuestionType.CHECKBOX && 'Множинний вибір'}
              </span>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-400 mb-2">
                Правильна відповідь:
              </p>
              {question.type === QuestionType.BOOLEAN && (
                <p className="text-gray-100 font-medium">
                  {question.answer ? 'Так' : 'Ні'}
                </p>
              )}

              {question.type === QuestionType.INPUT && (
                <p className="text-gray-100 font-medium">{question.answer}</p>
              )}

              {question.type === QuestionType.CHECKBOX && (
                <div className="space-y-2">
                  {question.options?.map((option: string, optIndex: number) => {
                    const isCorrect =
                      Array.isArray(question.answer) &&
                      question.answer.includes(option);

                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center space-x-2 p-2 rounded ${
                          isCorrect
                            ? 'bg-green-900 border border-green-700'
                            : 'bg-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isCorrect}
                          readOnly
                          className="cursor-not-allowed w-4 h-4 text-green-600 rounded border-gray-600 bg-gray-800"
                        />
                        <span
                          className={
                            isCorrect
                              ? 'text-green-200 font-medium'
                              : 'text-gray-300'
                          }
                        >
                          {option}
                        </span>
                        {isCorrect && (
                          <span className="text-green-400 text-xs ml-auto">
                            ✓ Правильно
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

