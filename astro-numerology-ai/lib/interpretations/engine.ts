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
