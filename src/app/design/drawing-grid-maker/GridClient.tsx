'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function GridClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState(8);
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const draw = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxW = 900;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1;
    const step = canvas.width / cells;
    for (let i = 1; i < cells; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, canvas.height);
      ctx.stroke();
    }
    const rows = Math.round(canvas.height / step);
    for (let j = 1; j < rows; j += 1) {
      ctx.beginPath();
      ctx.moveTo(0, j * step);
      ctx.lineTo(canvas.width, j * step);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    for (let i = 0; i < cells; i += 1) ctx.fillText(String(i + 1), i * step + 4, 14);
  };

  return (
    <ToolPageShell
      title="Drawing Grid Maker"
      subtitle="A drawing grid maker overlays numbered cells on a photo so the scene can be copied square by square. Cell count is across the width. Print uses the browser print dialog. Measurements are relative to the photo, not a calibrated A4 millimetre ruler unless the photo itself is to scale."
      directAnswerTitle="How does a grid maker for drawing work?"
      directAnswer="The image is drawn to a canvas. Vertical lines split the width into N cells. Horizontal lines use the same pixel pitch so cells stay square. Numbers label columns. Print CSS sends that canvas to paper."
      takeaways={['Square cells from width division.', 'Numbers help keep place.', 'A4 size depends on the printer scale, not a hidden mm grid.']}
      categoryName="Design"
      relatedCategoryId="design"
      seoTitle="Photo drawing grid"
      seoDescription="Artists copy a scene by matching grid squares. This page does not auto-detect vanishing points. It is a measured overlay."
      howToUse={['Upload a photo.', 'Set cells across.', 'Print or screenshot.']}
      benefits={['Local photo.', 'Square cells rather than stretched rectangles.']}
      formula="cellPx = imageWidth / cellsAcross"
      faqs={[
        { question: 'Can the grid be in centimetres?', answer: 'Cells are even divisions of the photo. True cm needs a photo shot with a ruler in frame.' },
        { question: 'Is there PDF export?', answer: 'Use the browser print dialog and save as PDF.' },
      ]}
      currentToolId="drawing-grid"
      relatedIds={['pixel-art-from-image', 'photo-print-size', 'cross-stitch-fabric']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Design tools', url: '/design' },
        { name: 'Drawing grid maker', url: '/design/drawing-grid-maker' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Cells across" type="number" min={2} max={32} value={cells} onChange={(e) => setCells(Number(e.target.value) || 0)} />
            <div className="flex gap-2">
              {(['cm', 'in'] as const).map((u) => (
                <Button key={u} type="button" size="sm" variant={unit === u ? 'default' : 'outline'} onClick={() => setUnit(u)}>{u} label</Button>
              ))}
            </div>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const img = new Image();
              img.onload = () => draw(img);
              img.src = URL.createObjectURL(file);
            }} />
            <Button type="button" onClick={() => window.print()}>Print</Button>
            <p className="text-xs text-zinc-500">Label unit is a reminder only. Grid pitch is even pixels ({unit}).</p>
          </div>
        </Card>
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800" />
      </div>
    </ToolPageShell>
  );
}
