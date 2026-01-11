"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuizzesService = class QuizzesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createQuizDto) {
        const { title, questions } = createQuizDto;
        const quiz = await this.prisma.quiz.create({
            data: {
                title,
                questions: {
                    create: questions.map((q) => ({
                        type: q.type,
                        text: q.text,
                        options: q.options || null,
                        answer: q.answer || null,
                    })),
                },
            },
            include: {
                questions: true,
            },
        });
        return quiz;
    }
    async findAll() {
        const quizzes = await this.prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                createdAt: true,
                _count: {
                    select: {
                        questions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const result = [];
        for (const quiz of quizzes) {
            result.push({
                id: quiz.id,
                title: quiz.title,
                questionCount: quiz._count.questions,
                createdAt: quiz.createdAt,
            });
        }
        return result;
    }
    async findOne(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: true,
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException(`Quiz with ID ${id} not found`);
        }
        return quiz;
    }
    async remove(id) {
        const exists = await this.prisma.quiz.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!exists) {
            throw new common_1.NotFoundException(`Quiz with ID ${id} not found`);
        }
        await this.prisma.question.deleteMany({
            where: { quizId: id },
        });
        await this.prisma.quiz.delete({
            where: { id },
        });
        return { message: `Quiz with ID ${id} has been deleted` };
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map