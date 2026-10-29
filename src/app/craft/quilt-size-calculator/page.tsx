import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import QuiltClient from './QuiltClient';

const path = '/craft/quilt-size-calculator';
const description =
  'Adds quilt blocks, sashing, and borders, then compares the finished size with a US mattress plus drop in inches and centimetres.';

export const metadata = buildPageMetadata({
  title: 'Quilt Size Calculator',
  description,
  path,
  keywords: ['quilt size calculator', 'blanket size calculator crochet', 'quilt size chart', 'duvet size calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Quilt Size Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Pick a bed', text: 'Crib through California king sets mattress width, length, and a default drop.' },
          { name: 'Enter the grid', text: 'Blocks, block size, sashing, and border are added in inches.' },
          { name: 'Compare', text: 'Finished size minus the bedspread target shows whether the quilt covers the drop.' },
        ]}
        faqs={[
          {
            question: 'How does a quilt size calculator add sashing?',
            answer: 'Each axis includes one more sashing strip than the block count, including outer sashing before the border.',
          },
        ]}
        breadcrumbs={[
          { name: 'Craft calculators', url: '/craft' },
          { name: 'Quilt size calculator', url: path },
        ]}
      />
      <QuiltClient />
    </>
  );
}
