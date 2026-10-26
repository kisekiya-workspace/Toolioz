import Link from 'next/link';

export default function RegexTesterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Regex tester</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the regular-expression tester. That page builds a JavaScript RegExp and lists matches and capture groups. The pattern is not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/devtools/regex-tester" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the regex tester
        </Link>
      </p>
    </main>
  );
}
