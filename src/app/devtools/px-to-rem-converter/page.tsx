import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import PxRemClient from './PxRemClient';

const path = '/devtools/px-to-rem-converter';
const description = 'Converts pixels to rem and em at a chosen root font size, with a table of common CSS sizes.';

export const metadata = buildPageMetadata({
  title: 'PX to REM Converter',
  description,
  path,
  keywords: ['px to rem converter', 'css unit converter', 'px to rem calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="PX to REM Converter"
        description={description}
        path={path}
        steps={[{ name: 'Set root px', text: 'Default 16. Enter px or rem.' }]}
        faqs={[{ question: 'How many rem is 24 px?', answer: '1.5 rem at a 16 px root.' }]}
        breadcrumbs={[
          { name: 'Developer tools', url: '/devtools' },
          { name: 'PX to REM converter', url: path },
        ]}
      />
      <PxRemClient />
    </>
  );
}
