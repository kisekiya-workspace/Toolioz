import Link from 'next/link';

export default function TimestampAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Timestamp converter</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the timestamp converter. Unix time can be read as seconds or milliseconds, and a datetime-local value can be turned back into Unix time. Ten digits usually means seconds. Thirteen digits usually means milliseconds.
      </p>
      <p className="mt-6">
        <Link href="/devtools/timestamp-converter" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the timestamp converter
        </Link>
      </p>
    </main>
  );
}
