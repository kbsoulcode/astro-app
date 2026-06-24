# AstroNumerology AI

Production-ready каркас Next.js 15 для натальной карты, нумерологии и AI-синтеза отчета.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Vercel

Добавьте переменные `OPENAI_API_KEY` и `OPENAI_MODEL` в Project Settings → Environment Variables. Затем деплойте репозиторий на Vercel.

## Астрологические расчеты

В каркасе используется `astronomy-engine`: чистый TypeScript/JavaScript пакет для положений Солнца, Луны и планет. Дома и углы реализованы собственным модулем с Placidus-like fallback, Whole Sign, Equal House и Koch-like mode. Для коммерческой точности уровня профессиональной астрологии рекомендуется подключить Swiss Ephemeris через отдельный Node runtime/API или платный API и заменить адаптер `lib/astrology/ephemeris.ts`.

## OpenAI

Серверный маршрут `app/api/analyze/route.ts` считает карту и нумерологию, затем вызывает OpenAI Responses API через официальный SDK для цельного отчета.
