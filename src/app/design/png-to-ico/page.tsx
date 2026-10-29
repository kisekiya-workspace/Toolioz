import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import PngIcoClient from './PngIcoClient';

const path = '/design/png-to-ico';
const description = 'Converts a PNG into a multi-size .ico with 16, 32, 48, and 256 px layers in the browser.';

export const metadata = buildPageMetadata({
  title: 'PNG to ICO Converter',
  description,
  path,
  keywords: ['png to ico', 'png to ico converter', 'png to icon online free'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="PNG to ICO Converter"
        description={description}
        path={path}
        steps={[{ name: 'Drop a PNG', text: 'Download a multi-size favicon.ico.' }]}
        faqs={[{ question: 'Does PNG to ICO upload the file?', answer: 'No. Layers are packed in the browser.' }]}
        breadcrumbs={[
          { name: 'Design tools', url: '/design' },
          { name: 'PNG to ICO', url: path },
        ]}
      />
      <PngIcoClient />
    </>
  );
}
