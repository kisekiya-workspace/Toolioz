'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { FILAMENT_MATERIALS, filamentGramsFromLength, filamentLengthMeters, remainingOnSpool, type FilamentId } from '@/lib/makers/filament';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function FilamentClient() {
  const [material, setMaterial] = useState<FilamentId>('pla');
  const [diameter, setDiameter] = useState(1.75);
  const [grams, setGrams] = useState(1000);
  const [meters, setMeters] = useState(() => filamentLengthMeters(1000, 1.24, 1.75));
  const [spool, setSpool] = useState(1000);
  const [left, setLeft] = useState(250);
  const density = FILAMENT_MATERIALS.find((row) => row.id === material)?.density ?? 1.24;
  const lengthFromMass = useMemo(() => filamentLengthMeters(grams, density, diameter), [grams, density, diameter]);
  const massFromLength = useMemo(() => filamentGramsFromLength(meters, density, diameter), [meters, density, diameter]);
  const remaining = useMemo(
    () => remainingOnSpool({ spoolGrams: spool, remainingGrams: left, density, diameterMm: diameter }),
    [spool, left, density, diameter],
  );

  return (
    <ToolPageShell
      title="Filament Weight to Length Calculator"
      subtitle="A filament weight to length calculator divides mass by density to get volume, then divides by the circular cross-section of 1.75 mm or 2.85 mm filament. PLA at 1.24 g/cm³ gives about 335 m in a 1 kg spool of 1.75 mm."
      directAnswerTitle="How long is 1 kg of PLA filament?"
      directAnswer="One kilogram of 1.75 mm PLA at 1.24 g/cm³ is about 335 metres. PETG at 1.27 g/cm³ is a little shorter. ABS at 1.04 g/cm³ is longer. Diameter is squared in the area, so 2.85 mm filament is much shorter per kilogram."
      takeaways={[
        'Length in metres = (grams / density) / (π r²) with r in centimetres, then / 100.',
        '1.75 mm and 2.85 mm are the usual diameters; 3.00 mm is treated as 2.85 mm in some shops.',
        'Spool remaining uses the same density as the full spool.',
        'Foamed or carbon-filled filament can miss these densities.',
      ]}
      categoryName="Making"
      seoTitle="Filament weight to length math"
      seoDescription="Filament is a cylinder. Volume is mass over density. Cross-section is π times radius squared. Published densities for PLA, PETG, ABS, TPU, nylon, and ASA are used; a custom density is not required unless the spool lists one."
      howToUse={[
        'Pick a material and diameter.',
        'Enter grams to read metres, or metres to read grams.',
        'Enter spool size and remaining grams for leftover length.',
      ]}
      benefits={[
        '1 kg PLA 1.75 mm is the worked default so a search for “how long is 1kg of filament” has an answer on screen.',
        'Remaining length uses leftover mass, not a guess from spool diameter.',
        'No cloud slicer is required.',
      ]}
      formula="length_m = (mass_g / density) / (π × (diameter_mm / 20)²) / 100"
      faqs={[
        {
          question: 'How long is 1 kg of PLA?',
          answer: 'About 335 m at 1.75 mm and 1.24 g/cm³. 2.85 mm PLA is about 126 m per kilogram.',
        },
        {
          question: 'Does a cardboard spool change the mass?',
          answer: 'Weigh filament only, or tare the empty spool. This page does not subtract spool mass automatically.',
        },
        {
          question: 'Is 1.75 mm exactly 1.75?',
          answer: 'Tolerance is usually ±0.05 mm. A thicker strand is shorter per kilogram.',
        },
      ]}
      accuracyNote="Densities are published typical values. Foamed, carbon, or wood-fill spools, and ±0.05 mm diameter, change length."
      currentToolId="filament-weight"
      relatedIds={['print-cost', 'epoxy-resin', 'candle-wax']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Making calculators', url: '/maker' },
        { name: 'Filament weight to length', url: '/maker/filament-weight-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="fil-mat">Material</label>
            <select id="fil-mat" className={styles.select} value={material} onChange={(e) => setMaterial(e.target.value as FilamentId)}>
              {FILAMENT_MATERIALS.map((row) => (
                <option key={row.id} value={row.id}>{row.label} ({row.density} g/cm³)</option>
              ))}
            </select>
            <Input label="Diameter (mm)" type="number" min={0.5} step={0.05} value={diameter} onChange={(e) => setDiameter(Number(e.target.value) || 0)} />
            <Input label="Weight (g)" type="number" min={0} value={grams} onChange={(e) => setGrams(Number(e.target.value) || 0)} />
            <Input label="Length (m)" type="number" min={0} value={meters} onChange={(e) => setMeters(Number(e.target.value) || 0)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Full spool (g)" type="number" min={0} value={spool} onChange={(e) => setSpool(Number(e.target.value) || 0)} />
              <Input label="Remaining (g)" type="number" min={0} value={left} onChange={(e) => setLeft(Number(e.target.value) || 0)} />
            </div>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label={`${fmtNum(grams, 0)} g → length`}
            value={`${fmtNum(lengthFromMass, 1)} m`}
            gradient="linear-gradient(160deg,#0f766e 0%,#134e4a 55%,#1c1917 100%)"
            stats={[
              [`${fmtNum(meters, 0)} m → mass`, `${fmtNum(massFromLength, 0)} g`],
              ['Remaining', `${fmtNum(remaining.remainingMeters, 1)} m (${fmtNum(remaining.remainingPercent, 0)}%)`],
              ['Full spool length', `${fmtNum(remaining.fullMeters, 1)} m`],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
