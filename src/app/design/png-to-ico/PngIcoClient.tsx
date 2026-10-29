'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { pngBlobToIco, rasterizeToPng } from '@/lib/makers/ico';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

const SIZES = [16, 32, 48, 256];

export default function PngIcoClient() {
  const [note, setNote] = useState('Drop a PNG. A multi-size .ico with 16, 32, 48, and 256 px layers is built locally.');

  const convert = async (file: File) => {
    const img = new Image();
    img.onload = async () => {
      const pngs = await Promise.all(
        SIZES.map(async (size) => ({ size, blob: await rasterizeToPng(img, size, img.naturalWidth, img.naturalHeight) })),
      );
      const ico = await pngBlobToIco(pngs);
      const url = URL.createObjectURL(ico);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon.ico';
      a.click();
      setNote(`Wrote ${SIZES.join(', ')} px PNG layers into one ICO.`);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolPageShell
      title="PNG to ICO Converter"
      subtitle="A PNG to ICO converter rasters the source to 16, 32, 48, and 256 px PNG images and packs them into a real multi-size .ico. Vista-style PNG-in-ICO is used. The file never uploads. The existing emoji favicon tool still makes a single PNG; this page is the icon container."
      directAnswerTitle="How is a multi-size ICO built?"
      directAnswer="ICONDIR lists each layer. Each ICONDIRENTRY points at a PNG payload. Width 256 is stored as 0 in the classic 1-byte field. Windows and browsers pick the nearest layer."
      takeaways={['Four sizes in one download.', 'Transparent PNG is preserved.', 'Link from favicon-generator for emoji sources.']}
      categoryName="Design"
      relatedCategoryId="design"
      seoTitle="PNG to ICO"
      seoDescription="ICO is a container. This page writes PNG images into that container at four sizes. It is not a Windows 3.x BMP-only icon."
      howToUse={['Drop a PNG.', 'Download favicon.ico.']}
      benefits={['256 px layer covers modern desktops.', 'No FreeConvert round-trip.']}
      formula="ICO = ICONDIR + n × ICONDIRENTRY + PNG payloads"
      faqs={[
        { question: 'Is this a real ICO?', answer: 'Yes. PNG-compressed layers inside an ICO directory.' },
        { question: 'Does SVG work?', answer: 'Rasterize SVG on the SVG to PNG page first, or paste a PNG.' },
      ]}
      currentToolId="png-to-ico"
      relatedIds={['svg-to-png', 'photo-print-size', 'x-hidden-image']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Design tools', url: '/design' },
        { name: 'PNG to ICO', url: '/design/png-to-ico' },
      ]}
    >
      <Card className={`${styles.inputCard} mx-auto max-w-xl`}>
        <input type="file" accept="image/png,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void convert(f); }} />
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{note}</p>
        <Button className="mt-4" type="button" variant="outline" onClick={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()}>Choose PNG</Button>
      </Card>
    </ToolPageShell>
  );
}
