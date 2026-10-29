import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import PrintSizeClient from './PrintSizeClient';

const path = '/design/photo-print-size-calculator';
const description = 'Converts image pixels to print inches and centimetres at a chosen DPI, and shows pixels needed for common paper sizes.';

export const metadata = buildPageMetadata({
  title: 'Photo Print Size Calculator',
  description,
  path,
  keywords: ['photo print size calculator', 'image print size calculator', 'pixels to cm at dpi'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Photo Print Size Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Enter pixels and DPI', text: 'Read inches, centimetres, and megapixels.' }]}
        faqs={[{ question: 'How large is 6000×4000 at 300 DPI?', answer: '20 × 13.33 inches.' }]}
        breadcrumbs={[
          { name: 'Design tools', url: '/design' },
          { name: 'Photo print size calculator', url: path },
        ]}
      />
      <PrintSizeClient />
    </>
  );
}
