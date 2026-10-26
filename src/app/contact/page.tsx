import React from 'react';
import ContactClient from './ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Get Support & Suggest Tools",
  description: "Lists the Toolioz email channel for corrections, tool requests, privacy questions, and other support.",
  keywords: 'Contact Toolioz support, suggest a tool, feature request, technical support helpdesk',
  alternates: {
    canonical: 'https://toolioz.com/contact',
  },
  openGraph: {
    title: 'Contact the Toolioz Team',
    description: 'Lists the Toolioz email channel for corrections, tool requests, privacy questions, and other support.',
    url: 'https://toolioz.com/contact',
    type: 'website',
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
