'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { morsePattern, morseToText, textToMorse } from '@/lib/makers/morse';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function MorseClient() {
  const [text, setText] = useState('SOS');
  const code = useMemo(() => textToMorse(text), [text]);
  const decoded = useMemo(() => morseToText(code), [code]);

  const play = async () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 600;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    const unit = 0.08;
    let t = ctx.currentTime + 0.05;
    for (const step of morsePattern(code)) {
      if (step.on) {
        gain.gain.setValueAtTime(0.12, t);
        t += step.units * unit;
        gain.gain.setValueAtTime(0, t);
      } else {
        t += step.units * unit;
      }
    }
    osc.stop(t + 0.05);
  };

  return (
    <ToolPageShell
      title="Morse Code Translator"
      subtitle="A Morse code translator encodes letters to ITU dots and dashes and plays them as a 600 Hz tone. Spaces become /. Microphone decode is not included. Image-to-Morse is not included."
      directAnswerTitle="How does Morse audio playback work?"
      directAnswer="Each dot is one unit, each dash three. Gaps: one unit between elements, three between letters, seven between words. SOS is ... --- ... . The Web Audio oscillator keys the gain envelope; nothing is recorded."
      takeaways={['Encode and decode in the same box.', 'Audio is generated locally.', 'Mic-to-text is out of scope.']}
      categoryName="Converters"
      seoTitle="Morse encode and audio"
      seoDescription="ITU Morse for A–Z and 0–9. Playback uses Web Audio. This is not a radio decoder."
      howToUse={['Type text.', 'Read Morse.', 'Press play.']}
      benefits={['No sample files to download.', 'Decode pasted Morse with / for spaces.']}
      formula="dot=1 unit; dash=3; letter gap=3; word gap=7"
      faqs={[
        { question: 'Can this decode Morse from audio?', answer: 'No. Playback only. Type Morse with dots, dashes, and / to decode to text.' },
        { question: 'What is SOS in Morse?', answer: '... --- ...' },
      ]}
      currentToolId="morse-code"
      relatedIds={['roman-numeral-date', 'barbell-plates', 'bpm-to-ms']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Converters', url: '/converters' },
        { name: 'Morse code translator', url: '/converters/morse-code-translator' },
      ]}
    >
      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
        <Card className={styles.inputCard}>
          <textarea className="min-h-40 w-full rounded-xl border border-zinc-200 p-3 font-mono text-sm dark:border-zinc-800" value={text} onChange={(e) => setText(e.target.value)} />
          <Button className="mt-4" type="button" onClick={() => void play()}>Play audio</Button>
        </Card>
        <Card className="p-6">
          <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">Morse</p>
          <pre className="whitespace-pre-wrap font-mono text-lg tracking-widest">{code}</pre>
          <p className="mt-6 text-xs font-semibold uppercase text-zinc-500">Decoded</p>
          <p className="font-mono">{decoded}</p>
        </Card>
      </div>
    </ToolPageShell>
  );
}
