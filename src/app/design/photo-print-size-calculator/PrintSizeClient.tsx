'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { PRINT_PRESETS, pixelsNeeded, printSize } from '@/lib/makers/photo-print';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function PrintSizeClient() {
  const [w, setW] = useState(6000);
  const [h, setH] = useState(4000);
  const [dpi, setDpi] = useState(300);
  const size = useMemo(() => printSize({ widthPx: w, heightPx: h, dpi }), [w, h, dpi]);
  const need = useMemo(() => pixelsNeeded(8, 10, dpi), [dpi]);

  return (
    <ToolPageShell
      title="Photo Print Size Calculator"
      subtitle="A photo print size calculator divides pixel width and height by DPI to get inches, then centimetres. 6000×4000 at 300 DPI is 20×13.33 in (50.8×33.9 cm). Reverse: an 8×10 at 300 DPI needs 2400×3000 px."
      directAnswerTitle="How large does a photo print at 300 DPI?"
      directAnswer="Inches = pixels / DPI. A 24 MP 6000×4000 file is 20×13.33 inches at 300 DPI. At 150 DPI the same file is twice as large on paper and softer."
      takeaways={['300 DPI is a common photo-lab target.', '72 DPI is screen, not a quality print.', 'Presets show pixels needed for 4×6 through A3.']}
      categoryName="Design"
      relatedCategoryId="design"
      seoTitle="Pixels to print size"
      seoDescription="Print size is a division, not a resampling. This page does not enlarge a file; it reports how large the existing pixels can print."
      howToUse={['Enter width, height, DPI.', 'Read inches and centimetres.', 'Use presets to see required pixels.']}
      benefits={['Inches and centimetres together.', 'Megapixels listed for camera comparison.']}
      formula="inches = pixels / DPI;  cm = inches × 2.54"
      faqs={[
        { question: 'What DPI should a photo print use?', answer: '300 is a common lab target. Large wall prints are often viewed farther away and can use 150–200.' },
        { question: 'Does this upscale the image?', answer: 'No. It only reports geometry.' },
      ]}
      currentToolId="photo-print-size"
      relatedIds={['svg-to-png', 'drawing-grid', 'pixel-art-from-image']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Design tools', url: '/design' },
        { name: 'Photo print size calculator', url: '/design/photo-print-size-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Width (px)" type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} />
            <Input label="Height (px)" type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} />
            <Input label="DPI" type="number" value={dpi} onChange={(e) => setDpi(Number(e.target.value) || 0)} />
            <div className="flex flex-wrap gap-2">
              {PRINT_PRESETS.map((row) => (
                <Button key={row.label} type="button" size="sm" variant="outline" onClick={() => { const p = pixelsNeeded(row.w, row.h, dpi); setW(p.widthPx); setH(p.heightPx); }}>
                  {row.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>
        <ResultCard
          label="Print size"
          value={`${fmtNum(size.widthIn, 2)} × ${fmtNum(size.heightIn, 2)} in`}
          gradient="linear-gradient(160deg,#0f766e 0%,#134e4a 55%,#1c1917 100%)"
          stats={[
            ['Centimetres', `${fmtNum(size.widthCm, 1)} × ${fmtNum(size.heightCm, 1)}`],
            ['Megapixels', fmtNum(size.megapixels, 2)],
            [`8×10 at ${dpi} DPI`, `${need.widthPx} × ${need.heightPx} px`],
          ]}
        />
      </div>
    </ToolPageShell>
  );
}
