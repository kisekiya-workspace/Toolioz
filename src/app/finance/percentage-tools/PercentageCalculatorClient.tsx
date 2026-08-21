'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Calculator, RotateCcw, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PercentageToolKind } from './percentage-tool-data';

const formatNumber = (value: number, digits = 4) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);

const presets: Record<PercentageToolKind, [number, number, number]> = {
  percentage: [18, 250, 0],
  change: [80, 100, 0],
  reverse: [80, 20, 0],
  discount: [1000, 20, 5],
  grade: [42, 50, 0],
  win: [7, 3, 0],
  weightLoss: [80, 72, 0],
  bodyFat: [175, 86, 38],
  average: [0, 0, 0],
};

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
      return {
        result,
        label: basicMode === 'of' ? `${formatNumber(a)}% of ${formatNumber(b)}` : `${formatNumber(a)} as a percentage of ${formatNumber(b)}`,
        working: basicMode === 'of' ? `(${formatNumber(a)} ÷ 100) × ${formatNumber(b)}` : `(${formatNumber(a)} ÷ ${formatNumber(b)}) × 100`,
        suffix: basicMode === 'ratio' ? '%' : '',
        stats: basicMode === 'of' ? [['Decimal rate', formatNumber(a / 100)], ['Remaining amount', formatNumber(b - result)]] : [['Ratio', formatNumber(a / b)], ['Difference', formatNumber(b - a)]],
      };
    }
    if (kind === 'change') {
      if (a === 0) return { error: 'Percentage change is undefined when the original value is zero.' };
      const difference = b - a;
      const result = (difference / Math.abs(a)) * 100;
      return {
        result,
        label: result > 0 ? 'Percentage increase' : result < 0 ? 'Percentage decrease' : 'No percentage change',
        working: `((${formatNumber(b)} − ${formatNumber(a)}) ÷ |${formatNumber(a)}|) × 100`,
        suffix: '%',
        stats: [['Absolute change', formatNumber(difference)], ['Direction', result > 0 ? 'Increase' : result < 0 ? 'Decrease' : 'No change']],
      };
    }
    if (kind === 'reverse') {
      const multiplier = reverseMode === 'decrease' ? 1 - b / 100 : 1 + b / 100;
      if (multiplier === 0) return { error: 'A 100% decrease cannot be reversed to one unique original value.' };
      const result = a / multiplier;
      return {
        result,
        label: 'Recovered original amount',
        working: `${formatNumber(a)} ÷ (${reverseMode === 'decrease' ? '1 −' : '1 +'} ${formatNumber(b)} ÷ 100)`,
        suffix: '',
        stats: [['Percentage multiplier', formatNumber(multiplier)], ['Forward check', formatNumber(result * multiplier)]],
      };
    }
    if (kind === 'grade') {
      if (b <= 0) return { error: 'Total possible points must be greater than zero.' };
      const result = (a / b) * 100;
      const grade = result >= 90 ? 'A' : result >= 80 ? 'B' : result >= 70 ? 'C' : result >= 60 ? 'D' : 'F';
      return {
        result,
        label: 'Grade percentage',
        working: `(${formatNumber(a)} ÷ ${formatNumber(b)}) × 100`,
        suffix: '%',
        stats: [['Indicative letter grade', grade], ['Points not earned', formatNumber(b - a)]],
      };
    }
    if (kind === 'win') {
      const games = a + b + c;
      if (games <= 0 || a < 0 || b < 0 || c < 0) return { error: 'Wins, losses, and ties must be non-negative, with at least one game played.' };
      const result = ((a + 0.5 * c) / games) * 100;
      return {
        result,
        label: 'Winning percentage',
        working: `((${formatNumber(a)} + 0.5 × ${formatNumber(c)}) ÷ ${formatNumber(games)}) × 100`,
        suffix: '%',
        stats: [['Total games', formatNumber(games)], ['Record', `${formatNumber(a)}-${formatNumber(b)}-${formatNumber(c)}`]],
      };
    }
    if (kind === 'weightLoss') {
      if (a <= 0 || b < 0) return { error: 'Starting weight must be greater than zero and current weight cannot be negative.' };
      const result = ((a - b) / a) * 100;
      return {
        result: Math.abs(result),
        label: result >= 0 ? 'Weight lost' : 'Weight gained',
        working: `((${formatNumber(a)} − ${formatNumber(b)}) ÷ ${formatNumber(a)}) × 100`,
        suffix: '%',
        stats: [['Weight change', formatNumber(Math.abs(a - b))], ['Direction', result >= 0 ? 'Loss' : 'Gain']],
      };
    }
    if (kind === 'bodyFat') {
      const factor = bodyFatUnit === 'cm' ? 1 / 2.54 : 1;
      const height = a * factor, waist = b * factor, neck = c * factor, hip = d * factor;
      const circumference = bodyFatSex === 'male' ? waist - neck : waist + hip - neck;
      if (height <= 0 || neck <= 0 || waist <= 0 || circumference <= 0 || (bodyFatSex === 'female' && hip <= 0))
        return { error: 'Enter positive measurements; combined circumference must be greater than the neck measurement.' };
      const result = bodyFatSex === 'male' ? 86.01 * Math.log10(circumference) - 70.041 * Math.log10(height) + 36.76 : 163.205 * Math.log10(circumference) - 97.684 * Math.log10(height) - 78.387;
      return {
        result,
        label: 'Estimated body fat',
        working: bodyFatSex === 'male' ? 'U.S. Navy male circumference equation' : 'U.S. Navy female circumference equation',
        suffix: '%',
        stats: [['Method', 'Circumference estimate'], ['Input unit', bodyFatUnit === 'cm' ? 'Centimetres' : 'Inches']],
      };
    }
    if (kind === 'average') {
      const values = percentageList.split(/[,\s%]+/).filter(Boolean).map(Number).filter(Number.isFinite);
      if (!values.length) return { error: 'Enter at least one valid percentage value.' };
      const result = values.reduce((total, value) => total + value, 0) / values.length;
      return {
        result,
        label: 'Average percentage',
        working: `${formatNumber(values.reduce((total, value) => total + value, 0))} ÷ ${values.length}`,
        suffix: '%',
        stats: [['Values counted', String(values.length)], ['Range', `${formatNumber(Math.min(...values))}%–${formatNumber(Math.max(...values))}%`]],
      };
    }
    const discounted = a * (1 - b / 100);
    const tax = discounted * (c / 100);
    const result = discounted + tax;
    return {
      result,
      label: 'Final price after discount and tax',
      working: `${formatNumber(a)} × (1 − ${formatNumber(b)} ÷ 100) × (1 + ${formatNumber(c)} ÷ 100)`,
      suffix: '',
      stats: [['Discount savings', formatNumber(a - discounted)], ['Discounted subtotal', formatNumber(discounted)], ['Tax amount', formatNumber(tax)]],
    };
  }, [a, b, c, d, basicMode, bodyFatSex, bodyFatUnit, kind, percentageList, reverseMode]);

  const reset = () => {
    setA(presets[kind][0]);
    setB(presets[kind][1]);
    setC(presets[kind][2]);
    setD(96);
    setPercentageList('70, 80, 90');
    setBasicMode('of');
    setReverseMode('decrease');
    setBodyFatSex('male');
    setBodyFatUnit('cm');
  };

  const fieldLabels =
    kind === 'percentage'
      ? basicMode === 'of'
        ? ['Percentage', 'Number']
        : ['Part (X)', 'Whole (Y)']
      : kind === 'change'
      ? ['Original value', 'New value']
      : kind === 'reverse'
      ? ['Final value', 'Percentage rate']
      : kind === 'grade'
      ? ['Points earned', 'Total possible points']
      : kind === 'win'
      ? ['Wins', 'Losses']
      : kind === 'weightLoss'
      ? ['Starting weight', 'Current weight']
      : kind === 'bodyFat'
      ? ['Height', 'Waist circumference']
      : ['Original price', 'Discount rate'];

  return (
    <section aria-label="Percentage calculator" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:gap-8">
        {/* Left Inputs Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Calculator size={16} />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Enter Known Values
              </h2>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition cursor-pointer"
              type="button"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          <div className="space-y-5">
            {kind === 'percentage' && (
              <div className="grid grid-cols-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-1 border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setBasicMode('of')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer ${
                    basicMode === 'of'
                      ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  What is P% of N?
                </button>
                <button
                  type="button"
                  onClick={() => setBasicMode('ratio')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer ${
                    basicMode === 'ratio'
                      ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  X is what % of Y?
                </button>
              </div>
            )}

            {kind === 'reverse' && (
              <div className="grid grid-cols-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-1 border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setReverseMode('decrease')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer ${
                    reverseMode === 'decrease'
                      ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  After a decrease
                </button>
                <button
                  type="button"
                  onClick={() => setReverseMode('increase')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer ${
                    reverseMode === 'increase'
                      ? 'bg-white text-blue-600 dark:bg-zinc-900 dark:text-blue-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  After an increase
                </button>
              </div>
            )}

            {kind === 'bodyFat' && (
              <div className="grid grid-cols-2 gap-3">
                <select
                  aria-label="Body fat equation"
                  value={bodyFatSex}
                  onChange={(e) => setBodyFatSex(e.target.value as 'male' | 'female')}
                  className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-bold text-zinc-900 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  <option value="male">Male equation</option>
                  <option value="female">Female equation</option>
                </select>
                <select
                  aria-label="Measurement unit"
                  value={bodyFatUnit}
                  onChange={(e) => setBodyFatUnit(e.target.value as 'cm' | 'in')}
                  className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-bold text-zinc-900 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  <option value="cm">Centimetres</option>
                  <option value="in">Inches</option>
                </select>
              </div>
            )}

            {kind === 'average' ? (
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Percentage values (comma separated)
                <textarea
                  value={percentageList}
                  onChange={(e) => setPercentageList(e.target.value)}
                  className="mt-2 min-h-28 w-full rounded-xl border border-zinc-200 bg-white p-3 font-mono text-xs text-zinc-900 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="70, 80, 90"
                />
              </label>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={fieldLabels[0]}
                  type="number"
                  inputMode="decimal"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  suffix={kind === 'percentage' && basicMode === 'of' ? '%' : undefined}
                />
                <Input
                  label={fieldLabels[1]}
                  type="number"
                  inputMode="decimal"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  suffix={kind === 'reverse' || kind === 'discount' ? '%' : undefined}
                />
              </div>
            )}

            {kind === 'discount' && (
              <Input
                label="Tax rate (optional)"
                type="number"
                inputMode="decimal"
                value={c}
                onChange={(e) => setC(Number(e.target.value))}
                suffix="%"
              />
            )}

            {kind === 'win' && (
              <Input
                label="Ties or draws"
                type="number"
                inputMode="numeric"
                value={c}
                onChange={(e) => setC(Number(e.target.value))}
              />
            )}

            {kind === 'bodyFat' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Neck circumference"
                  type="number"
                  inputMode="decimal"
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  suffix={bodyFatUnit}
                />
                {bodyFatSex === 'female' && (
                  <Input
                    label="Hip circumference"
                    type="number"
                    inputMode="decimal"
                    value={d}
                    onChange={(e) => setD(Number(e.target.value))}
                    suffix={bodyFatUnit}
                  />
                )}
              </div>
            )}

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                  100% Client-Side Private
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Result Card (Solid IDE-Grade Dark Surface) */}
        <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-900 p-6 sm:p-8 text-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          {'error' in calculation ? (
            <div className="my-auto rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-200">
              {calculation.error}
            </div>
          ) : (
            <>
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  {kind === 'change' && calculation.result < 0 ? (
                    <ArrowDownRight size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                  <span>Calculated Result</span>
                </div>

                <p className="text-xs font-medium text-zinc-400">
                  {calculation.label}
                </p>

                <p className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  {formatNumber(calculation.result)}
                  {calculation.suffix}
                </p>

                <code className="mt-5 block rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 font-mono text-xs leading-relaxed text-blue-300">
                  {calculation.working}
                </code>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
                {calculation.stats?.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-white font-mono">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
