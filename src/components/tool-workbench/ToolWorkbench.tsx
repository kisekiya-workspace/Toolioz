'use client';

import Link from 'next/link';
import { CheckCircle2, LockKeyhole, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { NewToolDefinition } from '@/lib/new-tool-catalog';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';
import { WORKBENCH_GUIDES } from '@/lib/tool-workbench-guides';
import { PUBLIC_TOOLS } from '@/lib/tools';

export const fieldClass =
  'w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-50 outline-none transition focus:border-blue-600 dark:focus:border-blue-500';
export const areaClass = `${fieldClass} min-h-44 resize-y font-mono text-xs leading-relaxed`;
export const primaryButtonClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 px-4 py-2 text-xs sm:text-sm font-bold text-white transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';
export const secondaryButtonClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3.5 py-2 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

export function ToolWorkbench({
  tool,
  children,
}: {
  tool: NewToolDefinition;
  children: ReactNode;
}) {
  const home = tool.group === 'pdf' ? '/pdftools' : tool.group === 'image' ? '/design' : '/devtools';
  const guide = WORKBENCH_GUIDES[tool.mode];
  const related = PUBLIC_TOOLS.filter(item => item.href !== tool.path && item.category === (tool.group === 'pdf' ? 'pdftools' : tool.group === 'image' ? 'design' : 'devtools')).slice(0, 3);
  const groupLabel =
    tool.group === 'pdf'
      ? 'PDF Utilities'
      : tool.group === 'seo'
      ? 'SEO Utilities'
      : tool.group === 'image'
      ? 'Image Utilities'
      : 'Developer Utilities';

  return (
    <div className="tool-workbench min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        {/* Standard Clean Hero Header */}
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                {groupLabel}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              {tool.title}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              {tool.description}
            </p>
          </div>
        </header>

        {/* Main Workspace Card */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-2 sm:px-6">
          <Card className="p-6 sm:p-8 space-y-6">
            {children}
          </Card>
          {guide && <section className="mt-8 rounded-2xl border border-zinc-200 p-5 sm:p-6 dark:border-zinc-800" aria-label="Tool instructions"><h2 className="text-lg font-semibold">How to use {tool.shortTitle}</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{guide.steps.map(step => <li key={step}>{step}</li>)}</ol><h3 className="mt-5 text-sm font-semibold">A practical example</h3><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{guide.example}</p><h3 className="mt-5 text-sm font-semibold">What to check before using the result</h3><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{guide.limitation}</p></section>}

          {/* Guarantee Badges */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: LockKeyhole,
                title: 'Local processing',
                desc: 'Inputs are processed in this tab. The site and some engines still load network assets.',
              },
              {
                icon: CheckCircle2,
                title: 'Inspect before sharing',
                desc: 'Review the output and retain your original. Large files may take longer to process.',
              },
              {
                icon: Sparkles,
                title: 'No account needed',
                desc: 'No account, API keys, or watermarks required.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-4 space-y-1.5 bg-zinc-50/60 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <Icon size={15} />
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-zinc-50">
                    {title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {desc}
                </p>
              </Card>
            ))}
          </div>
          <nav aria-label="Related tools" className="mt-8 flex flex-wrap gap-3 text-sm"><Link href={home} className="font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-400">Browse {groupLabel.toLowerCase()}</Link>{related.map(item => <Link key={item.id} href={item.href} className="text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400">{item.title}</Link>)}</nav>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export function downloadBlob(
  data: BlobPart | Uint8Array<ArrayBufferLike>,
  filename: string,
  type: string
) {
  const body: BlobPart =
    data instanceof Uint8Array ? new Uint8Array(data).buffer : data;
  const url = URL.createObjectURL(new Blob([body], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
