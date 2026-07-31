import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JSONLD } from '@/components/ui/JSONLD';
import { DEFAULT_OG_IMAGE, buildWebsiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://toolioz.com'),
  title: {
    default: 'Toolioz | Free Finance Calculators, Dev & PDF Utilities',
    template: '%s | Toolioz',
  },
  description:
    'Free SIP & tax calculators, JSON formatter, PDF merge, marriage biodata maker, and ATS resume builder. Private, browser-local utilities.',
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
    title: 'Toolioz | Free Finance Calculators, Dev & PDF Utilities',
    description:
      'Free SIP & tax calculators, JSON formatter, PDF merge, marriage biodata maker, and ATS resume builder. Private, client-side tools.',
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
      'SIP & tax calculators, developer utilities, PDF tools, biodata & resume makers — free in the browser.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
  const websiteJsonLd = buildWebsiteJsonLd();
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolioz',
    url: 'https://toolioz.com',
    logo: 'https://toolioz.com/tooliozLogo.svg',
    sameAs: [
      'https://twitter.com/toolioz',
      'https://facebook.com/toolioz',
      'https://instagram.com/toolioz',
      'https://linkedin.com/company/toolioz',
      'https://youtube.com/@toolioz',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@toolioz.com',
    },
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
        <JSONLD data={websiteJsonLd} />
        <JSONLD data={orgJsonLd} />
        <Navbar />
        <Breadcrumbs />
        <main>{children}</main>
      </body>
    </html>
  );
}
