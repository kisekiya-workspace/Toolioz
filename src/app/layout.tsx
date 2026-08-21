import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono, Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JSONLD } from '@/components/ui/JSONLD';
import { DEFAULT_OG_IMAGE, buildWebsiteJsonLd } from '@/lib/seo';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1c1c' },
  ],
};

const themeScript = `
  (function() {
    try {
      var key = 'toolioz-theme';
      var theme = localStorage.getItem(key);
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = theme === 'dark' || ((!theme || theme === 'system') && prefersDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

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
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@toolioz.com',
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground selection:bg-blue-600 selection:text-white">
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
        <ThemeProvider>
          <Navbar />
          <Breadcrumbs />
          <div id="main-content">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
