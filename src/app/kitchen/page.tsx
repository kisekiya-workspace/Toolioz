import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: 'Kitchen Calculators',
  description:
    'Baking pan size converter, cups to grams, sourdough hydration, coffee brew ratios, and cake serving counts.',
  path: '/kitchen',
  keywords: ['baking pan size converter', 'cups to grams flour', 'sourdough hydration calculator', 'coffee ratio calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Kitchen calculators',
          description: 'Pan volumes, ingredient weights, sourdough, coffee, and cake servings.',
          path: '/kitchen',
        })}
      />
      <ClusterHub
        prefix="/kitchen"
        eyebrow="Kitchen cluster"
        title="Kitchen"
        highlight="calculators"
        subtitle="Pan volumes, cups-to-grams ingredients, baker’s percentages, brew ratios, and cake slices. Weights stay in the browser."
        groupTitle="Baking and coffee"
        groupDescription="Volume scaling and gram conversions with US, UK, and Australian cups."
      />
    </>
  );
}
