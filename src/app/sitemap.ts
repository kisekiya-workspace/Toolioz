import { MetadataRoute } from 'next';
import { PUBLISHER_READY_TOOLS } from '@/lib/tools';
import { standaloneBlogs } from '@/../blogs';
import { indexedHowToPosts } from '@/lib/howto-content';
import { ADSENSE_NOINDEX_BLOG_SLUGS } from '@/lib/adsense-catalog';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const trendingIds = new Set(PUBLISHER_READY_TOOLS.filter((t) => t.isTrending).map((t) => t.id));

  const toolRoutes = PUBLISHER_READY_TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority:
      tool.id === 'x-hidden-image' ? 0.7 : trendingIds.has(tool.id) ? 0.92 : 0.85,
  }));

  const hubRoutes: MetadataRoute.Sitemap = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/blog', priority: 0.96, freq: 'weekly' as const },
    { route: '/how-to', priority: 0.96, freq: 'weekly' as const },
    { route: '/finance', priority: 0.95, freq: 'weekly' as const },
    { route: '/design', priority: 0.95, freq: 'weekly' as const },
    { route: '/devtools', priority: 0.95, freq: 'weekly' as const },
    { route: '/pdftools', priority: 0.95, freq: 'weekly' as const },
    { route: '/biodata', priority: 0.95, freq: 'weekly' as const },
    { route: '/biodata/biodata-generator', priority: 0.93, freq: 'weekly' as const },
    { route: '/resume-builder', priority: 0.92, freq: 'weekly' as const },
    { route: '/about', priority: 0.5, freq: 'monthly' as const },
    { route: '/contact', priority: 0.5, freq: 'monthly' as const },
    { route: '/editorial-policy', priority: 0.5, freq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { route: '/terms', priority: 0.3, freq: 'yearly' as const },
  ].map(({ route, priority, freq }) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: freq,
    priority,
  }));

  const blogRoutes = standaloneBlogs
    .filter((post) => !ADSENSE_NOINDEX_BLOG_SLUGS.has(post.slug))
    .map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.88,
  }));

  const howToRoutes = indexedHowToPosts.map((post) => ({
    url: `${SITE_URL}${post.directUrl}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  return [
    ...hubRoutes,
    ...toolRoutes,
    ...blogRoutes,
    ...howToRoutes,
  ];
}
