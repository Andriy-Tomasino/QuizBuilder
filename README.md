# Quiz Builder

Повнофункціональний веб-додаток для створення та керування квізами з різними типами питань.

## Технології

### Backend
- **Node.js** з **NestJS**
- **TypeScript**
- **Prisma** з **SQLite**
- **ESLint** та **Prettier** для якості коду

### Frontend
- **React.js** з **Next.js**
- **TypeScript**
- **Tailwind CSS** для стилізації
- **ESLint** для якості коду

## Структура проекту

```
QuizBuilder/
├── backend/         # NestJS додаток
│   ├── src/
│   │   ├── prisma/     # PrismaService
│   │   ├── quizzes/    # Модуль квізів
│   │   └── main.ts     # Точка входу
│   └── prisma/
│       └── schema.prisma
├── frontend/        # Next.js додаток
│   ├── app/         # Сторінки та компоненти
│   ├── lib/         # API сервіси
│   └── types/       # TypeScript типи
└── README.md
```

## Встановлення та запуск

### Передумови

- Node.js (v18 або вище)
- npm або yarn

### Backend

1. Перейдіть до директорії backend:
```bash
cd backend
```

2. Встановіть залежності:
```bash
npm install
```

3. Створіть файл `.env` на основі `.env.example`:
```bash
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

4. Запустіть міграції Prisma:
```bash
npx prisma migrate dev --name init
```

5. (Опціонально) Запустіть Prisma Studio для перегляду бази даних:
```bash
npx prisma studio
```

6. Запустіть backend сервер:
```bash
npm run start:dev
```

Backend буде доступний на `http://localhost:3000`

### Frontend

1. Перейдіть до директорії frontend:
```bash
cd frontend
```

2. Встановіть залежності:
```bash
npm install
```

3. Створіть файл `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Запустіть frontend сервер:
```bash
npm run dev
```

Frontend буде доступний на `http://localhost:3001`

## API Endpoints

### POST /quizzes
Створює новий квіз з питаннями.

**Request Body:**
```json
{
  "title": "Назва квізу",
  "questions": [
    {
      "type": "BOOLEAN",
      "text": "Текст питання",
      "answer": true
    }
  ]
}
```

### GET /quizzes
Повертає список всіх квізів з кількістю питань.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Назва квізу",
    "questionCount": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /quizzes/:id
Повертає повну інформацію про квіз включаючи всі питання.

**Response:**
```json
{
  "id": 1,
  "title": "Назва квізу",
  "questions": [
    {
      "id": 1,
      "type": "BOOLEAN",
      "text": "Текст питання",
      "answer": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /quizzes/:id
Видаляє квіз за ID.

## Типи питань

### 1. Boolean (Так/Ні)
Питання з двома варіантами відповіді: Так або Ні.

**Приклад:**
```json
{
  "type": "BOOLEAN",
  "text": "JavaScript є мовою програмування?",
  "answer": true
}
```

### 2. Input (Текстова відповідь)
Питання з короткою текстовою відповіддю.

**Приклад:**
```json
{
  "type": "INPUT",
  "text": "Яка столиця України?",
  "answer": "Київ"
}
```

### 3. Checkbox (Множинний вибір)
Питання з кількома варіантами відповідей, де може бути кілька правильних.

**Приклад:**
```json
{
  "type": "CHECKBOX",
  "text": "Які з наведених мов є мовами програмування?",
  "options": ["JavaScript", "HTML", "Python", "CSS"],
  "answer": ["JavaScript", "Python"]
}
```

## Створення тестового квізу

### Через UI

1. Відкрийте `http://localhost:3001/create`
2. Введіть назву квізу
3. Додайте питання, вибравши тип
4. Заповніть необхідні поля
5. Натисніть "Зберегти квіз"

### Через API

```bash
curl -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Тестовий квіз",
    "questions": [
      {
        "type": "BOOLEAN",
        "text": "JavaScript є мовою програмування?",
        "answer": true
      },
      {
        "type": "INPUT",
        "text": "Яка столиця України?",
        "answer": "Київ"
      },
      {
        "type": "CHECKBOX",
        "text": "Виберіть мови програмування",
        "options": ["JavaScript", "HTML", "Python"],
        "answer": ["JavaScript", "Python"]
      }
    ]
  }'
```

## Ліцензія

UNLICENSED

