import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Toolioz',
    short_name: 'Toolioz',
    description: 'Finance calculators, developer tools, and PDF utilities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/tooliozLogo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/tooliozLogo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
