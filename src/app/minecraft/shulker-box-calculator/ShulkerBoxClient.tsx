'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import {
  calculateShulkerLoad,
  SHULKER_SLOTS,
  STACK_PRESETS,
} from '@/lib/gaming/shulker-box';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const FAQS = [
  {
    question: 'How many items fit in a Minecraft shulker box?',
    answer: `A shulker box has ${SHULKER_SLOTS} slots. At a stack of 64 that is 1,728 items. At 16 it is 432 items. Unstackable items fill 27 slots.`,
  },
  {
    question: 'How many items fit in a double chest of shulker boxes?',
    answer:
      'A double chest holds 54 shulker boxes. At 64-stack items that is 93,312 items. An ender chest holds 27 boxes (46,656 items at stack 64).',
  },
  {
    question: 'Can shulker boxes go inside shulker boxes?',
    answer:
      'Vanilla Minecraft does not allow a shulker box inside another shulker box. This calculator treats each box as a 27-slot container of ordinary stacks.',
  },
  {
    question: 'Does a Minecraft shulker box calculator need patch updates?',
    answer:
      'No. Slot count 27 and stack sizes 64, 16, and 1 have been stable for years. Bundles and data-driven stack components can differ in a datapack world and are not modeled here.',
  },
];

function fmt(n: number): string {
  return n.toLocaleString();
}

export default function ShulkerBoxClient() {
  const [stack, setStack] = useState(64);
  const [boxes, setBoxes] = useState(1);
  const [items, setItems] = useState(1728);

  const result = useMemo(() => calculateShulkerLoad(boxes, items, stack), [boxes, items, stack]);

  return (
    <GamingToolShell
      title="Minecraft Shulker Box Calculator"
      subtitle="A Minecraft shulker box calculator multiplies 27 slots by a stack size of 64, 16, or 1. One box holds 1,728 of a 64-stack item. The slot math is vanilla container size and does not change with combat or world-generation patches."
      directAnswerTitle="How many items fit in a shulker box?"
      directAnswer="A shulker box has 27 slots. At stack size 64 that is 1,728 items per box, 46,656 in an ender chest of boxes, and 93,312 in a double chest of boxes. Unstackable items fill 27 slots per box."
      takeaways={[
        '27 slots × 64 = 1,728 items in one shulker box.',
        '54 shulker boxes in a double chest hold 93,312 of a 64-stack item.',
        'Vanilla boxes cannot nest inside other shulker boxes.',
        'Ender pearls and snowballs use stack 16 (432 items per box).',
      ]}
      categoryName="Minecraft"
      seoTitle="Minecraft shulker box stack math"
      seoDescription="Shulker boxes are 27-slot chests that can be placed and broken with their contents. Storage planning is ordinary stack arithmetic: slots times stack size times number of boxes. A player inventory of 36 boxes plus an offhand box is the usual full-carry figure."
      howToUse={[
        'Pick stack size 64, 16, or 1.',
        'Enter how many shulker boxes are available, or how many items need packing.',
        'Read items per box, boxes required, and the double-chest and ender-chest totals.',
      ]}
      benefits={[
        'Presets cover blocks, 16-stack projectiles, and tools.',
        'Boxes-needed rounding uses ceiling so a leftover stack still books a box.',
        'Double chest, ender chest, and full inventory figures are listed from the same slot count.',
        'No versioned loot table is required.',
      ]}
      formula="items = boxes × 27 × stackSize;  boxesNeeded = ceil(items / (27 × stackSize))"
      faqs={FAQS}
      currentToolId="minecraft-shulker-box"
      relatedIds={['minecraft-circle-generator', 'minecraft-nether-portal']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Minecraft tools', url: '/minecraft' },
        { name: 'Shulker box calculator', url: '/minecraft/shulker-box-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {STACK_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  size="sm"
                  variant={stack === preset.stackSize ? 'default' : 'outline'}
                  onClick={() => setStack(preset.stackSize)}
                >
                  Stack {preset.stackSize}
                </Button>
              ))}
            </div>
            <Input
              label="Shulker boxes"
              type="number"
              min={0}
              value={boxes}
              onChange={(e) => setBoxes(Number(e.target.value) || 0)}
            />
            <Input
              label="Items to pack"
              type="number"
              min={0}
              value={items}
              onChange={(e) => setItems(Number(e.target.value) || 0)}
            />
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Container size is documented on the{' '}
              <a
                href="https://minecraft.wiki/w/Shulker_Box"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                Minecraft Wiki shulker box page
              </a>
              .
            </p>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <div
            className={styles.resultCard}
            style={{ background: 'linear-gradient(160deg,#6b21a8 0%,#3b0764 50%,#1c1917 100%)' }}
          >
            <p className={styles.resultLabel}>
              Items in {result.boxCount} {result.boxCount === 1 ? 'box' : 'boxes'}
            </p>
            <p className={styles.resultValue}>{fmt(result.totalItems)}</p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Per box</span>
                <span className={styles.statVal}>{fmt(result.itemsPerBox)}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Boxes needed for items</span>
                <span className={styles.statVal}>{fmt(result.boxesNeededForItems)}</span>
              </div>
            </div>
          </div>
          <Card className="divide-y divide-zinc-200 p-0 text-sm dark:divide-zinc-800">
            {[
              ['Double chest of boxes', result.doubleChestItems],
              ['Ender chest of boxes', result.enderChestItems],
              ['36 inventory slots', result.inventoryItems],
              ['Inventory plus offhand', result.fullCarryItems],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between px-5 py-3">
                <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                <span className="font-mono font-semibold text-zinc-950 dark:text-zinc-50">
                  {fmt(Number(value))}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </GamingToolShell>
  );
}
