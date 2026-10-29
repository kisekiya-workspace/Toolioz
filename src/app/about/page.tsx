import React from 'react';
import AboutClient from './AboutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Describes Toolioz, a browser suite of unofficial calculators and file tools provided as-is and used at the visitor's own risk.",
  keywords: 'About Toolioz, unofficial calculators, browser tools, Toolioz disclaimer',
  alternates: {
    canonical: 'https://toolioz.com/about',
  },
  openGraph: {
    title: 'About Toolioz',
    description: 'Describes Toolioz, a browser suite of unofficial calculators and file tools provided as-is and used at the visitor\'s own risk.',
    url: 'https://toolioz.com/about',
    type: 'website',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
