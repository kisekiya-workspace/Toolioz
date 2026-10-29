'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import { parseDice, QUICK_ROLLS, rollDice, type RollResult } from '@/lib/gaming/dice';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const FAQS = [
  {
    question: 'How does a D&D dice roller parse 4d6kh3?',
    answer:
      '4d6kh3 rolls four six-sided dice and keeps the highest three, which is the standard ability-score method. 2d20kh1 is advantage. 2d20kl1 is disadvantage. A modifier such as +5 is added after the kept dice.',
  },
  {
    question: 'Are D&D dice roller results fair?',
    answer:
      'Each face is chosen with crypto.getRandomValues modulo the die size. Notation follows common 5e usage and does not depend on a rules errata date.',
  },
  {
    question: 'What dice notation does this D&D dice roller accept?',
    answer:
      'NdS, d20, 1d20+5, 8d6+3, 4d6kh3, 4d6dl1, 2d20kh1, 2d20kl1, and sums of those terms. Percentile dice use d100 or d%.',
  },
  {
    question: 'Does the D&D dice roller change with new editions?',
    answer:
      'Dice notation and physical dice do not change. Encounter XP lives on the 5e encounter calculator and uses the 2014 Dungeon Master\'s Guide table.',
  },
];

export default function DiceRollerClient() {
  const [expr, setExpr] = useState('1d20+5');
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);

  const roll = (value = expr) => {
    try {
      parseDice(value);
      const result = rollDice(value);
      setExpr(value);
      setCurrent(result);
      setHistory((prev) => [result, ...prev].slice(0, 12));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not roll.');
    }
  };

  return (
    <GamingToolShell
      title="D&D Dice Roller"
      subtitle="A D&D dice roller evaluates standard 5e notation such as 1d20+5, 2d20kh1 for advantage, and 4d6kh3 for ability scores. Dice math does not change with edition errata. Encounter budgets are a separate 5e encounter calculator."
      directAnswerTitle="How does a D&D dice roller handle advantage?"
      directAnswer="Advantage is 2d20kh1: two d20s, keep the highest. Disadvantage is 2d20kl1. Ability scores use 4d6kh3. A modifier is added after kept dice. Faces are drawn with crypto.getRandomValues."
      takeaways={[
        '2d20kh1 is advantage. 2d20kl1 is disadvantage.',
        '4d6kh3 is the common ability-score roll.',
        'Modifiers apply after keep/drop.',
        'Notation is edition-agnostic; XP budgets are on the encounter page.',
      ]}
      categoryName="D&D"
      seoTitle="D&D dice roller notation"
      seoDescription="The roller tokenizes NdS terms, optional kh/kl/dh/dl keep or drop suffixes, and integer modifiers. That grammar covers 5e combat, skill checks, and fireball damage without depending on a monster manual revision."
      howToUse={[
        'Enter notation such as 1d20+5 or pick a quick roll.',
        'Press Roll. Kept faces are highlighted; dropped faces are dim.',
        'Use Advantage for 2d20kh1 and Disadvantage for 2d20kl1.',
        'Read the history list for previous totals.',
      ]}
      benefits={[
        'Keep-high and drop-low cover advantage and 4d6 drop lowest.',
        'Sums such as 2d6+1d8+3 are valid.',
        'History stays in the tab only.',
        'Encounter difficulty is linked, not mixed into the roller.',
      ]}
      formula="total = sign × sum(kept faces) + modifiers"
      faqs={FAQS}
      currentToolId="dnd-dice-roller"
      relatedIds={['dnd-5e-encounter']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'D&D tools', url: '/dnd' },
        { name: 'Dice roller', url: '/dnd/dice-roller' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input
              label="Dice notation"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') roll();
              }}
              mono
            />
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <Button type="button" onClick={() => roll()}>
              Roll
            </Button>
            <div className="flex flex-wrap gap-2">
              {QUICK_ROLLS.map((item) => (
                <Button key={item.expr} type="button" size="sm" variant="outline" onClick={() => roll(item.expr)}>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className={styles.resultCol}>
          <div
            className={styles.resultCard}
            style={{ background: 'linear-gradient(160deg,#991b1b 0%,#1c1917 60%,#0c0a09 100%)' }}
          >
            <p className={styles.resultLabel}>{current?.expression.raw ?? 'Total'}</p>
            <p className={styles.resultValue}>{current ? current.total : '—'}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {current?.terms.flatMap((term, termIndex) =>
                term.faces.map((face, faceIndex) => (
                  <span
                    key={`${termIndex}-${faceIndex}`}
                    className={`inline-flex size-10 items-center justify-center rounded-lg font-mono text-sm font-bold ${
                      face.kept ? 'bg-white text-zinc-950' : 'bg-white/20 text-white/50 line-through'
                    }`}
                  >
                    {face.value}
                  </span>
                )),
              )}
            </div>
          </div>
          {history.length > 0 && (
            <Card className="p-4">
              <h2 className="mb-2 text-sm font-bold text-zinc-950 dark:text-zinc-50">Roll history</h2>
              <ul className="space-y-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                {history.map((item, index) => (
                  <li key={`${item.expression.raw}-${index}`} className="flex justify-between gap-3">
                    <span>{item.expression.raw}</span>
                    <span className="font-semibold text-zinc-950 dark:text-zinc-50">{item.total}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </GamingToolShell>
  );
}
