'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { dividerR2, ledResistor, voltageDivider } from '@/lib/makers/led';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function LedClient() {
  const [tab, setTab] = useState<'led' | 'divider'>('led');
  const [vs, setVs] = useState(5);
  const [vf, setVf] = useState(2.1);
  const [ma, setMa] = useState(20);
  const [series, setSeries] = useState(1);
  const [strings, setStrings] = useState(1);
  const [vin, setVin] = useState(12);
  const [r1, setR1] = useState(10000);
  const [r2, setR2] = useState(10000);
  const [vout, setVout] = useState(5);
  const led = useMemo(() => ledResistor({ supplyV: vs, forwardV: vf, currentMa: ma, seriesCount: series, strings }), [vs, vf, ma, series, strings]);
  const div = useMemo(() => voltageDivider(vin, r1, r2), [vin, r1, r2]);

  return (
    <ToolPageShell
      title="LED Resistor and Voltage Divider Calculator"
      subtitle="An LED resistor calculator uses R = (Vs − n×Vf) / I. Power is I²R. Parallel strings multiply current. A second tab solves a two-resistor divider: Vout = Vin × R2/(R1+R2). 12 V and 5 V supplies are common inputs, not the only ones."
      directAnswerTitle="What resistor does a 5 V LED need?"
      directAnswer="A 2.1 V LED at 20 mA on 5 V needs (5 − 2.1) / 0.02 = 145 Ω, dissipating 0.058 W, so a 150 Ω ¼ W part is typical. Two LEDs in series on 5 V leave only 0.8 V and may not light."
      takeaways={['Series count subtracts more Vf.', 'If drop ≤ 0 the supply is too low.', 'Divider tab is independent Ohm’s law.']}
      categoryName="Electronics"
      seoTitle="LED current-limit resistor"
      seoDescription="Ohm’s law on the leftover voltage. Datasheet Vf depends on colour. This is not a constant-current driver model."
      howToUse={['Enter supply, Vf, current, series count.', 'Switch to divider for R1/R2.', 'Pick the next standard resistor above the ohms.']}
      benefits={['Watts shown so ¼ W vs ½ W is obvious.', 'Divider reverse-solves R2.']}
      formula="R = (Vs − n Vf) / I"
      faqs={[
        { question: 'Can LEDs share one resistor in parallel?', answer: 'This page treats parallel as separate strings each with the same R, not one resistor feeding mismatched Vf.' },
        { question: 'How does a 3-resistor divider work?', answer: 'Only two resistors are modelled. Add stages by using Vout as the next Vin.' },
      ]}
      accuracyNote="145 Ω is the exact Ohm’s-law value. Buy the next standard E12/E24 resistor up (often 150 Ω) and check the LED datasheet Vf."
      currentToolId="led-resistor"
      relatedIds={['resistor-color', 'css-clamp']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Electronics calculators', url: '/electronics' },
        { name: 'LED resistor calculator', url: '/electronics/led-resistor-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={tab === 'led' ? 'default' : 'outline'} onClick={() => setTab('led')}>LED resistor</Button>
              <Button type="button" size="sm" variant={tab === 'divider' ? 'default' : 'outline'} onClick={() => setTab('divider')}>Voltage divider</Button>
            </div>
            {tab === 'led' ? (
              <>
                <Input label="Supply (V)" type="number" step={0.1} value={vs} onChange={(e) => setVs(Number(e.target.value) || 0)} />
                <Input label="LED Vf" type="number" step={0.1} value={vf} onChange={(e) => setVf(Number(e.target.value) || 0)} />
                <Input label="Current (mA)" type="number" value={ma} onChange={(e) => setMa(Number(e.target.value) || 0)} />
                <Input label="LEDs in series" type="number" min={1} value={series} onChange={(e) => setSeries(Number(e.target.value) || 0)} />
                <Input label="Parallel strings" type="number" min={1} value={strings} onChange={(e) => setStrings(Number(e.target.value) || 0)} />
              </>
            ) : (
              <>
                <Input label="Vin" type="number" value={vin} onChange={(e) => setVin(Number(e.target.value) || 0)} />
                <Input label="R1 (Ω)" type="number" value={r1} onChange={(e) => setR1(Number(e.target.value) || 0)} />
                <Input label="R2 (Ω)" type="number" value={r2} onChange={(e) => setR2(Number(e.target.value) || 0)} />
                <Input label="Target Vout (solve R2)" type="number" value={vout} onChange={(e) => setVout(Number(e.target.value) || 0)} />
              </>
            )}
          </div>
        </Card>
        {tab === 'led' ? (
          <ResultCard
            label={led.ok ? 'Series resistor' : 'Supply too low'}
            value={`${fmtNum(led.ohms, 0)} Ω`}
            gradient="linear-gradient(160deg,#ca8a04 0%,#854d0e 55%,#1c1917 100%)"
            stats={[
              ['Watts', fmtNum(led.watts, 3)],
              ['Drop', `${fmtNum(led.drop, 2)} V`],
              ['Total current', `${fmtNum(led.totalCurrentMa, 1)} mA`],
            ]}
          />
        ) : (
          <ResultCard
            label="Vout"
            value={`${fmtNum(div.vout, 3)} V`}
            gradient="linear-gradient(160deg,#ca8a04 0%,#854d0e 55%,#1c1917 100%)"
            stats={[['R2 for target', `${fmtNum(dividerR2(vin, vout, r1), 0)} Ω`]]}
          />
        )}
      </div>
    </ToolPageShell>
  );
}
