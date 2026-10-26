import Link from 'next/link';

export default function UrlConverterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">URL encoder</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the URL encoder. Encoding and decoding use encodeURIComponent and decodeURIComponent. The text is not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/devtools/url-encoder" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the URL encoder
        </Link>
      </p>
    </main>
  );
}
