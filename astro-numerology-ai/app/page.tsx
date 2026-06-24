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
