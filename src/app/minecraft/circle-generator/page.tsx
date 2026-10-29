import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import CircleSphereClient from './CircleSphereClient';

const path = '/minecraft/circle-generator';
const description =
  'Generates Minecraft circle and sphere block maps from a diameter. Pixel math is fixed and does not change with patches.';

export const metadata = buildPageMetadata({
  title: 'Minecraft Circle and Sphere Generator',
  description,
  path,
  keywords: [
    'minecraft circle generator',
    'minecraft sphere generator',
    'minecraft circle chart',
    'pixel circle minecraft',
  ],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'Minecraft Circle and Sphere Generator',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to generate a Minecraft circle',
            description,
            path,
            steps: [
              { name: 'Choose circle or sphere', text: 'Use circle for a flat ring or disk. Use sphere for a 3D shell or ball.' },
              { name: 'Enter diameter', text: 'Diameter is width in blocks. WorldEdit radius is half of this number.' },
              { name: 'Set fill or thickness', text: 'Filled keeps every interior block. Hollow keeps a ring of the chosen thickness.' },
              { name: 'Copy the map', text: 'Copy ASCII or relative coordinates and place blocks from the gold center.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How does a Minecraft circle generator place blocks?',
              answer:
                'A block is included when the distance from the origin to that block center is at most half the diameter. Hollow rings keep only the outer thickness.',
            },
            {
              question: 'Does the Minecraft circle generator change after a patch?',
              answer: 'No. The map is pixel geometry on a block grid and does not depend on Minecraft version.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'Minecraft tools', url: '/minecraft' },
            { name: 'Circle and sphere generator', url: path },
          ]),
        ]}
      />
      <CircleSphereClient />
    </>
  );
}
