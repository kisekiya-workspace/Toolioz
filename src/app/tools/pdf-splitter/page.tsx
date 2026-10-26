import Link from 'next/link';

export default function PdfSplitterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">PDF splitter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the PDF splitter. Selected pages are copied with pdf-lib in the browser. The PDF is not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/pdftools/split-pdf" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the PDF splitter
        </Link>
      </p>
    </main>
  );
}
