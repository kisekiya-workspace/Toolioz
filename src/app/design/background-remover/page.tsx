import BackgroundRemoverClient from './BackgroundRemoverClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Free Background Remover — Local Cutout Studio',
  description: 'Remove simple image backgrounds locally with our original engine. Keep/remove brushes, edge controls, and full-resolution transparent PNG export. No upload or watermark.',
  path: '/design/background-remover',
  keywords: ['background remover', 'transparent PNG', 'local background removal', 'product photo cutout'],
});

export default function BackgroundRemoverPage() {
  return <><JSONLD data={buildCalculatorJsonLd({ name: 'Toolioz Background Remover', description: 'Browser-local background removal with manual cleanup and original-resolution transparent PNG export.', path: '/design/background-remover', applicationCategory: 'MultimediaApplication' })} /><BackgroundRemoverClient /></>;
}
