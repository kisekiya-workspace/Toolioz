import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import TailwindColorClient from './TailwindColorClient';

const path = '/devtools/tailwind-color-generator';
const description =
  'Builds Tailwind 50–950 OKLCH shades from a seed hex and exports v4 @theme CSS tokens.';

export const metadata = buildPageMetadata({
  title: 'Tailwind Color Generator',
  description,
  path,
  keywords: ['tailwind color generator', 'tailwind oklch palette', 'tailwind v4 theme colors'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Tailwind Color Generator"
        description={description}
        path={path}
        steps={[{ name: 'Paste hex', text: 'Copy the @theme block into a CSS file.' }]}
        faqs={[{ question: 'Does this export Tailwind v4?', answer: 'Yes. @theme custom properties. v3 JS palettes are not written.' }]}
        breadcrumbs={[
          { name: 'Developer tools', url: '/devtools' },
          { name: 'Tailwind color generator', url: path },
        ]}
      />
      <TailwindColorClient />
    </>
  );
}
