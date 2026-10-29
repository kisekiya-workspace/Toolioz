import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import AquariumClient from '../aquarium-volume-calculator/AquariumClient';

const path = '/home/aquarium-bowfront-calculator';
const description =
  'Calculates bowfront aquarium volume by adding an elliptical bulge to a rectangular box, in litres and gallons.';

export const metadata = buildPageMetadata({
  title: 'Bowfront Aquarium Volume Calculator',
  description,
  path,
  keywords: ['aquarium volume calculator bowfront', 'bowfront aquarium litres', 'bowfront tank gallons'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Bowfront Aquarium Volume Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Measure the box', text: 'Length, width, height, and centre bulge.' },
          { name: 'Read litres', text: 'Extra volume is π × L × bulge × H / 4.' },
        ]}
        faqs={[{ question: 'How is bowfront volume calculated?', answer: 'Rectangle plus an elliptical cap using the centre bulge.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Bowfront aquarium volume', url: path },
        ]}
      />
      <AquariumClient shape="bowfront" />
    </>
  );
}
