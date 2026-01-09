import { z } from 'zod';
import { QuestionType } from '@/types/quiz';

const questionSchema = z.object({
  type: z.nativeEnum(QuestionType),
  text: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string().min(1, "Текст питання обов'язковий")
  ),
  options: z.array(z.string()).optional(),
  answer: z.union([
    z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          if (val === 'true') return true;
          if (val === 'false') return false;
        }
        return val;
      },
      z.boolean()
    ),
    z.preprocess(
      (val) => (typeof val === 'string' ? val.trim() : val),
      z.string().min(1, "Введіть правильну відповідь")
    ),
    z.array(z.string()).min(1, "Оберіть хоча б одну правильну відповідь"),
  ]),
}).superRefine((data, ctx) => {
  if (data.type === QuestionType.CHECKBOX) {
    if (!data.options || data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Додайте мінімум 2 варіанти відповіді",
        path: ["options"],
      });
    }
    if (data.options?.some(opt => !opt.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Варіанти відповідей не можуть бути порожніми",
        path: ["options"],
      });
    }
  }
});

export const quizSchema = z.object({
  title: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z.string().min(3, "Назва квізу має містити мінімум 3 символи")
  ),
  questions: z.array(questionSchema).min(1, "Додайте хоча б одне питання"),
});

export type QuizFormValues = z.infer<typeof quizSchema>;

