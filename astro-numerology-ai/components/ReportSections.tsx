import type { NatalReport } from '@/types/domain';
import { interpretAspect, interpretHouse, interpretNumber, interpretPoint } from '@/lib/interpretations/engine';

export function ReportSections({ report }: { report: NatalReport }) {
  return <section className="mt-10 space-y-6">
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Итоговый отчет</h2><p className="whitespace-pre-line leading-8 text-white/85">{report.finalReport}</p></div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card"><h2 className="mb-4 text-2xl font-bold">Натальная карта</h2><div className="space-y-3">{report.points.map(p=><div key={p.key} className="rounded-2xl bg-white/5 p-4"><b>{p.label}</b><p className="text-sm text-white/75">{interpretPoint(p)}</p></div>)}</div></div>
      <div className="card"><h2 className="mb-4 text-2xl font-bold">Нумерология</h2><div className="space-y-3">{report.numerology.map(n=><div key={n.title} className="rounded-2xl bg-white/5 p-4"><b>{n.title}</b><p className="text-sm text-white/75">{interpretNumber(n)}</p></div>)}</div></div>
    </div>
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Дома и управители</h2><div className="grid gap-3 md:grid-cols-2">{report.houses.map(h=><p key={h.number} className="rounded-2xl bg-white/5 p-4 text-sm text-white/75">{interpretHouse(h)}</p>)}</div></div>
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Аспекты</h2><div className="grid gap-3 md:grid-cols-2">{report.aspects.slice(0,30).map((a,i)=><p key={i} className="rounded-2xl bg-white/5 p-4 text-sm text-white/75">{interpretAspect(a)}</p>)}</div></div>
    <div className="card"><h2 className="mb-4 text-2xl font-bold">Практические рекомендации</h2><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Object.entries(report.recommendations).map(([k,v])=><div key={k} className="rounded-2xl bg-white/5 p-4"><b>{k}</b><ul className="mt-2 list-disc pl-5 text-sm text-white/75">{v.map(x=><li key={x}>{x}</li>)}</ul></div>)}</div></div>
  </section>;
}
