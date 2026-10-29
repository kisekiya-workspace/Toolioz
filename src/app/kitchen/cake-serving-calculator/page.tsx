import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CakeClient from './CakeClient';

const path = '/kitchen/cake-serving-calculator';
const description =
  'Counts party and wedding cake slices from round tier diameters using 4 in² party slices and 2 in² wedding slices.';

export const metadata = buildPageMetadata({
  title: 'Cake Serving Calculator',
  description,
  path,
  keywords: ['cake serving calculator', 'cake portion calculator', 'wedding cake serving calculator', 'cake cutting calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cake Serving Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Choose slice style', text: 'Party slices are 2×2 in. Wedding slices are 1×2 in.' },
          { name: 'Enter diameters', text: 'Tiers add.' },
        ]}
        faqs={[{ question: 'How many servings is an 8-inch cake?', answer: 'About 13 party slices or 25 wedding slices.' }]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Cake serving calculator', url: path },
        ]}
      />
      <CakeClient />
    </>
  );
}
