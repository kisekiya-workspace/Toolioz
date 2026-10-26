import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';
import ResumeGeneratorClient from '@/app/pdftools/resume-generator/ResumeGeneratorClient';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = buildPageMetadata({
  title: 'ATS Resume Builder',
  description:
    'Builds an ATS-oriented vector PDF resume from visual templates or LaTeX, with download and no account.',
  path: '/resume-builder',
  keywords: [
    'resume builder',
    'ats friendly resume',
    'latex resume builder',
    'free resume generator',
    'resume format for freshers india',
  ],
});

export default function ResumeBuilderPage() {
  return (
    <>
      <JSONLD
        data={buildCalculatorJsonLd({
          name: 'ATS Resume Builder',
          description: 'Free resume maker with vector PDF export for applicant tracking systems.',
          path: '/resume-builder',
          applicationCategory: 'BusinessApplication',
        })}
      />
      <ResumeGeneratorClient />
      <Footer />
    </>
  );
}
