import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import GridClient from './GridClient';

const path = '/design/drawing-grid-maker';
const description = 'Overlays a numbered square grid on a photo for transfer drawing, with print output in the browser.';

export const metadata = buildPageMetadata({
  title: 'Drawing Grid Maker',
  description,
  path,
  keywords: ['grid maker for drawing', 'drawing grid with measurements', 'grid over photo'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Drawing Grid Maker"
        description={description}
        path={path}
        steps={[{ name: 'Upload a photo', text: 'Set how many square cells span the width, then print.' }]}
        faqs={[{ question: 'Does the grid use centimetres?', answer: 'Cells are even pixel divisions. True cm needs a scale in the photo.' }]}
        breadcrumbs={[
          { name: 'Design tools', url: '/design' },
          { name: 'Drawing grid maker', url: path },
        ]}
      />
      <GridClient />
    </>
  );
}
