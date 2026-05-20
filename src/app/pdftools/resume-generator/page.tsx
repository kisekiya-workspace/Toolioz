import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import ResumeGeneratorClient from './ResumeGeneratorClient';

export const metadata: Metadata = {
  title: 'ATS Resume Generator | LaTeX Resume Builder and PDF Export',
  description:
    'Create an ATS-friendly resume with a structured editor, live LaTeX source, and text-based PDF download.',
  keywords: [
    'ats resume generator',
    'resume builder pdf',
    'latex resume editor',
    'resume latex source',
    'one page resume maker',
    'ats friendly resume',
    'resume pdf online',
    'overleaf resume builder',
  ],
  alternates: {
    canonical: 'https://toolioz.com/pdftools/resume-generator',
  },
  openGraph: {
    title: 'ATS Resume Generator | Toolioz',
    description: 'Build a recruiter-friendly resume, edit the LaTeX, and export a real PDF.',
    url: 'https://toolioz.com/pdftools/resume-generator',
    siteName: 'Toolioz PDF Tools',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz ATS Resume Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Resume Generator | Toolioz',
    description: 'Create a resume, edit the LaTeX, and download a text-based PDF in the browser.',
    images: ['/tooliozLogo.png'],
  },
};

export default function ResumeGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ATS Resume Generator with LaTeX Editor',
    description:
      'Browser-based resume builder with structured editing, LaTeX source output, and PDF export.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    url: 'https://toolioz.com/pdftools/resume-generator',
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to build an ATS resume online',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter your profile details',
        text: 'Fill in your name, headline, contact details, summary, skills, and experience sections.',
      },
      {
        '@type': 'HowToStep',
        name: 'Tune the source',
        text: 'Open the LaTeX editor if you want to refine the generated source or paste it into Overleaf.',
      },
      {
        '@type': 'HowToStep',
        name: 'Preview and export',
        text: 'Review the preview and download the PDF when the layout looks ready.',
      },
    ],
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <JSONLD data={howToJsonLd} />
      <ResumeGeneratorClient />
    </>
  );
}
