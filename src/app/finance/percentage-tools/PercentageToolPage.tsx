import { AlertTriangle, ArrowUpRight, BookOpenCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import PercentageCalculatorClient from './PercentageCalculatorClient';
import { PERCENTAGE_TOOL_CONFIGS, type PercentageToolKind } from './percentage-tool-data';

export default function PercentageToolPage({ kind }: { kind: PercentageToolKind }) {
  const config = PERCENTAGE_TOOL_CONFIGS[kind];

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        {/* Standard Clean Hero Header */}
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                {config.eyebrow}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              {config.title}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              {config.subtitle}
            </p>
          </div>
        </header>

        {/* Interactive Calculator Workspace */}
        <PercentageCalculatorClient kind={kind} />

        {/* Educational Content & Guides */}
        <main className="percentage-tool-content mx-auto max-w-6xl px-4 sm:px-6 space-y-10 pb-16">
          <DirectAnswerBlock
            title={config.explanationTitle}
            answer={config.directAnswer}
            keyTakeaways={config.steps}
            categoryName="Percentage Calculators"
          />

          <section className="grid gap-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <BookOpenCheck size={20} />
                </span>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {config.explanationTitle}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {config.explanation}
              </p>
              <div className="rounded-xl bg-zinc-900 p-5 text-zinc-50 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 font-mono">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Formula
                </p>
                <code className="block whitespace-pre-wrap text-sm text-blue-400 dark:text-blue-300">
                  {config.formula}
                </code>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 bg-zinc-50/60 dark:bg-zinc-900/50">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-4">
                How to use this {config.title.toLowerCase()}
              </h2>
              <ol className="space-y-4">
                {config.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </section>

          {/* Practical Examples Table */}
          <section className="py-6 space-y-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
                {config.exampleTitle}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Each example keeps the base value visible so the calculation can be easily verified.
              </p>
            </div>

            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-900 border-b border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700">
                  <tr>
                    <th className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider">Scenario</th>
                    <th className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider">Substituted Formula</th>
                    <th className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {config.examples.map((example) => (
                    <tr key={example.scenario} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition">
                      <td className="px-6 py-4 font-semibold text-zinc-950 dark:text-zinc-50">{example.scenario}</td>
                      <td className="px-6 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">{example.working}</td>
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{example.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          {/* Common Mistakes */}
          <section className="py-6 space-y-6">
            <div className="flex items-center justify-center gap-2.5">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                Common {config.title.toLowerCase()} Mistakes
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {config.mistakes.map((mistake) => (
                <Card key={mistake.title} className="p-6 space-y-2">
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />
                  <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-sm">{mistake.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{mistake.text}</p>
                </Card>
              ))}
            </div>
          </section>

          {config.source && (
            <Card className="p-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50/60 dark:bg-zinc-900/50">
              <strong className="text-zinc-950 dark:text-zinc-50">Method Reference:</strong> The formula used here aligns with{' '}
              <a
                className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                href={config.source.href}
                target="_blank"
                rel="noreferrer"
              >
                {config.source.label} <ArrowUpRight size={13} />
              </a>.
            </Card>
          )}

          {/* Percentage Calculator Cluster Navigation */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Percentage Calculator Cluster
              </p>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                Choose another percentage calculation
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(PERCENTAGE_TOOL_CONFIGS)
                .filter((tool) => tool.kind !== kind && tool.kind !== 'discount')
                .map((tool) => (
                  <Link
                    key={tool.kind}
                    href={tool.path}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-xs font-bold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    {tool.title}
                  </Link>
                ))}
            </div>
          </Card>

          <FAQSchema faqs={config.faqs} />
          <RelatedTools currentToolId={config.toolId} categoryId="finance" limit={4} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
