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
