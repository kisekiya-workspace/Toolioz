import React from 'react';
import PrivacyClient from './PrivacyClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Tool Inputs, Analytics & Advertising | Toolioz",
  description: "Learn which Toolioz inputs stay in your browser and how analytics, advertising, CDNs, and support messages process information.",
  keywords: 'Toolioz privacy policy, browser processing, Google Analytics, advertising privacy',
  alternates: {
    canonical: 'https://toolioz.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy & Data Security Policy | Toolioz',
    description: 'How local tool processing, analytics, advertising, CDNs, and support messages handle information.',
    url: 'https://toolioz.com/privacy-policy',
    type: 'website',
  }
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
