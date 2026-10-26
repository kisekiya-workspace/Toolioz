import type { Metadata } from 'next';
import DitherClient from './DitherClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { SITE_URL, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Image and Video Dither Studio',
  description:
    'Applies Floyd-Steinberg, Bayer, Atkinson, Game Boy, and CGA dithering to images and video in the browser.',
  path: '/devtools/dither-studio',
  keywords: [
    'image dither online',
    'video dither tool',
    'floyd steinberg dither online',
    'bayer ordered dithering',
    'gameboy camera dither filter',
    'retro pixel art converter',
    '1 bit dithering generator',
    'atkinson dither macintosh',
    'dither gif mp4 online',
  ],
});

export default function DitherStudioPage() {
  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Image & Video Dithering Studio',
    operatingSystem: 'Any',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Applies ordered and error-diffusion dithering to images and video, then exports the result in the browser.',
    url: `${SITE_URL}/devtools/dither-studio`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is image and video dithering?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dithering is a technique used in computer graphics to approximate color gradients and shades using a limited color palette. By arranging small dots or patterns of color (such as 1-bit black and white or 4-color Game Boy palettes), it creates the illusion of smooth tones without true continuous color.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are my uploaded images or videos sent to any server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Image processing, canvas drawing, video decoding, and dithering run in the browser with the canvas API. The files are not uploaded.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which dithering algorithms are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The studio supports Floyd-Steinberg Error Diffusion, Bayer 4x4 and 8x8 Ordered Matrix Dithering, Macintosh Atkinson Dithering, Sierra Lite, and direct Thresholding.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export dithered videos and animated clips?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can record and export your dithered video directly as a WebM file or capture static high-resolution PNG/WEBP dithered images.',
        },
      },
    ],
  };

  return (
    <>
      <JSONLD data={toolJsonLd} />
      <JSONLD data={faqJsonLd} />
      <DitherClient />
    </>
  );
}
