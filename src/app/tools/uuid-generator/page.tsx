import Link from 'next/link';

export default function UuidAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">UUID generator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the UUID generator. A version 4 UUID is 122 random bits. That page creates them with crypto.randomUUID, with hyphen and case options.
      </p>
      <p className="mt-6">
        <Link href="/devtools/uuid-generator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the UUID generator
        </Link>
      </p>
    </main>
  );
}
