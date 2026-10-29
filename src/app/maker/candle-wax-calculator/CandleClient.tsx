'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { calculateCandle, WAX_FILL, type WaxId } from '@/lib/makers/candles';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function CandleClient() {
  const [containerOz, setContainerOz] = useState(8);
  const [containers, setContainers] = useState(4);
  const [wax, setWax] = useState<WaxId>('soy');
  const [fragrance, setFragrance] = useState(8);
  const result = useMemo(
    () => calculateCandle({ containerOz, containers, wax, fragrancePercent: fragrance }),
    [containerOz, containers, wax, fragrance],
  );

  return (
    <ToolPageShell
      title="Candle Wax Calculator"
      subtitle="A candle wax calculator converts container water volume in ounces to wax mass using a fill factor (0.86 for soy), then applies fragrance load as a percent of wax. Four 8 oz soy tins at 8% fragrance need about 27.5 oz of wax and 2.2 oz of oil, plus 10% extra wax for the melting pot."
      directAnswerTitle="How much soy wax is in an 8 oz candle?"
      directAnswer="An 8 oz container holds 8 oz of water. Soy wax at 0.86 of that mass is 6.88 oz (195 g). At an 8% fragrance load the oil is 0.55 oz (16 g). Buy a little extra for the pour pot."
      takeaways={[
        'Container ounces are water volume, not wax mass.',
        'Fragrance percent is of wax weight, a common candle-making convention.',
        'UK and Australian makers can read grams on the same card.',
        'Flashpoint and IFRA limits are not computed here.',
      ]}
      categoryName="Making"
      seoTitle="Candle wax and fragrance load"
      seoDescription="Wax ounces equal container ounces times a density factor, times the number of vessels. Fragrance ounces equal wax ounces times load percent. Ten percent extra wax covers the melting pitcher. Always confirm the oil’s allowed load on its IFRA document."
      howToUse={[
        'Enter container water volume in ounces and how many vessels.',
        'Pick soy, paraffin, beeswax, or coconut blend.',
        'Set fragrance load, typically 6–10%.',
      ]}
      benefits={[
        'Grams sit beside ounces for kitchen-scale users.',
        'Headroom wax is listed separately so the pot can be filled once.',
        'Load percent stays a typed input because oils differ.',
      ]}
      formula="waxOz = containerOz × fillFactor × count;  fragranceOz = waxOz × load%"
      faqs={[
        {
          question: 'Is an 8 oz candle 8 oz of wax?',
          answer: 'No. 8 oz is usually the water volume of the jar. Soy wax is lighter, so the wax mass is lower.',
        },
        {
          question: 'What fragrance load should a soy candle use?',
          answer: 'Many soy systems sit between 6% and 10%. The oil supplier’s IFRA maximum is the cap, not this page.',
        },
      ]}
      accuracyNote="Jar ounces are water volume. Soy/paraffin factors are typical fill ratios, not a specific wax batch. Fragrance percent is of wax mass."
      currentToolId="candle-wax"
      relatedIds={['epoxy-resin', 'filament-weight', 'print-cost']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Making calculators', url: '/maker' },
        { name: 'Candle wax calculator', url: '/maker/candle-wax-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Container volume (fl oz water)" type="number" min={0.5} value={containerOz} onChange={(e) => setContainerOz(Number(e.target.value) || 0)} />
            <Input label="Number of candles" type="number" min={1} value={containers} onChange={(e) => setContainers(Number(e.target.value) || 0)} />
            <label className={styles.label} htmlFor="wax">Wax</label>
            <select id="wax" className={styles.select} value={wax} onChange={(e) => setWax(e.target.value as WaxId)}>
              {(Object.keys(WAX_FILL) as WaxId[]).map((id) => (
                <option key={id} value={id}>{WAX_FILL[id].label}</option>
              ))}
            </select>
            <Input label="Fragrance load %" type="number" min={0} max={15} step={0.5} value={fragrance} onChange={(e) => setFragrance(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Wax to melt"
            value={`${fmtNum(result.waxWithHeadroomOz, 1)} oz`}
            gradient="linear-gradient(160deg,#c2410c 0%,#7c2d12 55%,#1c1917 100%)"
            stats={[
              ['Wax (no extra)', `${fmtNum(result.waxOz, 2)} oz / ${fmtNum(result.waxG, 0)} g`],
              ['Fragrance', `${fmtNum(result.fragranceOz, 2)} oz / ${fmtNum(result.fragranceG, 0)} g`],
              ['Wax with 10% extra', `${fmtNum(result.waxWithHeadroomG, 0)} g`],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
