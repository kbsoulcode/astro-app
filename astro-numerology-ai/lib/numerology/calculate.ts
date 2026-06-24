import type { NumerologyNumber } from '@/types/domain';

function chain(n: number) { const out = [n]; while (n > 9 && ![11,22,33].includes(n)) { n = String(n).split('').reduce((s,d)=>s+Number(d),0); out.push(n); } return out; }
const sumDigits = (s: string) => s.replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0);

export function calculateNumerology(date: string): NumerologyNumber[] {
  const [y,m,d] = date.split('-');
  const day = Number(d); const month = Number(m); const yearSum = sumDigits(y!);
  const consciousness = chain(day);
  const mission = chain(sumDigits(`${d}${m}${y}`));
  const realization = chain(chain(day).at(-1)! + chain(month).at(-1)! + chain(yearSum).at(-1)!);
  const total = chain(consciousness.at(-1)! + mission.at(-1)! + realization.at(-1)!);
  return [
    { title:'Число сознания', source:d!, chain: consciousness, value: consciousness.at(-1)!, formula:`${day} → ${consciousness.join(' → ')}` },
    { title:'Число миссии', source:`${d}.${m}.${y}`, chain: mission, value: mission.at(-1)!, formula:`Сумма всех цифр даты = ${mission.join(' → ')}` },
    { title:'Число реализации', source:'день + месяц + год', chain: realization, value: realization.at(-1)!, formula:`${chain(day).at(-1)} + ${chain(month).at(-1)} + ${chain(yearSum).at(-1)} = ${realization.join(' → ')}` },
    { title:'Число итога', source:'сознание + миссия + реализация', chain: total, value: total.at(-1)!, formula:`${consciousness.at(-1)} + ${mission.at(-1)} + ${realization.at(-1)} = ${total.join(' → ')}` }
  ];
}
