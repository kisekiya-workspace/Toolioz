import { MetadataRoute } from 'next';
import { INDEXABLE_TOOLS } from '@/lib/tools';
import { standaloneBlogs } from '@/../blogs';
import { indexedHowToPosts } from '@/lib/howto-content';
import { ADSENSE_NOINDEX_BLOG_SLUGS } from '@/lib/adsense-catalog';
import { SITE_URL } from '@/lib/seo';
import { SENSITIVITY_PAIRS } from '@/lib/gaming/sensitivity-pairs';
import { AQUARIUM_EXTRA_ROUTES, INGREDIENT_EXTRA_ROUTES } from '@/lib/makers-catalog';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const trendingIds = new Set(INDEXABLE_TOOLS.filter((t) => t.isTrending).map((t) => t.id));

  const toolRoutes = INDEXABLE_TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
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
    { route: '/tools', priority: 0.95, freq: 'weekly' as const },
    { route: '/gaming', priority: 0.95, freq: 'weekly' as const },
    { route: '/minecraft', priority: 0.95, freq: 'weekly' as const },
    { route: '/pokemon', priority: 0.92, freq: 'weekly' as const },
    { route: '/dnd', priority: 0.92, freq: 'weekly' as const },
    { route: '/makers', priority: 0.95, freq: 'weekly' as const },
    { route: '/craft', priority: 0.92, freq: 'weekly' as const },
    { route: '/kitchen', priority: 0.92, freq: 'weekly' as const },
    { route: '/maker', priority: 0.92, freq: 'weekly' as const },
    { route: '/home', priority: 0.92, freq: 'weekly' as const },
    { route: '/music', priority: 0.92, freq: 'weekly' as const },
    { route: '/electronics', priority: 0.9, freq: 'weekly' as const },
    { route: '/converters', priority: 0.9, freq: 'weekly' as const },
    { route: '/about', priority: 0.5, freq: 'monthly' as const },
    { route: '/contact', priority: 0.5, freq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { route: '/terms', priority: 0.3, freq: 'yearly' as const },
  ].map(({ route, priority, freq }) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: freq,
    priority,
  }));

  const blogRoutes = standaloneBlogs
    .filter((post) => !ADSENSE_NOINDEX_BLOG_SLUGS.has(post.slug))
    .map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.88,
  }));

  const pairRoutes = SENSITIVITY_PAIRS.map((pair) => ({
    url: `${SITE_URL}/gaming/${pair.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.84,
  }));

  const makersExtraRoutes = [...AQUARIUM_EXTRA_ROUTES, ...INGREDIENT_EXTRA_ROUTES].map((route) => ({
    url: `${SITE_URL}${route.href}`,
    changeFrequency: 'monthly' as const,
    priority: 0.84,
  }));

  const howToRoutes = indexedHowToPosts.map((post) => ({
    url: `${SITE_URL}${post.directUrl}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : undefined,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  return Array.from(new Map([
    ...hubRoutes,
    ...toolRoutes,
    ...pairRoutes,
    ...makersExtraRoutes,
    ...blogRoutes,
    ...howToRoutes,
  ].map(entry => [entry.url, entry])).values());
}
