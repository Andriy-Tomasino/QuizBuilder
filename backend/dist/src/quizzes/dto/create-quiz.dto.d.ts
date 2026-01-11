import { QuestionType } from '@prisma/client';
export declare class CreateQuestionDto {
    type: QuestionType;
    text: string;
    options?: any;
    answer?: any;
}
export declare class CreateQuizDto {
    title: string;
    questions: CreateQuestionDto[];
}
