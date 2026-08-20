'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Calculator, RotateCcw, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type { PercentageToolKind } from './percentage-tool-data';

const formatNumber = (value: number, digits = 4) => new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
const presets: Record<PercentageToolKind, [number, number, number]> = { percentage: [18, 250, 0], change: [80, 100, 0], reverse: [80, 20, 0], discount: [1000, 20, 5], grade: [42, 50, 0], win: [7, 3, 0], weightLoss: [80, 72, 0], bodyFat: [175, 86, 38], average: [0, 0, 0] };

export default function PercentageCalculatorClient({ kind }: { kind: PercentageToolKind }) {
  const [a, setA] = useState(presets[kind][0]);
  const [b, setB] = useState(presets[kind][1]);
  const [c, setC] = useState(presets[kind][2]);
  const [d, setD] = useState(96);
  const [bodyFatSex, setBodyFatSex] = useState<'male' | 'female'>('male');
  const [bodyFatUnit, setBodyFatUnit] = useState<'cm' | 'in'>('cm');
  const [percentageList, setPercentageList] = useState('70, 80, 90');
  const [basicMode, setBasicMode] = useState<'of' | 'ratio'>('of');
  const [reverseMode, setReverseMode] = useState<'decrease' | 'increase'>('decrease');

  const calculation = useMemo(() => {
    if (kind === 'percentage') {
      if (basicMode === 'ratio' && b === 0) return { error: 'The whole value cannot be zero.' };
      const result = basicMode === 'of' ? (a / 100) * b : (a / b) * 100;
      return { result, label: basicMode === 'of' ? `${formatNumber(a)}% of ${formatNumber(b)}` : `${formatNumber(a)} as a percentage of ${formatNumber(b)}`, working: basicMode === 'of' ? `(${formatNumber(a)} ÷ 100) × ${formatNumber(b)}` : `(${formatNumber(a)} ÷ ${formatNumber(b)}) × 100`, suffix: basicMode === 'ratio' ? '%' : '', stats: basicMode === 'of' ? [['Decimal rate', formatNumber(a / 100)], ['Remaining amount', formatNumber(b - result)]] : [['Ratio', formatNumber(a / b)], ['Difference', formatNumber(b - a)]] };
    }
    if (kind === 'change') {
      if (a === 0) return { error: 'Percentage change is undefined when the original value is zero.' };
      const difference = b - a;
      const result = (difference / Math.abs(a)) * 100;
      return { result, label: result > 0 ? 'Percentage increase' : result < 0 ? 'Percentage decrease' : 'No percentage change', working: `((${formatNumber(b)} − ${formatNumber(a)}) ÷ |${formatNumber(a)}|) × 100`, suffix: '%', stats: [['Absolute change', formatNumber(difference)], ['Direction', result > 0 ? 'Increase' : result < 0 ? 'Decrease' : 'No change']] };
    }
    if (kind === 'reverse') {
      const multiplier = reverseMode === 'decrease' ? 1 - b / 100 : 1 + b / 100;
      if (multiplier === 0) return { error: 'A 100% decrease cannot be reversed to one unique original value.' };
      const result = a / multiplier;
      return { result, label: 'Recovered original amount', working: `${formatNumber(a)} ÷ (${reverseMode === 'decrease' ? '1 −' : '1 +'} ${formatNumber(b)} ÷ 100)`, suffix: '', stats: [['Percentage multiplier', formatNumber(multiplier)], ['Forward check', formatNumber(result * multiplier)]] };
    }
    if (kind === 'grade') {
      if (b <= 0) return { error: 'Total possible points must be greater than zero.' };
      const result = (a / b) * 100;
      const grade = result >= 90 ? 'A' : result >= 80 ? 'B' : result >= 70 ? 'C' : result >= 60 ? 'D' : 'F';
      return { result, label: 'Grade percentage', working: `(${formatNumber(a)} ÷ ${formatNumber(b)}) × 100`, suffix: '%', stats: [['Indicative letter grade', grade], ['Points not earned', formatNumber(b - a)]] };
    }
    if (kind === 'win') {
      const games = a + b + c;
      if (games <= 0 || a < 0 || b < 0 || c < 0) return { error: 'Wins, losses, and ties must be non-negative, with at least one game played.' };
      const result = ((a + 0.5 * c) / games) * 100;
      return { result, label: 'Winning percentage', working: `((${formatNumber(a)} + 0.5 × ${formatNumber(c)}) ÷ ${formatNumber(games)}) × 100`, suffix: '%', stats: [['Total games', formatNumber(games)], ['Record', `${formatNumber(a)}-${formatNumber(b)}-${formatNumber(c)}`]] };
    }
    if (kind === 'weightLoss') {
      if (a <= 0 || b < 0) return { error: 'Starting weight must be greater than zero and current weight cannot be negative.' };
      const result = ((a - b) / a) * 100;
      return { result: Math.abs(result), label: result >= 0 ? 'Weight lost' : 'Weight gained', working: `((${formatNumber(a)} − ${formatNumber(b)}) ÷ ${formatNumber(a)}) × 100`, suffix: '%', stats: [['Weight change', formatNumber(Math.abs(a - b))], ['Direction', result >= 0 ? 'Loss' : 'Gain']] };
    }
    if (kind === 'bodyFat') {
      const factor = bodyFatUnit === 'cm' ? 1 / 2.54 : 1;
      const height = a * factor, waist = b * factor, neck = c * factor, hip = d * factor;
      const circumference = bodyFatSex === 'male' ? waist - neck : waist + hip - neck;
      if (height <= 0 || neck <= 0 || waist <= 0 || circumference <= 0 || (bodyFatSex === 'female' && hip <= 0)) return { error: 'Enter positive measurements; combined circumference must be greater than the neck measurement.' };
      const result = bodyFatSex === 'male' ? 86.01 * Math.log10(circumference) - 70.041 * Math.log10(height) + 36.76 : 163.205 * Math.log10(circumference) - 97.684 * Math.log10(height) - 78.387;
      return { result, label: 'Estimated body fat', working: bodyFatSex === 'male' ? 'U.S. Navy male circumference equation' : 'U.S. Navy female circumference equation', suffix: '%', stats: [['Method', 'Circumference estimate'], ['Input unit', bodyFatUnit === 'cm' ? 'Centimetres' : 'Inches']] };
    }
    if (kind === 'average') {
      const values = percentageList.split(/[,\s%]+/).filter(Boolean).map(Number).filter(Number.isFinite);
      if (!values.length) return { error: 'Enter at least one valid percentage value.' };
      const result = values.reduce((total, value) => total + value, 0) / values.length;
      return { result, label: 'Average percentage', working: `${formatNumber(values.reduce((total, value) => total + value, 0))} ÷ ${values.length}`, suffix: '%', stats: [['Values counted', String(values.length)], ['Range', `${formatNumber(Math.min(...values))}%–${formatNumber(Math.max(...values))}%`]] };
    }
    const discounted = a * (1 - b / 100);
    const tax = discounted * (c / 100);
    const result = discounted + tax;
    return { result, label: 'Final price after discount and tax', working: `${formatNumber(a)} × (1 − ${formatNumber(b)} ÷ 100) × (1 + ${formatNumber(c)} ÷ 100)`, suffix: '', stats: [['Discount savings', formatNumber(a - discounted)], ['Discounted subtotal', formatNumber(discounted)], ['Tax amount', formatNumber(tax)]] };
  }, [a, b, c, d, basicMode, bodyFatSex, bodyFatUnit, kind, percentageList, reverseMode]);

  const reset = () => { setA(presets[kind][0]); setB(presets[kind][1]); setC(presets[kind][2]); setD(96); setPercentageList('70, 80, 90'); setBasicMode('of'); setReverseMode('decrease'); setBodyFatSex('male'); setBodyFatUnit('cm'); };
  const fieldLabels = kind === 'percentage' ? (basicMode === 'of' ? ['Percentage', 'Number'] : ['Part (X)', 'Whole (Y)']) : kind === 'change' ? ['Original value', 'New value'] : kind === 'reverse' ? ['Final value', 'Percentage rate'] : kind === 'grade' ? ['Points earned', 'Total possible points'] : kind === 'win' ? ['Wins', 'Losses'] : kind === 'weightLoss' ? ['Starting weight', 'Current weight'] : kind === 'bodyFat' ? ['Height', 'Waist circumference'] : ['Original price', 'Discount rate'];

  return (
    <section aria-label="Percentage calculator" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:gap-10">
        <Card className="relative overflow-hidden !border-slate-300 !p-0 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.45)]">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 sm:px-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white"><Calculator size={18} /></span><h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-800">Enter known values</h2></div><button onClick={reset} className="flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-700" type="button"><RotateCcw size={14} /> Reset</button></div></div>
          <div className="space-y-6 p-6 sm:p-8">
            {kind === 'percentage' && <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1" aria-label="Percentage calculation type"><button type="button" onClick={() => setBasicMode('of')} className={`rounded-lg px-3 py-3 text-xs font-bold transition ${basicMode === 'of' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>What is P% of N?</button><button type="button" onClick={() => setBasicMode('ratio')} className={`rounded-lg px-3 py-3 text-xs font-bold transition ${basicMode === 'ratio' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>X is what % of Y?</button></div>}
            {kind === 'reverse' && <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1" aria-label="Applied percentage type"><button type="button" onClick={() => setReverseMode('decrease')} className={`rounded-lg px-3 py-3 text-xs font-bold transition ${reverseMode === 'decrease' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>After a decrease</button><button type="button" onClick={() => setReverseMode('increase')} className={`rounded-lg px-3 py-3 text-xs font-bold transition ${reverseMode === 'increase' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}>After an increase</button></div>}
            {kind === 'bodyFat' && <div className="grid grid-cols-2 gap-3"><select aria-label="Body fat equation" value={bodyFatSex} onChange={event => setBodyFatSex(event.target.value as 'male' | 'female')} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold"><option value="male">Male equation</option><option value="female">Female equation</option></select><select aria-label="Measurement unit" value={bodyFatUnit} onChange={event => setBodyFatUnit(event.target.value as 'cm' | 'in')} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold"><option value="cm">Centimetres</option><option value="in">Inches</option></select></div>}
            {kind === 'average' ? <label className="block text-sm font-bold text-slate-800">Percentage values<textarea value={percentageList} onChange={event => setPercentageList(event.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 p-4 font-mono text-sm outline-none focus:border-blue-600" placeholder="70, 80, 90" /></label> : <div className="grid gap-5 sm:grid-cols-2"><Input label={fieldLabels[0]} type="number" inputMode="decimal" value={a} onChange={(event) => setA(Number(event.target.value))} suffix={kind === 'percentage' && basicMode === 'of' ? '%' : undefined} /><Input label={fieldLabels[1]} type="number" inputMode="decimal" value={b} onChange={(event) => setB(Number(event.target.value))} suffix={kind === 'reverse' || kind === 'discount' ? '%' : undefined} /></div>}
            {kind === 'discount' && <Input label="Tax rate (optional)" type="number" inputMode="decimal" value={c} onChange={(event) => setC(Number(event.target.value))} suffix="%" />}
            {kind === 'win' && <Input label="Ties or draws" type="number" inputMode="numeric" value={c} onChange={(event) => setC(Number(event.target.value))} />}
            {kind === 'bodyFat' && <div className="grid gap-5 sm:grid-cols-2"><Input label="Neck circumference" type="number" inputMode="decimal" value={c} onChange={(event) => setC(Number(event.target.value))} suffix={bodyFatUnit} />{bodyFatSex === 'female' && <Input label="Hip circumference" type="number" inputMode="decimal" value={d} onChange={(event) => setD(Number(event.target.value))} suffix={bodyFatUnit} />}</div>}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><p className="text-xs leading-5 text-emerald-900"><strong>Private by design:</strong> Every calculation runs in this browser. Values are not uploaded or stored.</p></div></div>
          </div>
        </Card>
        <Card className="relative flex min-h-[360px] flex-col overflow-hidden !border-0 !bg-slate-950 !p-7 text-white shadow-[0_26px_80px_-32px_rgba(15,23,42,0.8)] sm:!p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-14 text-[13rem] font-black leading-none text-white/[0.035]">%</div>
          {'error' in calculation ? <div className="relative my-auto rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-6 text-amber-100">{calculation.error}</div> : <><div className="relative mb-7 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{kind === 'change' && calculation.result < 0 ? <ArrowDownRight size={17} /> : <ArrowUpRight size={17} />}Calculated result</div><h2 className="relative text-sm font-semibold leading-6 text-slate-300">{calculation.label}</h2><p aria-live="polite" className="relative mt-2 break-words text-[clamp(2.6rem,8vw,5rem)] font-black tracking-[-0.05em] text-white">{formatNumber(calculation.result)}{calculation.suffix}</p><code className="relative mt-5 block rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-xs leading-5 text-cyan-100">{calculation.working}</code><dl className="relative mt-auto grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">{calculation.stats?.map(([label, value]) => <div key={label}><dt className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 text-sm font-bold text-white">{value}</dd></div>)}</dl></>}
        </Card>
      </div>
    </section>
  );
}
