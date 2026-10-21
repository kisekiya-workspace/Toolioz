import React from 'react';
import ContactClient from './ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Get Support & Suggest Tools",
  description: "Get in touch with the Toolioz team for technical support, tool suggestions, or business inquiries. We value your feedback.",
  keywords: 'Contact Toolioz support, suggest a tool, feature request, technical support helpdesk',
  alternates: {
    canonical: 'https://toolioz.com/contact',
  },
  openGraph: {
    title: 'Contact the Toolioz Team',
    description: 'We are here to help. Reach out for support or feedback on our utility suite.',
    url: 'https://toolioz.com/contact',
    type: 'website',
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
