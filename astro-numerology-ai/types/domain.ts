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
