const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

function buildAdsTxt() {
  if (!publisherId || !/^ca-pub-\d+$/.test(publisherId)) {
    return [
      '# Toolioz ads.txt',
      '# No seller is declared until a valid AdSense publisher ID is configured.',
      '',
    ].join('\n');
  }

  const sellerId = publisherId.replace(/^ca-/, '');
  return `google.com, ${sellerId}, DIRECT, f08c47fec0942fa0\n`;
}

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildAdsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
