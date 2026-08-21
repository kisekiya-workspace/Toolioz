import React from 'react';
import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';
import ResumeGeneratorClient from '@/app/pdftools/resume-generator/ResumeGeneratorClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Free ATS-Friendly Resume Builder | Vector PDF | Toolioz',
  description:
    'Create a professional, ATS-optimized vector PDF resume in minutes. Visual templates or LaTeX mode—free download, no signup.',
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
    </>
  );
}
