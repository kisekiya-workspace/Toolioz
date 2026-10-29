import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import MinecraftHubClient from './MinecraftHubClient';

export const metadata = buildPageMetadata({
  title: 'Minecraft Calculators',
  description:
    'Minecraft circle and sphere generator, nether portal calculator, and shulker box stack counts. Geometry that does not change with patches.',
  path: '/minecraft',
  keywords: ['minecraft circle generator', 'nether portal calculator', 'shulker box calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Minecraft calculators',
          description: 'Circle, sphere, nether portal, and shulker box tools.',
          path: '/minecraft',
        })}
      />
      <MinecraftHubClient />
    </>
  );
}
