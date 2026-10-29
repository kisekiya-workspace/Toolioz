'use client';

import { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { dateToRoman, fromRoman, toRoman } from '@/lib/makers/roman';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function RomanClient() {
  const [year, setYear] = useState(1994);
  const [month, setMonth] = useState(7);
  const [day, setDay] = useState(29);
  const [sep, setSep] = useState('·');
  const [raw, setRaw] = useState('');
  const preview = useRef<HTMLDivElement>(null);
  const date = useMemo(() => dateToRoman(year, month, day, sep), [year, month, day, sep]);
  const parsed = fromRoman(raw);

  const exportPng = async () => {
    if (!preview.current) return;
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(preview.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'roman-numeral-date.png';
    a.click();
  };

  return (
    <ToolPageShell
      title="Roman Numeral Date Converter"
      subtitle="A Roman numeral date converter writes day, month, and year with subtractive notation (IV, IX, XL, XC, CD, CM). Separators such as a middle dot suit tattoo and ring previews. PNG export captures the preview locally. Years 1–3999 only."
      directAnswerTitle="How is a birthday written in Roman numerals?"
      directAnswer="29 July 1994 is XXIX · VII · MCMXCIV using day · month · year. 1994 is MCMXCIV because 1000 + 900 + 90 + 4. 2026 is MMXXVI. There is no year-zero in this system."
      takeaways={[
        'Standard subtractive forms only; no IIII for 4.',
        'Tattoo preview is a font rendering, not a stencil.',
        'PNG export uses html-to-image in the browser.',
        'Pasting MCMXCIV decodes to 1994.',
      ]}
      categoryName="Converters"
      seoTitle="Roman numeral dates"
      seoDescription="Values map through M, CM, D, CD, C, XC, L, XL, X, IX, V, IV, I. Dates are three independent integers. Ring and tattoo searches need a visual, so the large glyph preview is the differentiator versus text-only converters."
      howToUse={['Enter day, month, year.', 'Pick a separator.', 'Export PNG if needed.', 'Or paste numerals to decode.']}
      benefits={['Preview is designed for a tattoo/ring photograph overlay.', 'Decode path checks a vendor’s engraving.']}
      formula="greedy subtractive: 900=CM, 400=CD, 90=XC, 40=XL, 9=IX, 4=IV"
      faqs={[
        { question: 'How do you write a date of birth in Roman numerals?', answer: 'Convert day, month, and year separately, then join them with a separator such as ·.' },
        { question: 'Is 1994 MCMXCIV?', answer: 'Yes. M + CM + XC + IV.' },
      ]}
      currentToolId="roman-numeral-date"
      relatedIds={['morse-code', 'barbell-plates', 'needle-size-converter']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Converters', url: '/converters' },
        { name: 'Roman numeral date', url: '/converters/roman-numeral-date' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="Day" type="number" min={1} max={31} value={day} onChange={(e) => setDay(Number(e.target.value) || 0)} />
              <Input label="Month" type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value) || 0)} />
              <Input label="Year" type="number" min={1} max={3999} value={year} onChange={(e) => setYear(Number(e.target.value) || 0)} />
            </div>
            <div className="flex gap-2">
              {['·', '.', ' | ', ' '].map((s) => (
                <Button key={s} type="button" size="sm" variant={sep === s ? 'default' : 'outline'} onClick={() => setSep(s)}>
                  {s.trim() || 'space'}
                </Button>
              ))}
            </div>
            <Input label="Decode numerals" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="MCMXCIV" />
            <Button type="button" onClick={() => void exportPng()}>Export PNG</Button>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <div
            ref={preview}
            className="flex min-h-40 items-center justify-center rounded-2xl bg-zinc-950 px-6 py-10 text-center"
          >
            <p className="font-serif text-3xl tracking-[0.35em] text-amber-100 sm:text-4xl">{date || '—'}</p>
          </div>
          <ResultCard
            label="Year"
            value={toRoman(year) || '—'}
            gradient="linear-gradient(160deg,#111827 0%,#000 100%)"
            stats={[
              ['Month', toRoman(month) || '—'],
              ['Day', toRoman(day) || '—'],
              ['Decoded', parsed == null ? '—' : String(parsed)],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
