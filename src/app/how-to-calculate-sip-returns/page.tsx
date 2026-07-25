import type { Metadata } from 'next';
import HowToDetailPage from '@/app/how-to/[slug]/page';
import { getHowToPost } from '@/lib/howto-content';
import { buildArticleMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const post = getHowToPost('calculate-sip-returns');
  if (!post) return {};
  return buildArticleMetadata({
    title: `${post.title} | Toolioz`,
    description: post.description,
    path: post.directUrl,
    keywords: post.keywords,
    modifiedTime: post.updatedIso,
  });
}

export default async function DirectCalculateSipPage() {
  return <HowToDetailPage params={Promise.resolve({ slug: 'calculate-sip-returns' })} />;
}
