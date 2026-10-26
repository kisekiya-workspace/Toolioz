import Link from 'next/link';

export default function HashGeneratorAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Hash generator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the hash generator. That page computes SHA-1, SHA-256, SHA-384, and SHA-512 with the Web Crypto API. MD5 is not included. The text or file is not uploaded.
      </p>
      <p className="mt-6">
        <Link href="/devtools/hash-generator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the hash generator
        </Link>
      </p>
    </main>
  );
}
