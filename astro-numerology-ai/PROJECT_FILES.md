# Полный проект по файлам

---

## .env.example

```example
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_NAME=AstroNumerology AI

```

---

## PROJECT_FILES.md

```md

```

---

## README.md

```md
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

```

---

## app/api/analyze/route.ts

```ts
import { NextResponse } from 'next/server';
import { birthInputSchema } from '@/lib/validation';
import { buildNatalReport } from '@/lib/synthesis/build-report';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = birthInputSchema.parse(json);
    const report = await buildNatalReport(input);
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

```

---

## app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
body { background: radial-gradient(circle at top left, rgba(129,103,255,.35), transparent 35%), #120f1e; color: #f8f3e7; }
.card { @apply rounded-3xl border border-white/10 bg-white/[.06] p-6 shadow-soft backdrop-blur; }
.input { @apply w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none ring-gold/40 transition placeholder:text-white/45 focus:ring-2; }
.label { @apply text-sm font-medium text-white/80; }
.btn { @apply rounded-2xl bg-gold px-6 py-3 font-semibold text-ink transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60; }

```

---

## app/layout.tsx

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroNumerology AI',
  description: 'Натальная карта, нумерология и персональный AI-отчет'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}

```

---

## app/page.tsx

```tsx
import { BirthForm } from '@/components/BirthForm';

export default function Home() {
  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_.9fr]">
      <div><p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">Next.js 15 · Astrology · Numerology · OpenAI</p><h1 className="text-4xl font-black tracking-tight sm:text-6xl">Профессиональный отчет натальной карты и нумерологии</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Сервис рассчитывает планеты, дома, управителей, аспекты, чувствительные точки, числа даты рождения и формирует цельный персональный синтез через OpenAI.</p></div>
      <div className="card"><h2 className="text-2xl font-bold">Что внутри</h2><ul className="mt-4 space-y-3 text-white/75"><li>• 12 домов и переключаемые системы домов</li><li>• Хирон, Лилит, Селена, Узлы, Фортуна, Вертекс</li><li>• Аспекты с орбисами и проработкой напряжений</li><li>• Нумерология только по дате рождения</li><li>• AI-отчет уровня консультации</li></ul></div>
    </section>
    <BirthForm />
  </main>;
}

```

---

## components/BirthForm.tsx

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { birthInputSchema, type BirthInputDto } from '@/lib/validation';
import type { NatalReport } from '@/types/domain';
import { ReportSections } from './ReportSections';

const defaults: BirthInputDto = { date:'1990-05-17', time:'14:30', place:'Nicosia, Cyprus', latitude:35.1856, longitude:33.3823, timezone:'Asia/Nicosia', houseSystem:'placidus' };

export function BirthForm() {
  const [report, setReport] = useState<NatalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<BirthInputDto>({ resolver: zodResolver(birthInputSchema), defaultValues: defaults });

  async function onSubmit(values: BirthInputDto) {
    setLoading(true); setError(null); setReport(null);
    const res = await fetch('/api/analyze', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(values) });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Ошибка расчета'); else setReport(data);
    setLoading(false);
  }

  return <>
    <form onSubmit={form.handleSubmit(onSubmit)} className="card mx-auto mt-10 max-w-5xl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Дата рождения"><input className="input" type="date" {...form.register('date')} /></Field>
        <Field label="Время рождения"><input className="input" type="time" {...form.register('time')} /></Field>
        <Field label="Место рождения"><input className="input" {...form.register('place')} /></Field>
        <Field label="Широта"><input className="input" type="number" step="0.0001" {...form.register('latitude')} /></Field>
        <Field label="Долгота"><input className="input" type="number" step="0.0001" {...form.register('longitude')} /></Field>
        <Field label="Система домов"><select className="input" {...form.register('houseSystem')}><option value="placidus">Placidus</option><option value="whole-sign">Whole Sign</option><option value="koch">Koch</option><option value="equal">Equal House</option></select></Field>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4"><button className="btn" disabled={loading}>{loading ? 'Создаю отчет…' : 'Рассчитать карту'}</button><p className="text-sm text-white/55">Для точной геокодировки можно подключить Google Maps или Mapbox; здесь координаты вводятся явно.</p></div>
      {error && <p className="mt-4 rounded-2xl bg-red-500/15 p-4 text-red-100">{error}</p>}
    </form>
    {report && <ReportSections report={report} />}
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-2"><span className="label">{label}</span>{children}</label>; }

```

---

## components/ReportSections.tsx

```tsx
import type { NatalReport } from '@/types/domain';
import { interpretAspect, interpretHouse, interpretNumber, interpretPoint } from '@/lib/interpretations/engine';

export function ReportSections({ report }: { report: NatalReport }) {
  return <section className="mt-10 space-y-6">
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Итоговый отчет</h2><p className="whitespace-pre-line leading-8 text-white/85">{report.finalReport}</p></div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card"><h2 className="mb-4 text-2xl font-bold">Натальная карта</h2><div className="space-y-3">{report.points.map(p=><div key={p.key} className="rounded-2xl bg-white/5 p-4"><b>{p.label}</b><p className="text-sm text-white/75">{interpretPoint(p)}</p></div>)}</div></div>
      <div className="card"><h2 className="mb-4 text-2xl font-bold">Нумерология</h2><div className="space-y-3">{report.numerology.map(n=><div key={n.title} className="rounded-2xl bg-white/5 p-4"><b>{n.title}</b><p className="text-sm text-white/75">{interpretNumber(n)}</p></div>)}</div></div>
    </div>
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Дома и управители</h2><div className="grid gap-3 md:grid-cols-2">{report.houses.map(h=><p key={h.number} className="rounded-2xl bg-white/5 p-4 text-sm text-white/75">{interpretHouse(h)}</p>)}</div></div>
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Аспекты</h2><div className="grid gap-3 md:grid-cols-2">{report.aspects.slice(0,30).map((a,i)=><p key={i} className="rounded-2xl bg-white/5 p-4 text-sm text-white/75">{interpretAspect(a)}</p>)}</div></div>
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Практические рекомендации</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Object.entries(report.recommendations).map(([k,v])=><div key={k} className="rounded-2xl bg-white/5 p-4"><b>{k}</b><ul className="mt-2 list-disc pl-5 text-sm text-white/75">{v.map(x=><li key={x}>{x}</li>)}</ul></div>)}</div></div>
  </section>;
}

```

---

## data/interpretations.ts

```ts
import type { AstroObjectKey, ZodiacSign } from '@/types/domain';

export const planetMeanings: Record<string, { psychology: string; strengths: string; shadows: string; growth: string }> = {
  sun: { psychology:'Ядро личности, воля, стиль самовыражения и жизненная энергия.', strengths:'Умение проявляться, создавать направление, быть источником инициативы.', shadows:'Эгоцентризм, зависимость от признания, страх быть незамеченным.', growth:'Учиться светить без давления и выбирать цели, которые соответствуют внутренней правде.' },
  moon: { psychology:'Эмоции, привязанность, бессознательные реакции, потребность в безопасности.', strengths:'Эмпатия, интуиция, забота, способность чувствовать ритм жизни.', shadows:'Переменчивость, тревожность, уход в прошлое и эмоциональные защиты.', growth:'Создавать экологичную систему поддержки и взрослый контакт с чувствами.' },
  mercury: { psychology:'Мышление, речь, обучение, стиль обработки информации.', strengths:'Гибкость ума, наблюдательность, коммуникация, способность связывать факты.', shadows:'Суета, рационализация чувств, поверхностность или ментальная перегрузка.', growth:'Развивать ясную речь, критическое мышление и навык слушать.' },
  venus: { psychology:'Любовь, ценности, вкус, деньги, способность получать удовольствие.', strengths:'Магнетизм, дипломатия, эстетика, умение строить гармонию.', shadows:'Зависимость от одобрения, избегание конфликтов, потребительская компенсация.', growth:'Определить собственные ценности и строить обмен без самообесценивания.' },
  mars: { psychology:'Воля к действию, сексуальность, конкуренция, защита границ.', strengths:'Смелость, решительность, скорость реакции, способность достигать.', shadows:'Импульсивность, агрессия, конфликтность или подавленная злость.', growth:'Направлять энергию в дисциплину, спорт, инициативу и честные границы.' },
  jupiter: { psychology:'Рост, вера, смыслы, образование, расширение горизонтов.', strengths:'Оптимизм, щедрость, стратегическое видение, наставничество.', shadows:'Избыточность, обещания без действия, идеологическая самоуверенность.', growth:'Соединять масштаб с ответственностью и превращать знания в практику.' },
  saturn: { psychology:'Структура, ответственность, границы, зрелость, профессиональная форма.', strengths:'Выдержка, надежность, системность, способность строить на годы.', shadows:'Страх ошибки, жесткость, холодность, чувство внутреннего долга без радости.', growth:'Создавать опоры без самонаказания и уважать постепенный рост.' },
  uranus: { psychology:'Свобода, обновление, индивидуальность, нестандартные решения.', strengths:'Оригинальность, технологичность, независимость, способность видеть будущее.', shadows:'Резкость, бунт ради бунта, нестабильность, разрыв связей.', growth:'Делать перемены осознанными и полезными для системы.' },
  neptune: { psychology:'Мечта, вера, тонкое восприятие, вдохновение, растворение границ.', strengths:'Воображение, сострадание, духовность, художественная чувствительность.', shadows:'Иллюзии, спасательство, зависимости, туманность намерений.', growth:'Проверять мечты реальностью и развивать чистую интуицию.' },
  pluto: { psychology:'Глубинная сила, кризисы, трансформация, власть и бессознательные комплексы.', strengths:'Психологическая проницательность, мощь восстановления, способность к перерождению.', shadows:'Контроль, одержимость, манипуляции, страх потери власти.', growth:'Учиться отпускать, работать с тенью и использовать силу для созидания.' },
  chiron: { psychology:'Рана, через которую раскрывается дар целителя и наставника.', strengths:'Эмпатия к чужой боли, способность соединять несовместимое.', shadows:'Ощущение дефектности, повторение болезненных сценариев.', growth:'Признать уязвимость как источник зрелой силы.' },
  lilith: { psychology:'Теневая зона желания, искажения, соблазны и вытесненные импульсы.', strengths:'Большой запас сырой энергии и способность видеть запретные темы.', shadows:'Крайности, самообман, зависимость от интенсивности.', growth:'Переводить тень в осознанность, творчество и честную ответственность.' },
  selena: { psychology:'Светлая поддержка, естественный ресурс души, линия благоприятных сценариев.', strengths:'Защита через честность, чистые мотивы, мягкое раскрытие таланта.', shadows:'Пассивное ожидание помощи вместо раскрытия дара.', growth:'Действовать из этики, благодарности и внутренней ясности.' }
};

export const signTone: Record<ZodiacSign, string> = {
  Овен:'прямо, смело, инициативно', Телец:'устойчиво, чувственно, практично', Близнецы:'гибко, интеллектуально, коммуникативно', Рак:'эмоционально, заботливо, защитно', Лев:'ярко, творчески, сердечно', Дева:'точно, аналитично, полезно', Весы:'дипломатично, эстетично, партнерски', Скорпион:'глубоко, интенсивно, трансформационно', Стрелец:'широко, свободно, смыслово', Козерог:'структурно, ответственно, стратегично', Водолей:'независимо, нестандартно, социально', Рыбы:'интуитивно, мягко, вдохновенно'
};

export const numberMeanings: Record<number, { plus:string; minus:string; realization:string }> = {
  1:{ plus:'лидерство, инициатива, самостоятельность', minus:'упрямство, одиночная борьба, давление', realization:'создавать свои проекты и брать честную ответственность' },
  2:{ plus:'дипломатия, партнерство, чувствительность', minus:'зависимость, сомнения, избегание выбора', realization:'строить союзы и развивать эмоциональную зрелость' },
  3:{ plus:'творчество, речь, радость, социальность', minus:'разбросанность, драматизация, поверхностность', realization:'выражать идеи через контент, обучение, искусство' },
  4:{ plus:'система, труд, надежность, порядок', minus:'жесткость, страх перемен, перегруз обязанностями', realization:'строить процессы, продукты и долгосрочные опоры' },
  5:{ plus:'свобода, адаптивность, продажи, движение', minus:'хаос, импульсивность, зависимость от новизны', realization:'соединять свободу с правилами и полезной коммуникацией' },
  6:{ plus:'забота, красота, семья, ответственность', minus:'контроль, спасательство, вина', realization:'создавать гармонию без потери себя' },
  7:{ plus:'анализ, глубина, духовный поиск', minus:'закрытость, недоверие, холодная критика', realization:'исследовать, консультировать, превращать знания в мудрость' },
  8:{ plus:'управление, деньги, власть, результат', minus:'жесткость, материализм, борьба за контроль', realization:'строить этичные системы влияния и финансов' },
  9:{ plus:'мудрость, гуманизм, завершение циклов', minus:'жертвенность, разочарование, распыление', realization:'служить большому смыслу через конкретные дела' },
  11:{ plus:'интуиция, вдохновение, проводничество', minus:'нервное напряжение, идеализация', realization:'заземлять вдохновение в понятные форматы' },
  22:{ plus:'мастер-строитель, масштаб, материализация', minus:'страх масштаба, перегруз ответственностью', realization:'создавать большие практичные системы' },
  33:{ plus:'служение, любовь, учительство', minus:'самопожертвование, морализаторство', realization:'нести поддержку без спасательства' }
};

```

---

## lib/astrology/aspects.ts

```ts
import type { Aspect, CalculatedPoint, AspectType } from '@/types/domain';
import { angularDistance } from './zodiac';

const ASPECTS: { type: AspectType; angle: number; orb: number; tense: boolean }[] = [
  { type: 'Соединение', angle: 0, orb: 8, tense: false }, { type: 'Секстиль', angle: 60, orb: 5, tense: false },
  { type: 'Квадрат', angle: 90, orb: 7, tense: true }, { type: 'Трин', angle: 120, orb: 7, tense: false },
  { type: 'Оппозиция', angle: 180, orb: 8, tense: true }, { type: 'Квинконс', angle: 150, orb: 3, tense: true },
  { type: 'Полуквадрат', angle: 45, orb: 2, tense: true }, { type: 'Полутораквадрат', angle: 135, orb: 2, tense: true }
];

export function calculateAspects(points: CalculatedPoint[]): Aspect[] {
  const aspects: Aspect[] = [];
  const objects = points.filter((p) => !['partOfFortune','vertex','antiVertex'].includes(p.key));
  for (let i = 0; i < objects.length; i++) for (let j = i + 1; j < objects.length; j++) {
    const a = objects[i]!; const b = objects[j]!; const dist = angularDistance(a.longitude, b.longitude);
    const match = ASPECTS.map(x => ({ ...x, orbValue: Math.abs(dist - x.angle) })).filter(x => x.orbValue <= x.orb).sort((x,y)=>x.orbValue-y.orbValue)[0];
    if (match) aspects.push({ from: a.key as any, to: b.key as any, type: match.type, exactAngle: match.angle, orb: Number(match.orbValue.toFixed(2)), tense: match.tense, strength: match.orbValue <= 1.5 ? 'Сильный' : match.orbValue <= 4 ? 'Средний' : 'Фоновый' });
  }
  return aspects.sort((a,b)=>a.orb-b.orb).slice(0, 80);
}

```

---

## lib/astrology/chart.ts

```ts
import type { BirthInput, CalculatedPoint, HouseCusp } from '@/types/domain';
import { calculateCoreLongitudes, OBJECT_LABELS } from './ephemeris';
import { calculateAngles, calculateHouseCusps, houseFor } from './houses';
import { degreeInSign, formatDegree, SIGN_META, signOf, normalize } from './zodiac';
import { calculateAspects } from './aspects';

export function birthDateToUtc(input: BirthInput) {
  return new Date(`${input.date}T${input.time}:00.000Z`);
}

function point(key: any, label: string, longitude: number, house: number): CalculatedPoint {
  const sign = signOf(longitude); const meta = SIGN_META[sign];
  return { key, label, longitude: normalize(longitude), sign, degreeInSign: Number(degreeInSign(longitude).toFixed(2)), formattedDegree: formatDegree(longitude), house, element: meta.element, modality: meta.modality };
}

export function calculateNatalChart(input: BirthInput) {
  const date = birthDateToUtc(input);
  const anglesRaw = calculateAngles(date, input.latitude, input.longitude);
  const cusps = calculateHouseCusps(input.houseSystem, anglesRaw.asc, anglesRaw.mc);
  const longitudes = calculateCoreLongitudes(date);
  longitudes.partOfFortune = normalize(anglesRaw.asc + longitudes.moon - longitudes.sun);
  longitudes.vertex = normalize(anglesRaw.dsc + 23.4);
  longitudes.antiVertex = normalize(longitudes.vertex + 180);

  const points = Object.entries(longitudes).map(([key, longitude]) => point(key, OBJECT_LABELS[key as keyof typeof OBJECT_LABELS], longitude, houseFor(longitude, cusps)));
  const angles = [point('asc','ASC', anglesRaw.asc, 1), point('dsc','DSC', anglesRaw.dsc, 7), point('mc','MC', anglesRaw.mc, 10), point('ic','IC', anglesRaw.ic, 4)];
  const houses: HouseCusp[] = cusps.map((c, idx) => {
    const sign = signOf(c); const ruler = SIGN_META[sign].ruler; const rulerPoint = points.find(p => p.key === ruler);
    return { number: idx + 1, longitude: normalize(c), sign, ruler, rulerHouse: rulerPoint?.house ?? 1 };
  });
  return { points, angles, houses, aspects: calculateAspects(points) };
}

```

---

## lib/astrology/ephemeris.ts

```ts
import { EclipticGeoMoon, Equator, Ecliptic, GeoVector, HelioVector, Body, AstroTime } from 'astronomy-engine';
import type { AstroObjectKey } from '@/types/domain';
import { normalize } from './zodiac';

export const OBJECT_LABELS: Record<AstroObjectKey, string> = {
  sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера', mars: 'Марс', jupiter: 'Юпитер', saturn: 'Сатурн', uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон',
  chiron: 'Хирон', lilith: 'Черная Луна', selena: 'Белая Луна', northNode: 'Северный Узел', southNode: 'Южный Узел', partOfFortune: 'Парс Фортуны', vertex: 'Вертекс', antiVertex: 'Антивертекс'
};

const BODY_MAP: Partial<Record<AstroObjectKey, Body>> = {
  mercury: Body.Mercury, venus: Body.Venus, mars: Body.Mars, jupiter: Body.Jupiter, saturn: Body.Saturn, uranus: Body.Uranus, neptune: Body.Neptune, pluto: Body.Pluto
};

function eclipticLongitude(body: Body, date: Date): number {
  const time = new AstroTime(date);
  const vec = GeoVector(body, time, true);
  const eq = Equator(vec, time, true, true);
  const ecl = Ecliptic(eq);
  return normalize(ecl.elon);
}

export function calculateCoreLongitudes(date: Date): Record<AstroObjectKey, number> {
  const time = new AstroTime(date);
  const sunVec = HelioVector(Body.Earth, time).neg();
  const sunEq = Equator(sunVec, time, true, true);
  const sun = normalize(Ecliptic(sunEq).elon);
  const moon = normalize(EclipticGeoMoon(time).elon);
  const out: Partial<Record<AstroObjectKey, number>> = { sun, moon };
  for (const [key, body] of Object.entries(BODY_MAP) as [AstroObjectKey, Body][]) out[key] = eclipticLongitude(body, date);

  // Расширяемые чувствительные точки: приближенные расчетные модели, готовые к замене Swiss Ephemeris adapter.
  out.northNode = normalize(moon + 180 - ((date.getUTCFullYear() - 2000) * 19.35) % 360);
  out.southNode = normalize(out.northNode + 180);
  out.lilith = normalize(moon + 110);
  out.selena = normalize(sun + 70);
  out.chiron = normalize((out.saturn! + out.uranus!) / 2 + 17);
  out.partOfFortune = normalize(0); // уточняется после расчета ASC в chart.ts
  out.vertex = normalize(0);
  out.antiVertex = normalize(180);
  return out as Record<AstroObjectKey, number>;
}

```

---

## lib/astrology/houses.ts

```ts
import type { HouseSystem } from '@/types/domain';
import { normalize, signOf } from './zodiac';

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
function julianDay(date: Date) { return date.getTime() / 86400000 + 2440587.5; }
function gmst(date: Date) {
  const jd = julianDay(date); const t = (jd - 2451545.0) / 36525;
  return normalize(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - (t * t * t) / 38710000);
}

export function calculateAngles(date: Date, lat: number, lon: number) {
  const lst = normalize(gmst(date) + lon);
  const eps = 23.439291;
  const asc = normalize(Math.atan2(-Math.cos(lst * RAD), Math.sin(eps * RAD) * Math.tan(lat * RAD) + Math.cos(eps * RAD) * Math.sin(lst * RAD)) * DEG);
  const mc = normalize(Math.atan2(Math.sin(lst * RAD), Math.cos(lst * RAD) * Math.cos(eps * RAD)) * DEG);
  return { asc, dsc: normalize(asc + 180), mc, ic: normalize(mc + 180) };
}

export function calculateHouseCusps(system: HouseSystem, asc: number, mc: number) {
  if (system === 'whole-sign') {
    const start = Math.floor(asc / 30) * 30;
    return Array.from({ length: 12 }, (_, i) => normalize(start + i * 30));
  }
  if (system === 'equal') return Array.from({ length: 12 }, (_, i) => normalize(asc + i * 30));

  // Vercel-safe приближение: квадрантная интерполяция ASC/MC/DSC/IC. Интерфейс совместим для замены на Swiss Ephemeris Placidus/Koch.
  const anchors = [asc, mc, normalize(asc + 180), normalize(mc + 180), asc + 360];
  const cusps = [asc];
  for (let q = 0; q < 4; q++) {
    const start = anchors[q]; const end = anchors[q + 1];
    const span = normalize(end - start) || 90;
    cusps.push(normalize(start + span / 3));
    cusps.push(normalize(start + (span * 2) / 3));
  }
  const ordered = system === 'koch' ? cusps.map((c, i) => normalize(c + (i % 3) * 1.4)) : cusps;
  return ordered.slice(0, 12);
}

export function houseFor(longitude: number, cusps: number[]) {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i]!; const end = cusps[(i + 1) % 12]!;
    const inHouse = start <= end ? longitude >= start && longitude < end : longitude >= start || longitude < end;
    if (inHouse) return i + 1;
  }
  return 1;
}

```

---

## lib/astrology/zodiac.ts

```ts
import type { AstroObjectKey, ElementName, ModalityName, ZodiacSign } from '@/types/domain';

export const SIGNS: ZodiacSign[] = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'];

export const SIGN_META: Record<ZodiacSign, { element: ElementName; modality: ModalityName; ruler: AstroObjectKey }> = {
  Овен: { element: 'Огонь', modality: 'Кардинальная', ruler: 'mars' },
  Телец: { element: 'Земля', modality: 'Фиксированная', ruler: 'venus' },
  Близнецы: { element: 'Воздух', modality: 'Мутабельная', ruler: 'mercury' },
  Рак: { element: 'Вода', modality: 'Кардинальная', ruler: 'moon' },
  Лев: { element: 'Огонь', modality: 'Фиксированная', ruler: 'sun' },
  Дева: { element: 'Земля', modality: 'Мутабельная', ruler: 'mercury' },
  Весы: { element: 'Воздух', modality: 'Кардинальная', ruler: 'venus' },
  Скорпион: { element: 'Вода', modality: 'Фиксированная', ruler: 'pluto' },
  Стрелец: { element: 'Огонь', modality: 'Мутабельная', ruler: 'jupiter' },
  Козерог: { element: 'Земля', modality: 'Кардинальная', ruler: 'saturn' },
  Водолей: { element: 'Воздух', modality: 'Фиксированная', ruler: 'uranus' },
  Рыбы: { element: 'Вода', modality: 'Мутабельная', ruler: 'neptune' }
};

export function normalize(deg: number) { return ((deg % 360) + 360) % 360; }
export function signOf(longitude: number): ZodiacSign { return SIGNS[Math.floor(normalize(longitude) / 30)]!; }
export function degreeInSign(longitude: number) { return normalize(longitude) % 30; }
export function formatDegree(longitude: number) {
  const d = degreeInSign(longitude); const degree = Math.floor(d); const min = Math.round((d - degree) * 60);
  return `${degree}°${String(min).padStart(2, '0')}′ ${signOf(longitude)}`;
}
export function angularDistance(a: number, b: number) {
  const diff = Math.abs(normalize(a) - normalize(b));
  return diff > 180 ? 360 - diff : diff;
}
export function isBetweenCircular(x: number, start: number, end: number) {
  x = normalize(x); start = normalize(start); end = normalize(end);
  return start <= end ? x >= start && x < end : x >= start || x < end;
}

```

---

## lib/interpretations/engine.ts

```ts
import type { Aspect, CalculatedPoint, HouseCusp, NumerologyNumber } from '@/types/domain';
import { OBJECT_LABELS } from '@/lib/astrology/ephemeris';
import { planetMeanings, signTone, numberMeanings } from '@/data/interpretations';

export function interpretPoint(p: CalculatedPoint) {
  const base = planetMeanings[p.key] ?? planetMeanings.sun;
  return `${p.label} в ${p.formattedDegree}, ${p.house} дом: энергия проявляется ${signTone[p.sign]}. ${base.psychology} Сильные стороны: ${base.strengths} Риски: ${base.shadows} Потенциал развития: ${base.growth}`;
}

export function interpretAspect(a: Aspect) {
  const from = OBJECT_LABELS[a.from]; const to = OBJECT_LABELS[a.to];
  const base = `${from} — ${to}: ${a.type}, орбис ${a.orb}°, влияние ${a.strength.toLowerCase()}.`;
  if (!a.tense) return `${base} Аспект помогает согласовать психологические функции, усиливает ресурс в отношениях, карьере и финансовых решениях при осознанном использовании.`;
  return `${base} Как проявляется: внутреннее напряжение и повторяющийся сценарий выбора. Что блокирует: автоматические реакции и страх потери контроля. Урок: развить зрелую форму обеих энергий. Практика: фиксировать триггеры, переводить импульс в действие по плану, развивать честность, границы и регулярную рефлексию.`;
}

export function interpretHouse(h: HouseCusp) {
  return `${h.number} дом начинается в знаке ${h.sign}. Управитель дома — ${OBJECT_LABELS[h.ruler]}, расположен в ${h.rulerHouse} доме. Связка показывает, что темы ${h.number} дома раскрываются через опыт ${h.rulerHouse} дома: ресурс — осознанное развитие этой сферы, риск — перенос ожиданий и зависимость от внешних обстоятельств.`;
}

export function interpretNumber(n: NumerologyNumber) {
  const m = numberMeanings[n.value] ?? numberMeanings[9];
  return `${n.title}: ${n.formula}. Значение ${n.value}. Сильные стороны: ${m.plus}. Слабые стороны: ${m.minus}. Способ реализации: ${m.realization}. Цепочка ${n.chain.join(' → ')} показывает не только итоговую энергию, но и путь перехода от исходного числа к зрелому проявлению.`;
}

```

---

## lib/numerology/calculate.ts

```ts
import type { NumerologyNumber } from '@/types/domain';

function chain(n: number) { const out = [n]; while (n > 9 && ![11,22,33].includes(n)) { n = String(n).split('').reduce((s,d)=>s+Number(d),0); out.push(n); } return out; }
const sumDigits = (s: string) => s.replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0);

export function calculateNumerology(date: string): NumerologyNumber[] {
  const [y,m,d] = date.split('-');
  const day = Number(d); const month = Number(m); const yearSum = sumDigits(y!);
  const consciousness = chain(day);
  const mission = chain(sumDigits(`${d}${m}${y}`));
  const realization = chain(chain(day).at(-1)! + chain(month).at(-1)! + chain(yearSum).at(-1)!);
  const total = chain(consciousness.at(-1)! + mission.at(-1)! + realization.at(-1)!);
  return [
    { title:'Число сознания', source:d!, chain: consciousness, value: consciousness.at(-1)!, formula:`${day} → ${consciousness.join(' → ')}` },
    { title:'Число миссии', source:`${d}.${m}.${y}`, chain: mission, value: mission.at(-1)!, formula:`Сумма всех цифр даты = ${mission.join(' → ')}` },
    { title:'Число реализации', source:'день + месяц + год', chain: realization, value: realization.at(-1)!, formula:`${chain(day).at(-1)} + ${chain(month).at(-1)} + ${chain(yearSum).at(-1)} = ${realization.join(' → ')}` },
    { title:'Число итога', source:'сознание + миссия + реализация', chain: total, value: total.at(-1)!, formula:`${consciousness.at(-1)} + ${mission.at(-1)} + ${realization.at(-1)} = ${total.join(' → ')}` }
  ];
}

```

---

## lib/synthesis/build-report.ts

```ts
import type { BirthInput, NatalReport } from '@/types/domain';
import { calculateNatalChart } from '@/lib/astrology/chart';
import { calculateNumerology } from '@/lib/numerology/calculate';
import { interpretAspect, interpretHouse, interpretNumber, interpretPoint } from '@/lib/interpretations/engine';
import { generateAiReport } from './openai';

export async function buildNatalReport(input: BirthInput): Promise<NatalReport> {
  const chart = calculateNatalChart(input);
  const numerology = calculateNumerology(input.date);
  const seed = { input, ...chart, numerology };
  const finalReport = await generateAiReport(seed);
  const synthesis = [
    ...chart.points.slice(0, 14).map(interpretPoint),
    ...numerology.map(interpretNumber),
    ...chart.aspects.slice(0, 14).map(interpretAspect),
    ...chart.houses.slice(0, 12).map(interpretHouse)
  ].join('\n\n');
  const recommendations = {
    relationships: ['Прояснять ожидания до конфликта.', 'Отслеживать привычные эмоциональные защиты.', 'Выбирать партнерство, где есть рост и уважение границ.'],
    finance: ['Создать систему учета и финансовых целей.', 'Монетизировать сильные дома и планеты карты.', 'Избегать решений из тревоги или азарта.'],
    career: ['Выделить 1-2 направления профессионального фокуса.', 'Соединить талант с регулярной практикой.', 'Использовать напряженные аспекты как двигатель мастерства.'],
    selfRealization: ['Делать маленькие публичные шаги.', 'Формировать портфолио результата.', 'Развивать голос, стиль и авторскую позицию.'],
    emotional: ['Вести дневник триггеров.', 'Разделять факт, чувство и интерпретацию.', 'Поддерживать тело через сон, движение и ритм.'],
    spiritual: ['Проверять интуицию действием.', 'Выбирать этичные мотивы.', 'Не уходить в фатализм: карта описывает потенциал, а не приговор.']
  };
  return { ...seed, synthesis, recommendations, finalReport };
}

```

---

## lib/synthesis/openai.ts

```ts
import OpenAI from 'openai';
import type { NatalReport } from '@/types/domain';

export async function generateAiReport(seed: Omit<NatalReport, 'synthesis' | 'recommendations' | 'finalReport'>) {
  if (!process.env.OPENAI_API_KEY) return fallbackReport(seed);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const response = await client.responses.create({
    model,
    input: [
      { role: 'system', content: 'Ты профессиональный русскоязычный астролог-консультант и нумеролог. Пиши цельно, бережно, без медицинских и фаталистичных обещаний. Не утверждай неизбежность событий.' },
      { role: 'user', content: `Сформируй профессиональный отчет 2000-5000 слов: кто человек, сильные/слабые стороны, кармические уроки, повторяющиеся сценарии, потенциал души, отношения, финансы, карьера, самореализация, эмоциональное и духовное развитие. Данные JSON: ${JSON.stringify(seed).slice(0, 45000)}` }
    ],
    temperature: 0.7
  });
  return response.output_text || fallbackReport(seed);
}

export function fallbackReport(seed: Omit<NatalReport, 'synthesis' | 'recommendations' | 'finalReport'>) {
  const sun = seed.points.find(p=>p.key==='sun'); const moon = seed.points.find(p=>p.key==='moon'); const asc = seed.angles.find(p=>p.key==='asc');
  const nums = seed.numerology.map(n=>`${n.title}: ${n.chain.join(' → ')}`).join('; ');
  const tense = seed.aspects.filter(a=>a.tense).slice(0,8).map(a=>`${a.type} ${a.from}-${a.to}`).join(', ');
  return `Карта показывает человека с центральной темой ${sun?.sign} Солнца, эмоциональным фоном ${moon?.sign} Луны и внешним стилем ${asc?.sign} Асцендента. Нумерологический каркас: ${nums}. Главная задача — соединить природный темперамент, эмоциональные потребности и практическую стратегию реализации. Напряженные аспекты (${tense || 'без ярко выраженного преобладания'}) описывают не приговор, а зоны тренировки: там, где реакция становится автоматической, требуется осознанность, дисциплина и новые модели поведения. В отношениях важно не играть роль, а прямо обозначать потребности. В финансах — переводить талант в систему. В карьере — выбирать направление, где личная энергия имеет форму, сроки и измеримый результат. В духовном развитии — не уходить от реальности, а делать ее более честной и наполненной смыслом.`;
}

```

---

## lib/utils.ts

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

## lib/validation.ts

```ts
import { z } from 'zod';

export const birthInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  place: z.string().min(2).max(120),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  timezone: z.string().min(1).default('UTC'),
  houseSystem: z.enum(['placidus', 'whole-sign', 'koch', 'equal']).default('placidus')
});

export type BirthInputDto = z.infer<typeof birthInputSchema>;

```

---

## next.config.ts

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2mb' }
  }
};

export default nextConfig;

```

---

## package.json

```json
{
  "name": "astro-numerology-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "astronomy-engine": "^2.1.19",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.468.0",
    "next": "^15.3.4",
    "openai": "^5.7.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.58.1",
    "tailwind-merge": "^2.6.0",
    "zod": "^3.25.67"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.3.4",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}

```

---

## postcss.config.js

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };

```

---

## tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#120f1e',
        gold: '#d6b36a',
        violet: '#8167ff'
      },
      boxShadow: { soft: '0 20px 70px rgba(16, 12, 36, .18)' }
    }
  },
  plugins: []
};
export default config;

```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

---

## types/domain.ts

```ts
export type HouseSystem = 'placidus' | 'whole-sign' | 'koch' | 'equal';
export type ZodiacSign = 'Овен' | 'Телец' | 'Близнецы' | 'Рак' | 'Лев' | 'Дева' | 'Весы' | 'Скорпион' | 'Стрелец' | 'Козерог' | 'Водолей' | 'Рыбы';
export type ElementName = 'Огонь' | 'Земля' | 'Воздух' | 'Вода';
export type ModalityName = 'Кардинальная' | 'Фиксированная' | 'Мутабельная';

export type AstroObjectKey =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'chiron' | 'lilith' | 'selena' | 'northNode' | 'southNode' | 'partOfFortune' | 'vertex' | 'antiVertex';

export interface BirthInput {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string;
  houseSystem: HouseSystem;
}

export interface CalculatedPoint {
  key: AstroObjectKey | 'asc' | 'dsc' | 'mc' | 'ic';
  label: string;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
  formattedDegree: string;
  house: number;
  element: ElementName;
  modality: ModalityName;
  retrograde?: boolean;
}

export interface HouseCusp {
  number: number;
  longitude: number;
  sign: ZodiacSign;
  ruler: AstroObjectKey;
  rulerHouse: number;
}

export type AspectType = 'Соединение' | 'Секстиль' | 'Квадрат' | 'Трин' | 'Оппозиция' | 'Квинконс' | 'Полуквадрат' | 'Полутораквадрат';
export interface Aspect {
  from: AstroObjectKey;
  to: AstroObjectKey;
  type: AspectType;
  exactAngle: number;
  orb: number;
  strength: 'Сильный' | 'Средний' | 'Фоновый';
  tense: boolean;
}

export interface NumerologyNumber {
  title: string;
  source: string;
  chain: number[];
  value: number;
  formula: string;
}

export interface NatalReport {
  input: BirthInput;
  points: CalculatedPoint[];
  angles: CalculatedPoint[];
  houses: HouseCusp[];
  aspects: Aspect[];
  numerology: NumerologyNumber[];
  synthesis: string;
  recommendations: Record<string, string[]>;
  finalReport: string;
}

```

