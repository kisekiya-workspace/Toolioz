import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import AquariumClient from './AquariumClient';

const path = '/home/aquarium-volume-calculator';
const description =
  'Calculates rectangular aquarium litres, US gallons, and UK gallons from inner length, width, and water height, plus substrate volume.';

export const metadata = buildPageMetadata({
  title: 'Aquarium Volume Calculator',
  description,
  path,
  keywords: ['aquarium volume calculator', 'aquarium volume calculator litres', 'aquarium substrate calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Aquarium Volume Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Measure inside', text: 'Length, width, and water height in cm or inches.' },
          { name: 'Add substrate depth', text: 'Gravel litres use the footprint.' },
        ]}
        faqs={[{ question: 'How many litres is a 90×45×45 cm tank?', answer: '182.3 L, about 48 US gallons.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Aquarium volume calculator', url: path },
        ]}
      />
      <AquariumClient shape="rectangular" />
    </>
  );
}
