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
