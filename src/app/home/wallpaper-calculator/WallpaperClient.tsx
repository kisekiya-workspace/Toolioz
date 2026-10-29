'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { ROLL_PRESETS, wallpaperRolls } from '@/lib/makers/wallpaper';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function WallpaperClient() {
  const [preset, setPreset] = useState<(typeof ROLL_PRESETS)[number]['id']>('eu');
  const roll = ROLL_PRESETS.find((row) => row.id === preset) ?? ROLL_PRESETS[0];
  const [wallW, setWallW] = useState(5);
  const [wallH, setWallH] = useState(2.4);
  const [repeat, setRepeat] = useState(32);
  const [pattern, setPattern] = useState<'none' | 'straight' | 'half-drop'>('straight');
  const [waste, setWaste] = useState(10);
  const result = useMemo(
    () =>
      wallpaperRolls({
        wallWidthM: wallW,
        wallHeightM: wallH,
        rollLengthM: roll.lengthM,
        rollWidthM: roll.widthM,
        repeatCm: repeat,
        pattern,
        wastePercent: waste,
      }),
    [wallW, wallH, roll, repeat, pattern, waste],
  );

  return (
    <ToolPageShell
      title="Wallpaper Calculator with Pattern Repeat"
      subtitle="A wallpaper calculator with pattern repeat adds extra drop height for matching. Straight match adds one repeat. Half-drop adds half a repeat. Drops per roll are floor(roll length / drop height). Rolls are ceil(drops needed / drops per roll) with waste percent."
      directAnswerTitle="How many rolls with a 32 cm repeat?"
      directAnswer="A 5 m wide × 2.4 m high wall using a 10.05 m × 53 cm Euro roll at a 32 cm straight repeat needs 2.72 m drops. Three drops fit a roll. Ten drops cover the width, so four rolls before waste, five with 10% extra."
      takeaways={['UK, EU, and US roll presets.', 'Half-drop wastes less than straight on some designs.', 'Doors and windows are not subtracted.']}
      categoryName="Home"
      seoTitle="Wallpaper rolls with repeat"
      seoDescription="Pattern matching increases drop height, which can cut drops per roll. Measure the printed repeat on the selvage. Regional roll sizes are presets, not a store inventory."
      howToUse={['Pick a roll preset.', 'Enter wall width and height in metres.', 'Set repeat and match type.']}
      benefits={['cm repeat field matches UK labels.', 'Waste percent is explicit.']}
      formula="dropHeight = wallH + matchExtra; rolls = ceil(dropsNeeded / dropsPerRoll × (1+waste))"
      faqs={[
        { question: 'What is a half-drop match?', answer: 'Each next drop is shifted by half the repeat so the pattern nested. Extra height is repeat/2.' },
        { question: 'Are windows subtracted?', answer: 'No. Keep waste percent if openings are large, or measure only net wall.' },
      ]}
      accuracyNote="A drop is one strip of paper. Pattern waste is estimated as extra height per strip; windows, doors, and centering a large motif can change the roll count."
      currentToolId="wallpaper-calculator"
      relatedIds={['miter-angle', 'board-feet', 'aquarium-volume']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Home calculators', url: '/home' },
        { name: 'Wallpaper calculator', url: '/home/wallpaper-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <select className={styles.select} value={preset} onChange={(e) => setPreset(e.target.value as typeof preset)}>
              {ROLL_PRESETS.map((row) => (
                <option key={row.id} value={row.id}>{row.label}</option>
              ))}
            </select>
            <Input label="Wall width (m)" type="number" step={0.1} value={wallW} onChange={(e) => setWallW(Number(e.target.value) || 0)} />
            <Input label="Wall height (m)" type="number" step={0.05} value={wallH} onChange={(e) => setWallH(Number(e.target.value) || 0)} />
            <Input label="Pattern repeat (cm)" type="number" value={repeat} onChange={(e) => setRepeat(Number(e.target.value) || 0)} />
            <select className={styles.select} value={pattern} onChange={(e) => setPattern(e.target.value as typeof pattern)}>
              <option value="none">No match</option>
              <option value="straight">Straight match</option>
              <option value="half-drop">Half-drop</option>
            </select>
            <Input label="Waste %" type="number" value={waste} onChange={(e) => setWaste(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <ResultCard
          label="Rolls to buy"
          value={String(result.rolls)}
          gradient="linear-gradient(160deg,#6b21a8 0%,#3b0764 55%,#1c1917 100%)"
          stats={[
            ['Drops needed', String(result.dropsNeeded)],
            ['Drops per roll', String(result.dropsPerRoll)],
            ['Drop height', `${fmtNum(result.dropHeight, 2)} m`],
            ['Wall area', `${fmtNum(result.areaM2, 2)} m²`],
          ]}
        />
      </div>
    </ToolPageShell>
  );
}
