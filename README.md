# Tracking System Client

Frontend приложение для системы отслеживания логистики и управления цепочками поставок.

## 🚀 Технологический стек

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev server
- **Tailwind CSS** - стилизация
- **Zustand** - управление состоянием
- **React Router** - роутинг
- **Zod** - валидация
- **Axios** - HTTP клиент
- **React Hook Form** - работа с формами
- **Lucide React** - иконки
- **Recharts** - графики
- **date-fns** - работа с датами

## 📦 Установка

```bash
# Установить зависимости
npm install

# Запустить dev server
npm run dev

# Собрать для продакшена
npm run build

# Preview продакшен сборки
npm run preview
```

## 🏗️ Структура проекта

```
src/
├── api/              # API клиенты
├── components/       # Компоненты
│   ├── ui/          # UI компоненты
│   ├── layout/      # Layout компоненты
│   └── features/    # Feature компоненты
├── pages/           # Страницы
├── stores/          # Zustand stores
├── hooks/           # Кастомные хуки
├── types/           # TypeScript типы
├── schemas/         # Zod схемы
├── utils/           # Утилиты
├── constants/       # Константы
└── routes/          # Роутинг
```

## 🔐 Роли пользователей

- **Co-Founder** - полный доступ ко всем функциям
- **Logistician** - управление логистикой и цепочками поставок
- **Expeditor** - просмотр и обновление заказов/грузов
- **Courier** - базовый доступ для курьеров

## 🎨 Дизайн система

### Цвета

- **Primary**: #3B82F6 (blue)
- **Secondary**: #8B5CF6 (purple)
- **Success**: #10B981 (green)
- **Warning**: #F59E0B (amber)
- **Danger**: #EF4444 (red)

### Статусы грузов

- **assembly** - сборка (синий)
- **on the way** - в пути (желтый)
- **delayed** - задержан (красный)
- **delivered** - доставлен (зеленый)

## 🌐 Переменные окружения

Создайте файл `.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Tracking System
```

## 📝 Доступные скрипты

- `npm run dev` - запуск dev server
- `npm run build` - сборка для продакшена
- `npm run preview` - preview продакшен сборки
- `npm run lint` - проверка кода

## 🔗 API Endpoints

Приложение взаимодействует с backend API:

- `/auth` - аутентификация
- `/orders` - заказы
- `/cargos` - грузы
- `/vehicles` - транспорт
- `/supply-chains` - цепочки поставок
- `/supply-nodes` - узлы цепочек
- `/receivers` - получатели
- `/company` - компания
- `/invitations` - приглашения

## 📄 Лицензия

UNLICENSED
