import { MetadataRoute } from 'next';
import { PUBLISHER_READY_TOOLS } from '@/lib/tools';
import { top5Articles } from '@/lib/top5-content';
import { standaloneBlogs } from '@/../blogs';
import { howToPosts } from '@/lib/howto-content';
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
      tool.id === 'x-hidden-image' ? 0.96 : trendingIds.has(tool.id) ? 0.92 : 0.85,
  }));

  const hubRoutes: MetadataRoute.Sitemap = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/blog', priority: 0.96, freq: 'weekly' as const },
    { route: '/how-to', priority: 0.96, freq: 'weekly' as const },
    { route: '/finance', priority: 0.95, freq: 'weekly' as const },
    { route: '/design', priority: 0.95, freq: 'weekly' as const },
    { route: '/devtools', priority: 0.95, freq: 'weekly' as const },
    { route: '/devtools/biodata-generator', priority: 0.9, freq: 'weekly' as const },
    { route: '/pdftools', priority: 0.95, freq: 'weekly' as const },
    { route: '/biodata', priority: 0.95, freq: 'weekly' as const },
    { route: '/biodata/biodata-generator', priority: 0.93, freq: 'weekly' as const },
    { route: '/resume-builder', priority: 0.92, freq: 'weekly' as const },
    { route: '/top5', priority: 0.90, freq: 'weekly' as const },
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

  const blogRoutes = standaloneBlogs.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.88,
  }));

  const howToRoutes = howToPosts.map((post) => ({
    url: `${SITE_URL}${post.directUrl}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  const top5Routes = top5Articles.map((post) => ({
    url: `${SITE_URL}/top5/${post.slug}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.90,
  }));

  return [
    ...hubRoutes,
    ...toolRoutes,
    { url: `${SITE_URL}/tools`, lastModified, changeFrequency: 'weekly' as const, priority: 0.94 },
    ...blogRoutes,
    ...howToRoutes,
    ...top5Routes,
  ];
}
