import { standaloneBlogs } from '@/../blogs';
import { howToPosts } from './howto-content';
import { top5Articles } from './top5-content';

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
  ...standaloneBlogs.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    updated: post.updated,
    updatedIso: post.updatedIso,
    readTime: post.readTime,
    href: `/blog/${post.slug}`,
    toolHref: post.toolHref,
    category: 'Engineering & Research',
  })),
  ...howToPosts.map((post) => ({
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
  ...top5Articles.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    updated: post.updated,
    updatedIso: post.updatedIso,
    readTime: post.readTime,
    href: `/top5/${post.slug}`,
    category: 'Top 5 Benchmarks',
  })),
];

export function getTooliozGuidesForPath(pathname: string) {
  const lastSegment = pathname.split('/').filter(Boolean).at(-1);
  return allTooliozBlogPosts
    .filter((post) => post.toolHref && (post.toolHref === pathname || post.toolHref.split('/').at(-1) === lastSegment))
    .slice(0, 3);
}
