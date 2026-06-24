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
