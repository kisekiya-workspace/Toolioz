import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CoffeeClient from './CoffeeClient';

const path = '/kitchen/coffee-ratio-calculator';
const description =
  'Sets pour-over, French press, cold brew, and espresso brew ratios in grams of coffee and water.';

export const metadata = buildPageMetadata({
  title: 'Coffee Ratio Calculator',
  description,
  path,
  keywords: ['coffee ratio calculator', 'coffee ratio calculator grams', 'v60 coffee ratio', 'cold brew ratio', 'espresso ratio'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Coffee Ratio Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Pick a method', text: 'Pour-over 1:16, press 1:15, cold brew 1:8, espresso 1:2.' },
          { name: 'Weigh coffee', text: 'Water is dose times ratio.' },
        ]}
        faqs={[{ question: 'What is a 1:16 pour-over?', answer: '15 g coffee with 240 g water.' }]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Coffee ratio calculator', url: path },
        ]}
      />
      <CoffeeClient />
    </>
  );
}
