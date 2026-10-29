'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { NEEDLE_SIZES, nearestNeedle } from '@/lib/makers/needle-sizes';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function NeedleClient() {
  const [mm, setMm] = useState(4);
  const match = useMemo(() => nearestNeedle(mm), [mm]);

  return (
    <ToolPageShell
      title="Knitting Needle Size Converter"
      subtitle="A knitting needle size converter maps millimetres to US, UK, and Japan knitting numbers and to crochet hook letters. The millimetre column is the Craft Yarn Council standard; letter and number labels are the usual retail names for that millimetre."
      directAnswerTitle="What millimetre is a US 8 knitting needle?"
      directAnswer="A US 8 knitting needle is 5.0 mm. UK 6 is the same millimetre. A US H-8 crochet hook is also 5.0 mm. Japan 10 is listed on the same row. Always trust the millimetre stamp on the needle over a worn painted size."
      takeaways={[
        'Millimetres are the only column that is physically the shaft diameter.',
        'US knitting numbers and crochet letters can share a millimetre.',
        'UK sizes run the other way: smaller UK numbers are larger needles.',
        'Japan sizes in this table follow common CYC-aligned charts.',
      ]}
      categoryName="Craft"
      seoTitle="Knitting needle size chart"
      seoDescription="Retail needles are sold as millimetres plus a regional number or letter. This chart does not convert gauge. A US 6 and a 4.0 mm needle are the same shaft; fabric density still depends on yarn and the knitter."
      howToUse={[
        'Type a millimetre value, or scan the full chart.',
        'Read US, UK, Japan, and crochet labels on the highlighted row.',
        'If two labels disagree, use the millimetre engraved on the needle.',
      ]}
      benefits={[
        'Knitting and crochet share one table so a millimetre search hits both.',
        'Gaps such as no UK size for 3.5 mm are shown as dashes, not invented numbers.',
        'The nearest-row match still works for odd millimetres such as 4.25.',
      ]}
      formula="match = nearest CYC millimetre to the typed shaft diameter"
      faqs={[
        {
          question: 'Is a US 8 knitting needle the same as an H-8 hook?',
          answer: 'Both are 5.0 mm in the Craft Yarn Council chart. The tools are different, the shaft diameter is not.',
        },
        {
          question: 'Why is there no UK size for 3.5 mm?',
          answer: 'Historic UK sizing skipped some millimetres. The millimetre is still 3.5; there is no traditional UK integer for that shaft.',
        },
        {
          question: 'Does this converter pick a needle for a yarn?',
          answer: 'No. Yarn labels suggest a millimetre range. Gauge fabric still has to be swatched.',
        },
      ]}
      currentToolId="needle-size-converter"
      relatedIds={['knitting-gauge', 'crochet-gauge', 'yarn-calculator', 'cross-stitch-fabric']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Craft calculators', url: '/craft' },
        { name: 'Needle size converter', url: '/craft/needle-size-converter' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Millimetres" type="number" min={1} max={30} step={0.25} value={mm} onChange={(e) => setMm(Number(e.target.value) || 0)} />
            <Card className="p-4 text-sm">
              <p className="font-semibold">{match.mm} mm</p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">US knitting {match.us} · UK {match.uk} · Japan {match.jp}</p>
              <p className="text-zinc-600 dark:text-zinc-400">Crochet US {match.crochetUS} · UK {match.crochetUK}</p>
            </Card>
            <p className="text-xs text-zinc-500">
              Chart aligned with the{' '}
              <a href="https://www.craftyarncouncil.com/standards/knitting-needle-sizes" target="_blank" rel="noreferrer" className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">
                Craft Yarn Council knitting needle sizes
              </a>
              .
            </p>
          </div>
        </Card>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
              <tr>
                {['mm', 'US knit', 'UK', 'Japan', 'Crochet US', 'Crochet UK'].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEEDLE_SIZES.map((row) => (
                <tr key={row.mm} className={row.mm === match.mm ? 'bg-pink-50 dark:bg-pink-950/40' : 'odd:bg-white even:bg-zinc-50/70 dark:odd:bg-zinc-950 dark:even:bg-zinc-900/40'}>
                  <td className="px-3 py-2 font-mono">{row.mm.toFixed(2)}</td>
                  <td className="px-3 py-2">{row.us}</td>
                  <td className="px-3 py-2">{row.uk}</td>
                  <td className="px-3 py-2">{row.jp}</td>
                  <td className="px-3 py-2">{row.crochetUS}</td>
                  <td className="px-3 py-2">{row.crochetUK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolPageShell>
  );
}
