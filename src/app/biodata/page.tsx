import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Lock,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { biodataFaqs, biodataKeywords, biodataPosts } from '@/lib/biodata-content';

export const metadata: Metadata = {
  title: 'Free Marriage Biodata Maker | PDF Download No Login',
  description:
    'Create marriage biodata online with Hindu, Muslim, Sikh, classic, minimalist, and modern templates. Preview live and download a PDF without login.',
  keywords: biodataKeywords,
  alternates: {
    canonical: 'https://toolioz.com/biodata',
  },
  openGraph: {
    title: 'Free Marriage Biodata Maker | Toolioz',
    description:
      'Build a marriage biodata PDF with photo, family details, horoscope fields, and community templates.',
    url: 'https://toolioz.com/biodata',
    type: 'website',
    images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: 'Toolioz Biodata Tools' }],
  },
};

const features = [
  {
    title: 'Live A4 Preview',
    body: 'See the exact biodata layout before you download, including photo crop, borders, and spacing.',
    icon: Eye,
    color: '#2563eb',
  },
  {
    title: 'PDF Download',
    body: 'Export a share-ready biodata PDF from mobile or desktop without waiting for a designer.',
    icon: Download,
    color: '#db2777',
  },
  {
    title: 'Private Drafts',
    body: 'Your draft stays in your browser so you can return and edit details without creating an account.',
    icon: Lock,
    color: '#0f766e',
  },
];

const templateCards = [
  {
    title: 'Hindu Traditional',
    label: 'Orange, gold, Om border',
    mark: 'ॐ',
    className: 'border-orange-200 bg-orange-50 text-orange-900',
    accent: 'text-orange-600',
  },
  {
    title: 'Islamic Elegant',
    label: 'Emerald arch styling',
    mark: 'بسم الله',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    accent: 'text-emerald-700',
  },
  {
    title: 'Sikh Heritage',
    label: 'Navy and saffron layout',
    mark: 'ੴ',
    className: 'border-blue-200 bg-blue-50 text-blue-950',
    accent: 'text-amber-600',
  },
  {
    title: 'Modern Minimal',
    label: 'Clean SaaS-style profile',
    mark: 'Aa',
    className: 'border-slate-200 bg-slate-50 text-slate-950',
    accent: 'text-slate-700',
  },
];

const steps = [
  ['Choose', 'Pick a modern, classic, Hindu, Islamic, Sikh, or minimalist template.'],
  ['Write', 'Add personal details, birth details, profession, family, and partner expectations.'],
  ['Preview', 'Check the A4 preview and adjust long entries before exporting.'],
  ['Download', 'Save a PDF that is ready for WhatsApp, email, or print.'],
];

export default function BiodataPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: biodataFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
        <JSONLD data={faqJsonLd} />

        <section className="relative border-b border-slate-200 bg-white">
          <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,#fff7ed,#fdf2f8,#ecfeff)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1fr_520px] lg:items-center lg:pb-24 lg:pt-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-pink-700 shadow-sm">
                <Sparkles size={14} />
                Biodata Tools
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.02em] text-slate-950 sm:text-5xl lg:text-7xl">
                Marriage biodata maker built for fast PDF sharing
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Create a polished biodata with photo, family details, horoscope fields,
                religion-based templates, live preview, and mobile PDF download. No login,
                no design software, no waiting.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/biodata/biodata-generator"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Create Biodata Free <ArrowRight size={16} />
                </Link>
                <a
                  href="#templates"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-pink-300 hover:text-pink-700"
                >
                  View Templates
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-sm">
                {[
                  ['6', 'Templates'],
                  ['PDF', 'Export'],
                  ['0', 'Login'],
                ].map(([value, label]) => (
                  <div key={label} className="px-4 py-5 text-center">
                    <div className="text-2xl font-black text-slate-950">{value}</div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 hidden rounded-3xl bg-orange-100 px-4 py-3 text-sm font-bold text-orange-800 shadow-sm lg:block">
                Hindu / Muslim / Sikh / Modern
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)]">
                <div className="rounded-[1.5rem] border border-orange-200 bg-[#fffaf0] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-4xl text-orange-600">ॐ</div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-700">
                      A4 Preview
                    </div>
                  </div>
                  <div className="rounded-2xl border border-orange-200 bg-white p-5">
                    <div className="flex items-center gap-4 border-b border-orange-100 pb-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                        <UserRound className="text-slate-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-950">Aarav Sharma</div>
                        <div className="mt-1 text-sm font-medium text-slate-500">
                          Product Manager / Bengaluru
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {['Date of Birth', 'Height', 'Religion', 'Education'].map((item) => (
                        <div key={item} className="rounded-xl bg-slate-50 px-3 py-3">
                          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            {item}
                          </div>
                          <div className="mt-1 h-2.5 rounded-full bg-slate-200" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="h-2 rounded-full bg-slate-200" />
                      <div className="h-2 w-5/6 rounded-full bg-slate-200" />
                      <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 right-6 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-lg">
                <CheckCircle2 className="mr-2 inline" size={16} />
                Mobile PDF ready
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${feature.color}16`, color: feature.color }}
                >
                  <feature.icon size={22} />
                </div>
                <h2 className="text-xl font-black text-slate-950">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="templates" className="border-y border-slate-200 bg-white px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-pink-700">
                  <Palette size={16} />
                  Template Library
                </div>
                <h2 className="max-w-3xl text-3xl font-black tracking-[-0.02em] text-slate-950 md:text-5xl">
                  Cultural templates that still feel clean and modern
                </h2>
              </div>
              <Link
                href="/biodata/biodata-generator"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-pink-300 hover:text-pink-700"
              >
                Open editor <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {templateCards.map((template) => (
                <div key={template.title} className={`rounded-[1.5rem] border p-5 ${template.className}`}>
                  <div className={`mb-8 text-4xl font-black ${template.accent}`}>{template.mark}</div>
                  <h3 className="text-xl font-black">{template.title}</h3>
                  <p className="mt-2 text-sm font-semibold opacity-75">{template.label}</p>
                  <div className="mt-6 rounded-2xl bg-white/80 p-4">
                    <div className="mb-3 h-2 rounded-full bg-current opacity-20" />
                    <div className="mb-3 h-2 w-4/5 rounded-full bg-current opacity-20" />
                    <div className="h-16 rounded-xl border border-current/10 bg-white/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-start">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                  <FileText size={16} />
                  Workflow
                </div>
                <h2 className="text-3xl font-black tracking-[-0.02em] md:text-5xl">
                  From blank page to biodata PDF in minutes
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  The editor is built like a compact SaaS workspace: left-side inputs, right-side
                  preview, template switching, zoom controls, and one-tap export.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {steps.map(([title, body], index) => (
                  <div key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="guides" className="border-y border-slate-200 bg-white px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                <Star size={16} />
                SEO Guides
              </div>
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-5xl">
                Helpful biodata guides for specific search needs
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Read practical articles for Hindu, Muslim, modern, and PDF biodata formats, then
                jump straight into the generator.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {biodataPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/biodata/blog/${post.slug}`}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
                >
                  <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-pink-600">
                    {post.readTime}
                  </div>
                  <h3 className="text-2xl font-black tracking-[-0.01em] text-slate-950 group-hover:text-pink-700">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-pink-700">
                    Read guide <ArrowRight size={15} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-[-0.02em] md:text-5xl">
                  Ready to create a clean marriage biodata?
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  Start with a template, add your details, preview the A4 layout, and download a
                  PDF that is ready to share.
                </p>
              </div>
              <Link
                href="/biodata/biodata-generator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-pink-100"
              >
                Launch Generator <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
