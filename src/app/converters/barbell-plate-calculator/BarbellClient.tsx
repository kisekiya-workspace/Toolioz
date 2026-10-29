'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { KG_PLATES, LB_PLATES, plateStack } from '@/lib/makers/barbell';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function BarbellClient() {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [bar, setBar] = useState(20);
  const [target, setTarget] = useState(100);
  const plates = unit === 'kg' ? KG_PLATES : LB_PLATES;
  const result = useMemo(() => plateStack(target, bar, plates), [target, bar, plates]);

  return (
    <ToolPageShell
      title="Barbell Plate Calculator"
      subtitle="A plate calculator splits (target − bar) across two sides using a greedy stack of gym plates. Kilograms: 25, 20, 15, 10, 5, 2.5, 1.25. Pounds: 45, 35, 25, 10, 5, 2.5. The bar drawing shows one side; load the mirror image on the other."
      directAnswerTitle="How do you load 100 kg on a 20 kg bar?"
      directAnswer="80 kg of plates, 40 kg per side: one 25, one 10, one 5. Leftover 0. The visual shows those discs from the collar inward."
      takeaways={['Greedy largest-first.', 'Change plates if a gym lacks 1.25 kg.', 'Collar weight is omitted.']}
      categoryName="Converters"
      seoTitle="Barbell plates kg and lb"
      seoDescription="Per-side load is (target − bar) / 2. Plates are applied largest first. This is not a percentage-based strength program."
      howToUse={['Pick kg or lb.', 'Set bar and target.', 'Load both sides identically.']}
      benefits={['Visual bar.', 'Leftover mass is shown if plates cannot hit the number.']}
      formula="perSide = (target − bar) / 2; greedy plates"
      faqs={[
        { question: 'Is a 20 kg bar 45 lb?', answer: 'Close, not exact. Switch the unit toggle rather than mixing.' },
        { question: 'Are bumper colours coded?', answer: 'The drawing uses size, not IWF colour law.' },
      ]}
      accuracyNote="Gyms omit small change plates. The leftover field is weight this stack cannot hit exactly."
      currentToolId="barbell-plates"
      relatedIds={['morse-code', 'roman-numeral-date', 'coffee-ratio']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Converters', url: '/converters' },
        { name: 'Barbell plate calculator', url: '/converters/barbell-plate-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2">
              {(['kg', 'lb'] as const).map((id) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={unit === id ? 'default' : 'outline'}
                  onClick={() => {
                    setUnit(id);
                    setBar(id === 'kg' ? 20 : 45);
                    setTarget(id === 'kg' ? 100 : 225);
                  }}
                >
                  {id}
                </Button>
              ))}
            </div>
            <Input label={`Bar (${unit})`} type="number" value={bar} onChange={(e) => setBar(Number(e.target.value) || 0)} />
            <Input label={`Target (${unit})`} type="number" value={target} onChange={(e) => setTarget(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Loaded"
            value={`${fmtNum(result.loaded, 2)} ${unit}`}
            gradient="linear-gradient(160deg,#334155 0%,#0f172a 100%)"
            stats={[
              ['Leftover', `${fmtNum(result.leftover, 2)} ${unit}`],
              ...result.perSide.map((row) => [`${row.weight} × ${row.count} / side`, `${row.weight * row.count * 2} ${unit}`] as [string, string]),
            ]}
          />
          <div className="flex items-center gap-1 overflow-x-auto rounded-2xl bg-zinc-900 px-4 py-8">
            <div className="h-3 w-24 rounded-full bg-zinc-500" />
            {result.perSide.flatMap((row) =>
              Array.from({ length: row.count }, (_, i) => (
                <div
                  key={`${row.weight}-${i}`}
                  className="rounded-sm bg-zinc-300"
                  style={{ width: 10 + row.weight / (unit === 'kg' ? 5 : 10), height: 24 + row.weight }}
                  title={`${row.weight}`}
                />
              )),
            )}
            <div className="h-4 w-6 rounded bg-zinc-400" />
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
