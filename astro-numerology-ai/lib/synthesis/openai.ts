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
