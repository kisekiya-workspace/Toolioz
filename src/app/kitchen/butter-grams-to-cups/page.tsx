import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CupsGramsClient from '../cups-to-grams/CupsGramsClient';

const path = '/kitchen/butter-grams-to-cups';
const description = 'Converts butter grams to cups and cups to grams. One US cup of butter is 227 g, or two sticks.';

export const metadata = buildPageMetadata({
  title: 'Butter Grams to Cups',
  description,
  path,
  keywords: ['butter grams to cups', 'butter 100 g to cups', 'butter 125 g to cups', 'cups to grams butter'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Butter Grams to Cups"
        description={description}
        path={path}
        steps={[
          { name: 'Enter grams or cups', text: '227 g is one US cup / two sticks.' },
          { name: 'Pick cup standard', text: 'UK and Australian cups are larger millilitre measures.' },
        ]}
        faqs={[{ question: 'How many cups is 125 g of butter?', answer: '125 / 227 ≈ 0.55 US cups, a little over one stick.' }]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Butter grams to cups', url: path },
        ]}
      />
      <CupsGramsClient slug="butter" />
    </>
  );
}
