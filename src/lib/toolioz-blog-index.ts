import { standaloneBlogs } from '@/../blogs';
import { biodataPosts } from './biodata-content';
import { devtoolsBlogPosts } from './devtools-blog-content';
import { financeBlogPosts } from './finance-blog-content';
import { financeEditorialPosts } from './finance-editorial-content';
import { howToPosts } from './howto-content';
import { pdftoolsBlogPosts } from './pdftools-blog-content';
import { resumeBlogPosts } from './resume-blog-content';
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

const mapPosts = <T extends { slug: string; title: string; description: string; keywords: string[]; updated: string; updatedIso?: string; readTime: string }>(
  posts: T[],
  category: string,
  href: (post: T) => string,
  toolHref?: (post: T) => string | undefined,
) => posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  updated: post.updated,
  updatedIso: post.updatedIso,
  readTime: post.readTime,
  href: href(post),
  toolHref: toolHref?.(post),
  category,
}));

export const allTooliozBlogPosts: TooliozBlogIndexItem[] = [
  ...mapPosts(standaloneBlogs, 'Toolioz research', (post) => `/blog/${post.slug}`, (post) => post.toolHref),
  ...mapPosts(financeEditorialPosts, 'Finance', (post) => `/finance/blog/${post.slug}`, (post) => post.toolHref),
  ...mapPosts(financeBlogPosts, 'Finance', (post) => `/finance/blog/${post.slug}`, (post) => post.toolHref),
  ...mapPosts(devtoolsBlogPosts, 'Developer tools', (post) => `/devtools/blog/${post.slug}`, (post) => post.toolHref),
  ...mapPosts(pdftoolsBlogPosts, 'PDF tools', (post) => `/pdftools/blog/${post.slug}`, (post) => post.toolHref),
  ...mapPosts(biodataPosts, 'Biodata', (post) => `/biodata/blog/${post.slug}`),
  ...mapPosts(resumeBlogPosts, 'Resume builder', (post) => `/resume-builder/blog/${post.slug}`, (post) => post.toolHref),
  ...mapPosts(howToPosts, 'How-to guides', (post) => post.directUrl, (post) => post.toolHref),
  ...top5Articles.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    updated: post.updated,
    updatedIso: post.updatedIso,
    readTime: post.readTime,
    href: `/top5/${post.slug}`,
    category: 'Comparisons',
  })),
];

export function getTooliozGuidesForPath(pathname: string) {
  const lastSegment = pathname.split('/').filter(Boolean).at(-1);
  return allTooliozBlogPosts
    .filter((post) => post.toolHref && (post.toolHref === pathname || post.toolHref.split('/').at(-1) === lastSegment))
    .slice(0, 3);
}
