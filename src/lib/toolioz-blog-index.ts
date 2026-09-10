import { ADSENSE_NOINDEX_BLOG_SLUGS } from '@/lib/adsense-catalog';
import { standaloneBlogs } from '@/../blogs';
import { indexedHowToPosts } from './howto-content';

export type TooliozBlogIndexItem = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  updated: string;
  updatedIso?: string;
  readTime: string;
  href: string;
  toolHref?: string;
  category: string;
};

export const allTooliozBlogPosts: TooliozBlogIndexItem[] = [
  ...standaloneBlogs
    .filter((post) => !ADSENSE_NOINDEX_BLOG_SLUGS.has(post.slug))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      keywords: post.keywords,
      updated: post.updated,
      updatedIso: post.updatedIso,
      readTime: post.readTime,
      href: `/blog/${post.slug}`,
      toolHref: post.toolHref,
      category: 'Guides',
    })),
  ...indexedHowToPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    updated: post.updated,
    updatedIso: post.updatedIso,
    readTime: post.readTime,
    href: post.directUrl,
    toolHref: post.toolHref,
    category: 'How-To Guides',
  })),
];

export function getTooliozGuidesForPath(pathname: string) {
  const lastSegment = pathname.split('/').filter(Boolean).at(-1);
  return allTooliozBlogPosts
    .filter((post) => post.toolHref && (post.toolHref === pathname || post.toolHref.split('/').at(-1) === lastSegment))
    .slice(0, 3);
}
