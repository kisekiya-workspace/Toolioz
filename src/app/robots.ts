import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/tools/',
          '/finance/grade-percentage-calculator',
          '/finance/win-percentage-calculator',
          '/finance/weight-loss-percentage-calculator',
          '/finance/body-fat-percentage-calculator',
          '/finance/average-percentage-calculator',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai'],
        allow: '/',
        disallow: [
          '/api/',
          '/tools/',
          '/finance/grade-percentage-calculator',
          '/finance/win-percentage-calculator',
          '/finance/weight-loss-percentage-calculator',
          '/finance/body-fat-percentage-calculator',
          '/finance/average-percentage-calculator',
        ],
      },
    ],
    sitemap: 'https://toolioz.com/sitemap.xml',
    host: 'https://toolioz.com',
  };
}
