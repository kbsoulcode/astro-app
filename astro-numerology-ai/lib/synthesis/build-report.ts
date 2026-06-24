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
