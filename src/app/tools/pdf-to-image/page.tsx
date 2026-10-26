import Link from 'next/link';

export default function PdfToImageAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">PDF to image</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the PDF-to-image tool. Each page can be saved as PNG or JPEG at 1x, 2x, or 3x, up to 30 pages. The PDF is not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/pdftools/pdf-to-image" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open PDF to image
        </Link>
      </p>
    </main>
  );
}
