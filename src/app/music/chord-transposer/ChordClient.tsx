'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { capoAsIf, transposeChart } from '@/lib/makers/chords';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const SAMPLE = `G     D     Em    C
Amazing example lyrics here
G     D     C     G`;

export default function ChordClient() {
  const [text, setText] = useState(SAMPLE);
  const [steps, setSteps] = useState(2);
  const [capo, setCapo] = useState(0);
  const transposed = useMemo(() => transposeChart(text, steps), [text, steps]);
  const capoChart = useMemo(() => capoAsIf(transposed, capo), [transposed, capo]);

  return (
    <ToolPageShell
      title="Chord Transposer"
      subtitle="A chord transposer shifts A–G chord tokens in a pasted lyric sheet by semitones. Capo view transposes the written chords down so the same shapes can be played with a capo. Roots use sharps after conversion. Slash chords keep the bass note token if it was written as a second chord-like token."
      directAnswerTitle="How does an online chord transposer work?"
      directAnswer="Each token starting with A–G and optional #/b is moved around the 12-tone circle. Lyrics that do not look like chords stay put. Capo 2 shows shapes two semitones lower than the sounding chart."
      takeaways={[
        'Paste chords above lyrics; only chord-like tokens move.',
        'Positive steps raise the key.',
        'Capo N writes shapes as if the capo supplies those semitones.',
        'Piano and guitar share the same root names.',
      ]}
      categoryName="Music"
      seoTitle="Chord sheet transpose"
      seoDescription="The parser matches [A-G][#b]? plus a trailing suffix such as m, 7, sus4, or maj7. Lines that are mostly lyrics are unchanged except where a lone C or G appears as a word, which is a known false positive. Check the output before a gig."
      howToUse={['Paste a chart.', 'Set semitones.', 'Optionally set capo frets for shape names.']}
      benefits={['No account. The chart never leaves the tab.', 'Capo and transpose are separate so Nashville numbers are unnecessary.']}
      formula="newRoot = (oldRootIndex + semitones) mod 12"
      faqs={[
        { question: 'Does the transposer move lyrics?', answer: 'Only tokens that look like chords. The word “A” at a line start can still be caught; scan the result.' },
        { question: 'How does capo work?', answer: 'Sounding chords are transposed, then shapes are shifted down by capo frets.' },
      ]}
      accuracyNote="Tokens that look like English words (a lone “A”) can be transposed by mistake. Check the lyric lines after running."
      currentToolId="chord-transposer"
      relatedIds={['bpm-to-ms', 'frequency-to-note', 'video-file-size']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Music calculators', url: '/music' },
        { name: 'Chord transposer', url: '/music/chord-transposer' },
      ]}
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <textarea className="min-h-48 w-full rounded-xl border border-zinc-200 bg-transparent p-3 font-mono text-sm dark:border-zinc-800" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setSteps((n) => n - 1)}>−1</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setSteps((n) => n + 1)}>+1</Button>
            </div>
            <Input label="Semitones" type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value) || 0)} />
            <Input label="Capo frets" type="number" min={0} max={12} value={capo} onChange={(e) => setCapo(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <Card className="p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Sounding chords</p>
          <pre className="whitespace-pre-wrap font-mono text-sm">{transposed}</pre>
          {capo > 0 ? (
            <>
              <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">Shapes with capo {capo}</p>
              <pre className="whitespace-pre-wrap font-mono text-sm">{capoChart}</pre>
            </>
          ) : null}
        </Card>
      </div>
    </ToolPageShell>
  );
}
