import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import PanClient from './PanClient';

const path = '/kitchen/baking-pan-size-converter';
const description =
  'Scales cake batter between round, square, rectangular, loaf, and bundt pans using geometric volume and US cup equivalents.';

export const metadata = buildPageMetadata({
  title: 'Baking Pan Size Converter',
  description,
  path,
  keywords: ['baking pan size converter', 'cake pan size converter', 'cake pan size equivalents', 'cake pan size chart'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Baking Pan Size Converter"
        description={description}
        path={path}
        steps={[
          { name: 'Enter the recipe pan', text: 'Use a preset or type diameter, sides, and depth in inches.' },
          { name: 'Enter the bake pan', text: 'The volume ratio is the recipe scale factor.' },
        ]}
        faqs={[
          {
            question: 'Can 9-inch round batter fill a 9×13 pan?',
            answer: 'A 9×2 in round is about half of a 9×13×2 in pan, so the scale factor is near 1.8.',
          },
        ]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Baking pan size converter', url: path },
        ]}
      />
      <PanClient />
    </>
  );
}
