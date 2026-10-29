import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import ColorBlindClient from './ColorBlindClient';

const path = '/design/color-blindness-simulator';
const description =
  'Simulates protanopia, deuteranopia, and tritanopia on hex palettes and uploaded images in the browser.';

export const metadata = buildPageMetadata({
  title: 'Color Blindness Simulator',
  description,
  path,
  keywords: ['color blindness simulator', 'color blindness simulator for images', 'color blindness simulator hex'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Color Blindness Simulator"
        description={description}
        path={path}
        steps={[{ name: 'Paste hex or upload an image', text: 'Pick protanopia, deuteranopia, or tritanopia.' }]}
        faqs={[{ question: 'Does the simulator upload images?', answer: 'No. Pixels are rewritten on a local canvas.' }]}
        breadcrumbs={[
          { name: 'Design tools', url: '/design' },
          { name: 'Color blindness simulator', url: path },
        ]}
      />
      <ColorBlindClient />
    </>
  );
}
