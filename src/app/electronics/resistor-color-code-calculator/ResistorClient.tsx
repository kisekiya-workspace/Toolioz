'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { COLOR_BANDS, formatOhms, resistorFromBands, valueToBands } from '@/lib/makers/resistor';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const DIGITS = COLOR_BANDS.filter((b) => b.digit != null);
const MULTS = COLOR_BANDS.filter((b) => b.multiplier);
const TOLS = COLOR_BANDS.filter((b) => b.tolerance != null);

export default function ResistorClient() {
  const [bands, setBands] = useState<4 | 5 | 6>(4);
  const [d1, setD1] = useState('brown');
  const [d2, setD2] = useState('black');
  const [d3, setD3] = useState('black');
  const [mult, setMult] = useState('red');
  const [tol, setTol] = useState('gold');
  const [ohmsIn, setOhmsIn] = useState(1000);
  const digits = bands === 4 ? [bandDigit(d1), bandDigit(d2)] : [bandDigit(d1), bandDigit(d2), bandDigit(d3)];
  const multiplier = COLOR_BANDS.find((b) => b.name === mult)?.multiplier ?? 1;
  const tolerance = COLOR_BANDS.find((b) => b.name === tol)?.tolerance;
  const decoded = useMemo(() => resistorFromBands(digits, multiplier, tolerance), [digits, multiplier, tolerance]);
  const encoded = useMemo(() => valueToBands(ohmsIn, bands === 4 ? 4 : 5), [ohmsIn, bands]);

  return (
    <ToolPageShell
      title="Resistor Color Code Calculator"
      subtitle="A resistor color code calculator reads IEC 60062 bands. 4-band: digit, digit, multiplier, tolerance. 5-band adds a third digit. 6-band adds temperature coefficient. Reverse mode maps a value back to digits and multiplier."
      directAnswerTitle="What is brown-black-red-gold?"
      directAnswer="Brown 1, black 0, red ×100, gold ±5% is 1.0 kΩ ±5%. A 5-band 1.00 kΩ is brown-black-black-brown-brown (±1%)."
      takeaways={['First bands are digits.', 'Gold/silver as multiplier are 0.1 and 0.01.', 'Pearson charts and this page share the same IEC colours.']}
      categoryName="Electronics"
      seoTitle="Resistor color bands"
      seoDescription="IEC 60062 colour digits 0–9, multipliers including gold and silver, tolerances 1%–10%. Temperature coefficient on a 6th band is shown as ppm from the colour table when present."
      howToUse={['Pick 4, 5, or 6 bands.', 'Set colours left to right.', 'Or type ohms to see colours.']}
      benefits={['Both directions.', 'kΩ / MΩ formatting.']}
      formula="ohms = digits × multiplier"
      faqs={[
        { question: 'Which end is the first band?', answer: 'The tolerance band is usually gold or silver and sits apart. Read from the other end.' },
        { question: 'Is there a mnemonic?', answer: 'This page uses colours, not a memory phrase.' },
      ]}
      currentToolId="resistor-color"
      relatedIds={['led-resistor', 'css-clamp']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Electronics calculators', url: '/electronics' },
        { name: 'Resistor color code', url: '/electronics/resistor-color-code-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2">
              {([4, 5, 6] as const).map((n) => (
                <Button key={n} type="button" size="sm" variant={bands === n ? 'default' : 'outline'} onClick={() => setBands(n)}>{n} band</Button>
              ))}
            </div>
            <BandSelect label="Digit 1" value={d1} onChange={setD1} options={DIGITS} />
            <BandSelect label="Digit 2" value={d2} onChange={setD2} options={DIGITS} />
            {bands !== 4 ? <BandSelect label="Digit 3" value={d3} onChange={setD3} options={DIGITS} /> : null}
            <BandSelect label="Multiplier" value={mult} onChange={setMult} options={MULTS} />
            <BandSelect label="Tolerance" value={tol} onChange={setTol} options={TOLS} />
            <Input label="Value → colours (Ω)" type="number" value={ohmsIn} onChange={(e) => setOhmsIn(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <ResultCard
          label="Decoded"
          value={formatOhms(decoded.ohms)}
          gradient="linear-gradient(160deg,#b45309 0%,#78350f 55%,#1c1917 100%)"
          stats={[
            ['Tolerance', decoded.tolerance != null ? `±${decoded.tolerance}%` : '—'],
            ['Digits for typed Ω', encoded.digits.join('')],
            ['Multiplier', String(encoded.multiplier)],
          ]}
        />
      </div>
    </ToolPageShell>
  );
}

function bandDigit(name: string) {
  return COLOR_BANDS.find((b) => b.name === name)?.digit ?? 0;
}

function BandSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { name: string; hex: string }[];
}) {
  return (
    <label className={styles.label}>
      {label}
      <select className={`${styles.select} mt-2`} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((row) => (
          <option key={row.name} value={row.name}>{row.name}</option>
        ))}
      </select>
    </label>
  );
}
