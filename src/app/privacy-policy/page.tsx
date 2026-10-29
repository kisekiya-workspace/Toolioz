import React from 'react';
import PrivacyClient from './PrivacyClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Explains which Toolioz inputs stay in the browser, how analytics and ads work, and that tools are used at the visitor's own risk.",
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
