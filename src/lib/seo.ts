import type { Metadata } from 'next';
import { PUBLISHER_READY_TOOLS } from '@/lib/tools';

export const SITE_URL = 'https://toolioz.com';
export const SITE_NAME = 'Toolioz';

/** Default social preview — static asset (keeps Worker bundle under Cloudflare free-tier limits). */
export const DEFAULT_OG_IMAGE = {
  url: 'https://toolioz.com/opengraph-toolioz.png',
  width: 1731,
  height: 909,
  alt: 'Toolioz — Free tools for finance, code, and creators, shown as a glowing ASCII toolkit',
} as const;

export function ogImageMetadata() {
  return {
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image' as const,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Free WebApplication / calculator schema — no fabricated ratings. */
export function buildCalculatorJsonLd(options: {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path),
    applicationCategory: options.applicationCategory ?? 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildItemListJsonLd(options: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path),
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
      description: item.description,
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Free finance calculators, developer utilities, PDF tools, and marriage biodata makers for India and global users.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/tooliozLogo.svg`,
    },
    inLanguage: 'en',
  };
}

export function buildCollectionPageJsonLd(options: {
  name: string;
  description: string;
  path: string;
}) {
  const categoryTools = PUBLISHER_READY_TOOLS.filter((t) => t.href.startsWith(options.path));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path),
    mainEntity: buildItemListJsonLd({
      name: `${options.name} — tools`,
      description: options.description,
      path: options.path,
      items: categoryTools.map((t) => ({ name: t.title, url: t.href, description: t.desc })),
    }),
  };
}

export function buildArticleMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string | string[];
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const base = buildPageMetadata({
    ...options,
    type: 'article',
  });
  const openGraph = base.openGraph;
  return {
    ...base,
    openGraph:
      openGraph && typeof openGraph === 'object'
        ? {
            ...openGraph,
            type: 'article',
            publishedTime: options.publishedTime ?? options.modifiedTime,
            modifiedTime: options.modifiedTime,
          }
        : openGraph,
  };
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string | string[];
  type?: 'website' | 'article';
}): Metadata {
  const canonical = absoluteUrl(options.path);
  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: { canonical },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonical,
      siteName: SITE_NAME,
      type: options.type ?? 'website',
      locale: 'en_US',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function buildHowToJsonLd(options: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path),
    step: options.steps.map((s, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export const allToolItems = [
  ...PUBLISHER_READY_TOOLS.map((t) => ({
    name: t.title,
    url: t.href,
    description: t.desc,
  })),
];
