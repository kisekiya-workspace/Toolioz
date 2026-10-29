'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function PixelArtClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cols, setCols] = useState(32);
  const [grid, setGrid] = useState(true);

  const run = (img: HTMLImageElement) => {
    const src = document.createElement('canvas');
    src.width = cols;
    src.height = Math.max(1, Math.round((img.height / img.width) * cols));
    const sctx = src.getContext('2d');
    const canvas = canvasRef.current;
    if (!sctx || !canvas) return;
    sctx.imageSmoothingEnabled = false;
    sctx.drawImage(img, 0, 0, src.width, src.height);
    const scale = 12;
    canvas.width = src.width * scale;
    canvas.height = src.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    if (grid) {
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      for (let x = 0; x <= src.width; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * scale, 0);
        ctx.lineTo(x * scale, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= src.height; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * scale);
        ctx.lineTo(canvas.width, y * scale);
        ctx.stroke();
      }
    }
  };

  return (
    <ToolPageShell
      title="Pixel Art from Image"
      subtitle="Pixel art from an image downsamples to a chosen column count with nearest-neighbour sampling, then upscales with an optional bead or cross-stitch grid. It is a planning chart, not a Minecraft schematic exporter. Dither studio remains the place for Floyd–Steinberg."
      directAnswerTitle="How is pixel art generated from a photo?"
      directAnswer="The photo is drawn into a tiny canvas whose width is the bead/pixel count. imageSmoothingEnabled is false, so each output cell is one averaged source block. A second canvas magnifies those cells and optionally strokes a grid for stitching or beads."
      takeaways={['Nearest neighbour, not dither.', 'Grid helps cross-stitch and beads.', 'Pair with the fabric calculator for Aida size.']}
      categoryName="Design"
      relatedCategoryId="design"
      seoTitle="Image to pixel grid"
      seoDescription="Downsampling uses canvas smoothing off. Palettes are not reduced unless the source already is. For ordered dither, use Dither Studio."
      howToUse={['Upload a photo.', 'Set columns.', 'Toggle grid.', 'Screenshot or print.']}
      benefits={['Cross-stitch fabric calculator is linked for stitch counts.', 'No server.']}
      formula="tinyWidth = columns; tinyHeight = round(srcH/srcW × columns)"
      faqs={[
        { question: 'Is this a Minecraft converter?', answer: 'It produces a grid. Block palettes are not mapped to IDs.' },
        { question: 'Where is dithering?', answer: 'Dither Studio on the design hub.' },
      ]}
      currentToolId="pixel-art-from-image"
      relatedIds={['drawing-grid', 'cross-stitch-fabric', 'dither-studio']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Design tools', url: '/design' },
        { name: 'Pixel art from image', url: '/design/pixel-art-from-image' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Columns" type="number" min={8} max={128} value={cols} onChange={(e) => setCols(Number(e.target.value) || 0)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={grid} onChange={(e) => setGrid(e.target.checked)} />
              Show grid
            </label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const img = new Image();
              img.onload = () => run(img);
              img.src = URL.createObjectURL(file);
            }} />
            <Button type="button" variant="outline" onClick={() => window.print()}>Print</Button>
          </div>
        </Card>
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800" />
      </div>
    </ToolPageShell>
  );
}
