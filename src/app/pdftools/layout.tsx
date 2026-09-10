import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  description:
    'Merge PDFs and convert images to PDF in the browser. Resume export is a separate page.',
  keywords: [
    'pdf tools',
    'merge pdf',
    'image to pdf',
    'online pdf utility',
  ],
  openGraph: {
    siteName: 'Toolioz',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function PdfToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
