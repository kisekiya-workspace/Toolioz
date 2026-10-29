'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { epoxyVolumeMl, mixEpoxy, type EpoxyShape } from '@/lib/makers/epoxy';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const SHAPES: Array<{ id: EpoxyShape; label: string }> = [
  { id: 'rectangle', label: 'Rectangle slab' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'oval', label: 'Oval' },
  { id: 'river', label: 'River table (~35% fill)' },
];

export default function EpoxyClient() {
  const [shape, setShape] = useState<EpoxyShape>('rectangle');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [length, setLength] = useState(80);
  const [width, setWidth] = useState(40);
  const [depth, setDepth] = useState(2);
  const [fill, setFill] = useState(100);
  const [ratioA, setRatioA] = useState(1);
  const [ratioB, setRatioB] = useState(1);
  const [density, setDensity] = useState(1.1);
  const volume = useMemo(
    () => epoxyVolumeMl({ shape, length, width, depth, unit, fillPercent: fill }),
    [shape, length, width, depth, unit, fill],
  );
  const mix = useMemo(() => mixEpoxy(volume, ratioA, ratioB, density), [volume, ratioA, ratioB, density]);

  return (
    <ToolPageShell
      title="Epoxy Resin Calculator"
      subtitle="An epoxy resin calculator fills a rectangle, cylinder, oval, or river-table cavity, then splits millilitres into an A:B mix by volume. Grams use a typed density, usually near 1.1 g/ml. The river option treats about 35% of the bounding box as the void."
      directAnswerTitle="How much epoxy does a river table need?"
      directAnswer="A bounding box of 80 × 40 × 2 cm is 6.4 L. At a 35% river fill that is 2.24 L. A 1:1 mix at 1.1 g/ml is 1.23 kg of A and 1.23 kg of B. Always check the kit’s ratio; some systems are 2:1 by weight."
      takeaways={[
        'Volume is geometric; waste and soak-in are extra.',
        'Ratio fields are parts A to parts B by volume unless density differs by side.',
        'Millilitres, litres, and US fluid ounces are listed together.',
        'Deep pours may need a different product than a tabletop coat.',
      ]}
      categoryName="Making"
      seoTitle="Epoxy resin calculator volumes"
      seoDescription="Rectangle volume is length × width × depth. A cylinder uses π r² h with length as diameter. A river table uses 35% of the box as a starting void fraction that can be edited with fill percent. Mix mass is volume times density."
      howToUse={[
        'Pick a shape and centimetres or inches.',
        'Enter cavity size and optional fill percent.',
        'Set A:B and density from the resin kit.',
      ]}
      benefits={[
        'Litres and ounces avoid a second converter.',
        'Fill percent models a partial river or a second flood coat.',
        'The kit SDS is still the authority for mix ratio.',
      ]}
      formula="ml = shapeVolumeCm3 × fill%;  gramsA = ml × (A/(A+B)) × density"
      faqs={[
        {
          question: 'Is epoxy ratio by weight or volume?',
          answer:
            'This page splits volume by parts, then multiplies each side by the same density. If A and B have different densities, weigh using the kit’s mass ratio instead.',
        },
        {
          question: 'How many ml are in a litre of epoxy?',
          answer: '1,000 ml. The result card lists both.',
        },
      ]}
      accuracyNote="River-table fill is modelled as 35% of the bounding box. Parts A and B use one density; a real kit can differ by weight versus volume."
      currentToolId="epoxy-resin"
      relatedIds={['candle-wax', 'filament-weight', 'print-cost']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Making calculators', url: '/maker' },
        { name: 'Epoxy resin calculator', url: '/maker/epoxy-resin-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((row) => (
                <Button key={row.id} type="button" size="sm" variant={shape === row.id ? 'default' : 'outline'} onClick={() => setShape(row.id)}>
                  {row.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['cm', 'in'] as const).map((u) => (
                <Button key={u} type="button" size="sm" variant={unit === u ? 'default' : 'outline'} onClick={() => setUnit(u)}>
                  {u}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label={shape === 'cylinder' ? `Diameter (${unit})` : `Length (${unit})`} type="number" value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
              <Input label={`Width (${unit})`} type="number" value={width} onChange={(e) => setWidth(Number(e.target.value) || 0)} disabled={shape === 'cylinder'} />
              <Input label={`Depth (${unit})`} type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value) || 0)} />
              <Input label="Fill %" type="number" min={1} max={100} value={fill} onChange={(e) => setFill(Number(e.target.value) || 0)} />
              <Input label="Part A" type="number" min={0.1} value={ratioA} onChange={(e) => setRatioA(Number(e.target.value) || 0)} />
              <Input label="Part B" type="number" min={0.1} value={ratioB} onChange={(e) => setRatioB(Number(e.target.value) || 0)} />
            </div>
            <Input label="Density (g/ml)" type="number" step={0.01} value={density} onChange={(e) => setDensity(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Mixed volume"
            value={`${fmtNum(mix.volumeL, 3)} L`}
            gradient="linear-gradient(160deg,#1d4ed8 0%,#1e3a8a 55%,#1c1917 100%)"
            stats={[
              ['Millilitres', fmtNum(mix.volumeMl, 0)],
              ['US fl oz', fmtNum(mix.volumeOz, 1)],
              ['Resin A', `${fmtNum(mix.mlA, 0)} ml / ${fmtNum(mix.gramsA, 0)} g`],
              ['Hardener B', `${fmtNum(mix.mlB, 0)} ml / ${fmtNum(mix.gramsB, 0)} g`],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
