import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import AquariumClient from '../aquarium-volume-calculator/AquariumClient';

const path = '/home/aquarium-hexagon-calculator';
const description = 'Calculates hexagon aquarium volume from point-to-point width and water height.';

export const metadata = buildPageMetadata({
  title: 'Hexagon Aquarium Volume Calculator',
  description,
  path,
  keywords: ['hexagon aquarium volume calculator', 'hex tank litres'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Hexagon Aquarium Volume Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Enter width and height', text: 'Regular hexagon prism volume.' }]}
        faqs={[{ question: 'How is a hexagon tank calculated?', answer: 'Regular hexagon area times water height.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Hexagon aquarium volume', url: path },
        ]}
      />
      <AquariumClient shape="hexagon" />
    </>
  );
}
