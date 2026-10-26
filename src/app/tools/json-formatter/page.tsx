import Link from 'next/link';

export default function JsonFormatterAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">JSON formatter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the JSON formatter. That page pretty-prints with 2 or 4 spaces, minifies, and can emit YAML or TypeScript after JSON.parse succeeds. A parse error shows the parser message.
      </p>
      <p className="mt-6">
        <Link href="/devtools/json-formatter" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the JSON formatter
        </Link>
      </p>
    </main>
  );
}
