'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { tierServings, type SliceStyle } from '@/lib/makers/cake';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function CakeClient() {
  const [style, setStyle] = useState<SliceStyle>('party');
  const [d1, setD1] = useState(8);
  const [d2, setD2] = useState(6);
  const [useSecond, setUseSecond] = useState(true);
  const result = useMemo(
    () =>
      tierServings(
        useSecond
          ? [
              { kind: 'round', a: d1, b: d1 },
              { kind: 'round', a: d2, b: d2 },
            ]
          : [{ kind: 'round', a: d1, b: d1 }],
        style,
      ),
    [d1, d2, useSecond, style],
  );

  return (
    <ToolPageShell
      title="Cake Serving Calculator"
      subtitle="A cake serving calculator divides pan area by slice area. Party slices are 2×2 in (4 in²). Wedding slices are 1×2 in (2 in²). Tiers add. These are planning counts, not a Wilton trademark chart, though the slice sizes match common catering practice."
      directAnswerTitle="How many party slices are in an 8-inch round?"
      directAnswer="An 8-inch round has about 50.3 in². At 4 in² per party slice that is 13 servings. Wedding slices at 2 in² yield 25. Two tiers of 8 and 6 inches are about 20 party slices or 40 wedding slices."
      takeaways={[
        'Party = 4 in², wedding = 2 in².',
        'Tiers add areas; they are not stacked as extra height in this count.',
        'Sheet cakes use the same area rule.',
        'Filling and crust waste are not subtracted.',
      ]}
      categoryName="Kitchen"
      seoTitle="Cake serving counts"
      seoDescription="Servings equal π (d/2)² divided by 4 for party slices or 2 for wedding slices. A second tier adds its own area. Rectangular tiers are width × length. Always cut a test slice; dense fruitcake portions smaller."
      howToUse={[
        'Choose party or wedding slice size.',
        'Enter the main round diameter.',
        'Optionally add a second tier.',
      ]}
      benefits={['Wedding versus party is a single toggle.', 'Two-tier totals are summed, not averaged.']}
      formula="servings = round(area / sliceArea);  party slice = 4 in²"
      faqs={[
        { question: 'How many servings is an 8-inch cake?', answer: 'About 13 party slices or 25 wedding slices.' },
        { question: 'Does height change servings?', answer: 'Not in this model. Taller cakes are still one layer of footprints unless a second tier is added.' },
      ]}
      accuracyNote="Party slices use about 4 in² and wedding slices about 2 in². Height, frosting, and how the cake is cut will change the count."
      currentToolId="cake-servings"
      relatedIds={['baking-pan', 'cups-to-grams', 'sourdough-hydration']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Kitchen calculators', url: '/kitchen' },
        { name: 'Cake serving calculator', url: '/kitchen/cake-serving-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2">
              {(['party', 'wedding'] as const).map((id) => (
                <Button key={id} type="button" size="sm" variant={style === id ? 'default' : 'outline'} onClick={() => setStyle(id)}>
                  {id} slices
                </Button>
              ))}
            </div>
            <Input label="Bottom tier diameter (in)" type="number" min={4} value={d1} onChange={(e) => setD1(Number(e.target.value) || 0)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useSecond} onChange={(e) => setUseSecond(e.target.checked)} />
              Second round tier
            </label>
            {useSecond ? <Input label="Upper tier diameter (in)" type="number" min={3} value={d2} onChange={(e) => setD2(Number(e.target.value) || 0)} /> : null}
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label={`${style} servings`}
            value={fmtNum(result.total, 0)}
            gradient="linear-gradient(160deg,#9d174d 0%,#831843 55%,#1c1917 100%)"
            stats={result.rows.map((row, i) => [`Tier ${i + 1} area`, `${fmtNum(row.area, 1)} in² · ${row.servings} slices`])}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
