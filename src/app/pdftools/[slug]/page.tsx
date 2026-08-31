import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PdfUtilityClient from '@/components/tool-workbench/PdfUtilityClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { NEW_PDF_TOOLS, getNewTool } from '@/lib/new-tool-catalog';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export function generateStaticParams() { return NEW_PDF_TOOLS.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = getNewTool((await params).slug, 'pdf');
  if (!tool) return {};
  return {
    ...buildPageMetadata({ title: `${tool.title} | Toolioz`, description: tool.description, path: tool.path, keywords: tool.keywords }),
    robots: { index: false, follow: true },
  };
}

export default async function NewPdfToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getNewTool((await params).slug, 'pdf');
  if (!tool) notFound();
  return <><JSONLD data={[buildCalculatorJsonLd({ name: tool.title, description: tool.description, path: tool.path, applicationCategory: 'UtilitiesApplication' }), buildBreadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'PDF Tools', url: '/pdftools' }, { name: tool.shortTitle, url: tool.path }])]} /><PdfUtilityClient tool={tool} /></>;
}
