'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import {
  CR_OPTIONS,
  CR_XP,
  evaluateEncounter,
  type EncounterMonster,
} from '@/lib/gaming/encounter-5e';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const FAQS = [
  {
    question: 'How does a D&D 5e encounter calculator rate difficulty?',
    answer:
      'Party XP thresholds come from the 2014 Dungeon Master\'s Guide by character level. Monster XP is summed, then multiplied by a monster-count factor (1, 1.5, 2, 2.5, 3, or 4). Adjusted XP is compared with Easy, Medium, Hard, and Deadly budgets.',
  },
  {
    question: 'Does party size change 5e encounter difficulty?',
    answer:
      'Yes. A party of one or two characters shifts the multiplier one step up. A party of six or more shifts it one step down. That is the 2014 DMG rule.',
  },
  {
    question: 'Is this the 2014 or 2024 D&D encounter table?',
    answer:
      'This page uses the 2014 Dungeon Master\'s Guide XP thresholds and multipliers. Those numbers are frozen. The 2024 rules use a different encounter-building method and are not mixed in.',
  },
  {
    question: 'Where do CR XP values in a 5e encounter calculator come from?',
    answer:
      'Challenge rating to XP is the standard 5e table (CR 1 = 200 XP, CR 5 = 1,800 XP, and so on). Named monsters are not required; enter CR and count.',
  },
];

const BAND_COLOR: Record<string, string> = {
  Trivial: '#3f3f46',
  Easy: '#15803d',
  Medium: '#a16207',
  Hard: '#c2410c',
  Deadly: '#b91c1c',
  'Beyond deadly': '#7f1d1d',
};

export default function EncounterClient() {
  const [partySize, setPartySize] = useState(4);
  const [level, setLevel] = useState(5);
  const [monsters, setMonsters] = useState<EncounterMonster[]>([
    { id: 'm1', cr: '2', count: 2 },
    { id: 'm2', cr: '5', count: 1 },
  ]);

  const levels = useMemo(() => Array.from({ length: Math.max(1, partySize) }, () => level), [partySize, level]);
  const result = useMemo(() => evaluateEncounter(levels, monsters), [levels, monsters]);

  const updateMonster = (id: string, patch: Partial<EncounterMonster>) => {
    setMonsters((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  return (
    <GamingToolShell
      title="D&D 5e Encounter Calculator"
      subtitle="A D&D 5e encounter calculator compares party XP budgets from the 2014 Dungeon Master's Guide with adjusted monster XP. Thresholds, challenge-rating XP, and monster-count multipliers are fixed tables. They do not change with later monster books."
      directAnswerTitle="How is a 5e encounter rated Easy, Medium, Hard, or Deadly?"
      directAnswer="Sum each character's Easy through Deadly XP from the 2014 table. Sum monster XP by challenge rating, multiply by the monster-count factor, and compare. Two monsters use ×1.5; three to six use ×2. A party of 1–2 steps the multiplier up; six or more steps it down."
      takeaways={[
        'Budgets are per character, then summed for the table.',
        'Adjusted XP = raw XP × monster-count multiplier.',
        'This page uses 2014 DMG numbers, not the 2024 method.',
        'Players split raw XP, not adjusted XP, after the fight.',
      ]}
      categoryName="D&D"
      seoTitle="D&D 5e encounter XP thresholds"
      seoDescription="The 2014 Dungeon Master's Guide publishes Easy, Medium, Hard, and Deadly XP per level and a multiplier for groups of monsters. This calculator applies those tables only. Named stat blocks are unnecessary when challenge rating and count are known."
      howToUse={[
        'Enter party size and character level (all characters share the level box).',
        'Add monsters by challenge rating and count.',
        'Read Easy–Deadly budgets, raw XP, multiplier, adjusted XP, and the difficulty band.',
        'Award raw XP divided by party size after the encounter.',
      ]}
      benefits={[
        '2014 tables are complete through level 20 and CR 30.',
        'Party-size multiplier shifts follow the DMG footnote.',
        'Beyond deadly is flagged when adjusted XP exceeds 1.5× Deadly.',
        'Dice notation lives on the D&D dice roller, not in this budget tool.',
      ]}
      formula="adjustedXP = sum(CR_XP × count) × multiplier(monsterCount, partySize)"
      faqs={FAQS}
      currentToolId="dnd-5e-encounter"
      relatedIds={['dnd-dice-roller']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'D&D tools', url: '/dnd' },
        { name: '5e encounter calculator', url: '/dnd/5e-encounter-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Party size"
                type="number"
                min={1}
                max={12}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value) || 1)}
              />
              <Input
                label="Character level"
                type="number"
                min={1}
                max={20}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-3">
              <p className={styles.label}>Monsters</p>
              {monsters.map((monster) => (
                <div key={monster.id} className="grid grid-cols-[1fr_5rem_auto] gap-2">
                  <select
                    className={styles.select}
                    value={monster.cr}
                    onChange={(e) => updateMonster(monster.id, { cr: e.target.value })}
                  >
                    {CR_OPTIONS.map((cr) => (
                      <option key={cr} value={cr}>
                        CR {cr} ({CR_XP[cr].toLocaleString()} XP)
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min={0}
                    value={monster.count}
                    onChange={(e) => updateMonster(monster.id, { count: Number(e.target.value) || 0 })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setMonsters((prev) => prev.filter((row) => row.id !== monster.id))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setMonsters((prev) => [
                    ...prev,
                    { id: `m${Date.now()}`, cr: '1', count: 1 },
                  ])
                }
              >
                Add monster
              </Button>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Encounter-building math is published in the 2014 Dungeon Master&apos;s Guide and restated in the{' '}
              <a
                href="https://www.dndbeyond.com/sources/dnd/dmg-2014/creating-nonplayer-characters"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                5e Systems Reference Document materials
              </a>
              .
            </p>
          </div>
        </Card>

        <div className={styles.resultCol}>
          <div
            className={styles.resultCard}
            style={{
              background: `linear-gradient(160deg, ${BAND_COLOR[result.band]} 0%, #1c1917 62%, #0c0a09 100%)`,
            }}
          >
            <p className={styles.resultLabel}>Encounter rating</p>
            <p className={styles.resultValue}>{result.band}</p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Raw XP</span>
                <span className={styles.statVal}>{result.rawXp.toLocaleString()}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Multiplier</span>
                <span className={styles.statVal}>×{result.multiplier}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Adjusted XP</span>
                <span className={styles.statVal}>{result.adjustedXp.toLocaleString()}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>XP each</span>
                <span className={styles.statVal}>{result.xpEach.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Card className="divide-y divide-zinc-200 p-0 text-sm dark:divide-zinc-800">
            {(
              [
                ['Easy', result.thresholds.easy],
                ['Medium', result.thresholds.medium],
                ['Hard', result.thresholds.hard],
                ['Deadly', result.thresholds.deadly],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-zinc-600 dark:text-zinc-400">{label} budget</span>
                <span className="font-mono font-semibold">{value.toLocaleString()} XP</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </GamingToolShell>
  );
}
