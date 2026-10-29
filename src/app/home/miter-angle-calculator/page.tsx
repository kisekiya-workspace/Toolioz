import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import MiterClient from './MiterClient';

const path = '/home/miter-angle-calculator';
const description =
  'Finds regular-polygon miters, picture-frame angles, and compound crown-molding miter and bevel.';

export const metadata = buildPageMetadata({
  title: 'Miter Angle Calculator',
  description,
  path,
  keywords: ['miter angle calculator', 'polygon miter angle', 'compound miter calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Miter Angle Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Enter sides or corner', text: 'Optional spring angle for crown molding.' }]}
        faqs={[{ question: 'What miter is an octagon?', answer: '22.5 degrees.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Miter angle calculator', url: path },
        ]}
      />
      <MiterClient />
    </>
  );
}
