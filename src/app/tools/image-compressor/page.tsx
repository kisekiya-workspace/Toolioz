import Link from 'next/link';

export default function ImageCompressorAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Image compressor</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the image compressor. That page reads a JPEG, PNG, or WebP and saves a JPEG. A target size in KB can still be missed.
      </p>
      <p className="mt-6">
        <Link href="/pdftools/image-compressor" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the image compressor
        </Link>
      </p>
    </main>
  );
}
