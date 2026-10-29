'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function SvgPngClient() {
  const [width, setWidth] = useState(512);
  const [note, setNote] = useState('Drop an SVG. Transparent PNG is drawn at the typed width.');

  const convert = async (file: File) => {
    const text = await file.text();
    const blob = new Blob([text], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = width / img.naturalWidth;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((out) => {
        if (!out) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(out);
        a.download = 'export.png';
        a.click();
        setNote(`Exported ${canvas.width}×${canvas.height} PNG.`);
      }, 'image/png');
    };
    img.src = url;
  };

  return (
    <ToolPageShell
      title="SVG to PNG Converter"
      subtitle="An SVG to PNG converter draws the vector at a chosen width with a transparent canvas. Scale is width / native SVG width. Batch is one file at a time in this version. Nothing is uploaded."
      directAnswerTitle="How does SVG to PNG keep transparency?"
      directAnswer="The canvas is cleared, then the SVG image is drawn. Unfilled pixels stay alpha 0. Width is typed; height follows aspect ratio."
      takeaways={['Transparent background.', 'Width sets export size.', 'Fonts inside the SVG must already be outlined or system-available.']}
      categoryName="Design"
      relatedCategoryId="design"
      seoTitle="SVG to PNG"
      seoDescription="Rasterization is canvas drawImage of an SVG blob. High-quality here means a large pixel width, not a proprietary encoder."
      howToUse={['Drop an SVG.', 'Set width in pixels.', 'Download PNG.']}
      benefits={['No server.', 'Transparent by default.']}
      formula="height = svgHeight × (targetWidth / svgWidth)"
      faqs={[
        { question: 'Is batch export included?', answer: 'One file per run. Repeat the picker for more files.' },
        { question: 'Why is text missing?', answer: 'Web fonts not loaded in the SVG will fall back. Convert text to outlines in the editor first.' },
      ]}
      currentToolId="svg-to-png"
      relatedIds={['png-to-ico', 'photo-print-size', 'drawing-grid']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Design tools', url: '/design' },
        { name: 'SVG to PNG', url: '/design/svg-to-png' },
      ]}
    >
      <Card className={`${styles.inputCard} mx-auto max-w-xl`}>
        <div className={styles.inputGroup}>
          <Input label="Width (px)" type="number" min={16} value={width} onChange={(e) => setWidth(Number(e.target.value) || 0)} />
          <input type="file" accept=".svg,image/svg+xml" onChange={(e) => { const f = e.target.files?.[0]; if (f) void convert(f); }} />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{note}</p>
        </div>
      </Card>
    </ToolPageShell>
  );
}
