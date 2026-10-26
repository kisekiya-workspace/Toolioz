import Link from 'next/link';

export default function CronAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Cron generator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the cron generator. A cron expression here is five fields: minute, hour, day, month, and weekday. The page lists the next five times that expression would run.
      </p>
      <p className="mt-6">
        <Link href="/devtools/cron-generator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the cron generator
        </Link>
      </p>
    </main>
  );
}
