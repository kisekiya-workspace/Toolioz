import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DeveloperUtilityClient from '@/components/tool-workbench/DeveloperUtilityClient';
import ImageUtilityClient from '@/components/tool-workbench/ImageUtilityClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { NEW_DEV_TOOLS, getNewTool } from '@/lib/new-tool-catalog';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export function generateStaticParams() { return NEW_DEV_TOOLS.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = getNewTool((await params).slug, 'dev');
  if (!tool) return {};
  return buildPageMetadata({ title: `${tool.title} | Toolioz`, description: tool.description, path: tool.path, keywords: tool.keywords });
}

export default async function NewDeveloperToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getNewTool((await params).slug, 'dev');
  if (!tool) notFound();
  return <><JSONLD data={[buildCalculatorJsonLd({ name: tool.title, description: tool.description, path: tool.path, applicationCategory: tool.group === 'image' ? 'MultimediaApplication' : 'DeveloperApplication' }), buildBreadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Developer Tools', url: '/devtools' }, { name: tool.shortTitle, url: tool.path }])]} />{tool.group === 'image' ? <ImageUtilityClient tool={tool} /> : <DeveloperUtilityClient tool={tool} />}</>;
}
