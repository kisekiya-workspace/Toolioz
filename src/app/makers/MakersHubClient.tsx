'use client';

import { GamingHub } from '@/components/gaming/GamingHub';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';

export default function MakersHubClient() {
  const makers = TOOLS.filter((tool) => tool.category === 'makers');
  const clamp = TOOLS.filter((tool) =>
    ['/devtools/css-clamp-generator', '/devtools/px-to-rem-converter', '/devtools/tailwind-color-generator'].includes(tool.href),
  );
  const design = TOOLS.filter((tool) =>
    [
      '/design/color-blindness-simulator',
      '/design/png-to-ico',
      '/design/svg-to-png',
      '/design/photo-print-size-calculator',
      '/design/drawing-grid-maker',
      '/design/pixel-art-from-image',
    ].includes(tool.href),
  );
  return (
    <GamingHub
      eyebrow="Evergreen maker math"
      title="Makers"
      highlight="calculators"
      subtitle="Knitting, baking, 3D printing, music, home, and electronics tools that run in the browser. Formulas are documented on each page and do not need a server."
      searchPlaceholder="Search gauge, yarn, filament, pans, bpm…"
      groups={[
        {
          title: 'Craft',
          description: 'Gauge, yarn, needle sizes, cross stitch fabric, and quilt layout.',
          href: '/craft',
          tools: makers.filter((tool) => tool.href.startsWith('/craft')),
        },
        {
          title: 'Kitchen',
          description: 'Pan volumes, cups to grams, sourdough hydration, coffee ratios, and cake servings.',
          href: '/kitchen',
          tools: makers.filter((tool) => tool.href.startsWith('/kitchen')),
        },
        {
          title: '3D printing and making',
          description: 'Filament length, print cost, epoxy volume, and candle wax load.',
          href: '/maker',
          tools: makers.filter((tool) => tool.href.startsWith('/maker')),
        },
        {
          title: 'Home',
          description: 'Aquarium volume, board feet, wallpaper rolls, and miter angles.',
          href: '/home',
          tools: makers.filter((tool) => tool.href.startsWith('/home')),
        },
        {
          title: 'Music and video',
          description: 'BPM delay times, chord transpose, note frequency, and file size.',
          href: '/music',
          tools: makers.filter((tool) => tool.href.startsWith('/music')),
        },
        {
          title: 'Electronics and converters',
          description: 'Resistor color codes, LED resistors, Roman dates, Morse, and barbell plates.',
          href: '/electronics',
          tools: makers.filter((tool) => tool.href.startsWith('/electronics') || tool.href.startsWith('/converters')),
        },
        {
          title: 'CSS and type',
          description: 'Fluid clamp(), px to rem, and Tailwind shade tokens.',
          href: '/devtools',
          tools: clamp,
        },
        {
          title: 'Image utilities',
          description: 'Color-blind simulation, ICO, SVG raster, print size, drawing grids, and pixel art.',
          href: '/design',
          tools: design,
        },
      ]}
    />
  );
}
