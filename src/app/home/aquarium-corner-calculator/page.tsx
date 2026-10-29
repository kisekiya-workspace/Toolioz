import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import AquariumClient from '../aquarium-volume-calculator/AquariumClient';

const path = '/home/aquarium-corner-calculator';
const description = 'Calculates a corner aquarium as a right-triangle prism from the two wall legs and water height.';

export const metadata = buildPageMetadata({
  title: 'Corner Aquarium Volume Calculator',
  description,
  path,
  keywords: ['corner aquarium volume calculator', 'triangle aquarium litres'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Corner Aquarium Volume Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Enter wall legs and height', text: 'Volume is ½ × L × W × H.' }]}
        faqs={[{ question: 'How is a corner tank calculated?', answer: 'Right-triangle prism: half length times width times height.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Corner aquarium volume', url: path },
        ]}
      />
      <AquariumClient shape="corner" />
    </>
  );
}
