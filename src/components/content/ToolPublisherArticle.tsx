'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPublisherArticle } from '@/lib/publisher-articles';

export function ToolPublisherArticle() {
  const pathname = usePathname() ?? '';
  const article = getPublisherArticle(pathname);
  if (!article) return null;

  return (
    <article className="border-t border-zinc-200 bg-white py-14 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Publisher notes · reviewed {article.reviewed}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          {article.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{article.lead}</p>

        {article.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{section.heading}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Worked examples</h3>
          <ul className="mt-3 space-y-3">
            {article.examples.map((example) => (
              <li key={example.title} className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
                <p className="font-medium text-zinc-950 dark:text-zinc-50">{example.title}</p>
                <p className="mt-1 leading-relaxed text-zinc-600 dark:text-zinc-400">{example.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Limits of this page</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {article.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Sources</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {article.sources.map((source) => (
              <li key={source.href}>
                {source.href.startsWith('http') ? (
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                  >
                    {source.label}
                  </a>
                ) : (
                  <Link href={source.href} className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">
                    {source.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
