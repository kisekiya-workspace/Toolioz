export type ToolGuideLink = {
  toolSuffix: string;
  title: string;
  href: string;
  category: string;
};

// Keep this client-safe and intentionally small. Full article content stays server-side.
export const toolGuideLinks: ToolGuideLink[] = [
  { toolSuffix: 'json-formatter', title: 'How to format JSON and fix parse errors', href: '/how-to-format-json-and-fix-errors', category: 'Developer guide' },
  { toolSuffix: 'jwt-decoder', title: 'How to decode and inspect a JWT safely', href: '/how-to-decode-jwt-token', category: 'Security guide' },
  { toolSuffix: 'timestamp-converter', title: 'Unix timestamps: seconds, milliseconds, and dates', href: '/devtools/blog/unix-timestamp-converter-seconds-milliseconds', category: 'Developer guide' },
  { toolSuffix: 'sip-calculator', title: 'How to calculate SIP returns step by step', href: '/how-to-calculate-sip-returns', category: 'Finance guide' },
  { toolSuffix: 'mortgage-calculator', title: 'Home loan EMI and affordability guide', href: '/finance/blog/home-loan-emi-affordability-salary-down-payment', category: 'Finance guide' },
  { toolSuffix: 'compress-pdf', title: 'How to compress a PDF under 2MB', href: '/how-to-compress-pdf-under-2mb', category: 'PDF guide' },
  { toolSuffix: 'merge-pdf', title: 'How to merge PDFs without losing order', href: '/pdftools/blog/merge-pdf-online-free-guide', category: 'PDF guide' },
  { toolSuffix: 'biodata-generator', title: 'How to create a marriage biodata PDF', href: '/how-to-create-marriage-biodata-pdf', category: 'Biodata guide' },
  { toolSuffix: 'resume-builder', title: 'How ATS-friendly resumes are structured', href: '/resume-builder/blog/how-to-beat-ats-systems', category: 'Resume guide' },
];

export function getToolGuideLinks(pathname: string) {
  const suffix = pathname.split('/').filter(Boolean).at(-1) ?? '';
  return toolGuideLinks.filter((guide) => guide.toolSuffix === suffix).slice(0, 3);
}
