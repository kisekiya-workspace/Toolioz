'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { GamingToolShell } from '@/components/gaming/GamingToolShell';
import {
  convertSensitivity,
  formatFactor,
  formatSens,
  SENS_GAMES,
} from '@/lib/gaming/sensitivity';
import { SENSITIVITY_PAIRS, type SensitivityPair } from '@/lib/gaming/sensitivity-pairs';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const DEFAULT_FAQS = [
  {
    question: 'How does a mouse sensitivity converter with eDPI work?',
    answer:
      'Hipfire conversion multiplies the source sensitivity by (source yaw / destination yaw) and by (source DPI / destination DPI). eDPI is sensitivity times DPI. cm/360 is 360 / (yaw × sensitivity × DPI) × 2.54.',
  },
  {
    question: 'What is eDPI in a sensitivity converter?',
    answer:
      'eDPI is effective DPI: in-game sensitivity multiplied by mouse DPI. It compares two settings in the same game. Across games, yaw also has to match, which is why this converter reports cm/360 as well.',
  },
  {
    question: 'Why is CS2 to Valorant sensitivity not 1:1?',
    answer:
      'CS2 m_yaw is 0.022 and Valorant yaw is 0.07. The hipfire factor is 0.022 / 0.07 ≈ 0.314286. CS2 1.0 at the same DPI is Valorant 0.314286.',
  },
  {
    question: 'Does a sensitivity converter include ADS?',
    answer:
      'No. Each game has its own ADS, zoom, or relative-aim slider. This page converts hipfire yaw so a 360° turn matches. ADS is copied or rebuilt in the destination game.',
  },
];

const selectClass = styles.select;

interface SensitivityClientProps {
  pair?: SensitivityPair;
}

export default function SensitivityClient({ pair }: SensitivityClientProps) {
  const [fromId, setFromId] = useState(pair?.fromId ?? 'cs2');
  const [toId, setToId] = useState(pair?.toId ?? 'valorant');
  const [fromSens, setFromSens] = useState(pair?.exampleSens ?? 1.5);
  const [fromDpi, setFromDpi] = useState(pair?.exampleDpi ?? 800);
  const [toDpi, setToDpi] = useState(pair?.exampleDpi ?? 800);

  const locked = Boolean(pair);
  const result = useMemo(
    () => convertSensitivity({ fromId, toId, fromSens, fromDpi, toDpi }),
    [fromId, toId, fromSens, fromDpi, toDpi],
  );

  const title = pair?.title ?? 'Mouse Sensitivity Converter with eDPI';
  const subtitle =
    pair?.lead ??
    'A mouse sensitivity converter with eDPI matches hipfire turn speed between FPS games by comparing yaw constants. CS2, Valorant, Apex, Overwatch 2, Fortnite, Siege, and Warzone use fixed yaw values, so the conversion does not change when a patch ships new weapons.';

  const reverseHref = pair
    ? SENSITIVITY_PAIRS.find((item) => item.fromId === pair.toId && item.toId === pair.fromId)
    : undefined;

  return (
    <GamingToolShell
      title={title}
      subtitle={subtitle}
      directAnswerTitle={
        pair ? `How is ${result?.from.shortName} converted to ${result?.to.shortName}?` : 'How is mouse sensitivity converted between games?'
      }
      directAnswer={
        pair?.directAnswer ??
        'Hipfire sensitivity in the destination game is source sensitivity × (source yaw / destination yaw) × (source DPI / destination DPI). eDPI is sensitivity × DPI. cm/360 uses the source yaw so the physical mouse distance for a full turn stays matched.'
      }
      takeaways={
        pair?.takeaways ?? [
          'Same DPI: multiply by source yaw divided by destination yaw.',
          'eDPI = sensitivity × DPI. It is not comparable across games unless yaw also matches.',
          'cm/360 is the figure that should match when the conversion is correct.',
          'ADS, zoom, and relative-aim sliders are not part of hipfire yaw.',
        ]
      }
      categoryName="FPS"
      seoTitle={pair ? `${pair.title} math` : 'Mouse sensitivity and eDPI conversion'}
      seoDescription={
        pair
          ? `${pair.lead} ADS notes: ${pair.faqs[3]?.answer ?? ''}`
          : 'Each game stores a yaw constant: degrees turned per mouse count at sensitivity 1. Matching cm/360 across titles is a yaw ratio, not a copy-paste of the sensitivity number. Pair pages such as CS2 to Valorant sens isolate one ratio with a worked eDPI example.'
      }
      howToUse={
        pair?.howTo ?? [
          'Select the source game and destination game.',
          'Enter hipfire sensitivity and mouse DPI.',
          'Change destination DPI only when the mouse DPI will change.',
          'Read destination sensitivity, eDPI, and cm/360.',
          'Open a pair page such as CS2 to Valorant sens for a dedicated conversion.',
        ]
      }
      benefits={
        pair
          ? [
              `Dedicated ${result?.from.shortName} → ${result?.to.shortName} factor ${result ? formatFactor(result.factor) : ''}.`,
              'Worked example uses the same yaw constants as the main converter.',
              'Reverse pair is linked when that page exists.',
              'ADS remains a separate slider in each game.',
            ]
          : [
              'Yaw table covers CS2, CS:GO, Valorant, Overwatch 2, Apex, Fortnite, Siege, Warzone, and The Finals.',
              'Pair pages target searches such as CS2 to Valorant sens.',
              'cm/360 is reported so two different sensitivity numbers can be verified as the same turn.',
              'Constants are engine yaw, not patch notes.',
            ]
      }
      formula={pair?.formula ?? 'newSens = oldSens × (oldYaw / newYaw) × (oldDPI / newDPI);  eDPI = sens × DPI'}
      faqs={pair?.faqs ?? DEFAULT_FAQS}
      currentToolId={pair ? `sens-${pair.slug}` : 'mouse-sensitivity-converter'}
      relatedIds={
        pair
          ? ['mouse-sensitivity-converter', 'minecraft-circle-generator']
          : ['minecraft-circle-generator', 'pokemon-type-weakness', 'dnd-dice-roller']
      }
      breadcrumbs={
        pair
          ? [
              { name: 'Home', url: '/' },
              { name: 'Gaming tools', url: '/gaming' },
              { name: 'Sensitivity converter', url: '/gaming/mouse-sensitivity-converter' },
              { name: pair.title, url: `/gaming/${pair.slug}` },
            ]
          : [
              { name: 'Home', url: '/' },
              { name: 'Gaming tools', url: '/gaming' },
              { name: 'Sensitivity converter', url: '/gaming/mouse-sensitivity-converter' },
            ]
      }
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={styles.selectGroup}>
                <span className={styles.label}>From game</span>
                <select
                  className={selectClass}
                  value={fromId}
                  disabled={locked}
                  onChange={(e) => setFromId(e.target.value)}
                >
                  {SENS_GAMES.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.selectGroup}>
                <span className={styles.label}>To game</span>
                <select
                  className={selectClass}
                  value={toId}
                  disabled={locked}
                  onChange={(e) => setToId(e.target.value)}
                >
                  {SENS_GAMES.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Input
              label="Source sensitivity"
              type="number"
              step="0.001"
              value={fromSens}
              onChange={(e) => setFromSens(Number(e.target.value))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Source DPI"
                type="number"
                value={fromDpi}
                onChange={(e) => setFromDpi(Number(e.target.value))}
              />
              <Input
                label="Destination DPI"
                type="number"
                value={toDpi}
                onChange={(e) => setToDpi(Number(e.target.value))}
              />
            </div>
            {result && (
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {result.from.adsNote} {result.to.adsNote}
              </p>
            )}
          </div>
        </Card>

        <div className={styles.resultCol}>
          <div
            className={styles.resultCard}
            style={{ background: 'linear-gradient(160deg,#b45309 0%,#1c1917 55%,#0c0a09 100%)' }}
          >
            <p className={styles.resultLabel}>{result ? `${result.to.shortName} sensitivity` : 'Sensitivity'}</p>
            <p className={styles.resultValue}>{result ? formatSens(result.toSens) : '—'}</p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Factor</span>
                <span className={styles.statVal}>{result ? formatFactor(result.factor) : '—'}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Source eDPI</span>
                <span className={styles.statVal}>{result ? Math.round(result.fromEdpi) : '—'}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Dest eDPI</span>
                <span className={styles.statVal}>{result ? Math.round(result.toEdpi) : '—'}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>cm / 360°</span>
                <span className={styles.statVal}>{result ? result.cm360.toFixed(2) : '—'}</span>
              </div>
            </div>
          </div>
          {reverseHref && (
            <Link
              href={`/gaming/${reverseHref.slug}`}
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Reverse: {reverseHref.title}
            </Link>
          )}
        </div>
      </div>

      {!pair && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-zinc-950 dark:text-zinc-50">
            CS2 to Valorant sens and other game pair pages
          </h2>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Each pair page locks one yaw ratio and shows a worked eDPI example. The main converter above accepts any two games from the table.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SENSITIVITY_PAIRS.map((item) => (
              <Link
                key={item.slug}
                href={`/gaming/${item.slug}`}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </GamingToolShell>
  );
}
