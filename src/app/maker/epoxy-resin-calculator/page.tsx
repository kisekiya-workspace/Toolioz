import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import EpoxyClient from './EpoxyClient';

const path = '/maker/epoxy-resin-calculator';
const description =
  'Estimates epoxy millilitres, litres, and A:B grams for a slab, cylinder, oval, or river table from cavity size and mix ratio.';

export const metadata = buildPageMetadata({
  title: 'Epoxy Resin Calculator',
  description,
  path,
  keywords: ['epoxy resin calculator', 'epoxy resin calculator in ml', 'epoxy resin calculator litres', 'epoxy resin calculator grams'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Epoxy Resin Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Measure the cavity', text: 'Length, width, and depth in centimetres or inches.' },
          { name: 'Set mix ratio', text: 'Use the kit’s A:B parts and density.' },
        ]}
        faqs={[
          {
            question: 'How much epoxy does a river table need?',
            answer: 'This page uses 35% of the bounding box as a starting void. Adjust fill percent after looking at the live slab.',
          },
        ]}
        breadcrumbs={[
          { name: 'Making calculators', url: '/maker' },
          { name: 'Epoxy resin calculator', url: path },
        ]}
      />
      <EpoxyClient />
    </>
  );
}
