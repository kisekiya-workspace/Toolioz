import Link from 'next/link';

export default function JsonToCsvAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">JSON and CSV converter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the CSV and JSON converter. A CSV needs a header row. Cell values stay strings. JSON must be an array of objects. Nested objects are stringified, not expanded into columns.
      </p>
      <p className="mt-6">
        <Link href="/devtools/csv-json-converter" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the CSV and JSON converter
        </Link>
      </p>
    </main>
  );
}
