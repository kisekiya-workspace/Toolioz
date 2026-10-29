'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { TYPE_RATIOS, fluidClamp, typeScale } from '@/lib/makers/css-clamp';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function ClampClient() {
  const [tab, setTab] = useState<'clamp' | 'scale'>('clamp');
  const [minPx, setMinPx] = useState(16);
  const [maxPx, setMaxPx] = useState(32);
  const [minVw, setMinVw] = useState(360);
  const [maxVw, setMaxVw] = useState(1240);
  const [root, setRoot] = useState(16);
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const clamp = useMemo(() => fluidClamp({ minPx, maxPx, minVw, maxVw, rootPx: root }), [minPx, maxPx, minVw, maxVw, root]);
  const scale = useMemo(() => typeScale(base, ratio), [base, ratio]);

  return (
    <ToolPageShell
      title="CSS Clamp Generator"
      subtitle="A CSS clamp generator builds fluid type and spacing: clamp(min, intercept + slope × vw, max). A type-scale tab lists modular steps from a base size and ratio. The preferred value is linear between two viewports, not a magic 5vw."
      directAnswerTitle="How does a CSS clamp() fluid type calculator work?"
      directAnswer="Slope is (maxPx − minPx) / (maxVw − minVw). Intercept is minPx − slope × minVw. The preferred term is intercept px + slope×100 vw. Wrap that in clamp(minPx, preferred, maxPx). From 16→32 px over 360→1240 px the CSS is clamp(16px, 9.4545px + 1.8182vw, 32px)."
      takeaways={[
        'Two viewports and two font sizes fully determine the line.',
        'Rem output divides by the typed root.',
        'Type scale is independent: base × ratio^step.',
        'Figma type-scale plugins are not required; the table is local.',
      ]}
      categoryName="DevTools"
      relatedCategoryId="devtools"
      seoTitle="Fluid typography clamp()"
      seoDescription="CSS clamp() needs a minimum, a preferred linear function of viewport width, and a maximum. This page solves the linear function from two design sizes. Spacing uses the same engine. The type-scale tab is a modular scale, not fluid until each step is fed back into clamp."
      howToUse={[
        'Enter min/max px and the viewports they should hit.',
        'Copy the px or rem clamp().',
        'Optionally generate a modular type scale.',
      ]}
      benefits={['No 5vw guess. The slope is exact.', 'Root size is typed so rem matches html { font-size }.']}
      formula="slope = (max − min) / (maxVw − minVw); preferred = intercept + slope×100vw"
      faqs={[
        { question: 'Is this a width clamp or a font clamp?', answer: 'Both. Any two sizes over two viewports work for type or spacing.' },
        { question: 'Does the type scale use clamp?', answer: 'The scale tab lists static px/rem. Feed a pair of steps into the clamp tab for fluid type.' },
      ]}
      currentToolId="css-clamp"
      relatedIds={['px-to-rem', 'tailwind-color', 'layout-generator']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Developer tools', url: '/devtools' },
        { name: 'CSS clamp generator', url: '/devtools/css-clamp-generator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={tab === 'clamp' ? 'default' : 'outline'} onClick={() => setTab('clamp')}>Fluid clamp</Button>
              <Button type="button" size="sm" variant={tab === 'scale' ? 'default' : 'outline'} onClick={() => setTab('scale')}>Type scale</Button>
            </div>
            {tab === 'clamp' ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Min px" type="number" value={minPx} onChange={(e) => setMinPx(Number(e.target.value) || 0)} />
                  <Input label="Max px" type="number" value={maxPx} onChange={(e) => setMaxPx(Number(e.target.value) || 0)} />
                  <Input label="Min viewport" type="number" value={minVw} onChange={(e) => setMinVw(Number(e.target.value) || 0)} />
                  <Input label="Max viewport" type="number" value={maxVw} onChange={(e) => setMaxVw(Number(e.target.value) || 0)} />
                </div>
                <Input label="Root px (for rem)" type="number" value={root} onChange={(e) => setRoot(Number(e.target.value) || 0)} />
              </>
            ) : (
              <>
                <Input label="Base px" type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 0)} />
                <select className={styles.select} value={ratio} onChange={(e) => setRatio(Number(e.target.value))}>
                  {TYPE_RATIOS.map((row) => (
                    <option key={row.id} value={row.ratio}>{row.label}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </Card>
        <div className={styles.resultCol}>
          {tab === 'clamp' ? (
            <ResultCard
              label="clamp()"
              value={clamp.cssPx}
              gradient="linear-gradient(160deg,#0369a1 0%,#164e63 55%,#1c1917 100%)"
              stats={[['rem', clamp.cssRem], ['slope', fmtNum(clamp.slope, 5)]]}
            />
          ) : (
            <Card className="divide-y divide-zinc-200 p-0 text-sm dark:divide-zinc-800">
              {scale.map((row) => (
                <div key={row.step} className="flex justify-between px-5 py-3">
                  <span>step {row.step}</span>
                  <span className="font-mono">{row.px}px / {row.rem}rem</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
