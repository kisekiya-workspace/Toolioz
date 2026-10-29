import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: '3D Printing and Making Calculators',
  description:
    'Filament weight to length converter, 3D print cost calculator, epoxy resin volume, and candle wax fragrance load.',
  path: '/maker',
  keywords: ['filament weight to length calculator', '3d print cost calculator', 'epoxy resin calculator', 'candle wax calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Making calculators',
          description: 'Filament, print cost, epoxy, and candle wax.',
          path: '/maker',
        })}
      />
      <ClusterHub
        prefix="/maker"
        eyebrow="Making cluster"
        title="Making"
        highlight="calculators"
        subtitle="Filament length from mass, print electricity cost, epoxy mix ratios, and candle fragrance load. Densities are published material values, not marketplace guesses."
        groupTitle="3D printing, resin, candles"
        groupDescription="Mass, volume, and mix math that runs locally, including optional slicer-comment import."
      />
    </>
  );
}
