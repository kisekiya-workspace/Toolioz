import type { Metadata } from 'next';
import { importedTools } from '@/lib/sociials-tool-index';
import { buildPageMetadata } from '@/lib/seo';

export function metadataForImportedTool(slug: string): Metadata {
  const tool = importedTools.find((item) => item.url === `/tools/${slug}`);
  const title = tool?.name ?? 'Online Tool';
  const description = tool?.description ?? 'Free browser-based utility from Toolioz.';

  return buildPageMetadata({
    title,
    description,
    path: `/tools/${slug}`,
    keywords: [title.toLowerCase(), `${title.toLowerCase()} online`, 'free online tool'],
  });
}
