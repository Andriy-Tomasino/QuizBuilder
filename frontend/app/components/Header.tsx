'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isCreatePage = pathname === '/create';
  const isQuizPage = pathname?.startsWith('/quizzes/') && pathname !== '/quizzes';
  const showBackButton = isCreatePage || isQuizPage;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {showBackButton && (
            <button
              onClick={() => router.push('/quizzes')}
              className="absolute left-4 text-gray-400 hover:text-gray-100 transition flex items-center gap-2"
              title="Назад до квізів"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Назад
            </button>
          )}
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-roboto)' }}>
            Quiz Builder
          </h1>
          {!showBackButton && (
            <Link
              href="/create"
              className="absolute right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center justify-center"
              title="Створити квіз"
            >
              +
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

