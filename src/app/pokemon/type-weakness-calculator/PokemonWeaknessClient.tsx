'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import {
  dualTypeWeakness,
  POKEMON_TYPES,
  TYPE_COLORS,
  attackMultiplier,
  typeLabel,
  type PokemonType,
} from '@/lib/gaming/pokemon-types';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const FAQS = [
  {
    question: 'How does a Pokemon dual-type weakness calculator work?',
    answer:
      'Each attacking type is multiplied against both defending types from the Generation 6 chart. 2 × 2 is a 4× weakness. 2 × 0.5 cancels to 1×. A 0 on either type is an immunity.',
  },
  {
    question: 'Has the Pokemon type chart changed since 2013?',
    answer:
      'Fairy was added in X and Y (2013). The 18×18 attacking chart used here has been stable through later generations. Terastallization and abilities such as Levitate are not applied.',
  },
  {
    question: 'What is a 4× Pokemon type weakness?',
    answer:
      'A 4× weakness happens when both defending types are weak to the same attack, such as Fire/Flying taking 4× from Rock, or Grass/Ice taking 4× from Fire.',
  },
  {
    question: 'Does this replace a Pokemon type chart?',
    answer:
      'The full attacking chart is on this page under Pokemon type chart. Weakness searches are answered by the dual-type buckets (4×, 2×, ½×, ¼×, 0×) above the grid.',
  },
];

const BUCKETS: Array<{ key: 'x4' | 'x2' | 'x1' | 'x05' | 'x025' | 'x0'; label: string; hint: string }> = [
  { key: 'x4', label: '4× weakness', hint: 'Both types are weak' },
  { key: 'x2', label: '2× weakness', hint: 'One type is weak' },
  { key: 'x1', label: '1× neutral', hint: 'No net modifier' },
  { key: 'x05', label: '½× resist', hint: 'One type resists' },
  { key: 'x025', label: '¼× resist', hint: 'Both types resist' },
  { key: 'x0', label: 'Immune', hint: 'One type is immune' },
];

function TypeChip({ type }: { type: PokemonType }) {
  return (
    <span
      className="inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm"
      style={{ backgroundColor: TYPE_COLORS[type] }}
    >
      {typeLabel(type)}
    </span>
  );
}

export default function PokemonWeaknessClient() {
  const [type1, setType1] = useState<PokemonType>('fire');
  const [type2, setType2] = useState<PokemonType | ''>('flying');

  const report = useMemo(
    () => dualTypeWeakness(type1, type2 === '' ? null : type2),
    [type1, type2],
  );

  return (
    <GamingToolShell
      title="Pokemon Dual-Type Weakness Calculator"
      subtitle="A Pokemon dual-type weakness calculator multiplies both defending types against every attacking type on the Generation 6 chart. Fairy was added in 2013. The 18-type grid has not changed, so the weakness list does not need patch updates."
      directAnswerTitle="How are dual-type Pokemon weaknesses calculated?"
      directAnswer="Each attacking type is multiplied by its effectiveness against both defending types. Two 2× weaknesses become 4×. A 2× and a ½× cancel to 1×. A 0 on either type is an immunity. The chart is the Generation 6 table used since 2013."
      takeaways={[
        'Weakness is defensive: what hits this pairing hard.',
        '4× means both types are weak to that attack.',
        'Abilities, item effects, and Terastallization are not applied.',
        'The full Pokemon type chart sits under the weakness buckets.',
      ]}
      categoryName="Pokemon"
      seoTitle="Pokemon type weakness and type chart"
      seoDescription="Dual-type defense multiplies two independent type matchups. The attacking Pokemon type chart on this page is the same 18×18 matrix used since X and Y. Searches for Pokemon type chart and dual-type weakness both resolve to that frozen table."
      howToUse={[
        'Select the first defending type.',
        'Select a second type, or None for a single-type Pokemon.',
        'Read 4×, 2×, resist, and immunity buckets.',
        'Use the Pokemon type chart grid for a full attacker-versus-defender lookup.',
      ]}
      benefits={[
        'Targets weakness searches rather than only the generic type chart query.',
        'Shows 4× combinations that a single-type chart hides.',
        'The 18-type matrix is included for chart intent.',
        'No generation toggle is required after Fairy.',
      ]}
      formula="defenseMult = chart[attack][type1] × chart[attack][type2]"
      faqs={FAQS}
      currentToolId="pokemon-type-weakness"
      relatedIds={['minecraft-circle-generator', 'dnd-dice-roller']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Pokemon tools', url: '/pokemon' },
        { name: 'Type weakness calculator', url: '/pokemon/type-weakness-calculator' },
      ]}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <label className={styles.selectGroup}>
              <span className={styles.label}>Type 1</span>
              <select
                className={styles.select}
                value={type1}
                onChange={(e) => setType1(e.target.value as PokemonType)}
              >
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {typeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.selectGroup}>
              <span className={styles.label}>Type 2</span>
              <select
                className={styles.select}
                value={type2}
                onChange={(e) => setType2(e.target.value as PokemonType | '')}
              >
                <option value="">None (single type)</option>
                {POKEMON_TYPES.filter((type) => type !== type1).map((type) => (
                  <option key={type} value={type}>
                    {typeLabel(type)}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Type effectiveness is documented on{' '}
              <a
                href="https://bulbapedia.bulbagarden.net/wiki/Type"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
              >
                Bulbapedia&apos;s type page
              </a>
              .
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          {BUCKETS.map((bucket) => {
            const types = report[bucket.key];
            return (
              <Card key={bucket.key} className="p-4">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{bucket.label}</h2>
                  <span className="text-[11px] text-zinc-500">{bucket.hint}</span>
                </div>
                {types.length === 0 ? (
                  <p className="text-xs text-zinc-400">None</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {types.map((type) => (
                      <TypeChip key={type} type={type} />
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <section className="mt-12 overflow-x-auto">
        <h2 className="mb-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">Pokemon type chart</h2>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Rows attack, columns defend. 2 is super effective, ½ resists, 0 is immune. This is the chart in use since Fairy was added in 2013.
        </p>
        <table className="min-w-[720px] border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="p-1 text-left text-zinc-500">Atk \\ Def</th>
              {POKEMON_TYPES.map((type) => (
                <th key={type} className="p-1 font-bold text-white" style={{ backgroundColor: TYPE_COLORS[type] }}>
                  {type.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {POKEMON_TYPES.map((atk) => (
              <tr key={atk}>
                <th className="p-1 font-bold text-white" style={{ backgroundColor: TYPE_COLORS[atk] }}>
                  {typeLabel(atk)}
                </th>
                {POKEMON_TYPES.map((def) => {
                  const m = attackMultiplier(atk, def);
                  const bg =
                    m === 0
                      ? 'bg-zinc-900 text-white'
                      : m === 2
                        ? 'bg-emerald-200 text-emerald-950'
                        : m === 0.5
                          ? 'bg-rose-200 text-rose-950'
                          : 'bg-white text-zinc-500 dark:bg-zinc-900';
                  return (
                    <td key={def} className={`p-1 text-center font-mono ${bg}`}>
                      {m === 0.5 ? '½' : m}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </GamingToolShell>
  );
}
