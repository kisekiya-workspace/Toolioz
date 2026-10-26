import Link from 'next/link';

export default function WordCounterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Word counter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the text tools. That page counts characters, characters without spaces, words, sentences, lines, and paragraphs, and estimates reading time at 200 words a minute.
      </p>
      <p className="mt-6">
        <Link href="/tools/text-tools" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the text tools
        </Link>
      </p>
    </main>
  );
}
