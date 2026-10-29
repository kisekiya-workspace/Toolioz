import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import PokemonHubClient from './PokemonHubClient';

export const metadata = buildPageMetadata({
  title: 'Pokemon Type Tools',
  description:
    'Pokemon dual-type weakness calculator and type chart using the Generation 6 table frozen since Fairy was added in 2013.',
  path: '/pokemon',
  keywords: ['pokemon type weakness calculator', 'pokemon type chart'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Pokemon type tools',
          description: 'Dual-type weakness calculator and type chart.',
          path: '/pokemon',
        })}
      />
      <PokemonHubClient />
    </>
  );
}
