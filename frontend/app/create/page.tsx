'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch, Control, UseFormSetValue, UseFormWatch, UseFormTrigger, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionType } from '@/types/quiz';
import { api } from '@/lib/api';
import { quizSchema, QuizFormValues } from '@/lib/schemas';
import { clsx } from 'clsx';

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      questions: [
        {
          type: QuestionType.BOOLEAN,
          text: '',
          answer: true,
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);
    try {
      const cleanQuestions = data.questions.map((q) => {
        const base = {
          type: q.type,
          text: q.text.trim(),
        };

        if (q.type === QuestionType.BOOLEAN) {
          // Переконуємося, що значення є булевим
          let boolAnswer: boolean;
          if (typeof q.answer === 'boolean') {
            boolAnswer = q.answer;
          } else if (typeof q.answer === 'string') {
            boolAnswer = q.answer === 'true' || q.answer === 'True';
          } else {
            boolAnswer = Boolean(q.answer);
          }
          return {
            ...base,
            answer: boolAnswer,
          };
        }
        
        if (q.type === QuestionType.INPUT) {
          return {
            ...base,
            answer: typeof q.answer === 'string' ? q.answer.trim() : q.answer,
          };
        }
        
        if (q.type === QuestionType.CHECKBOX) {
          return {
            ...base,
            options: q.options?.filter(opt => opt.trim()).map(opt => opt.trim()) || [],
            answer: Array.isArray(q.answer) ? q.answer.filter(a => a.trim()).map(a => a.trim()) : [],
          };
        }

        return base;
      });

      const quizData = {
        title: data.title.trim(),
        questions: cleanQuestions,
      };

      await api.createQuiz(quizData);
      router.push('/quizzes');
    } catch (err) {
      console.error('Помилка при створенні квізу:', err);
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      console.error(`Помилка: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Створити новий квіз</h1>

      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error('Помилки валідації:', errors);
      })} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Назва квізу
          </label>
          <input
            {...register('title')}
            className={clsx(
              "w-full px-4 py-2 bg-gray-800 border rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500",
              errors.title ? "border-red-500" : "border-gray-700"
            )}
            placeholder="Введіть назву квізу"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-100">Питання</h2>
            <button
              type="button"
              onClick={() =>
                append({
                  type: QuestionType.BOOLEAN,
                  text: '',
                  answer: true,
                  options: [],
                })
              }
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
            >
              + Додати питання
            </button>
          </div>

          {fields.map((field, index) => (
            <QuestionCard
              key={field.id}
              index={index}
              remove={remove}
              control={control}
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
              errors={errors}
              showRemove={fields.length > 1}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
          <button
            type="button"
            onClick={() => router.push('/quizzes')}
            className="px-6 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              console.log('Кнопка натиснута, isSubmitting:', isSubmitting);
              console.log('Помилки форми:', errors);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Збереження...' : 'Зберегти квіз'}
          </button>
        </div>
      </form>
    </div>
  );
}

function QuestionCard({
  index,
  remove,
  control,
  register,
  setValue,
  watch,
  trigger,
  errors,
  showRemove,
}: {
  index: number;
  remove: (index: number) => void;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  setValue: UseFormSetValue<QuizFormValues>;
  watch: UseFormWatch<QuizFormValues>;
  trigger: UseFormTrigger<QuizFormValues>;
  errors: any;
  showRemove: boolean;
}) {
  const type = useWatch({ control, name: `questions.${index}.type` });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-100">Питання {index + 1}</h3>
        {showRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Видалити
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Тип питання</label>
          <select
            {...register(`questions.${index}.type`)}
            onChange={(e) => {
              const newType = e.target.value as QuestionType;
              setValue(`questions.${index}.type`, newType);
              if (newType === QuestionType.BOOLEAN) setValue(`questions.${index}.answer`, true);
              if (newType === QuestionType.INPUT) setValue(`questions.${index}.answer`, '');
              if (newType === QuestionType.CHECKBOX) {
                setValue(`questions.${index}.answer`, []);
                setValue(`questions.${index}.options`, ['', '']);
              }
            }}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value={QuestionType.BOOLEAN}>Boolean (Так/Ні)</option>
            <option value={QuestionType.INPUT}>Текстова відповідь</option>
            <option value={QuestionType.CHECKBOX}>Множинний вибір</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Текст питання</label>
          <input
            {...register(`questions.${index}.text`)}
            placeholder="Введіть текст питання"
            className={clsx(
              "w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500",
              errors.questions?.[index]?.text ? "border-red-500" : "border-gray-600"
            )}
          />
          {errors.questions?.[index]?.text && (
            <p className="text-red-400 text-xs mt-1">{errors.questions[index].text.message}</p>
          )}
        </div>

        <div className="pt-2 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {type === QuestionType.CHECKBOX ? 'Варіанти та правильні відповіді' : 'Правильна відповідь'}
          </label>

          {type === QuestionType.BOOLEAN && (
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-100 cursor-pointer">
                <input
                  type="radio"
                  checked={watch(`questions.${index}.answer`) === true}
                  onChange={() => setValue(`questions.${index}.answer`, true)}
                  className="mr-2 w-4 h-4 text-blue-600"
                />
                Так
              </label>
              <label className="flex items-center text-gray-100 cursor-pointer">
                <input
                  type="radio"
                  checked={watch(`questions.${index}.answer`) === false}
                  onChange={() => setValue(`questions.${index}.answer`, false)}
                  className="mr-2 w-4 h-4 text-blue-600"
                />
                Ні
              </label>
            </div>
          )}

          {type === QuestionType.INPUT && (
            <div>
              <input
                {...register(`questions.${index}.answer`)}
                placeholder="Введіть правильну відповідь"
                className={clsx(
                  "w-full px-4 py-2 bg-gray-700 border rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500",
                  errors.questions?.[index]?.answer ? "border-red-500" : "border-gray-600"
                )}
              />
              {errors.questions?.[index]?.answer && (
                <p className="text-red-400 text-xs mt-1">{errors.questions[index].answer.message}</p>
              )}
            </div>
          )}

          {type === QuestionType.CHECKBOX && (
            <CheckboxOptions control={control} setValue={setValue} watch={watch} nestIndex={index} errors={errors} />
          )}
        </div>
      </div>
    </div>
  );
}

function CheckboxOptions({ control, setValue, watch, nestIndex, errors }: { control: Control<QuizFormValues>, setValue: UseFormSetValue<QuizFormValues>, watch: UseFormWatch<QuizFormValues>, nestIndex: number, errors: any }) {
  const options = watch(`questions.${nestIndex}.options`) || [];
  const currentAnswers = watch(`questions.${nestIndex}.answer`) as string[] || [];

  const addOption = () => {
    setValue(`questions.${nestIndex}.options`, [...options, '']);
  };

  const removeOption = (idx: number) => {
    const optToRemove = options[idx];
    const newOptions = options.filter((_: string, i: number) => i !== idx);
    setValue(`questions.${nestIndex}.options`, newOptions);
    
    if (currentAnswers.includes(optToRemove)) {
      setValue(`questions.${nestIndex}.answer`, currentAnswers.filter(a => a !== optToRemove));
    }
  };

  const toggleAnswer = (opt: string) => {
    if (!opt.trim()) return;
    if (currentAnswers.includes(opt)) {
      setValue(`questions.${nestIndex}.answer`, currentAnswers.filter(a => a !== opt));
    } else {
      setValue(`questions.${nestIndex}.answer`, [...currentAnswers, opt]);
    }
  };

  return (
    <div className="space-y-3">
      {errors.questions?.[nestIndex]?.options && (
        <p className="text-red-400 text-xs">{errors.questions[nestIndex].options.message}</p>
      )}
      {errors.questions?.[nestIndex]?.answer && (
        <p className="text-red-400 text-xs">{errors.questions[nestIndex].answer.message}</p>
      )}

      <button
        type="button"
        onClick={addOption}
        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
      >
        + Додати варіант
      </button>

      {options.map((opt: string, k: number) => (
        <div key={k} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={currentAnswers.includes(opt)}
            onChange={() => toggleAnswer(opt)}
            disabled={!opt.trim()}
            className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-700"
          />
          <input
            value={opt}
            onChange={(e) => {
              const val = e.target.value;
              const newOptions = [...options];
              newOptions[k] = val;
              setValue(`questions.${nestIndex}.options`, newOptions);
              
              if (currentAnswers.includes(opt)) {
                const newAns = currentAnswers.filter(a => a !== opt);
                if (val.trim()) newAns.push(val);
                setValue(`questions.${nestIndex}.answer`, newAns);
              }
            }}
            placeholder={`Варіант ${k + 1}`}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeOption(k)}
            className="text-gray-400 hover:text-red-400 px-2 text-xl"
            title="Видалити варіант"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
