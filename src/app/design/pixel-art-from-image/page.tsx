import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import PixelArtClient from './PixelArtClient';

const path = '/design/pixel-art-from-image';
const description =
  'Downsamples a photo to a pixel grid with optional stitch/bead lines for cross-stitch or mosaic planning.';

export const metadata = buildPageMetadata({
  title: 'Pixel Art from Image',
  description,
  path,
  keywords: ['pixel art from image', 'pixel art from image with grid', 'image to pixel art generator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Pixel Art from Image"
        description={description}
        path={path}
        steps={[{ name: 'Upload a photo', text: 'Set column count and optional grid, then print.' }]}
        faqs={[{ question: 'Does this dither?', answer: 'No. Nearest-neighbour downsample. Dither Studio handles dithering.' }]}
        breadcrumbs={[
          { name: 'Design tools', url: '/design' },
          { name: 'Pixel art from image', url: path },
        ]}
      />
      <PixelArtClient />
    </>
  );
}
