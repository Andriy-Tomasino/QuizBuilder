import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
    create(createQuizDto: CreateQuizDto): Promise<{
        questions: {
            id: number;
            type: import("@prisma/client").$Enums.QuestionType;
            text: string;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            answer: import("@prisma/client/runtime/client").JsonValue | null;
            quizId: number;
        }[];
    } & {
        title: string;
        createdAt: Date;
        id: number;
    }>;
    findAll(): Promise<{
        id: number;
        title: string;
        questionCount: number;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        questions: {
            id: number;
            type: import("@prisma/client").$Enums.QuestionType;
            text: string;
            options: import("@prisma/client/runtime/client").JsonValue | null;
            answer: import("@prisma/client/runtime/client").JsonValue | null;
            quizId: number;
        }[];
    } & {
        title: string;
        createdAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
