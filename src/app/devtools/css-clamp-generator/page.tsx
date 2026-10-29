import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import ClampClient from './ClampClient';

const path = '/devtools/css-clamp-generator';
const description =
  'Generates CSS clamp() for fluid type and spacing from two font sizes and two viewports, plus a modular type-scale table.';

export const metadata = buildPageMetadata({
  title: 'CSS Clamp Generator',
  description,
  path,
  keywords: ['css clamp generator', 'fluid typography calculator', 'type scale generator', 'font clamp generator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="CSS Clamp Generator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter min and max px', text: 'And the viewports where those sizes should hold.' },
          { name: 'Copy clamp()', text: 'Px and rem forms are both listed.' },
        ]}
        faqs={[{ question: 'How does CSS clamp fluid type work?', answer: 'A linear function of viewport width is clamped between min and max px.' }]}
        breadcrumbs={[
          { name: 'Developer tools', url: '/devtools' },
          { name: 'CSS clamp generator', url: path },
        ]}
      />
      <ClampClient />
    </>
  );
}
