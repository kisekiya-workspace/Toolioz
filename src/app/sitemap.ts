import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { biodataPosts } from '@/lib/biodata-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toolioz.com';
  const lastModified = new Date();

  const trendingIds = new Set(TOOLS.filter((t) => t.isTrending).map((t) => t.id));

  const toolRoutes = TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: trendingIds.has(tool.id) ? 0.9 : 0.8,
  }));

  const biodataBlogRoutes = biodataPosts.map((post) => ({
    url: `${baseUrl}/biodata/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/finance', priority: 0.9, freq: 'weekly' as const },
    { route: '/devtools', priority: 0.9, freq: 'weekly' as const },
    { route: '/pdftools', priority: 0.9, freq: 'weekly' as const },
    { route: '/biodata', priority: 0.9, freq: 'weekly' as const },
    { route: '/about', priority: 0.5, freq: 'monthly' as const },
    { route: '/contact', priority: 0.5, freq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { route: '/terms', priority: 0.3, freq: 'yearly' as const },
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: freq,
    priority,
  }));

  return [...staticRoutes, ...toolRoutes, ...biodataBlogRoutes];
}
