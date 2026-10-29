'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { frequencyFromMidi, noteFromFrequency, pianoChart } from '@/lib/makers/frequency';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function FrequencyClient() {
  const [hz, setHz] = useState(440);
  const [a4, setA4] = useState(440);
  const note = useMemo(() => noteFromFrequency(hz, a4), [hz, a4]);
  const chart = useMemo(() => pianoChart(a4), [a4]);

  return (
    <ToolPageShell
      title="Frequency to Note Converter"
      subtitle="A frequency to note converter maps hertz to the nearest piano key, cents offset, and MIDI number. A4 can be 440 Hz or 432 Hz. The chart lists A0 through C8."
      directAnswerTitle="What note is 440 Hz?"
      directAnswer="440 Hz is A4 when A4 is defined as 440. MIDI note 69. At A4 = 432 Hz, 440 Hz is about 32 cents sharp of A4. Formula: midi = 69 + 12 × log2(f / A4)."
      takeaways={[
        'Equal temperament, twelve-tone.',
        'Cents are 100 × (midiFloat − roundedMidi).',
        '432 Hz only changes the reference, not the note names.',
        'The table is a piano note frequency chart.',
      ]}
      categoryName="Music"
      seoTitle="Frequency to note and piano chart"
      seoDescription="MIDI 69 is A4. Each semitone is a factor of 2^(1/12). Switching A4 to 432 retunes the whole chart. This is not a microphone pitch detector."
      howToUse={['Enter hertz.', 'Pick A4 = 440 or 432.', 'Read the nearest note, cents, and the piano table.']}
      benefits={['440 and 432 are a toggle, not a hidden constant.', 'MIDI numbers help DAW mapping.']}
      formula="midi = 69 + 12 × log2(f / A4)"
      faqs={[
        { question: 'What frequency is middle C?', answer: 'C4 is MIDI 60, about 261.63 Hz at A4 = 440.' },
        { question: 'Is this a pitch detector?', answer: 'No. Paste a number from an analyser. There is no microphone here.' },
      ]}
      currentToolId="frequency-to-note"
      relatedIds={['bpm-to-ms', 'chord-transposer', 'video-file-size']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Music calculators', url: '/music' },
        { name: 'Frequency to note converter', url: '/music/frequency-to-note-converter' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Frequency (Hz)" type="number" min={8} value={hz} onChange={(e) => setHz(Number(e.target.value) || 0)} />
            <div className="flex gap-2">
              {[440, 432].map((ref) => (
                <Button key={ref} type="button" size="sm" variant={a4 === ref ? 'default' : 'outline'} onClick={() => setA4(ref)}>
                  A4 = {ref}
                </Button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">A4 itself is {fmtNum(frequencyFromMidi(69, a4), 2)} Hz in this tuning.</p>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Nearest note"
            value={`${note.name} (${fmtNum(note.cents, 1)} ¢)`}
            gradient="linear-gradient(160deg,#5b21b6 0%,#3b0764 55%,#1c1917 100%)"
            stats={[
              ['MIDI', String(note.midi)],
              ['Exact Hz of that key', fmtNum(note.frequency, 2)],
            ]}
          />
          <div className="max-h-72 overflow-auto rounded-2xl border border-zinc-200 text-xs dark:border-zinc-800">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900"><tr><th className="px-3 py-2 text-left">Note</th><th className="px-3 py-2 text-left">Hz</th><th className="px-3 py-2 text-left">MIDI</th></tr></thead>
              <tbody>
                {chart.map((row) => (
                  <tr key={row.midi} className={row.midi === note.midi ? 'bg-violet-100 dark:bg-violet-950' : ''}>
                    <td className="px-3 py-1 font-mono">{row.name}</td>
                    <td className="px-3 py-1 font-mono">{row.hz}</td>
                    <td className="px-3 py-1 font-mono">{row.midi}</td>
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
