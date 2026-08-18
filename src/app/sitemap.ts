import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { biodataPosts } from '@/lib/biodata-content';
import { devtoolsBlogPosts } from '@/lib/devtools-blog-content';
import { financeBlogPosts } from '@/lib/finance-blog-content';
import { financeEditorialPosts } from '@/lib/finance-editorial-content';
import { pdftoolsBlogPosts } from '@/lib/pdftools-blog-content';
import { resumeBlogPosts } from '@/lib/resume-blog-content';
import { top5Articles } from '@/lib/top5-content';
import { standaloneBlogs } from '@/../blogs';
import { howToPosts } from '@/lib/howto-content';
import { SITE_URL } from '@/lib/seo';
import { importedToolItems } from '@/lib/sociials-tool-index';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const trendingIds = new Set(TOOLS.filter((t) => t.isTrending).map((t) => t.id));

  const toolRoutes = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority:
      tool.id === 'x-hidden-image' ? 0.96 : trendingIds.has(tool.id) ? 0.92 : 0.85,
  }));

  const importedToolRoutes = importedToolItems.map((tool) => ({
    url: `${SITE_URL}${tool.url}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.82,
  }));

  const hubRoutes: MetadataRoute.Sitemap = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/how-to', priority: 0.96, freq: 'weekly' as const },
    { route: '/finance', priority: 0.95, freq: 'weekly' as const },
    { route: '/finance/blog', priority: 0.88, freq: 'weekly' as const },
    { route: '/design', priority: 0.95, freq: 'weekly' as const },
    { route: '/devtools', priority: 0.95, freq: 'weekly' as const },
    { route: '/devtools/blog', priority: 0.88, freq: 'weekly' as const },
    { route: '/devtools/biodata-generator', priority: 0.9, freq: 'weekly' as const },
    { route: '/pdftools', priority: 0.95, freq: 'weekly' as const },
    { route: '/pdftools/blog', priority: 0.88, freq: 'weekly' as const },
    { route: '/biodata', priority: 0.95, freq: 'weekly' as const },
    { route: '/biodata/blog', priority: 0.88, freq: 'weekly' as const },
    { route: '/biodata/biodata-generator', priority: 0.93, freq: 'weekly' as const },
    { route: '/resume-builder', priority: 0.92, freq: 'weekly' as const },
    { route: '/resume-builder/blog', priority: 0.85, freq: 'weekly' as const },
    { route: '/top5', priority: 0.90, freq: 'weekly' as const },
    { route: '/about', priority: 0.5, freq: 'monthly' as const },
    { route: '/contact', priority: 0.5, freq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { route: '/terms', priority: 0.3, freq: 'yearly' as const },
  ].map(({ route, priority, freq }) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: freq,
    priority,
  }));

  const blogRoutes = (
    posts: Array<{ slug: string; updatedIso?: string }>,
    basePath: string,
    priority: number
  ) =>
    posts.map((post) => ({
      url: `${SITE_URL}${basePath}/${post.slug}`,
      lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    }));

  const directHowToRoutes = howToPosts.map((post) => ({
    url: `${SITE_URL}${post.directUrl}`,
    lastModified: post.updatedIso ? new Date(post.updatedIso) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  }));

  return [
    ...hubRoutes,
    ...toolRoutes,
    { url: `${SITE_URL}/tools`, lastModified, changeFrequency: 'weekly' as const, priority: 0.94 },
    ...importedToolRoutes,
    ...directHowToRoutes,
    ...blogRoutes(standaloneBlogs, '/blog', 0.82),
    ...blogRoutes(biodataPosts, '/biodata/blog', 0.82),
    ...blogRoutes([...financeEditorialPosts, ...financeBlogPosts], '/finance/blog', 0.86),
    ...blogRoutes(devtoolsBlogPosts, '/devtools/blog', 0.8),
    ...blogRoutes(pdftoolsBlogPosts, '/pdftools/blog', 0.78),
    ...blogRoutes(resumeBlogPosts, '/resume-builder/blog', 0.78),
    ...blogRoutes(top5Articles, '/top5', 0.88),
  ];
}
