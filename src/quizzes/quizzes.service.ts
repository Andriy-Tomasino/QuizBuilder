import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
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

    const result: Array<{
      id: number;
      title: string;
      questionCount: number;
      createdAt: Date;
    }> = [];
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

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async remove(id: number) {
    const exists = await this.prisma.quiz.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    // Спочатку видаляємо всі питання, потім квіз
    await this.prisma.question.deleteMany({
      where: { quizId: id },
    });

    await this.prisma.quiz.delete({
      where: { id },
    });

    return { message: `Quiz with ID ${id} has been deleted` };
  }
}

