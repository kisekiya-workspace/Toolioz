import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import DndHubClient from './DndHubClient';

export const metadata = buildPageMetadata({
  title: 'D&D Dice and Encounter Tools',
  description:
    'D&D dice roller with advantage notation and a 5e encounter calculator using the 2014 Dungeon Master\'s Guide XP table.',
  path: '/dnd',
  keywords: ['dnd dice roller', '5e encounter calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'D&D tools',
          description: 'Dice roller and 5e encounter calculator.',
          path: '/dnd',
        })}
      />
      <DndHubClient />
    </>
  );
}
