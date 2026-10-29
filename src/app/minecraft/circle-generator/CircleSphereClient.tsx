'use client';

import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import { PixelMap } from '@/components/gaming/PixelMap';
import {
  asciiGrid,
  coordList,
  generateCircle,
  generateSphere,
  layerOf,
} from '@/lib/gaming/minecraft-shapes';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const FAQS = [
  {
    question: 'How does a Minecraft circle generator place blocks?',
    answer:
      'Each block is included when the distance from the circle center to the center of that block is at most half the diameter. Hollow rings keep only the outer thickness. The test does not change with Minecraft patches.',
  },
  {
    question: 'What diameter should a Minecraft circle use?',
    answer:
      'Diameter is the width in blocks, not radius. Diameter 1 is a single block. Even diameters sit between four center blocks; odd diameters sit on one center block, shown as a gold block on the map.',
  },
  {
    question: 'How is a Minecraft sphere generator different from a circle?',
    answer:
      'A sphere uses the same distance test in three axes. The map shows one Y layer at a time. WorldEdit //sphere and //hsphere build the same shape in-game from a radius, which is half the diameter used here.',
  },
  {
    question: 'Does the Minecraft circle generator need updates after a patch?',
    answer:
      'No. Block placement math is geometry, not a game datapack. Java and Bedrock place the same pixels when the diameter, fill, and thickness match.',
  },
];

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function CircleSphereClient() {
  const [mode, setMode] = useState<'circle' | 'sphere'>('circle');
  const [diameter, setDiameter] = useState(16);
  const [filled, setFilled] = useState(false);
  const [thickness, setThickness] = useState(1);
  const [layer, setLayer] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const circle = useMemo(
    () => generateCircle(diameter, { filled, thickness }),
    [diameter, filled, thickness],
  );
  const sphere = useMemo(
    () => (mode === 'sphere' ? generateSphere(diameter, { filled, thickness }) : []),
    [mode, diameter, filled, thickness],
  );

  const yExtent = useMemo(() => {
    if (sphere.length === 0) return { min: 0, max: 0 };
    let min = Infinity;
    let max = -Infinity;
    for (const cell of sphere) {
      if (cell.y < min) min = cell.y;
      if (cell.y > max) max = cell.y;
    }
    return { min, max };
  }, [sphere]);
  const y = Math.min(yExtent.max, Math.max(yExtent.min, layer));
  const mapCells = mode === 'circle' ? circle : layerOf(sphere, y);
  const blockCount = mode === 'circle' ? circle.length : sphere.length;
  const layerCount = mapCells.length;

  const markCopied = async (key: string, text: string) => {
    if (await copy(text)) {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    }
  };

  return (
    <GamingToolShell
      title="Minecraft Circle and Sphere Generator"
      subtitle="A Minecraft circle generator maps each block whose center lies inside the chosen diameter. The same distance test in three axes builds a sphere. The math is pixel geometry and does not change when Minecraft receives a patch."
      directAnswerTitle="How does a Minecraft circle generator work?"
      directAnswer="A Minecraft circle generator includes a block when the distance from the origin to that block's center is at most half the diameter. Hollow circles keep an outer ring. Spheres apply the same test on X, Y, and Z and are shown one layer at a time."
      takeaways={[
        'Diameter is width in blocks. Radius used by WorldEdit is half of that diameter.',
        'Odd diameters center on one block. Even diameters center between four blocks.',
        'Thickness is ignored when the shape is filled.',
        'Java and Bedrock use the same block grid, so the map matches both editions.',
      ]}
      categoryName="Minecraft"
      seoTitle="Minecraft circle generator math"
      seoDescription="Minecraft circles are discrete disks on a block grid. The generator tests the center of every block against the radius, then optionally peels inner blocks to leave a ring. Spheres add a Y axis and list each horizontal slice. WorldEdit //sphere uses radius, so divide the diameter on this page by two before running that command."
      howToUse={[
        'Choose Circle or Sphere.',
        'Enter a diameter in blocks, from 1 to 256 for circles or 64 for spheres.',
        'Toggle filled or set ring thickness.',
        'For a sphere, move the Y layer to read each slice.',
        'Copy the ASCII map or relative coordinates into a build plan.',
      ]}
      benefits={[
        'The block-center test matches the maps Minecraft builders expect.',
        'Sphere layers share the circle preview so a dome can be built floor by floor.',
        'Coordinate lists are relative to the gold center block or four-block center.',
        'No datapack or version number is required. The geometry is stable.',
      ]}
      formula="include block if hypot(x + 0.5 − d/2, z + 0.5 − d/2) ≤ d/2"
      faqs={FAQS}
      currentToolId="minecraft-circle-generator"
      relatedIds={['minecraft-nether-portal', 'minecraft-shulker-box']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Minecraft tools', url: '/minecraft' },
        { name: 'Circle and sphere generator', url: '/minecraft/circle-generator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              {(['circle', 'sphere'] as const).map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={mode === item ? 'default' : 'ghost'}
                  className="flex-1 capitalize"
                  onClick={() => setMode(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
            <Input
              label="Diameter (blocks)"
              type="number"
              min={1}
              max={mode === 'sphere' ? 64 : 256}
              value={diameter}
              onChange={(e) => setDiameter(Number(e.target.value) || 1)}
            />
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={filled}
                onChange={(e) => setFilled(e.target.checked)}
                className="size-4 rounded"
              />
              Filled
            </label>
            {!filled && (
              <Input
                label="Ring thickness"
                type="number"
                min={1}
                max={8}
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value) || 1)}
              />
            )}
            {mode === 'sphere' && (
              <Input
                label="Y layer (relative to center)"
                type="number"
                min={yExtent.min}
                max={yExtent.max}
                value={y}
                onChange={(e) => setLayer(Number(e.target.value) || 0)}
              />
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => markCopied('ascii', asciiGrid(mapCells))}
              >
                {copied === 'ascii' ? <Check size={14} /> : <Copy size={14} />} ASCII layer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  markCopied('coords', coordList(mode === 'circle' ? circle : sphere))
                }
              >
                {copied === 'coords' ? <Check size={14} /> : <Copy size={14} />} Coordinates
              </Button>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              WorldEdit uses radius. A diameter {diameter} {mode} is{' '}
              <code className="font-mono">
                {mode === 'sphere' ? '//sphere' : '//hcyl'} ~ {Math.floor(diameter / 2)}
              </code>{' '}
              after picking a center.{' '}
              <a
                href="https://worldedit.enginehub.org/en/latest/usage/generation/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                WorldEdit generation docs
              </a>
              .
            </p>
          </div>
        </Card>

        <div className={styles.resultCol}>
          <div
            className={styles.resultCard}
            style={{ background: 'linear-gradient(160deg,#3d5f27 0%,#1a1714 55%,#141210 100%)' }}
          >
            <p className={styles.resultLabel}>Blocks in {mode}</p>
            <p className={styles.resultValue}>{blockCount.toLocaleString()}</p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>This layer</span>
                <span className={styles.statVal}>{layerCount}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Diameter</span>
                <span className={styles.statVal}>{Math.max(1, Math.floor(diameter))}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Center</span>
                <span className={styles.statVal}>
                  {Math.max(1, Math.floor(diameter)) % 2 === 0 ? 'Between 4 blocks' : 'One block'}
                </span>
              </div>
            </div>
          </div>
          <PixelMap
            cells={mapCells}
            label={`Minecraft ${mode} block map, diameter ${diameter}`}
          />
        </div>
      </div>
    </GamingToolShell>
  );
}
