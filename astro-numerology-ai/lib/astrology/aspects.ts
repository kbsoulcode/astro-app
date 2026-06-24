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
