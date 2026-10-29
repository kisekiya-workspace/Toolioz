import { ADSENSE_NOINDEX_BLOG_SLUGS } from '@/lib/adsense-catalog';
import { indexedHowToPosts } from '@/lib/howto-content';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { standaloneBlogs } from '@/../blogs';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function GET() {
  const posts = [
    ...standaloneBlogs
      .filter((post) => !ADSENSE_NOINDEX_BLOG_SLUGS.has(post.slug))
      .map((post) => ({
        title: post.title,
        description: post.description,
        url: `${SITE_URL}/blog/${post.slug}`,
        updatedIso: post.updatedIso,
      })),
    ...indexedHowToPosts.map((post) => ({
      title: post.title,
      description: post.description,
      url: `${SITE_URL}${post.directUrl}`,
      updatedIso: post.updatedIso,
    })),
  ].sort((a, b) => b.updatedIso.localeCompare(a.updatedIso));

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(post.url)}</link>
      <guid isPermaLink="true">${escapeXml(post.url)}</guid>
      <pubDate>${new Date(post.updatedIso).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Indexable how-to guides and articles from ${SITE_NAME}.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
