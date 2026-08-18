import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { financeBlogPosts, getFinanceBlogPost } from '@/lib/finance-blog-content';
import { financeEditorialPosts, getFinanceEditorialPost, type FinanceEditorialPost } from '@/lib/finance-editorial-content';
import { buildArticleMetadata, buildBreadcrumbJsonLd } from '@/lib/seo';
import { Sparkles } from 'lucide-react';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...financeBlogPosts, ...financeEditorialPosts].map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getFinanceEditorialPost(slug) ?? getFinanceBlogPost(slug);

  if (!post) {
    return {};
  }

  return buildArticleMetadata({
    title: `${post.title} | Toolioz`,
    description: post.description,
    path: `/finance/blog/${post.slug}`,
    keywords: post.keywords,
    modifiedTime: post.updatedIso,
  });
}

export default async function FinanceBlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const editorialPost = getFinanceEditorialPost(slug);
  const resolvedPost = editorialPost ?? getFinanceBlogPost(slug);

  if (!resolvedPost) {
    notFound();
  }

  if (editorialPost) {
    return <EditorialFinanceBlogPostPage post={editorialPost} />;
  }

  const post = getFinanceBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = financeBlogPosts
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    dateModified: post.updatedIso,
    author: {
      '@type': 'Organization',
      name: 'Toolioz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolioz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolioz.com/tooliozLogo.png',
      },
    },
    mainEntityOfPage: `https://toolioz.com/finance/blog/${post.slug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Finance', url: '/finance' },
    { name: 'Blog', url: '/finance/blog' },
    { name: post.title, url: `/finance/blog/${post.slug}` },
  ]);

  return (
    <main className="bg-[linear-gradient(180deg,#fffdf9_0%,#f8fafc_100%)] text-[var(--text-primary)]">
      <JSONLD data={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]} />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Link href="/finance/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition">
          <ArrowLeft size={16} />
          Back to Finance Blog
        </Link>

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              {post.readTime}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              Updated {post.updated}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.03em] md:text-6xl">
            {post.title}
          </h1>

          {/* Direct Answer / Quick Takeaway Block for AEO Extraction */}
          <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-800 mb-2">
              <Sparkles size={16} className="text-blue-600 shrink-0" />
              <span>Direct Answer / Quick Takeaway</span>
            </h2>
            <p className="text-base font-bold leading-relaxed text-blue-950">
              {post.description}
            </p>
          </section>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-20 space-y-20">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-4xl">{section.heading}</h2>
              <div className="mt-6 space-y-6">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-8 text-[var(--text-secondary)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-[2rem] border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
            <BookOpen size={16} />
            Open the matching tool
          </h2>
          <h3 className="mt-3 text-2xl font-extrabold">{post.toolLabel}</h3>
          <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
            Take the idea from the article and turn it into a real calculation with live inputs.
          </p>
          <Link
            href={post.toolHref}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Open tool <ArrowRight size={15} />
          </Link>
        </section>

        <section className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            <ExternalLink size={16} />
            Research sources
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {post.sources.map((source) => (
              <a
                key={`${source.label}-${source.href}`}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              >
                {source.label}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">FAQs</h2>
          <div className="mt-5 space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            <ArrowRight size={14} />
            More guides
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/finance/blog/${related.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  {related.readTime}
                </div>
                <h3 className="mt-2 text-lg font-black leading-snug">{related.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {related.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}

function EditorialFinanceBlogPostPage({ post }: { post: FinanceEditorialPost }) {
  const relatedPosts = financeEditorialPosts.filter((entry) => entry.slug !== post.slug).slice(0, 3);
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title,
    description: post.description, dateModified: post.updatedIso,
    author: { '@type': 'Organization', name: 'Toolioz Editorial Desk' },
    publisher: { '@type': 'Organization', name: 'Toolioz', logo: { '@type': 'ImageObject', url: 'https://toolioz.com/tooliozLogo.png' } },
    mainEntityOfPage: `https://toolioz.com/finance/blog/${post.slug}`,
  };
  const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Finance', url: '/finance' }, { name: 'Finance guides', url: '/finance/blog' }, { name: post.title, url: `/finance/blog/${post.slug}` }]);

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-slate-900">
      <JSONLD data={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <div className="border-b border-slate-200 bg-[#173b35] text-emerald-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-sm">
          <Link href="/finance/blog" className="font-semibold hover:text-white">← Finance guides</Link>
          <span className="text-emerald-200">{post.label} · {post.readTime}</span>
        </div>
      </div>
      <article className="mx-auto max-w-6xl px-5 py-12 lg:py-20">
        <header className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Toolioz field guide · Updated {post.updated}</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-[-0.04em] text-[#102c28] sm:text-6xl">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">{post.description}</p>
          <div className="mt-8 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-3">
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Reading time</p><p className="mt-1 font-bold">{post.readTime}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Primary intent</p><p className="mt-1 font-bold">Practical planning</p></div>
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Review note</p><p className="mt-1 font-bold">Educational, not personal advice</p></div>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <section className="rounded-3xl bg-[#173b35] p-7 text-white shadow-xl shadow-emerald-950/10 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">The short answer</p>
              <p className="mt-4 text-xl font-semibold leading-9 text-emerald-50">{post.answer}</p>
            </section>
            <section className="mt-12 border-b border-slate-200 pb-10">
              <h2 className="text-2xl font-black text-[#173b35]">Before using the calculator</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {post.keyTakeaways.map((item) => <li key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-700">✓ {item}</li>)}
              </ul>
            </section>
            {post.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading} className="scroll-mt-8 border-b border-slate-200 py-12">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-2 text-3xl font-black leading-tight text-[#173b35]">{section.heading}</h2>
                <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">{section.intro}</p>
                <div className="mt-5 space-y-5 text-[1.05rem] leading-8 text-slate-600">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                {section.bullets && <ul className="mt-6 space-y-2 rounded-2xl bg-white p-5 text-sm font-semibold leading-7 text-slate-700">{section.bullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}</ul>}
              </section>
            ))}
            {post.comparison && <section className="border-b border-slate-200 py-12"><h2 className="text-3xl font-black text-[#173b35]">At-a-glance comparison</h2><div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-emerald-50 text-emerald-950"><tr><th className="p-4">Decision point</th><th className="p-4">Option A</th><th className="p-4">Option B</th></tr></thead><tbody>{post.comparison.map((row) => <tr key={row.label} className="border-t border-slate-100"><th className="p-4 font-bold text-slate-800">{row.label}</th><td className="p-4 text-slate-600">{row.first}</td><td className="p-4 text-slate-600">{row.second}</td></tr>)}</tbody></table></div></section>}
            <section className="py-12"><h2 className="text-3xl font-black text-[#173b35]">A practical checklist</h2><ol className="mt-6 space-y-3">{post.checklist.map((item, index) => <li key={item} className="flex gap-4 rounded-2xl bg-white p-4 text-slate-700"><span className="font-black text-emerald-700">{index + 1}</span><span>{item}</span></li>)}</ol></section>
            <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Put the framework to work</p><h2 className="mt-2 text-2xl font-black text-[#173b35]">{post.toolLabel}</h2><p className="mt-3 leading-7 text-slate-700">Use the live calculator to change one assumption at a time and save the scenario that matches the household plan.</p><Link href={post.toolHref} className="mt-5 inline-flex rounded-full bg-[#173b35] px-6 py-3 font-bold text-white hover:bg-emerald-900">Open calculator →</Link></section>
            <section className="mt-12"><h2 className="text-3xl font-black text-[#173b35]">Frequently asked questions</h2><div className="mt-6 space-y-4">{post.faqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer list-none font-bold text-slate-900">{faq.question}<span className="float-right text-emerald-700">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-slate-600">{faq.answer}</p></details>)}</div></section>
          </div>
          <aside className="lg:sticky lg:top-8 lg:self-start"><div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">On this page</p><nav className="mt-4 space-y-3 text-sm font-semibold text-emerald-800">{post.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`} className="block hover:text-emerald-950">{index + 1}. {section.heading}</a>)}</nav></div><div className="mt-5 rounded-3xl bg-[#e4eee9] p-6 text-sm leading-7 text-slate-700"><p className="font-black text-[#173b35]">Editorial standard</p><p className="mt-2">Numbers are examples, assumptions are labeled, and official sources are linked so readers can verify rules before acting.</p></div><div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">More in this series</p><div className="mt-4 space-y-4">{relatedPosts.map((related) => <Link key={related.slug} href={`/finance/blog/${related.slug}`} className="block text-sm font-bold leading-6 text-emerald-800 hover:text-emerald-950">{related.title}</Link>)}</div></div></aside>
        </div>
        <section className="mt-14 border-t border-slate-200 pt-8"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Sources and verification</h2><div className="mt-4 flex flex-wrap gap-3">{post.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:border-emerald-300">{source.label} ↗</a>)}</div><p className="mt-5 text-sm leading-6 text-slate-500">This guide is educational information, not individualized financial, tax, legal, or investment advice. Product terms and regulations can change; verify current details with the relevant provider or qualified professional.</p></section>
      </article>
      <Footer />
    </main>
  );
}
