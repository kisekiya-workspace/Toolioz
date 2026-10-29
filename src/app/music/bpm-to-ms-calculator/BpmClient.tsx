'use client';

import { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { NOTE_VALUES, bpmToMs, hzFromBpm, tapBpm } from '@/lib/makers/bpm';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function BpmClient() {
  const [bpm, setBpm] = useState(120);
  const taps = useRef<number[]>([]);
  const last = useRef<number | null>(null);
  const table = useMemo(
    () =>
      NOTE_VALUES.map((note) => ({
        ...note,
        straight: bpmToMs(bpm, note.beats, 'straight'),
        dotted: bpmToMs(bpm, note.beats, 'dotted'),
        triplet: bpmToMs(bpm, note.beats, 'triplet'),
      })),
    [bpm],
  );

  const tap = () => {
    const now = performance.now();
    if (last.current != null) taps.current.push(now - last.current);
    last.current = now;
    const next = tapBpm(taps.current);
    if (next) setBpm(next);
  };

  return (
    <ToolPageShell
      title="BPM to MS Calculator"
      subtitle="A BPM to MS calculator converts tempo to delay and reverb times. A quarter note at 120 BPM is 500 ms. Dotted values multiply by 1.5. Triplets multiply by 2/3. Tap tempo averages the last eight intervals."
      directAnswerTitle="How many milliseconds is a quarter note at 120 BPM?"
      directAnswer="A quarter note is 60,000 / BPM. At 120 BPM that is 500 ms. An eighth note is 250 ms, a dotted quarter is 750 ms, and a quarter-note triplet is 333.33 ms. Delay plugins use these times for tempo-synced echoes."
      takeaways={[
        'ms = 60,000 / BPM × note beats.',
        'Tap tempo uses the last eight taps.',
        'LFO hertz is BPM / 60.',
        'The chart covers 1/1 through 1/32.',
      ]}
      categoryName="Music"
      seoTitle="BPM to milliseconds"
      seoDescription="Delay time in milliseconds is 60000 divided by BPM for a quarter note. Other divisions scale by 4, 2, 0.5, 0.25, or 0.125 beats. Dotted notes are ×1.5. Triplets are ×2/3. No DAW session is required."
      howToUse={[
        'Type a BPM or tap the pad.',
        'Read straight, dotted, and triplet columns.',
        'Copy the 1/4 or 1/8 value into a delay plugin.',
      ]}
      benefits={['Tap BPM and the delay chart share one number.', 'Hertz is listed for tremolo and auto-pan.']}
      formula="quarter_ms = 60000 / BPM"
      faqs={[
        { question: 'What is tap BPM?', answer: 'Each tap stores an interval. The average of the last eight intervals is converted with 60000 / ms.' },
        { question: 'Why 333 ms at 120 BPM?', answer: 'That is a quarter-note triplet: 500 × 2/3.' },
      ]}
      currentToolId="bpm-to-ms"
      relatedIds={['frequency-to-note', 'chord-transposer', 'video-file-size']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Music calculators', url: '/music' },
        { name: 'BPM to MS calculator', url: '/music/bpm-to-ms-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="BPM" type="number" min={20} max={400} value={bpm} onChange={(e) => setBpm(Number(e.target.value) || 0)} />
            <Button type="button" onClick={tap}>Tap BPM</Button>
            <Button type="button" variant="outline" onClick={() => { taps.current = []; last.current = null; }}>Reset taps</Button>
            <p className="text-xs text-zinc-500">{fmtNum(hzFromBpm(bpm), 3)} Hz at this tempo</p>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="1/4 note"
            value={`${fmtNum(bpmToMs(bpm, 1, 'straight'), 1)} ms`}
            gradient="linear-gradient(160deg,#7c3aed 0%,#4c1d95 55%,#1c1917 100%)"
            stats={[
              ['Dotted 1/4', `${fmtNum(bpmToMs(bpm, 1, 'dotted'), 1)} ms`],
              ['Triplet 1/4', `${fmtNum(bpmToMs(bpm, 1, 'triplet'), 1)} ms`],
            ]}
          />
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 text-xs dark:border-zinc-800">
            <table className="min-w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  {['Note', 'Straight', 'Dotted', 'Triplet'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map((row) => (
                  <tr key={row.id} className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-950 dark:even:bg-zinc-900">
                    <td className="px-3 py-2 font-mono">{row.label}</td>
                    <td className="px-3 py-2 font-mono">{fmtNum(row.straight, 2)}</td>
                    <td className="px-3 py-2 font-mono">{fmtNum(row.dotted, 2)}</td>
                    <td className="px-3 py-2 font-mono">{fmtNum(row.triplet, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
