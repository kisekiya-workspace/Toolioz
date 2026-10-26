import Link from 'next/link';

export default function PdfMergerAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">PDF merger</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the PDF merger. The PDFs are combined with pdf-lib in the browser. The files are not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/pdftools/merge-pdf" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the PDF merger
        </Link>
      </p>
    </main>
  );
}
