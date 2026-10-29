'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { calculateGauge, GAUGE_DEFAULTS, type CraftKind } from '@/lib/makers/craft-gauge';
import { fmtNum, roundTo } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const COPY: Record<CraftKind, {
  title: string;
  other: { href: string; label: string };
  keyword: string;
}> = {
  knitting: {
    title: 'Knitting Gauge Calculator',
    other: { href: '/craft/crochet-gauge-calculator', label: 'Crochet gauge calculator' },
    keyword: 'knitting gauge calculator',
  },
  crochet: {
    title: 'Crochet Gauge Calculator',
    other: { href: '/craft/knitting-gauge-calculator', label: 'Knitting gauge calculator' },
    keyword: 'crochet gauge calculator',
  },
};

export default function GaugeClient({ craft }: { craft: CraftKind }) {
  const copy = COPY[craft];
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [swatchStitches, setSwatchStitches] = useState(GAUGE_DEFAULTS.swatchStitches);
  const [swatchRows, setSwatchRows] = useState(GAUGE_DEFAULTS.swatchRows);
  const [swatchWidth, setSwatchWidth] = useState(4);
  const [swatchHeight, setSwatchHeight] = useState(4);
  const [targetWidth, setTargetWidth] = useState(20);
  const [targetHeight, setTargetHeight] = useState(24);
  const [patternStitches, setPatternStitches] = useState(20);
  const [patternRows, setPatternRows] = useState(28);
  const [patternWidth, setPatternWidth] = useState(4);
  const [patternHeight, setPatternHeight] = useState(4);

  const result = useMemo(
    () =>
      calculateGauge({
        swatchStitches,
        swatchRows,
        swatchWidth,
        swatchHeight,
        targetWidth,
        targetHeight,
        patternStitches,
        patternRows,
        patternWidth,
        patternHeight,
      }),
    [swatchStitches, swatchRows, swatchWidth, swatchHeight, targetWidth, targetHeight, patternStitches, patternRows, patternWidth, patternHeight],
  );

  const unitLabel = unit === 'in' ? 'in' : 'cm';

  return (
    <ToolPageShell
      title={copy.title}
      subtitle={`A ${copy.keyword} turns stitches and rows counted on a blocked swatch into stitches per ${unitLabel} and a cast-on for a target width. The same ratio adjusts a pattern written for a different gauge.`}
      directAnswerTitle={`How does a ${copy.keyword} work?`}
      directAnswer={`Stitches per unit equal swatch stitches divided by swatch width. Cast-on stitches equal that rate times the finished width. If the swatch is tighter than the pattern gauge, the garment comes out smaller unless stitch counts are multiplied by the stitch factor.`}
      takeaways={[
        'Count stitches over the same width the pattern used, usually 4 in or 10 cm.',
        'Wash and block the swatch before measuring.',
        'A higher stitch count than the pattern means a smaller finished piece at the same cast-on.',
        `${copy.other.label} uses the same arithmetic on a different stitch structure.`,
      ]}
      categoryName="Craft"
      seoTitle={`${copy.title} math`}
      seoDescription="Gauge is a linear density: stitches divided by measured width. Row gauge is independent and is used for length, not circumference. Changing needle size changes gauge; this page does not pick a needle for a yarn."
      howToUse={[
        `Knit or crochet a swatch larger than the measurement window, then block it.`,
        `Count stitches and rows across a known width and height.`,
        `Enter the finished width, or enter the pattern gauge to see an adjustment factor.`,
        `Cast on the listed stitch count, then re-check after a few centimetres.`,
      ]}
      benefits={[
        'Inches and centimetres use the same ratio, so the unit only has to stay consistent.',
        'Pattern adjustment is a simple factor, not a restitch of the chart.',
        'Worked numbers sit beside the inputs so a hand check is possible.',
        'Related yarn and needle tools stay in the craft cluster.',
      ]}
      formula="stitches = (swatchStitches / swatchWidth) × targetWidth;  factor = yourStitchesPerUnit / patternStitchesPerUnit"
      faqs={[
        {
          question: `What gauge should a ${copy.keyword} use?`,
          answer:
            'Use the blocked swatch, not the ball-band number. Count over 4 inches or 10 cm, matching the pattern’s window, and include half-stitches if the edge lands between columns.',
        },
        {
          question: 'How is a knitting gauge converter different from a needle size chart?',
          answer:
            'Gauge is fabric density. Needle size is a millimetre label. The two are related in practice but this page only converts counted stitches. Needle millimetres, US, UK, and Japan live on the needle size converter.',
        },
        {
          question: 'Does row gauge affect cast-on?',
          answer:
            'No. Cast-on uses stitch gauge and width. Row gauge sets how many rows reach a length, or how much the work should be stretched when blocking to length.',
        },
        {
          question: 'Can this page replace a pattern’s schematic?',
          answer:
            'It sizes stitch counts. Ease, set-in sleeves, and lace repeats still follow the pattern. If a repeat must stay whole, round the adjusted count to the nearest repeat.',
        },
      ]}
      accuracyNote="Switching inches and centimetres now converts the typed widths so the same physical swatch is kept. Ease, repeats, and blocking still sit outside this ratio."
      currentToolId={craft === 'knitting' ? 'knitting-gauge' : 'crochet-gauge'}
      relatedIds={
        craft === 'knitting'
          ? ['crochet-gauge', 'yarn-calculator', 'needle-size-converter', 'cross-stitch-fabric', 'quilt-size']
          : ['knitting-gauge', 'yarn-calculator', 'needle-size-converter', 'cross-stitch-fabric', 'quilt-size']
      }
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Craft calculators', url: '/craft' },
        { name: copy.title, url: craft === 'knitting' ? '/craft/knitting-gauge-calculator' : '/craft/crochet-gauge-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {(['in', 'cm'] as const).map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={unit === item ? 'default' : 'outline'}
                  onClick={() => {
                    if (item === unit) return;
                    const factor = item === 'cm' ? 2.54 : 1 / 2.54;
                    setSwatchWidth(roundTo(swatchWidth * factor, 2));
                    setSwatchHeight(roundTo(swatchHeight * factor, 2));
                    setTargetWidth(roundTo(targetWidth * factor, 2));
                    setTargetHeight(roundTo(targetHeight * factor, 2));
                    setPatternWidth(roundTo(patternWidth * factor, 2));
                    setPatternHeight(roundTo(patternHeight * factor, 2));
                    setUnit(item);
                  }}
                >
                  {item === 'in' ? 'Inches' : 'Centimetres'}
                </Button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">Swatch</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Stitches counted" type="number" min={1} value={swatchStitches} onChange={(e) => setSwatchStitches(Number(e.target.value) || 0)} />
              <Input label="Rows counted" type="number" min={1} value={swatchRows} onChange={(e) => setSwatchRows(Number(e.target.value) || 0)} />
              <Input label={`Width (${unitLabel})`} type="number" min={0.25} step={0.25} value={swatchWidth} onChange={(e) => setSwatchWidth(Number(e.target.value) || 0)} />
              <Input label={`Height (${unitLabel})`} type="number" min={0.25} step={0.25} value={swatchHeight} onChange={(e) => setSwatchHeight(Number(e.target.value) || 0)} />
            </div>
            <p className="text-xs text-zinc-500">Finished piece</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label={`Target width (${unitLabel})`} type="number" min={0.25} value={targetWidth} onChange={(e) => setTargetWidth(Number(e.target.value) || 0)} />
              <Input label={`Target length (${unitLabel})`} type="number" min={0.25} value={targetHeight} onChange={(e) => setTargetHeight(Number(e.target.value) || 0)} />
            </div>
            <p className="text-xs text-zinc-500">Pattern gauge (optional)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Pattern stitches" type="number" min={1} value={patternStitches} onChange={(e) => setPatternStitches(Number(e.target.value) || 0)} />
              <Input label="Pattern rows" type="number" min={1} value={patternRows} onChange={(e) => setPatternRows(Number(e.target.value) || 0)} />
              <Input label={`Pattern width (${unitLabel})`} type="number" min={0.25} value={patternWidth} onChange={(e) => setPatternWidth(Number(e.target.value) || 0)} />
              <Input label={`Pattern height (${unitLabel})`} type="number" min={0.25} value={patternHeight} onChange={(e) => setPatternHeight(Number(e.target.value) || 0)} />
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              Needle millimetres follow the{' '}
              <a href="https://www.craftyarncouncil.com/standards/knitting-needle-sizes" target="_blank" rel="noreferrer" className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">
                Craft Yarn Council needle chart
              </a>
              . Open the {copy.other.label.toLowerCase()} for the other craft.
            </p>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Cast-on stitches"
            value={fmtNum(result.targetStitches, 0)}
            gradient="linear-gradient(160deg,#be185d 0%,#831843 50%,#1c1917 100%)"
            stats={[
              ['Rows for length', fmtNum(result.targetRows, 0)],
              [`Stitches per ${unitLabel}`, fmtNum(result.stitchesPerUnit, 2)],
              [`Rows per ${unitLabel}`, fmtNum(result.rowsPerUnit, 2)],
            ]}
          />
          <Card className="divide-y divide-zinc-200 p-0 text-sm dark:divide-zinc-800">
            {[
              ['Stitch factor vs pattern', fmtNum(result.stitchFactor, 3)],
              ['Adjusted pattern stitches', fmtNum(result.adjustedPatternStitches, 0)],
              ['Adjusted pattern rows', fmtNum(result.adjustedPatternRows, 0)],
              ['Width change if unadjusted', `${fmtNum(result.sizeChangePercent, 1)}%`],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between px-5 py-3">
                <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                <span className="font-mono font-semibold">{value}</span>
              </div>
            ))}
          </Card>
          <p className="text-xs text-zinc-500">
            Example: 22 stitches in 4 in is 5.5 stitches per inch. A 20 in sweater front is 110 stitches. If the pattern was 20 stitches in 4 in, the factor is 22/20 = 1.1.
          </p>
        </div>
      </div>
    </ToolPageShell>
  );
}
