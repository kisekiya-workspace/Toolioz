export const secondaryPageStyles = {
  wrapper: 'flex min-h-screen flex-col bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50',
  header:
    'relative border-b border-zinc-200 bg-white vercel-grid py-16 sm:py-24 text-center dark:border-zinc-800 dark:bg-zinc-950',
  title:
    'mb-5 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl dark:text-zinc-50',
  subtitle: 'mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400',
  contentSection: 'px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-zinc-50/50 flex-1 dark:bg-zinc-950/50',
  card:
    'mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12 text-sm sm:text-base leading-relaxed text-zinc-950 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-zinc-950 dark:[&_h2]:text-zinc-50 [&_h2:first-of-type]:mt-0 [&_li]:mb-2.5 [&_li]:text-zinc-600 dark:[&_li]:text-zinc-400 [&_p]:mb-5 [&_p]:text-zinc-600 dark:[&_p]:text-zinc-400 [&_strong]:text-zinc-950 dark:[&_strong]:text-zinc-50 [&_strong]:font-semibold [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-5',
  lastUpdated:
    'mt-12 border-t border-zinc-100 dark:border-zinc-800 pt-6 text-xs font-mono text-zinc-400',
} as const;
