'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { COMMON_PANS, panScale, type Pan, type PanKind } from '@/lib/makers/baking-pans';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

function PanFields({ pan, onChange }: { pan: Pan; onChange: (pan: Pan) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className={styles.label}>
        Shape
        <select className={`${styles.select} mt-2`} value={pan.kind} onChange={(e) => onChange({ ...pan, kind: e.target.value as PanKind })}>
          <option value="round">Round</option>
          <option value="square">Square</option>
          <option value="rect">Rectangle</option>
          <option value="loaf">Loaf</option>
          <option value="bundt">Bundt</option>
        </select>
      </label>
      <Input label={pan.kind === 'round' || pan.kind === 'bundt' || pan.kind === 'square' ? 'Diameter or side (in)' : 'Length (in)'} type="number" value={pan.a} onChange={(e) => onChange({ ...pan, a: Number(e.target.value) || 0 })} />
      {pan.kind === 'rect' || pan.kind === 'loaf' ? (
        <Input label="Width (in)" type="number" value={pan.b} onChange={(e) => onChange({ ...pan, b: Number(e.target.value) || 0 })} />
      ) : null}
      <Input label="Depth (in)" type="number" step={0.25} value={pan.depth} onChange={(e) => onChange({ ...pan, depth: Number(e.target.value) || 0 })} />
    </div>
  );
}

export default function PanClient() {
  const [from, setFrom] = useState<Pan>(COMMON_PANS[1].pan);
  const [to, setTo] = useState<Pan>(COMMON_PANS[2].pan);
  const scale = useMemo(() => panScale(from, to), [from, to]);

  return (
    <ToolPageShell
      title="Baking Pan Size Converter"
      subtitle="A baking pan size converter compares batter volume between round, square, rectangular, loaf, and bundt pans. Scale a recipe by the volume ratio. Bundt volume subtracts an estimated centre tube."
      directAnswerTitle="Can 9-inch round batter fill a 9×13 pan?"
      directAnswer="A 9×2 in round holds about 127 in³ (8.8 cups). A 9×13×2 in pan holds about 234 in³ (16.2 cups). The volume factor is 1.84, so one 9-inch layer is not enough; two layers plus extra, or a scaled recipe, fill the sheet."
      takeaways={[
        'Volume, not diameter, is what scales a batter.',
        'A bundt tube is modelled as 35% of the outer diameter.',
        'Linear factor is the cube root of volume factor for 3D mix-ins, not for baking time.',
        'Food Network charts list typical cups; this page computes from geometry.',
      ]}
      categoryName="Kitchen"
      seoTitle="Baking pan size conversion"
      seoDescription="Round volume is π r² h. Rectangle volume is length × width × depth. Scaling a recipe by volume keeps the same batter depth only when the new pan area is considered; this tool reports volume factor and cup equivalents using 14.4375 in³ per US cup."
      howToUse={[
        'Set the recipe pan, or pick a common preset.',
        'Set the pan that will actually be baked.',
        'Multiply every ingredient by the volume factor.',
      ]}
      benefits={[
        'Cups are listed so a box-mix “fills two 9-inch pans” line can be checked.',
        'Loaf and bundt are first-class shapes.',
        'Presets cover the searches cake pan size converter and equivalents.',
      ]}
      formula="factor = volumeTo / volumeFrom;  round = π (d/2)² h"
      faqs={[
        {
          question: 'How does a baking pan size converter scale a cake?',
          answer: 'It divides destination volume by source volume. Multiply ingredient weights by that factor.',
        },
        {
          question: 'Does baking time scale the same way?',
          answer: 'No. A shallower sheet bakes faster. Use the volume factor for batter, then watch the crumb.',
        },
      ]}
      currentToolId="baking-pan"
      relatedIds={['cups-to-grams', 'cake-servings', 'sourdough-hydration', 'coffee-ratio']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Kitchen calculators', url: '/kitchen' },
        { name: 'Baking pan size converter', url: '/kitchen/baking-pan-size-converter' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <p className="text-xs font-semibold">Recipe pan</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_PANS.map((row) => (
                <Button key={row.label} type="button" size="sm" variant="outline" onClick={() => setFrom(row.pan)}>{row.label}</Button>
              ))}
            </div>
            <PanFields pan={from} onChange={setFrom} />
            <p className="text-xs font-semibold">Bake in</p>
            <PanFields pan={to} onChange={setTo} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Scale batter by"
            value={`× ${fmtNum(scale.volumeFactor, 2)}`}
            gradient="linear-gradient(160deg,#b45309 0%,#78350f 55%,#1c1917 100%)"
            stats={[
              ['From volume', `${fmtNum(scale.fromVol, 0)} in³ (${fmtNum(scale.fromCups, 1)} cups)`],
              ['To volume', `${fmtNum(scale.toVol, 0)} in³ (${fmtNum(scale.toCups, 1)} cups)`],
              ['Linear (cube root)', fmtNum(scale.linearFactor, 2)],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
