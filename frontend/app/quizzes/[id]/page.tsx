'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Quiz, QuestionType } from '@/types/quiz';
import { api } from '@/lib/api';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResults, setShowResults] = useState(false);

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
      // Ініціалізуємо відповіді
      const initialAnswers: Record<number, any> = {};
      data.questions.forEach((q) => {
        if (q.type === QuestionType.CHECKBOX) {
          initialAnswers[q.id || 0] = [];
        } else if (q.type === QuestionType.BOOLEAN) {
          initialAnswers[q.id || 0] = null;
        } else {
          initialAnswers[q.id || 0] = '';
        }
      });
      setAnswers(initialAnswers);
    } catch (err) {
      router.push('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCheckboxChange = (questionId: number, option: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (Array.isArray(current)) {
        if (current.includes(option)) {
          return {
            ...prev,
            [questionId]: current.filter((o) => o !== option),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...current, option],
          };
        }
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const isAnswerCorrect = (question: any) => {
    const userAnswer = answers[question.id || 0];
    if (question.type === QuestionType.BOOLEAN) {
      return userAnswer === question.answer;
    }
    if (question.type === QuestionType.INPUT) {
      return String(userAnswer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
    }
    if (question.type === QuestionType.CHECKBOX) {
      const correctAnswers = Array.isArray(question.answer) ? question.answer : [];
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
      if (correctAnswers.length !== userAnswers.length) return false;
      return correctAnswers.every((ans) => userAnswers.includes(ans));
    }
    return false;
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

  const allAnswered = quiz.questions.every((q) => {
    const answer = answers[q.id || 0];
    if (q.type === QuestionType.CHECKBOX) {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (q.type === QuestionType.BOOLEAN) {
      return answer !== null && answer !== undefined;
    }
    return answer !== '' && answer !== null && answer !== undefined;
  });

  const correctCount = quiz.questions.filter((q) => isAnswerCorrect(q)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">{quiz.title}</h1>
        <p className="text-gray-400 mt-2">
          Кількість питань: {quiz.questions.length}
        </p>
        {showResults && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-lg font-semibold text-gray-100">
              Результат: {correctCount} з {quiz.questions.length} правильних відповідей
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {Math.round((correctCount / quiz.questions.length) * 100)}% правильних відповідей
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const userAnswer = answers[question.id || 0];
          const isCorrect = showResults ? isAnswerCorrect(question) : null;

          return (
            <div key={question.id || index} className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Питання {index + 1}: {question.text}
              </h3>

              {!showResults ? (
                <div className="space-y-4">
                  {question.type === QuestionType.BOOLEAN && (
                    <div className="flex space-x-6">
                      <label className="flex items-center text-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={userAnswer === true}
                          onChange={() => handleAnswerChange(question.id || 0, true)}
                          className="mr-2 w-4 h-4 text-blue-600"
                        />
                        Так
                      </label>
                      <label className="flex items-center text-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={userAnswer === false}
                          onChange={() => handleAnswerChange(question.id || 0, false)}
                          className="mr-2 w-4 h-4 text-blue-600"
                        />
                        Ні
                      </label>
                    </div>
                  )}

                  {question.type === QuestionType.INPUT && (
                    <input
                      type="text"
                      value={userAnswer || ''}
                      onChange={(e) => handleAnswerChange(question.id || 0, e.target.value)}
                      placeholder="Введіть відповідь"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500"
                    />
                  )}

                  {question.type === QuestionType.CHECKBOX && (
                    <div className="space-y-2">
                      {question.options?.map((option: string, optIndex: number) => {
                        const isChecked = Array.isArray(userAnswer) && userAnswer.includes(option);
                        return (
                          <label
                            key={optIndex}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(question.id || 0, option)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-600 bg-gray-700"
                            />
                            <span className="text-gray-100">{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                    <p className={`font-medium mb-2 ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                      {isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                    </p>
                    <p className="text-gray-300 text-sm mb-2">Ваша відповідь:</p>
                    {question.type === QuestionType.BOOLEAN && (
                      <p className="text-gray-100">{userAnswer ? 'Так' : 'Ні'}</p>
                    )}
                    {question.type === QuestionType.INPUT && (
                      <p className="text-gray-100">{userAnswer || '(не відповіли)'}</p>
                    )}
                    {question.type === QuestionType.CHECKBOX && (
                      <div className="space-y-1">
                        {Array.isArray(userAnswer) && userAnswer.length > 0 ? (
                          userAnswer.map((ans, idx) => (
                            <p key={idx} className="text-gray-100">• {ans}</p>
                          ))
                        ) : (
                          <p className="text-gray-100">(не відповіли)</p>
                        )}
                      </div>
                    )}
                    <p className="text-gray-300 text-sm mt-3 mb-1">Правильна відповідь:</p>
                    {question.type === QuestionType.BOOLEAN && (
                      <p className="text-gray-100 font-medium">{question.answer ? 'Так' : 'Ні'}</p>
                    )}
                    {question.type === QuestionType.INPUT && (
                      <p className="text-gray-100 font-medium">{question.answer}</p>
                    )}
                    {question.type === QuestionType.CHECKBOX && (
                      <div className="space-y-1">
                        {Array.isArray(question.answer) && question.answer.map((ans, idx) => (
                          <p key={idx} className="text-gray-100 font-medium">• {ans}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Завершити квіз
          </button>
        </div>
      )}
    </div>
  );
}
