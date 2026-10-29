import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import PokemonWeaknessClient from './PokemonWeaknessClient';

const path = '/pokemon/type-weakness-calculator';
const description =
  'Calculates dual-type Pokemon weaknesses, resistances, and immunities from the Generation 6 type chart used since 2013.';

export const metadata = buildPageMetadata({
  title: 'Pokemon Dual-Type Weakness Calculator',
  description,
  path,
  keywords: [
    'pokemon type weakness calculator',
    'pokemon dual type calculator',
    'pokemon type chart',
    '4x weakness pokemon',
  ],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'Pokemon Dual-Type Weakness Calculator',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to calculate dual-type Pokemon weaknesses',
            description,
            path,
            steps: [
              { name: 'Select type 1', text: 'Pick the first defending type.' },
              { name: 'Select type 2', text: 'Pick a second type or None for a single-type Pokemon.' },
              { name: 'Read buckets', text: '4×, 2×, 1×, ½×, ¼×, and immunities are listed. The full Pokemon type chart is below.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How are dual-type Pokemon weaknesses calculated?',
              answer:
                'Each attacking type is multiplied against both defending types. Two 2× matchups become 4×. A 0 on either type is an immunity. The chart has been stable since Fairy was added in 2013.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'Pokemon tools', url: '/pokemon' },
            { name: 'Type weakness calculator', url: path },
          ]),
        ]}
      />
      <PokemonWeaknessClient />
    </>
  );
}
