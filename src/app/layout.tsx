import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JSONLD } from '@/components/ui/JSONLD';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://toolioz.com'),
  title: {
    default: 'Toolioz | Finance, Dev, and PDF Utilities',
    template: '%s | Toolioz',
  },
  description:
    'A practical suite of finance calculators, developer tools, and PDF utilities built for fast daily workflows.',
  applicationName: 'Toolioz',
  alternates: {
    canonical: 'https://toolioz.com',
  },
  authors: [{ name: 'Toolioz Team' }],
  icons: {
    icon: [
      { url: '/tooliozLogo.svg', type: 'image/svg+xml' },
      { url: '/tooliozLogo.png', type: 'image/png' },
    ],
    apple: '/tooliozLogo.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Toolioz | Finance, Dev, and PDF Utilities',
    description:
      'Free SIP calculator, income tax, JSON formatter, PDF merge, marriage biodata, and ATS resume builder. Private, client-side tools.',
    url: 'https://toolioz.com',
    siteName: 'Toolioz',
    locale: 'en_US',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolioz | Free Finance, Dev & PDF Tools',
    description:
      'SIP & tax calculators, developer utilities, PDF tools, biodata & resume makers — free in your browser.',
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolioz',
    url: 'https://toolioz.com',
    logo: 'https://toolioz.com/tooliozLogo.svg',
  };

  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VM8TJM1RER"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VM8TJM1RER');
          `}
        </Script>
        <JSONLD data={orgJsonLd} />
        <Navbar />
        <Breadcrumbs />
        <main>{children}</main>
      </body>
    </html>
  );
}
