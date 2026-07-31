# Foundational & Technical SEO Strategy Guide

This guide covers technical, infrastructural, audit, and local SEO foundations required to establish baseline search engine visibility, indexability, and site trust.

---

## 1. Domain Authority, Trust, & Strategic Objectives

- **Domain Authority (E-A-T)**: Sites are evaluated on **Expertise, Authoritativeness, and Trustworthiness**. Domain authority directly impacts how quickly new pages rank.
- **Domain Age**: Older, established domains carry inherent search trust. Changing your domain name resets domain authority to zero and requires rebuilding search equity from scratch.
- **Strategic Objectives**: Define long-term business goals prior to audit execution. Strategic clarity drives targeted keyword acquisition, content architecture, and link building.
- **HTTPS Encryption**: HTTPS encryption (SSL certificate) is mandatory for security and search ranking. HTTP sites are penalized.

---

## 2. Comprehensive Website SEO Audit Framework

Conducting an SEO audit can be performed manually or using specialized tools such as **Website Auditor (SEO Power Suite)**, **SEMrush Site Audit**, **BrightLocal Audit Tool**, **Screaming Frog**, or **Sitebulb**. Fixing identified issues alone often yields dramatic ranking improvements.

```
+-------------------------------------------------------------------------------+
|                        THE 7-DIMENSION SEO AUDIT FRAMEWORK                    |
+-------------------+-----------------------------------------------------------+
| Audit Dimension   | Core Focus & Specific Verification Checkpoints            |
+-------------------+-----------------------------------------------------------+
| 1. Strategic      | Goal alignment, HTTPS status, domain authority & age.     |
| 2. Technical      | Load speed (<2s), mobile responsiveness, redirect loops,  |
|                   | crawl errors, duplicate metadata, URL structure, 404s.    |
| 3. Page-Level     | Title tags (<60 chars), meta descriptions (<150 chars),   |
|                   | H1-H6 hierarchy, HTML structure, image alt tags, links.   |
| 4. Content        | Uniqueness, duplicate removal, evergreen value, depth     |
|                   | (>1000 words), accuracy, grammar, research backing.       |
| 5. UX & UI        | Bounce rate, average time on site, unique vs returning    |
|                   | visitors, exit pages, mobile navigation, intrusive popups.|
| 6. Link Profile   | Quantity & quality of backlinks, link relevancy, authority|
|                   | diversity, deep-link targeting, steady link velocity.     |
| 7. Citations/Local| Consistent NAP (Name, Address, Phone), Google Business    |
|                   | profile accuracy, customer reviews, local directories.    |
+-------------------+-----------------------------------------------------------+
```

### Detailed Link Profile Analysis Rules:
- **Link Quality & Relevancy**: Backlinks must come from high-ranking, topical, reputable sites.
- **Link Targeting (Deep Linking)**: Avoid pointing all incoming backlinks to your homepage. Ideally, acquire links targeting **deep pages** within your site architecture.
- **Link Velocity**: Maintain a steady, organic link acquisition velocity. Erratic spikes trigger spam flags.

---

## 3. Technical Backend & Server Configuration Checklist

- [ ] **HTTPS / SSL Encryption**: Ensure 100% of site traffic routes through secure HTTPS with valid SSL certificates.
- [ ] **Server Infrastructure**: Host on a reliable provider to eliminate downtime. Upgrade server runtime to **PHP 7.0 or higher** (or modern equivalent).
- [ ] **Google Search Console Integration**:
  - Setup GSC tracking.
  - Check the **Coverage** tab regularly for indexation errors.
  - Use the **Inspect URL** feature to inspect how Google's rendering engine sees page HTML.
- [ ] **Google Analytics & Tracking**: Configure GA to track traffic, user path behavior, conversions, and bounce rates.
- [ ] **Permalink Structure**:
  - In WordPress/CMS, set permalinks to post names: `example.com/postname` or `example.com/category/post-name`.
  - NEVER use default parameter URLs like `example.com/?p=123`.
- [ ] **XML Sitemap (`sitemap.xml`)**:
  - Generate a simple, organized XML sitemap and submit it to Google Search Console.
- [ ] **Robots.txt File (`example.com/robots.txt`)**:
  - Verify that search crawlers are allowed to access critical content pages.
- [ ] **Core Web Vitals & Load Speed**:
  - Total site load speed **MUST be under 2 seconds**. Test via Google PageSpeed Insights.
  - Enable browser caching and implement server-side caching.
  - Minify CSS, HTML, and JavaScript files.
  - **DO NOT use Flash or unnecessary JavaScript files** that block rendering.
- [ ] **Plugin & Code Hygiene**:
  - Install SEO plugins like Yoast SEO or Rank Math.
  - Delete unused plugins. Update active plugins regularly to prevent security vulnerabilities and slow load times.
- [ ] **Favicon & Accessible Navigation**:
  - Install a site favicon (`.ico`).
  - Ensure intuitive desktop and mobile navigation menus.

---

## 4. Local SEO & NAP Citation Standards

1. **Google Business Profile (Google Places)**:
   - Fully claim and verify your profile.
   - List 100% accurate business name, physical address, phone number, operating hours, and primary business category.
   - Upload high-resolution, relevant business photos.
   - Proactively collect and respond to customer reviews.
2. **NAP Consistency (Name, Address, Phone)**:
   - Ensure exact NAP consistency across all local business listings, directories, citations, and footer contact info.
3. **Local Schema Markup**:
   - Implement `LocalBusiness` Schema (rich snippets) to display targeted business info directly in search results.

---

## 5. Real-World Practitioner Field Notes: Technical & Indexing Realities

> [!TIP]
> **Practitioner Advice on Indexing**: "Crawled - currently not indexed" status is an **authority assessment**, not a technical bug. Google will not index low-authority or repetitive pages. Simply changing the date in your title (e.g. 2025 to 2026) will not trick Google into indexing or ranking a page. Focus on building out topical cluster depth before expecting secondary pages to index.

> [!IMPORTANT]
> **Server-Side Rendering (SSR) Mandatory for AI Crawlers**: Heavy client-side JavaScript (CSR) causes AI crawlers (PerplexityBot, GPTBot, ClaudeBot) to fail to extract content. Ensure core content, headings, and schema render server-side in raw HTML.
