export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export interface Question {
  id?: number;
  type: QuestionType;
  text: string;
  options?: string[];
  answer: boolean | string | string[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  createdAt?: string;
}

export interface QuizListItem {
  id: number;
  title: string;
  questionCount: number;
  createdAt?: string;
}

export interface CreateQuizDto {
  title: string;
  questions: Omit<Question, 'id'>[];
}

