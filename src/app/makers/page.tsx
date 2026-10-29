import { JSONLD } from '@/components/ui/JSONLD';
import { buildItemListJsonLd, buildPageMetadata } from '@/lib/seo';
import { INDEXABLE_TOOLS } from '@/lib/tools';
import MakersHubClient from './MakersHubClient';

export const metadata = buildPageMetadata({
  title: 'Makers Calculators',
  description:
    'Knitting gauge, yarn, 3D filament, baking pans, coffee ratios, BPM delay, aquarium volume, and other browser calculators.',
  path: '/makers',
  keywords: [
    'knitting gauge calculator',
    'filament weight to length calculator',
    'bpm to ms',
    'aquarium volume calculator',
  ],
});

export default function Page() {
  const tools = INDEXABLE_TOOLS.filter(
    (tool) =>
      tool.category === 'makers' ||
      [
        '/devtools/css-clamp-generator',
        '/devtools/px-to-rem-converter',
        '/devtools/tailwind-color-generator',
        '/design/color-blindness-simulator',
        '/design/png-to-ico',
        '/design/svg-to-png',
        '/design/photo-print-size-calculator',
        '/design/drawing-grid-maker',
        '/design/pixel-art-from-image',
      ].includes(tool.href),
  );
  return (
    <>
      <JSONLD
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Makers calculators',
          url: 'https://toolioz.com/makers',
          mainEntity: buildItemListJsonLd({
            name: 'Makers calculators',
            description: 'Craft, kitchen, 3D printing, music, home, and electronics tools.',
            path: '/makers',
            items: tools.map((tool) => ({ name: tool.title, url: tool.href, description: tool.desc })),
          }),
        }}
      />
      <MakersHubClient />
    </>
  );
}
