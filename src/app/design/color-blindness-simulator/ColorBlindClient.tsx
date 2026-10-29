'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { simulateHex } from '@/lib/makers/colorblind';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const KINDS = ['protanopia', 'deuteranopia', 'tritanopia'] as const;

export default function ColorBlindClient() {
  const [hex, setHex] = useState('#2563eb');
  const [palette, setPalette] = useState('#ef4444,#22c55e,#2563eb,#eab308,#111827');
  const [kind, setKind] = useState<(typeof KINDS)[number]>('deuteranopia');
  const colors = useMemo(() => palette.split(/[\s,]+/).filter((c) => c.startsWith('#')), [palette]);

  const onImage = (file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.getElementById('cb-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = Math.min(640, img.width);
      const h = (img.height / img.width) * w;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < data.data.length; i += 4) {
        const sim = simulateHex(
          `#${[data.data[i], data.data[i + 1], data.data[i + 2]].map((n) => n.toString(16).padStart(2, '0')).join('')}`,
          kind,
        );
        const r = Number.parseInt(sim.slice(1, 3), 16);
        const g = Number.parseInt(sim.slice(3, 5), 16);
        const b = Number.parseInt(sim.slice(5, 7), 16);
        data.data[i] = r;
        data.data[i + 1] = g;
        data.data[i + 2] = b;
      }
      ctx.putImageData(data, 0, 0);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolPageShell
      title="Color Blindness Simulator"
      subtitle="A color blindness simulator applies Brettel/Viénot-style matrices for protanopia, deuteranopia, and tritanopia to hex swatches or an uploaded image. Processing stays in the tab. It is a planning preview, not a clinical diagnosis."
      directAnswerTitle="How does a color blindness simulator work?"
      directAnswer="Each RGB pixel is multiplied by a 3×3 matrix for the chosen deficiency. Deuteranopia reduces green-cone contribution. The same matrix is applied to palette hex values so a UI kit can be checked without an image."
      takeaways={['Three matrices: protan, deutan, tritan.', 'Images never upload.', 'Anomalous trichromacy (partial) is not a separate slider.']}
      categoryName="Design"
      relatedCategoryId="design"
      seoTitle="Color blindness simulation"
      seoDescription="Matrices approximate dichromacy. They do not model every person’s cone response. Use them to catch red/green collisions in a palette, then test with real users."
      howToUse={['Paste hex colours.', 'Pick a deficiency.', 'Optionally drop an image.']}
      benefits={['Palette and image share the same matrix.', 'No account.']}
      formula="RGB' = M × RGB  (Viénot 1999-style)"
      faqs={[
        { question: 'Can this simulate color blindness for images?', answer: 'Yes. The canvas rewrite uses the same matrix as the hex palette.' },
        { question: 'Is this medical?', answer: 'No. It is a design preview.' },
      ]}
      accuracyNote="The simulation uses a simplified RGB matrix. It is a design preview, not a clinical model of anyone’s vision."
      currentToolId="color-blindness"
      relatedIds={['tailwind-color', 'color-converter', 'png-to-ico']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Design tools', url: '/design' },
        { name: 'Color blindness simulator', url: '/design/color-blindness-simulator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((id) => (
                <Button key={id} type="button" size="sm" variant={kind === id ? 'default' : 'outline'} onClick={() => setKind(id)}>{id}</Button>
              ))}
            </div>
            <Input label="Single hex" value={hex} onChange={(e) => setHex(e.target.value)} />
            <label className={styles.label}>Palette (comma-separated)
              <textarea className="mt-2 min-h-20 w-full rounded-xl border border-zinc-200 p-3 font-mono text-xs dark:border-zinc-800" value={palette} onChange={(e) => setPalette(e.target.value)} />
            </label>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImage(f); }} />
          </div>
        </Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="size-12 rounded-xl border" style={{ background: hex }} />
            <span className="size-12 rounded-xl border" style={{ background: simulateHex(hex, kind) }} />
            <span className="font-mono text-xs">{simulateHex(hex, kind)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <div key={c} className="flex flex-col items-center gap-1">
                <span className="size-10 rounded-lg border" style={{ background: c }} />
                <span className="size-10 rounded-lg border" style={{ background: simulateHex(c, kind) }} />
              </div>
            ))}
          </div>
          <canvas id="cb-canvas" className="max-w-full rounded-xl border border-zinc-200 dark:border-zinc-800" />
        </div>
      </div>
    </ToolPageShell>
  );
}
