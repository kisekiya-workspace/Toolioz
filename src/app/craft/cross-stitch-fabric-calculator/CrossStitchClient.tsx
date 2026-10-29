'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { calculateCrossStitchFabric } from '@/lib/makers/cross-stitch';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function CrossStitchClient() {
  const [stitchesX, setStitchesX] = useState(140);
  const [stitchesY, setStitchesY] = useState(180);
  const [count, setCount] = useState(14);
  const [over, setOver] = useState<1 | 2>(1);
  const [marginIn, setMarginIn] = useState(3);
  const result = useMemo(
    () => calculateCrossStitchFabric({ stitchesX, stitchesY, count, over, marginIn }),
    [stitchesX, stitchesY, count, over, marginIn],
  );

  return (
    <ToolPageShell
      title="Cross Stitch Fabric Calculator"
      subtitle="A cross stitch fabric calculator divides design stitches by fabric count, then adds a framing margin. Aida 14 over 1 is 14 stitches per inch. Evenweave stitched over 2 on 28-count is the same 14 stitches per inch."
      directAnswerTitle="How large is Aida 14 for a 140 × 180 stitch design?"
      directAnswer="On 14-count Aida over 1, 140 stitches are 10.00 in (25.4 cm) wide and 180 stitches are 12.86 in (32.7 cm) tall. A 3 in margin on each side makes a cut piece 16.00 × 18.86 in."
      takeaways={[
        'Stitches per inch equal fabric count divided by over 1 or over 2.',
        'Cut size adds twice the margin to each design edge.',
        '28-count evenweave over 2 matches 14-count Aida.',
        'Fat-quarter shops still need these inches; the calculator does not stock fabric.',
      ]}
      categoryName="Craft"
      seoTitle="Cross stitch fabric size math"
      seoDescription="Fabric count is holes per inch. Over 1 uses every hole; over 2 skips a hole and halves the stitch density. UK centimetres are inches times 2.54. Extra fabric for a hoop or frame is a margin, not part of the design."
      howToUse={[
        'Enter the pattern’s stitch width and height.',
        'Set fabric count and over 1 or over 2.',
        'Add a margin in inches for framing or a hoop.',
        'Cut at the listed size, or round up to the next centimetre.',
      ]}
      benefits={[
        'Inches and centimetres print together for mixed UK and US patterns.',
        'Over 2 is a single toggle, not a second count field.',
        'A 3 in margin is a common hoop default and can be changed.',
      ]}
      formula="designIn = stitches / (count / over);  cutIn = designIn + 2 × margin"
      faqs={[
        {
          question: 'How does a cross stitch fabric calculator size Aida?',
          answer:
            'Design inches equal stitch count divided by fabric count for over-1 work. Over 2 uses count/2 as stitches per inch.',
        },
        {
          question: 'Is 16-count smaller than 14-count?',
          answer:
            'Yes. The same 140 stitches occupy 140/16 = 8.75 in on 16-count versus 10 in on 14-count.',
        },
        {
          question: 'Does linen count the same as evenweave?',
          answer:
            'Linen count is also threads per inch. Over-2 linen on 32-count is 16 stitches per inch. Slubs can shift a hole; this page assumes an even grid.',
        },
      ]}
      currentToolId="cross-stitch-fabric"
      relatedIds={['pixel-art-from-image', 'drawing-grid', 'knitting-gauge', 'quilt-size', 'yarn-calculator']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Craft calculators', url: '/craft' },
        { name: 'Cross stitch fabric calculator', url: '/craft/cross-stitch-fabric-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Stitches wide" type="number" min={1} value={stitchesX} onChange={(e) => setStitchesX(Number(e.target.value) || 0)} />
              <Input label="Stitches tall" type="number" min={1} value={stitchesY} onChange={(e) => setStitchesY(Number(e.target.value) || 0)} />
              <Input label="Fabric count" type="number" min={6} max={40} value={count} onChange={(e) => setCount(Number(e.target.value) || 0)} />
              <Input label="Margin (in) each side" type="number" min={0} step={0.5} value={marginIn} onChange={(e) => setMarginIn(Number(e.target.value) || 0)} />
            </div>
            <div className="flex gap-2">
              {([1, 2] as const).map((n) => (
                <Button key={n} type="button" size="sm" variant={over === n ? 'default' : 'outline'} onClick={() => setOver(n)}>
                  Over {n}
                </Button>
              ))}
            </div>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Design size"
            value={`${fmtNum(result.designWidthIn, 2)} × ${fmtNum(result.designHeightIn, 2)} in`}
            gradient="linear-gradient(160deg,#c2410c 0%,#7c2d12 50%,#1c1917 100%)"
            stats={[
              ['Design (cm)', `${fmtNum(result.designWidthCm, 1)} × ${fmtNum(result.designHeightCm, 1)}`],
              ['Cut (in)', `${fmtNum(result.cutWidthIn, 2)} × ${fmtNum(result.cutHeightIn, 2)}`],
              ['Cut (cm)', `${fmtNum(result.cutWidthCm, 1)} × ${fmtNum(result.cutHeightCm, 1)}`],
              ['Stitches / in', fmtNum(result.spi, 2)],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
