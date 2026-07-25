import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai'],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://toolioz.com/sitemap.xml',
    host: 'https://toolioz.com',
  };
}
