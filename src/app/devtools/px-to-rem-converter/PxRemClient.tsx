'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { conversionTable, pxToRem, remToPx } from '@/lib/makers/px-rem';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function PxRemClient() {
  const [root, setRoot] = useState(16);
  const [px, setPx] = useState(24);
  const [rem, setRem] = useState(1.5);
  const table = useMemo(() => conversionTable(root), [root]);

  return (
    <ToolPageShell
      title="PX to REM Converter"
      subtitle="A px to rem converter divides pixels by the root font size. The default root is 16 px. em uses the same division when the parent is the root. A table of common spacing values sits beside the fields."
      directAnswerTitle="How many rem is 24 px at a 16 px root?"
      directAnswer="24 / 16 = 1.5 rem. 1 rem is 16 px. Changing the root to 10 px makes 24 px equal 2.4 rem. The table lists 1–96 px at the typed root."
      takeaways={['rem = px / root.', 'em equals rem only when the parent font-size is the root.', 'html { font-size: 62.5% } is a 10 px root.']}
      categoryName="DevTools"
      relatedCategoryId="devtools"
      seoTitle="PX REM conversion table"
      seoDescription="CSS rem units are pixels divided by the document root font size. This page does not convert viewport units; those belong on the clamp generator."
      howToUse={['Set root px.', 'Enter px or rem.', 'Scan the table for spacing tokens.']}
      benefits={['Custom root covers 10 px and 18 px design systems.', 'Table is copyable common sizes.']}
      formula="rem = px / rootFontSize"
      faqs={[
        { question: 'Is 16 px always 1 rem?', answer: 'Only if the root is 16 px, the browser default.' },
        { question: 'Does this convert em?', answer: 'The em column assumes the parent is the root. Nested em compounds and is not modelled.' },
      ]}
      currentToolId="px-to-rem"
      relatedIds={['css-clamp', 'tailwind-color', 'unit-converter']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Developer tools', url: '/devtools' },
        { name: 'PX to REM converter', url: '/devtools/px-to-rem-converter' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Root font size (px)" type="number" value={root} onChange={(e) => setRoot(Number(e.target.value) || 0)} />
            <Input label="Pixels" type="number" value={px} onChange={(e) => setPx(Number(e.target.value) || 0)} />
            <Input label="Rem" type="number" step={0.125} value={rem} onChange={(e) => setRem(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label={`${px} px`}
            value={`${fmtNum(pxToRem(px, root), 4)} rem`}
            gradient="linear-gradient(160deg,#0e7490 0%,#155e75 55%,#1c1917 100%)"
            stats={[[`${rem} rem`, `${fmtNum(remToPx(rem, root), 2)} px`]]}
          />
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 text-xs dark:border-zinc-800">
            <table className="min-w-full">
              <thead><tr><th className="px-3 py-2 text-left">px</th><th className="px-3 py-2 text-left">rem</th></tr></thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.px}><td className="px-3 py-1 font-mono">{row.px}</td><td className="px-3 py-1 font-mono">{row.rem}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
