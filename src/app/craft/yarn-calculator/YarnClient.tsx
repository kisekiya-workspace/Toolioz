'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import {
  estimateYarn,
  PROJECT_PRESETS,
  YARN_WEIGHTS,
  type YarnProject,
  type YarnWeight,
} from '@/lib/makers/yarn';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function YarnClient() {
  const [project, setProject] = useState<YarnProject>('blanket');
  const [widthIn, setWidthIn] = useState(50);
  const [lengthIn, setLengthIn] = useState(60);
  const [weight, setWeight] = useState<YarnWeight>('worsted');
  const [yardsPer100g, setYardsPer100g] = useState(YARN_WEIGHTS.worsted.defaultYdsPer100g);
  const [extra, setExtra] = useState(10);

  const result = useMemo(
    () => estimateYarn({ widthIn, lengthIn, weight, yardsPer100g, extraPercent: extra }),
    [widthIn, lengthIn, weight, yardsPer100g, extra],
  );

  return (
    <ToolPageShell
      title="Yarn Calculator for Blanket, Scarf, or Hat"
      subtitle="A yarn calculator for a blanket multiplies finished area by a typical grams-per-square-inch for the yarn weight, then converts to yards using the ball-band yardage. The figure is an estimate for stockinette or single crochet, not a promise from a specific skein dye lot."
      directAnswerTitle="How much yarn does a blanket need?"
      directAnswer="A 50×60 in throw in worsted yarn is about 450 g, or 900 yards at 200 yards per 100 g, plus a 10% buffer. Lighter yarn uses more yards for the same area; bulky yarn uses fewer yards and more grams."
      takeaways={[
        'Area in square inches times a density factor gives grams.',
        'Yards come from the ball band, not from a universal constant.',
        'Add 10% extra for swatches, tails, and a mismatched dye lot.',
        'Openwork or brioche can miss this estimate by a wide margin.',
      ]}
      categoryName="Craft"
      seoTitle="Yarn calculator for blanket math"
      seoDescription="Yardage is estimated from fabric area and yarn-weight density, then scaled by the printed yards per 100 g. A scarf and a hat use the same formula with smaller rectangles. Highly textured stitches need a larger buffer or a weighed swatch."
      howToUse={[
        'Pick blanket, scarf, hat, or custom dimensions.',
        'Choose yarn weight and paste yards per 100 g from the label.',
        'Set extra percent for swatching.',
        'Buy at least the listed 100 g skein count.',
      ]}
      benefits={[
        'Blanket, scarf, and hat presets save measuring a schematic.',
        'Grams and yards are shown together so a 50 g mini-skein still counts.',
        'The density table is documented, not hidden in a black box.',
        'Inches convert to centimetres on the result card.',
      ]}
      formula="grams = width × length × gramsPerSqIn × (1 + extra%);  yards = grams / 100 × yardsPer100g"
      faqs={[
        {
          question: 'How does a yarn calculator for a blanket estimate yardage?',
          answer:
            'It treats the blanket as a rectangle, multiplies area by a typical grams-per-square-inch for that yarn weight, then converts grams to yards with the ball-band figure.',
        },
        {
          question: 'Is worsted the same as aran?',
          answer:
            'This page groups them. Aran is often a bit heavier. If the label lists a different yards per 100 g, that number overrides the default.',
        },
        {
          question: 'Does crochet use more yarn than knitting?',
          answer:
            'Often yes for the same area. Increase extra percent or weigh a 4 in crochet swatch and scale area from that mass instead of the table.',
        },
        {
          question: 'Can leftover yarn from a partial skein be entered?',
          answer:
            'Enter remaining grams on a kitchen scale after the project. This page does not track stash inventory.',
        },
      ]}
      accuracyNote="Grams per square inch are typical stockinette or single-crochet densities, not a ball-band guarantee. Weigh a swatch when the stitch is lace, cables, or a thick fabric."
      currentToolId="yarn-calculator"
      relatedIds={['knitting-gauge', 'crochet-gauge', 'needle-size-converter', 'quilt-size', 'cross-stitch-fabric']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Craft calculators', url: '/craft' },
        { name: 'Yarn calculator', url: '/craft/yarn-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PROJECT_PRESETS) as YarnProject[]).map((id) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={project === id ? 'default' : 'outline'}
                  onClick={() => {
                    setProject(id);
                    setWidthIn(PROJECT_PRESETS[id].widthIn);
                    setLengthIn(PROJECT_PRESETS[id].lengthIn);
                  }}
                >
                  {PROJECT_PRESETS[id].label}
                </Button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Width (in)" type="number" min={1} value={widthIn} onChange={(e) => setWidthIn(Number(e.target.value) || 0)} />
              <Input label="Length (in)" type="number" min={1} value={lengthIn} onChange={(e) => setLengthIn(Number(e.target.value) || 0)} />
            </div>
            <label className={styles.label} htmlFor="yarn-weight">Yarn weight</label>
            <select
              id="yarn-weight"
              className={styles.select}
              value={weight}
              onChange={(e) => {
                const next = e.target.value as YarnWeight;
                setWeight(next);
                setYardsPer100g(YARN_WEIGHTS[next].defaultYdsPer100g);
              }}
            >
              {(Object.keys(YARN_WEIGHTS) as YarnWeight[]).map((id) => (
                <option key={id} value={id}>{YARN_WEIGHTS[id].label}</option>
              ))}
            </select>
            <Input label="Yards per 100 g" type="number" min={20} value={yardsPer100g} onChange={(e) => setYardsPer100g(Number(e.target.value) || 0)} />
            <Input label="Extra %" type="number" min={0} max={50} value={extra} onChange={(e) => setExtra(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Yarn needed"
            value={`${fmtNum(result.yards, 0)} yd`}
            gradient="linear-gradient(160deg,#a21caf 0%,#6b21a8 50%,#1c1917 100%)"
            stats={[
              ['Grams', `${fmtNum(result.grams, 0)} g`],
              ['Ounces', `${fmtNum(result.ounces, 1)} oz`],
              ['100 g skeins', fmtNum(result.skeins100g, 2)],
              ['Metres', `${fmtNum(result.meters, 0)} m`],
            ]}
          />
          <p className="text-xs text-zinc-500">
            Example: 50×60 in = 3,000 in². Worsted at 0.15 g/in² is 450 g before extra. At 200 yd/100 g that is 900 yards; 10% extra is 990 yards, or 5.0 skeins of 100 g.
          </p>
        </div>
      </div>
    </ToolPageShell>
  );
}
