'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import { convertPortal, NETHER_SEARCH, OVERWORLD_SEARCH, SCALE } from '@/lib/gaming/nether-portal';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const FAQS = [
  {
    question: 'How does a Minecraft nether portal calculator convert coordinates?',
    answer: `Overworld X and Z are divided by ${SCALE} with truncation toward zero. Nether X and Z are multiplied by ${SCALE}. Y is not scaled. Java Edition then searches ${NETHER_SEARCH} blocks in the Nether or ${OVERWORLD_SEARCH} blocks in the Overworld for an existing portal.`,
  },
  {
    question: 'Why did two nether portals link to the wrong place?',
    answer: `Java Edition reuses a portal if one already sits inside the search radius (${NETHER_SEARCH} in the Nether, ${OVERWORLD_SEARCH} in the Overworld). Building both ends at the converted pair, then lighting the destination first, keeps the link exact.`,
  },
  {
    question: 'Does Bedrock Edition use the same nether portal math?',
    answer:
      'The 8:1 X and Z scale is the same. Search ranges and portal creation rules differ slightly on Bedrock. This calculator reports Java Edition search radii.',
  },
  {
    question: 'Is Y divided for a nether portal?',
    answer:
      'No. Y is copied unchanged. A portal at Y 80 in the Overworld still prefers Y 80 in the Nether, which may be inside netherrack and needs a carved room.',
  },
];

export default function NetherPortalClient() {
  const [from, setFrom] = useState<'overworld' | 'nether'>('overworld');
  const [x, setX] = useState(800);
  const [y, setY] = useState(64);
  const [z, setZ] = useState(-1200);

  const result = useMemo(
    () => convertPortal({ x, y, z }, from),
    [x, y, z, from],
  );

  return (
    <GamingToolShell
      title="Minecraft Nether Portal Calculator"
      subtitle="A Minecraft nether portal calculator divides Overworld X and Z by eight, or multiplies Nether X and Z by eight. Y is copied. The 8:1 scale is part of the dimension spec and does not change with patches."
      directAnswerTitle="How are nether portal coordinates converted?"
      directAnswer={`Overworld X and Z are divided by ${SCALE} with truncation toward zero; Nether X and Z are multiplied by ${SCALE}. Y is unchanged. Java Edition then searches ${NETHER_SEARCH} blocks in the Nether or ${OVERWORLD_SEARCH} blocks in the Overworld for a portal to reuse.`}
      takeaways={[
        `Scale is exactly ${SCALE}:1 on X and Z.`,
        'Truncation toward zero matches Java integer division, including negative coordinates.',
        `Search radius is ${NETHER_SEARCH} in the Nether and ${OVERWORLD_SEARCH} in the Overworld.`,
        'Light the destination portal first so the game does not spawn a second pair.',
      ]}
      categoryName="Minecraft"
      seoTitle="Minecraft nether portal linking"
      seoDescription="Java Edition converts a portal traveler by scaling X and Z by eight and leaving Y as-is. If a portal already exists inside the destination search radius, that portal is used. Matching both ends of the converted pair is the reliable way to keep a highway or base link stable."
      howToUse={[
        'Choose Overworld to Nether or Nether to Overworld.',
        'Enter the X, Y, and Z of the portal that already exists, or the planned frame.',
        'Read the matching coordinates in the other dimension.',
        'Build the second frame at those coordinates, then light it.',
      ]}
      benefits={[
        'Negative coordinates use truncation toward zero, not floor, so west and north bases stay aligned.',
        'Search radii are listed so a nearby extra portal can be spotted before it steals the link.',
        'Y is shown unchanged so a netherrack ceiling can be planned.',
        'The 8:1 rule is documented on the Minecraft Wiki and is not a patch-dependent datapack.',
      ]}
      formula="netherXZ = trunc(overworldXZ / 8);  overworldXZ = netherXZ × 8;  Y copied"
      faqs={FAQS}
      currentToolId="minecraft-nether-portal"
      relatedIds={['minecraft-circle-generator', 'minecraft-shulker-box']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Minecraft tools', url: '/minecraft' },
        { name: 'Nether portal calculator', url: '/minecraft/nether-portal-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              <Button
                type="button"
                size="sm"
                variant={from === 'overworld' ? 'default' : 'ghost'}
                className="flex-1"
                onClick={() => setFrom('overworld')}
              >
                Overworld → Nether
              </Button>
              <Button
                type="button"
                size="sm"
                variant={from === 'nether' ? 'default' : 'ghost'}
                className="flex-1"
                onClick={() => setFrom('nether')}
              >
                Nether → Overworld
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
              <Input label="Y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
              <Input label="Z" type="number" value={z} onChange={(e) => setZ(Number(e.target.value))} />
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Coordinate conversion is described on the{' '}
              <a
                href="https://minecraft.wiki/w/Nether_portal"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                Minecraft Wiki nether portal page
              </a>
              .
            </p>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <div
            className={styles.resultCard}
            style={{ background: 'linear-gradient(160deg,#7f1d1d 0%,#431407 55%,#1c1917 100%)' }}
          >
            <p className={styles.resultLabel}>
              {from === 'overworld' ? 'Nether coordinates' : 'Overworld coordinates'}
            </p>
            <p className={styles.resultValue}>
              {result.destination.x} {result.destination.y} {result.destination.z}
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Search radius</span>
                <span className={styles.statVal}>{result.searchRadius} blocks</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Scale</span>
                <span className={styles.statVal}>X/Z ÷ {SCALE}</span>
              </div>
            </div>
          </div>
          <Card className="p-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {result.note}
          </Card>
        </div>
      </div>
    </GamingToolShell>
  );
}
