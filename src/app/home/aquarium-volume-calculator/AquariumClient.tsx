'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { AQUARIUM_SHAPES, aquariumLitres, substrateLitres, type AquariumSlug } from '@/lib/makers/aquarium';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const HREFS: Record<AquariumSlug, string> = {
  rectangular: '/home/aquarium-volume-calculator',
  bowfront: '/home/aquarium-bowfront-calculator',
  cylinder: '/home/aquarium-cylinder-calculator',
  hexagon: '/home/aquarium-hexagon-calculator',
  corner: '/home/aquarium-corner-calculator',
};

export default function AquariumClient({ shape }: { shape: AquariumSlug }) {
  const meta = AQUARIUM_SHAPES.find((row) => row.slug === shape) ?? AQUARIUM_SHAPES[0];
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [length, setLength] = useState(90);
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(45);
  const [bulge, setBulge] = useState(10);
  const [subDepth, setSubDepth] = useState(6);
  const volume = useMemo(
    () => aquariumLitres({ shape, length, width, height, bulge, unit }),
    [shape, length, width, height, bulge, unit],
  );
  const substrate = useMemo(
    () => substrateLitres(length, width, subDepth, unit, shape),
    [length, width, subDepth, unit, shape],
  );

  return (
    <ToolPageShell
      title={`${meta.label} Aquarium Volume Calculator`}
      subtitle={`An aquarium volume calculator for a ${meta.label.toLowerCase()} tank converts inner length, width, and water height to litres, US gallons, and UK gallons. Substrate litres use the footprint times gravel depth. Glass thickness is not subtracted; measure inside.`}
      directAnswerTitle={`How many litres is a ${meta.label.toLowerCase()} aquarium?`}
      directAnswer={
        shape === 'bowfront'
          ? 'A bowfront adds an elliptical cap: extra ≈ (π × length × bulge × height) / 4 on top of the rectangular box. A 90 × 45 × 45 cm box with a 10 cm bulge is about 214 L before substrate.'
          : shape === 'cylinder'
            ? 'Cylinder litres are π r² h / 1000 with length as diameter. A 50 cm diameter × 60 cm high cylinder is about 118 L.'
            : shape === 'hexagon'
              ? 'Regular hexagon volume uses (3√3/2) × (side/2 as apothem form via side length as the short diagonal stand-in on this page: (3√3/2)×(L/2)²×H. Measure point-to-point width as length.'
              : shape === 'corner'
                ? 'A corner tank is modelled as a right triangle prism: 0.5 × length × width × height. Two 60 cm legs and 50 cm height are about 90 L.'
                : 'A rectangular 90 × 45 × 45 cm tank is 182.3 L (48.2 US gal). Water weight is about 182 kg plus glass and stand.'
      }
      takeaways={[
        'Measure inside dimensions.',
        'US gallon = litre / 3.785; UK gallon = litre / 4.546.',
        'Substrate displaces water; fill height should be the water column.',
        'Bowfront, cylinder, hexagon, and corner each have their own URL.',
      ]}
      categoryName="Home"
      seoTitle={`${meta.label} aquarium litres`}
      seoDescription="Litres are cubic centimetres / 1000. Inches convert at 2.54. Substrate volume is footprint × depth. Livestock stocking rules are not computed; this is geometry only."
      howToUse={[
        'Choose centimetres or inches.',
        'Enter inner length, width, and water height.',
        'Set gravel depth for substrate litres.',
      ]}
      benefits={['UK and US gallons print together.', 'Shape-specific pages target bowfront and hex searches.']}
      formula={
        shape === 'rectangular'
          ? 'L × W × H / 1000 L'
          : shape === 'bowfront'
            ? 'LWH/1000 + π L bulge H / 4000'
            : shape === 'cylinder'
              ? 'π (d/2)² H / 1000'
              : shape === 'hexagon'
                ? '(3√3/2)×(L/2)²×H / 1000'
                : '0.5 × L × W × H / 1000'
      }
      faqs={[
        {
          question: 'Does an aquarium volume calculator use inner or outer glass?',
          answer: 'Inner. Outer millimetres include glass thickness and overstate water.',
        },
        {
          question: 'How much substrate does a 90 cm tank need?',
          answer: 'Footprint times depth. 90 × 45 × 6 cm is 24.3 L of gravel before compaction.',
        },
      ]}
      accuracyNote="Measure inside the glass. Hexagon length is point-to-point; a flat-to-flat measure will mis-size the tank. Bowfront extra is an ellipse, not the real curve."
      currentToolId="aquarium-volume"
      relatedIds={['board-feet', 'wallpaper-calculator', 'miter-angle']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Home calculators', url: '/home' },
        { name: `${meta.label} aquarium volume`, url: HREFS[shape] },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {AQUARIUM_SHAPES.map((row) => (
                <Button key={row.slug} asChild size="sm" variant={shape === row.slug ? 'default' : 'outline'}>
                  <Link href={HREFS[row.slug]}>{row.label}</Link>
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['cm', 'in'] as const).map((u) => (
                <Button key={u} type="button" size="sm" variant={unit === u ? 'default' : 'outline'} onClick={() => setUnit(u)}>{u}</Button>
              ))}
            </div>
            <Input label={shape === 'cylinder' ? `Diameter (${unit})` : `Length (${unit})`} type="number" value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
            {shape !== 'cylinder' && shape !== 'hexagon' ? (
              <Input label={`Width (${unit})`} type="number" value={width} onChange={(e) => setWidth(Number(e.target.value) || 0)} />
            ) : null}
            <Input label={`Water height (${unit})`} type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} />
            {shape === 'bowfront' ? (
              <Input label={`Centre bulge (${unit})`} type="number" value={bulge} onChange={(e) => setBulge(Number(e.target.value) || 0)} />
            ) : null}
            <Input label={`Substrate depth (${unit})`} type="number" value={subDepth} onChange={(e) => setSubDepth(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Water volume"
            value={`${fmtNum(volume.litres, 1)} L`}
            gradient="linear-gradient(160deg,#0369a1 0%,#164e63 55%,#1c1917 100%)"
            stats={[
              ['US gallons', fmtNum(volume.gallonsUS, 1)],
              ['UK gallons', fmtNum(volume.gallonsUK, 1)],
              ['Water mass', `${fmtNum(volume.kg, 1)} kg`],
              ['Substrate', `${fmtNum(substrate, 1)} L`],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
