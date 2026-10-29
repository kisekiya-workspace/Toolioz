import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import NetherPortalClient from './NetherPortalClient';

const path = '/minecraft/nether-portal-calculator';
const description =
  'Converts Overworld coordinates to the Nether by dividing X and Z by eight, then lists the matching return portal.';

export const metadata = buildPageMetadata({
  title: 'Minecraft Nether Portal Calculator',
  description,
  path,
  keywords: ['nether portal calculator', 'minecraft nether coordinates', 'overworld to nether', 'portal linking minecraft'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'Minecraft Nether Portal Calculator',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to convert nether portal coordinates',
            description,
            path,
            steps: [
              { name: 'Choose direction', text: 'Overworld to Nether divides X and Z by 8. Nether to Overworld multiplies by 8.' },
              { name: 'Enter XYZ', text: 'Use the existing frame or the planned build coordinates, including negative values.' },
              { name: 'Build the pair', text: 'Place the second portal at the listed point and light it so Java Edition does not spawn another.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How does a Minecraft nether portal calculator convert coordinates?',
              answer:
                'Overworld X and Z are divided by 8 with truncation toward zero. Nether X and Z are multiplied by 8. Y is copied. Java Edition searches 16 blocks in the Nether or 128 blocks in the Overworld.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'Minecraft tools', url: '/minecraft' },
            { name: 'Nether portal calculator', url: path },
          ]),
        ]}
      />
      <NetherPortalClient />
    </>
  );
}
