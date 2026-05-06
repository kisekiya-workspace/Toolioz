import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import BiodataGeneratorClient from '@/app/devtools/biodata-generator/BiodataGeneratorClient';
import { biodataFaqs, biodataKeywords } from '@/lib/biodata-content';

export const metadata: Metadata = {
  title: 'Free Marriage Biodata Generator | PDF Download With Photo',
  description:
    'Create marriage biodata PDF online with photo, family details, Hindu, Muslim, Sikh, classic, and modern templates. No login required.',
  keywords: biodataKeywords,
  alternates: {
    canonical: 'https://toolioz.com/biodata/biodata-generator',
  },
  openGraph: {
    title: 'Marriage Biodata Generator | Toolioz',
    description:
      'Build biodata layouts with live preview, customizable sections, and direct PDF export.',
    url: 'https://toolioz.com/biodata/biodata-generator',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Biodata Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biodata Generator | Toolioz',
    description:
      'Generate modern and religion-based marriage biodata templates with PDF export.',
    images: ['/tooliozLogo.png'],
  },
};

export default function BiodataGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Marriage Biodata Generator',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: 'https://toolioz.com/biodata/biodata-generator',
    description:
      'Browser-based biodata builder with live preview and PDF download for matrimonial profiles.',
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create a marriage biodata PDF online',
    description:
      'Create a marriage biodata with photo, family details, template preview, and PDF download.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choose a template',
        text: 'Select a modern, classic, Hindu, Islamic, Sikh, or minimalist biodata template.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add personal and family details',
        text: 'Enter name, birth details, education, profession, family background, contact details, and partner preferences.',
      },
      {
        '@type': 'HowToStep',
        name: 'Preview and download',
        text: 'Open the A4 preview, check spacing, and export the biodata as a PDF.',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: biodataFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <JSONLD data={howToJsonLd} />
      <JSONLD data={faqJsonLd} />
      <BiodataGeneratorClient />
    </>
  );
}
