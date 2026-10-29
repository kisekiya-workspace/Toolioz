'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { tailwindShades, tailwindThemeCss } from '@/lib/makers/oklch';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function TailwindColorClient() {
  const [hex, setHex] = useState('#0ea5e9');
  const [name, setName] = useState('brand');
  const shades = useMemo(() => tailwindShades(hex), [hex]);
  const css = useMemo(() => tailwindThemeCss(name || 'brand', hex), [name, hex]);

  return (
    <ToolPageShell
      title="Tailwind Color Generator"
      subtitle="A Tailwind color generator builds 50–950 shades in OKLCH from a seed hex and prints Tailwind v4 @theme tokens. Lightness steps follow a 50–950 ramp. Chroma is reduced at the ends so 50 and 950 stay readable. v3 config objects are not emitted because the export syntax changed."
      directAnswerTitle="How are Tailwind 50–950 shades built?"
      directAnswer="The seed hex is converted to OKLCH. Hue is held. Lightness walks a fixed ramp from about 0.97 to 0.21. Each stop is converted back to hex and to an oklch() CSS colour. @theme maps --color-name-500 and neighbours."
      takeaways={[
        'OKLCH, not HSL, so chroma stays even.',
        'v4 @theme is the export. v3 JS config is omitted on purpose.',
        '500 is not guaranteed to equal the seed; the ramp owns lightness.',
      ]}
      categoryName="DevTools"
      relatedCategoryId="devtools"
      seoTitle="Tailwind OKLCH shades"
      seoDescription="Shades are a lightness ramp in OKLCH. Tailwind v4 reads @theme custom properties. If Tailwind changes token names again, the CSS block on this page should be edited, not a hidden JSON blob."
      howToUse={['Paste a hex.', 'Name the scale.', 'Copy @theme CSS.']}
      benefits={['Stops match 50, 100, … 950.', 'No Figma plugin required.']}
      formula="oklch(L_stop, C_adjusted, H_seed)"
      faqs={[
        { question: 'Is this Tailwind v4?', answer: 'The export is @theme { --color-* } which v4 reads. v3 module.exports palettes are not written.' },
        { question: 'Why is 500 not my hex?', answer: '500 uses a fixed lightness near 0.62. The seed mainly donates hue and chroma.' },
      ]}
      currentToolId="tailwind-color"
      relatedIds={['css-clamp', 'px-to-rem', 'color-converter']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Developer tools', url: '/devtools' },
        { name: 'Tailwind color generator', url: '/devtools/tailwind-color-generator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Seed hex" value={hex} onChange={(e) => setHex(e.target.value)} />
            <Input label="Token name" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="button" onClick={() => void navigator.clipboard.writeText(css)}>Copy @theme CSS</Button>
            <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-[11px] text-zinc-100">{css}</pre>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-2">
          {shades.map((row) => (
            <div key={row.stop} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <span className="size-10 rounded-lg border border-black/10" style={{ background: row.hex }} />
              <span className="w-10 font-mono text-xs">{row.stop}</span>
              <span className="font-mono text-xs">{row.hex}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolPageShell>
  );
}
