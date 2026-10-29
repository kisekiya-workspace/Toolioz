'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { doyle, internationalQuarter, lumberBoardFeet, scribner } from '@/lib/makers/board-feet';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function BoardFeetClient() {
  const [t, setT] = useState(2);
  const [w, setW] = useState(8);
  const [len, setLen] = useState(10);
  const [n, setN] = useState(1);
  const [d, setD] = useState(16);
  const lumber = useMemo(() => lumberBoardFeet(t, w, len, n), [t, w, len, n]);
  const logs = useMemo(
    () => ({ doyle: doyle(d, len), scribner: scribner(d, len), intl: internationalQuarter(d, len) }),
    [d, len],
  );

  return (
    <ToolPageShell
      title="Board Feet Calculator for Lumber and Logs"
      subtitle="Lumber board feet are thickness × width × length(ft) / 12. Log scales: Doyle ((D−4)² × L) / 16, Scribner (0.79D² − 2D − 4) × L / 16, International ¼″ in 4-foot sections with a ½″ taper. Doyle undercounts small logs."
      directAnswerTitle="How many board feet is a 2×8×10?"
      directAnswer="(2 × 8 × 10) / 12 = 13.33 board feet. A 16 in × 10 ft log is about 90 bf Doyle, 104 bf Scribner, and about 106 bf International ¼″ (two 4-foot sections plus a 2-foot remainder with ½ in taper)."
      takeaways={['Sawn lumber uses the /12 formula.', 'Log rules disagree on purpose; mills pick one.', 'International ¼″ steps down diameter 0.5 in per 4 ft.']}
      categoryName="Home"
      seoTitle="Board feet lumber and logs"
      seoDescription="Board foot is 144 in³. Dimensional lumber ignores kerf. Log rules estimate sawn yield from diameter at the small end."
      howToUse={['Enter T, W, L, pieces for lumber.', 'Enter small-end diameter and length for logs.']}
      benefits={['Three log rules on one card.', 'Generic board-foot searches still get the sawn formula first.']}
      formula="bf = T×W×Lft / 12;  Doyle = (D−4)² L / 16"
      faqs={[
        { question: 'Why do log scales differ?', answer: 'Doyle subtracts a large slab; small logs look worse. International ¼″ is closer to sawn yield.' },
        { question: 'Is this square feet?', answer: 'No. Board feet include thickness.' },
      ]}
      accuracyNote="Doyle, Scribner, and International ¼″ are different mill rules, not three measurements of the same log. Kerf and drying shrink are omitted."
      currentToolId="board-feet"
      relatedIds={['miter-angle', 'wallpaper-calculator', 'aquarium-volume']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Home calculators', url: '/home' },
        { name: 'Board feet calculator', url: '/home/board-feet-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Thickness (in)" type="number" value={t} onChange={(e) => setT(Number(e.target.value) || 0)} />
            <Input label="Width (in)" type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} />
            <Input label="Length (ft)" type="number" value={len} onChange={(e) => setLen(Number(e.target.value) || 0)} />
            <Input label="Pieces" type="number" value={n} onChange={(e) => setN(Number(e.target.value) || 0)} />
            <Input label="Log small-end diameter (in)" type="number" value={d} onChange={(e) => setD(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <ResultCard
          label="Sawn lumber"
          value={`${fmtNum(lumber, 2)} bf`}
          gradient="linear-gradient(160deg,#3f6212 0%,#1a2e05 55%,#1c1917 100%)"
          stats={[
            ['Doyle', `${fmtNum(logs.doyle, 1)} bf`],
            ['Scribner', `${fmtNum(logs.scribner, 1)} bf`],
            ['International ¼″', `${fmtNum(logs.intl, 1)} bf`],
          ]}
        />
      </div>
    </ToolPageShell>
  );
}
