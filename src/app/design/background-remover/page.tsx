import BackgroundRemoverClient from './BackgroundRemoverClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Free Background Remover — Local Cutout Studio',
  description: 'Removes a simple image background in the browser, with keep and remove brushes and a transparent PNG export.',
  path: '/design/background-remover',
  keywords: ['background remover', 'transparent PNG', 'local background removal', 'product photo cutout'],
});

export default function BackgroundRemoverPage() {
  return <><JSONLD data={buildCalculatorJsonLd({ name: 'Toolioz Background Remover', description: 'Browser-local background removal with manual cleanup and original-resolution transparent PNG export.', path: '/design/background-remover', applicationCategory: 'MultimediaApplication' })} /><BackgroundRemoverClient /></>;
}
