# Toolioz SEO and publisher-risk audit — August 2026

This audit is based on the repository, not live Search Console or Analytics data. Live indexing, impressions, CTR, Core Web Vitals, and AdSense Policy Center status still need to be checked in the production properties.

## Findings fixed in this pass

### Duplicate how-to URLs — high priority

The same how-to content was available at both `/how-to/{slug}` and a direct URL such as `/how-to-calculate-sip-returns`. The direct route already rendered the dynamic page, so both URLs exposed the same article. The direct URL is now the preferred canonical/indexable route; the nested route is `noindex, follow`, and the nested route was removed from the sitemap. The how-to index now links to direct URLs.

### The main blog hub was incomplete — high priority

`/blog` previously listed only the legacy research articles even though the site had separate finance, developer, PDF, biodata, resume, how-to, and comparison libraries. A unified index now links to all existing article families without copying their bodies into a second content system. The sitemap also includes the legacy `/blog/{slug}` pages.

### Tool pages were not consistently connected to their guides — medium priority

The generic `/tools/*` pages now show contextual “Helpful guide for this tool” links when an existing article targets the same utility. This creates a direct tool → guide → tool path and reduces orphan risk without generating doorway pages.

### Placeholder AdSense client ID — high publisher risk

The generic ad component contained `ca-pub-XXXXXXXXXXXXXXXX`, which is not a valid production publisher identifier. Ad markup now renders only when `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` exists, and uses that value for `data-ad-client`. Set the real ID in deployment configuration before enabling ads.

### Nested `<main>` landmark — quality issue

The root layout wrapped every page in `<main>` while many pages already used their own `<main>`. The outer wrapper is now a neutral content container to avoid invalid landmark nesting.

## Remaining risks to address before scaling content

1. **Thin or overconfident legacy articles.** Several older posts are short, use generic organization authorship, or make strong claims without a visible editorial reviewer. Review financial, tax, privacy, and security claims before promoting those URLs.
2. **Unverified current regulatory claims.** Tax slabs, capital-gains rates, prepayment rules, and privacy guarantees need date-stamped source checks. Avoid presenting examples as universal rules.
3. **No live indexing evidence.** Connect Search Console and inspect URL Inspection, duplicate/canonical reports, coverage, and manual actions before deciding which topics to expand.
4. **Ad placement must follow content value.** Do not place ads on empty tool states, error pages, or pages where advertising dominates the publisher content. Keep `ads.txt` aligned with the real seller account.
5. **No keyword volume should be treated as proof of demand.** The content index maps intent and internal links, but volume and ranking opportunity should be validated in Keyword Planner, Search Console, or a trusted keyword dataset.

## Operating rule for future blog pages

Create one genuinely useful page per distinct user task. Prefer improving an existing direct tool page or linking one canonical guide from the tool page over creating near-duplicate URL variants for every keyword permutation. Each article should have a clear audience, first-hand explanation or test, dated sources, an author/reviewer identity, and a direct path back to the working tool.

Google references: [canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), and [publisher content value](https://support.google.com/publisherpolicies/answer/11112688).
