// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/** SSG-only app: serve prerendered routes from static assets + cache interception (avoids loading full Next server on every hit). */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
