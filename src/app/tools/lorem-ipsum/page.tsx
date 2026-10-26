import Link from 'next/link';

export default function LoremAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Lorem ipsum</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the lorem ipsum generator. It writes a chosen number of words, sentences, or paragraphs from a fixed Latin word list.
      </p>
      <p className="mt-6">
        <Link href="/devtools/lorem-ipsum" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the lorem ipsum generator
        </Link>
      </p>
    </main>
  );
}
