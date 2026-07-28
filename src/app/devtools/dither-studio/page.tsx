import type { Metadata } from 'next';
import DitherClient from './DitherClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { SITE_URL, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Image & Video Dithering Studio Online (1-Bit, Floyd-Steinberg, GameBoy, Bayer)',
  description:
    'Free online Dither Studio for images and videos. Apply Floyd-Steinberg, Bayer matrix, Atkinson 1-bit dithering, Game Boy, CGA, and pixel art retro palettes with 100% browser-local processing.',
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
      'Client-side retro image and video dithering tool supporting Floyd-Steinberg, Bayer ordered dithering, Game Boy palettes, pixel art downscaling, and instant export.',
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
          text: 'No. All image processing, canvas manipulations, video decoding, and dither algorithms run 100% locally in your browser using HTML5 Canvas APIs. Your files never leave your device.',
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
