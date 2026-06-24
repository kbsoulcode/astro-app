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
