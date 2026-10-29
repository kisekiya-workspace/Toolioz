import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import YarnClient from './YarnClient';

const path = '/craft/yarn-calculator';
const description =
  'Estimates yarn grams, yards, metres, and 100 g skeins for a blanket, scarf, or hat from area and yarn weight.';

export const metadata = buildPageMetadata({
  title: 'Yarn Calculator for Blanket',
  description,
  path,
  keywords: ['yarn calculator for blanket', 'yarn calculator knitting', 'yarn calculator crochet', 'yarn calculator by weight'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Yarn Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Choose a project', text: 'Use the blanket, scarf, or hat preset, or type custom inches.' },
          { name: 'Set yarn weight', text: 'Paste yards per 100 g from the ball band.' },
          { name: 'Add a buffer', text: 'Ten percent covers a swatch and a replacement skein.' },
        ]}
        faqs={[
          {
            question: 'How much yarn does a blanket need?',
            answer:
              'A 50×60 in worsted throw is about 450 g or 900 yards at 200 yards per 100 g, plus a buffer. The page scales that rectangle for other sizes.',
          },
        ]}
        breadcrumbs={[
          { name: 'Craft calculators', url: '/craft' },
          { name: 'Yarn calculator', url: path },
        ]}
      />
      <YarnClient />
    </>
  );
}
