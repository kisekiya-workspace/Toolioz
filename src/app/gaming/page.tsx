import { JSONLD } from '@/components/ui/JSONLD';
import { buildItemListJsonLd, buildPageMetadata } from '@/lib/seo';
import { SENSITIVITY_PAIRS } from '@/lib/gaming/sensitivity-pairs';
import { INDEXABLE_TOOLS } from '@/lib/tools';
import GamingHubClient from './GamingHubClient';

export const metadata = buildPageMetadata({
  title: 'Gaming Calculators',
  description:
    'Minecraft circle and nether tools, a mouse sensitivity converter with eDPI, Pokemon type weakness, and D&D 5e calculators.',
  path: '/gaming',
  keywords: ['minecraft circle generator', 'mouse sensitivity converter', 'pokemon type weakness', 'dnd dice roller'],
});

export default function Page() {
  const tools = INDEXABLE_TOOLS.filter((tool) => tool.category === 'gaming');
  const pairs = SENSITIVITY_PAIRS.map((pair) => ({
    name: pair.title,
    url: `/gaming/${pair.slug}`,
    description: pair.description,
  }));
  return (
    <>
      <JSONLD
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Gaming calculators',
          url: 'https://toolioz.com/gaming',
          mainEntity: buildItemListJsonLd({
            name: 'Gaming calculators',
            description: 'Evergreen Minecraft, FPS, Pokemon, and D&D tools.',
            path: '/gaming',
            items: [
              ...tools.map((tool) => ({ name: tool.title, url: tool.href, description: tool.desc })),
              ...pairs,
            ],
          }),
        }}
      />
      <GamingHubClient />
    </>
  );
}
