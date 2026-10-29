import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import SvgPngClient from './SvgPngClient';

const path = '/design/svg-to-png';
const description = 'Rasters an SVG to a transparent PNG at a chosen pixel width in the browser.';

export const metadata = buildPageMetadata({
  title: 'SVG to PNG Converter',
  description,
  path,
  keywords: ['svg to png', 'svg to png high quality', 'svg to png converter online free'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="SVG to PNG Converter"
        description={description}
        path={path}
        steps={[{ name: 'Drop an SVG', text: 'Set width and download a transparent PNG.' }]}
        faqs={[{ question: 'Does SVG to PNG upload the file?', answer: 'No. drawImage runs in the tab.' }]}
        breadcrumbs={[
          { name: 'Design tools', url: '/design' },
          { name: 'SVG to PNG', url: path },
        ]}
      />
      <SvgPngClient />
    </>
  );
}
