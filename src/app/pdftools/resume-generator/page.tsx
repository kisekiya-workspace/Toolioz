import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'ATS resume editor',
  description: 'Alias of the resume editor. It fills a visual template or LaTeX and downloads a PDF. No account is required.',
  path: '/pdftools/resume-generator',
});

export default function ResumeAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">ATS resume editor</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the resume editor. It fills a visual template or LaTeX and downloads a PDF in the browser. No account is required. Parsing success is not measured.
      </p>
      <p className="mt-6">
        <Link href="/resume-builder" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the resume editor
        </Link>
      </p>
    </main>
  );
}
