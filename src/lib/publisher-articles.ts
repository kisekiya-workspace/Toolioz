import { publisherArticles as financeArticles, type PublisherArticle } from '@/lib/publisher-articles-finance';
import { publisherArticlesTools } from '@/lib/publisher-articles-tools';

export type { PublisherArticle };

const allArticles: PublisherArticle[] = [...financeArticles, ...publisherArticlesTools];

const aliases: Record<string, string> = {
  '/resume-builder': '/pdftools/resume-generator',
};

export function getPublisherArticle(pathname: string): PublisherArticle | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  const resolved = aliases[path] ?? path;
  return allArticles.find((entry) => entry.path === resolved);
}

export const publisherArticlePaths = allArticles.map((entry) => entry.path);
