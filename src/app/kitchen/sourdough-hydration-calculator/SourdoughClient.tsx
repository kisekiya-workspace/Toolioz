'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { calculateSourdough } from '@/lib/makers/sourdough';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function SourdoughClient() {
  const [flour, setFlour] = useState(500);
  const [hydration, setHydration] = useState(72);
  const [starterPct, setStarterPct] = useState(20);
  const [starterHydration, setStarterHydration] = useState(100);
  const [salt, setSalt] = useState(2);
  const result = useMemo(
    () => calculateSourdough({ flourG: flour, hydrationPercent: hydration, starterPercent: starterPct, starterHydration, saltPercent: salt }),
    [flour, hydration, starterPct, starterHydration, salt],
  );

  return (
    <ToolPageShell
      title="Sourdough Hydration Calculator"
      subtitle="A sourdough hydration calculator treats flour as 100% baker’s percent. Water is hydration percent of that flour. Starter is a percent of flour, split into flour and water using starter hydration. Salt is a percent of flour. Dough water is reduced by the water already in the starter so total hydration stays on target."
      directAnswerTitle="What is 72% hydration on 500 g flour with 20% starter?"
      directAnswer="500 g flour at 72% wants 360 g water in the dough system. 20% starter at 100% hydration is 100 g starter (50 g flour + 50 g water). Bowl water is 310 g. Salt at 2% is 10 g. Total dough is 920 g and true hydration including starter flour is 65.5% (360 g water / 550 g flour)."
      takeaways={[
        'Baker’s percent is always of the bread flour unless noted.',
        'Starter water is subtracted from bowl water.',
        'True hydration includes starter flour in the denominator.',
        'Pizza and cookie baker’s percent use the same fields with different hydration.',
      ]}
      categoryName="Kitchen"
      seoTitle="Sourdough baker’s percentage"
      seoDescription="Bowl water = flour × hydration − starter water. Starter water = starter × (starterHydration / (100 + starterHydration)). Salt is independent. Cups are not used; grams keep preferment math honest."
      howToUse={[
        'Enter bread flour in grams.',
        'Set dough hydration, starter percent, starter hydration, and salt.',
        'Weigh bowl water, starter, and salt as listed.',
      ]}
      benefits={[
        'True hydration is shown so a wet starter does not silently dry the dough.',
        'Pizza at 60% or a cookie dough at 20% still uses the same engine.',
      ]}
      formula="bowlWater = flour×hydration − starter×(Hs/(1+Hs))"
      faqs={[
        {
          question: 'Does sourdough hydration include starter?',
          answer: 'This page targets hydration on bread flour, then reports true hydration of all flour including starter flour.',
        },
        {
          question: 'Can cups be used instead of grams?',
          answer: 'Not here. Convert cups on the cups-to-grams page first. Preferment math needs grams.',
        },
      ]}
      accuracyNote="Hydration here is a target on bread flour, with starter water subtracted from the bowl. Other apps treat hydration as bowl water only; the two conventions disagree."
      currentToolId="sourdough-hydration"
      relatedIds={['cups-to-grams', 'baking-pan', 'coffee-ratio', 'cake-servings']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Kitchen calculators', url: '/kitchen' },
        { name: 'Sourdough hydration calculator', url: '/kitchen/sourdough-hydration-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Flour (g)" type="number" value={flour} onChange={(e) => setFlour(Number(e.target.value) || 0)} />
            <Input label="Hydration %" type="number" value={hydration} onChange={(e) => setHydration(Number(e.target.value) || 0)} />
            <Input label="Starter % of flour" type="number" value={starterPct} onChange={(e) => setStarterPct(Number(e.target.value) || 0)} />
            <Input label="Starter hydration %" type="number" value={starterHydration} onChange={(e) => setStarterHydration(Number(e.target.value) || 0)} />
            <Input label="Salt %" type="number" step={0.1} value={salt} onChange={(e) => setSalt(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Bowl water"
            value={`${fmtNum(result.water, 0)} g`}
            gradient="linear-gradient(160deg,#92400e 0%,#78350f 55%,#1c1917 100%)"
            stats={[
              ['Starter', `${fmtNum(result.starter, 0)} g`],
              ['Salt', `${fmtNum(result.salt, 1)} g`],
              ['Dough', `${fmtNum(result.dough, 0)} g`],
              ['True hydration', `${fmtNum(result.trueHydration, 1)}%`],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
