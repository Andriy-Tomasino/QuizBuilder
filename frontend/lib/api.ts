import { Quiz, QuizListItem, CreateQuizDto } from '@/types/quiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  async createQuiz(data: CreateQuizDto): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to create quiz');
    }

    return response.json();
  },

  async getQuizzes(): Promise<QuizListItem[]> {
    const response = await fetch(`${API_BASE_URL}/quizzes`);

    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }

    return response.json();
  },

  async getQuiz(id: number): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }

    return response.json();
  },

  async deleteQuiz(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete quiz');
    }
  },
};

