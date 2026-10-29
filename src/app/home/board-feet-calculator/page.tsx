import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import BoardFeetClient from './BoardFeetClient';

const path = '/home/board-feet-calculator';
const description =
  'Counts lumber board feet and log scale using Doyle, Scribner, and International ¼-inch rules.';

export const metadata = buildPageMetadata({
  title: 'Board Feet Calculator',
  description,
  path,
  keywords: ['board feet calculator for logs', 'board feet calculator for lumber', 'doyle scribner international'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Board Feet Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter sawn size', text: 'Thickness, width, length in feet, pieces.' },
          { name: 'Optional log diameter', text: 'Compare Doyle, Scribner, and International ¼″.' },
        ]}
        faqs={[{ question: 'How many board feet is a 2×8×10?', answer: '13.33 board feet.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Board feet calculator', url: path },
        ]}
      />
      <BoardFeetClient />
    </>
  );
}
