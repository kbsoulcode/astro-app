'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { birthInputSchema, type BirthInputDto } from '@/lib/validation';
import type { NatalReport } from '@/types/domain';
import { ReportSections } from './ReportSections';

const defaults: BirthInputDto = { date:'1990-05-17', time:'14:30', place:'Nicosia, Cyprus', latitude:35.1856, longitude:33.3823, timezone:'Asia/Nicosia', houseSystem:'placidus' };

export function BirthForm() {
  const [report, setReport] = useState<NatalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<BirthInputDto>({ resolver: zodResolver(birthInputSchema), defaultValues: defaults });

  async function onSubmit(values: BirthInputDto) {
    setLoading(true); setError(null); setReport(null);
    const res = await fetch('/api/analyze', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(values) });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Ошибка расчета'); else setReport(data);
    setLoading(false);
  }

  return <>
    <form onSubmit={form.handleSubmit(onSubmit)} className="card mx-auto mt-10 max-w-5xl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Дата рождения"><input className="input" type="date" {...form.register('date')} /></Field>
        <Field label="Время рождения"><input className="input" type="time" {...form.register('time')} /></Field>
        <Field label="Место рождения"><input className="input" {...form.register('place')} /></Field>
        <Field label="Широта"><input className="input" type="number" step="0.0001" {...form.register('latitude')} /></Field>
        <Field label="Долгота"><input className="input" type="number" step="0.0001" {...form.register('longitude')} /></Field>
        <Field label="Система домов"><select className="input" {...form.register('houseSystem')}><option value="placidus">Placidus</option><option value="whole-sign">Whole Sign</option><option value="koch">Koch</option><option value="equal">Equal House</option></select></Field>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4"><button className="btn" disabled={loading}>{loading ? 'Создаю отчет…' : 'Рассчитать карту'}</button><p className="text-sm text-white/55">Для точной геокодировки можно подключить Google Maps или Mapbox; здесь координаты вводятся явно.</p></div>
      {error && <p className="mt-4 rounded-2xl bg-red-500/15 p-4 text-red-100">{error}</p>}
    </form>
    {report && <ReportSections report={report} />}
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-2"><span className="label">{label}</span>{children}</label>; }
