import React from 'react';
import AboutClient from './AboutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Our Vision for Precision Tools",
  description: "Describes Toolioz, a browser-based suite of finance calculators, developer utilities, PDF tools, and biodata makers.",
  keywords: 'About Toolioz, mission statement, privacy-first tools, high precision calculators, developer utility vision',
  alternates: {
    canonical: 'https://toolioz.com/about',
  },
  openGraph: {
    title: 'Our Mission & Vision | Toolioz',
    description: 'Built for precision. Learn why we created the Toolioz utility suite.',
    url: 'https://toolioz.com/about',
    type: 'website',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
