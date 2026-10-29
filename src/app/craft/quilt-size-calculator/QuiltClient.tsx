'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { BED_PRESETS, calculateQuilt } from '@/lib/makers/quilt';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function QuiltClient() {
  const [preset, setPreset] = useState<(typeof BED_PRESETS)[number]['id']>('queen');
  const bed = BED_PRESETS.find((row) => row.id === preset) ?? BED_PRESETS[3];
  const [blocksX, setBlocksX] = useState(8);
  const [blocksY, setBlocksY] = useState(9);
  const [blockIn, setBlockIn] = useState(6);
  const [sashingIn, setSashingIn] = useState(1);
  const [borderIn, setBorderIn] = useState(4);
  const [dropIn, setDropIn] = useState<number>(bed.drop);
  const result = useMemo(
    () =>
      calculateQuilt({
        blocksX,
        blocksY,
        blockIn,
        sashingIn,
        borderIn,
        dropIn,
        mattressW: bed.mattressW,
        mattressL: bed.mattressL,
      }),
    [blocksX, blocksY, blockIn, sashingIn, borderIn, dropIn, bed],
  );

  return (
    <ToolPageShell
      title="Quilt Size Calculator"
      subtitle="A quilt size calculator adds a block grid, sashing between blocks, and borders, then compares that rectangle to a mattress plus drop. Mattress numbers are common US sizes; drop is an estimate and should be measured on the actual bed."
      directAnswerTitle="How large is an 8×9 grid of 6 in blocks with 1 in sashing and a 4 in border?"
      directAnswer="Blocks and between-block sashing make a 55 × 62 in body (8×6 + 7×1 wide, 9×6 + 8×1 long). A 4 in border on each side finishes 63 × 70 in (160 × 178 cm). A queen mattress with a 12 in coverlet drop wants about 84 × 92 in, so this layout is a wall quilt, not a bedspread."
      takeaways={[
        'Sashing is between blocks (one fewer strip than the block count), not an extra outer frame.',
        'Drop hangs on both sides and the foot, not the pillow edge, in this model. The 12 in preset is a coverlet, not a floor-length bedspread.',
        'UK centimetres are listed next to inches.',
        'Mattress sizes here are US; a UK double is closer to US full. Twin is listed as 39 in; some makers use 38 in.',
      ]}
      categoryName="Craft"
      seoTitle="Quilt size calculator math"
      seoDescription="Finished width is blocks times block size plus (blocks − 1) times sashing plus twice the border. A bedspread target is mattress width plus two drops, and mattress length plus one drop. Crochet blanket charts can use the same rectangle without sashing by setting sashing to zero."
      howToUse={[
        'Pick a mattress preset or keep the drop at zero for a wall hanging.',
        'Enter blocks across and down, block size, sashing, and border.',
        'Compare finished size with the target bedspread.',
      ]}
      benefits={[
        'Sashing is only between blocks. Put a second outer frame in the border field.',
        'Negative width delta means the quilt is smaller than the bed drop target.',
        'Zero sashing models a block-to-block layout or a crochet blanket.',
      ]}
      formula="width = blocksX×block + (blocksX−1)×sashing + 2×border"
      faqs={[
        {
          question: 'Does a quilt size calculator include batting shrinkage?',
          answer: 'No. Quilt as desired, then expect a little draw-up. Add extra border if the batting is lofty.',
        },
        {
          question: 'What drop should a queen quilt use?',
          answer: 'Twelve inches is a common coverlet drop and can be wrong for a given frame. Measure from mattress top to the hang wanted on the sides and foot. A floor-length bedspread is often 16–21 in. This page does not add drop at the pillow edge.',
        },
        {
          question: 'Can this page size a crochet blanket?',
          answer: 'Yes. Set sashing to 0 and treat each motif as a block, or enter the finished motif size including join-as-you-go width.',
        },
      ]}
      accuracyNote="Bed drop is an estimate. Measure the real mattress and frame; the 12 in preset is a coverlet, not a floor-length drop, and the head/pillow edge has no drop in this model."
      currentToolId="quilt-size"
      relatedIds={['yarn-calculator', 'cross-stitch-fabric', 'knitting-gauge', 'crochet-gauge']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Craft calculators', url: '/craft' },
        { name: 'Quilt size calculator', url: '/craft/quilt-size-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {BED_PRESETS.map((row) => (
                <Button
                  key={row.id}
                  type="button"
                  size="sm"
                  variant={preset === row.id ? 'default' : 'outline'}
                  onClick={() => {
                    setPreset(row.id);
                    setDropIn(row.drop);
                  }}
                >
                  {row.label}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Blocks across" type="number" min={1} value={blocksX} onChange={(e) => setBlocksX(Number(e.target.value) || 0)} />
              <Input label="Blocks down" type="number" min={1} value={blocksY} onChange={(e) => setBlocksY(Number(e.target.value) || 0)} />
              <Input label="Block (in)" type="number" min={1} value={blockIn} onChange={(e) => setBlockIn(Number(e.target.value) || 0)} />
              <Input label="Sashing (in)" type="number" min={0} step={0.25} value={sashingIn} onChange={(e) => setSashingIn(Number(e.target.value) || 0)} />
              <Input label="Border (in)" type="number" min={0} value={borderIn} onChange={(e) => setBorderIn(Number(e.target.value) || 0)} />
              <Input label="Bed drop (in)" type="number" min={0} value={dropIn} onChange={(e) => setDropIn(Number(e.target.value) || 0)} />
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              Drop is added to both sides and the foot only. The 12 in preset is a coverlet estimate and can be wrong for a tall frame or a floor-length bedspread. Measure the bed. Outer sashing is not added; put extra width in the border field.
            </p>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Finished quilt"
            value={`${fmtNum(result.quiltW, 1)} × ${fmtNum(result.quiltL, 1)} in`}
            gradient="linear-gradient(160deg,#b45309 0%,#7c2d12 55%,#1c1917 100%)"
            stats={[
              ['Centimetres', `${fmtNum(result.quiltWcm, 1)} × ${fmtNum(result.quiltLcm, 1)}`],
              ['Target bedspread', `${fmtNum(result.targetW, 1)} × ${fmtNum(result.targetL, 1)} in`],
              ['Width vs target', `${fmtNum(result.widthDelta, 1)} in`],
              ['Length vs target', `${fmtNum(result.lengthDelta, 1)} in`],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
