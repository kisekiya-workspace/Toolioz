import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: 'Home and DIY Calculators',
  description:
    'Aquarium volume by tank shape, board feet for lumber and logs, wallpaper with pattern repeat, and miter angles.',
  path: '/home',
  keywords: ['aquarium volume calculator bowfront', 'board feet calculator for logs', 'wallpaper calculator with pattern repeat', 'miter angle calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Home calculators',
          description: 'Aquarium volume, board feet, wallpaper, and miter angles.',
          path: '/home',
        })}
      />
      <ClusterHub
        prefix="/home"
        eyebrow="Home cluster"
        title="Home"
        highlight="calculators"
        subtitle="Tank litres, lumber scales, wallpaper rolls with repeat, and saw angles. Results are planning figures, not a substitute for a building code or livestock care."
        groupTitle="Aquarium, lumber, walls, saws"
        groupDescription="Shape-specific tank pages, Doyle/Scribner log rules, and compound miters."
      />
    </>
  );
}
