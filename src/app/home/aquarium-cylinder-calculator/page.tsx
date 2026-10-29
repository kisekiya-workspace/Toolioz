import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import AquariumClient from '../aquarium-volume-calculator/AquariumClient';

const path = '/home/aquarium-cylinder-calculator';
const description = 'Calculates cylinder aquarium volume from diameter and water height in litres and gallons.';

export const metadata = buildPageMetadata({
  title: 'Cylinder Aquarium Volume Calculator',
  description,
  path,
  keywords: ['cylinder aquarium volume calculator', 'round aquarium litres'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cylinder Aquarium Volume Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Enter diameter and height', text: 'Volume is π r² h.' }]}
        faqs={[{ question: 'How many litres is a 50 cm diameter cylinder 60 cm high?', answer: 'About 118 L.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Cylinder aquarium volume', url: path },
        ]}
      />
      <AquariumClient shape="cylinder" />
    </>
  );
}
