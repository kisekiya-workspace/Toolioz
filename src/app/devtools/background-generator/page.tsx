import React from 'react';
import BackgroundGeneratorClient from './BackgroundGeneratorClient';
import { TOOLS } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';

export const metadata: Metadata = {
  title: 'Free Shader Background Generator | Wallpapers & Web Backdrops | Toolioz',
  description: 'Design beautiful shader-based background images for desktop wallpapers, mobile lockscreens, social banners, and website hero sections. Customize colors, shapes, and effects, then download high-resolution PNGs or copy CSS code. Free and no sign-up.',
  keywords: 'free background generator, shader background generator, desktop wallpaper generator, phone wallpaper generator, mesh gradient generator, liquid background generator, CSS background generator, social media banner background, high resolution wallpaper generator',
  alternates: {
    canonical: 'https://toolioz.com/devtools/background-generator',
  },
  openGraph: {
    title: 'Free Shader Background Generator | Wallpapers & Web Backdrops | Toolioz',
    description: 'Design and download high-resolution shader background wallpapers and web backdrops. 100% free, customizable color palettes, and instant PNG/CSS export.',
    url: 'https://toolioz.com/devtools/background-generator',
    siteName: 'Toolioz DevTools',
    type: 'website',
  }
};

export default function BackgroundGeneratorPage() {
  const tool = TOOLS.find((t) => t.id === 'background-generator');
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Shader Background Generator",
    "description": "Design beautiful animated shader-based background images for wallpapers, social headers, and website hero sections. Customize colors and export high-res PNGs or CSS.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "All",
    "url": "https://toolioz.com/devtools/background-generator",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <BackgroundGeneratorClient title={tool.title} color={tool.color} />
    </>
  );
}
