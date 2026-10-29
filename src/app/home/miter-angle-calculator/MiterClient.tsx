'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { compoundMiter, frameMiter, polygonMiter } from '@/lib/makers/miter';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function MiterClient() {
  const [sides, setSides] = useState(8);
  const [corner, setCorner] = useState(90);
  const [spring, setSpring] = useState(38);
  const poly = useMemo(() => polygonMiter(sides), [sides]);
  const frame = useMemo(() => frameMiter(corner), [corner]);
  const compound = useMemo(() => compoundMiter({ wallAngle: corner, springAngle: spring }), [corner, spring]);

  return (
    <ToolPageShell
      title="Miter Angle Calculator"
      subtitle="A miter angle calculator for regular polygons uses 180°/n as the saw angle from square. Picture frames are half the corner. Compound crown uses miter = atan(sin(spring)×tan(corner/2)) and bevel = asin(cos(spring)×sin(corner/2))."
      directAnswerTitle="What miter is an octagon?"
      directAnswer="Eight sides: 180/8 = 22.5° miter. Interior angle is 135°. A 90° frame is a 45° miter. Crown at 38° spring into a 90° corner is about 31.6° miter and 33.9° bevel."
      takeaways={['Polygon miter is 180/n.', 'Frames: half the corner.', 'Compound needs spring angle from the wall.']}
      categoryName="Home"
      seoTitle="Miter and compound miter"
      seoDescription="Saw gauges read from square. Confirm whether a particular saw labels miter as from square or from the fence. Spring angle is the crown’s lean off the wall."
      howToUse={['Enter polygon sides.', 'Enter frame corner.', 'For crown, add spring angle.']}
      benefits={['Octagon 22.5° is the default worked example.', 'Bevel is listed for compound cuts.']}
      formula="polygon miter = 180 / n"
      faqs={[
        { question: 'What angle is a hexagon miter?', answer: '180/6 = 30°.' },
        { question: 'Does this replace a crown chart?', answer: 'It implements the common trig identities. Test on scrap; saw scales differ.' },
      ]}
      accuracyNote="Compound crown numbers use spring angle from the wall. A saw’s bevel/miter scale and a nested vs flat cut can read the complement of these angles."
      currentToolId="miter-angle"
      relatedIds={['board-feet', 'wallpaper-calculator', 'aquarium-volume']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Home calculators', url: '/home' },
        { name: 'Miter angle calculator', url: '/home/miter-angle-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Polygon sides" type="number" min={3} max={24} value={sides} onChange={(e) => setSides(Number(e.target.value) || 0)} />
            <Input label="Corner angle (°)" type="number" value={corner} onChange={(e) => setCorner(Number(e.target.value) || 0)} />
            <Input label="Crown spring (°)" type="number" value={spring} onChange={(e) => setSpring(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <ResultCard
          label={`${poly.sides}-gon miter`}
          value={`${fmtNum(poly.miter, 2)}°`}
          gradient="linear-gradient(160deg,#9a3412 0%,#7c2d12 55%,#1c1917 100%)"
          stats={[
            ['Interior', `${fmtNum(poly.interior, 2)}°`],
            ['Frame miter', `${fmtNum(frame.miter, 2)}°`],
            ['Compound miter', `${fmtNum(compound.miter, 2)}°`],
            ['Compound bevel', `${fmtNum(compound.bevel, 2)}°`],
          ]}
        />
      </div>
    </ToolPageShell>
  );
}
