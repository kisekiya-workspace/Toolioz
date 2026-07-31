# On-Page & Editorial Content SEO Guide

This guide details exact rules, character limits, percentage guidelines, editorial conventions, image parameters, and HTML structural requirements for on-page SEO.

---

## 1. Search Intent & Keyword Research Rules

- **Keyword Research Tools**: Use **Google Keyword Planner** and **Google Search Bar Suggestions** to discover short-tail keywords and long-tail key phrases.
- **Short-Tail vs Long-Tail**:
  - *Short-Tail Keywords* (broad, high volume): Point broad category keywords (e.g. "books") to your homepage or top-level category pages—NOT to specific product pages.
  - *Long-Tail Key Phrases* (specific, lower competition, high conversion): Target specific niche questions (e.g., "How to do xyz in WordPress" instead of "How to use WordPress").
- **Common Misspellings Strategy**:
  - Include common misspellings of focus keywords, brand names, or products (e.g., `"camkorder, kamcorder, camcorder"`) in your internal keyword research list to capture searchers who misspell terms.
- **Keyword Cannibalization Prevention**:
  - Ensure no two pages on your domain compete for the exact same focus keyword/phrase. Keyword cannibalization causes your pages to outrank each other and dilutes overall authority.
- **Spam Penalty Avoidance**:
  - Do NOT repeatedly overuse the same keyword across a page. Search engine crawlers flag repetitive keyword stuffing as spam.

---

## 2. On-Page HTML & Meta Tags Rules

### A. Title Tags (`<title>`)
- **Length**: Maximum **60 characters** (including spaces).
- **Keyword Placement**: Place keywords and info-carrying words as close to the beginning of the title phrase as possible.
- **Formatting Rules**:
  - Make titles catchy, short, and precise.
  - **DO NOT include punctuation marks or special characters at the beginning of titles**—they do NOT improve search relevancy or search rankings.
  - **Avoid promotional superlatives** such as `"best"`, `"cheapest"`, or `"great"`. Searchers look for specific solutions/products, not hype terms.

### B. Meta Description Rules (`<meta name="description">`)
- **Length**: Maximum **150 characters with spaces** (must not exceed 150-160 chars).
- **Point of View Rule**:
  - **MUST BE WRITTEN IN THIRD PERSON**.
  - **STRICTLY AVOID first-person pronouns (`"me"`, `"my"`) and second-person pronouns (`"you"`, `"your"`)**.
- **Execution**: Write unique meta descriptions for every page. Include primary and secondary key phrases with a clear CTA. If omitted, Google pulls random body text.

### C. Heading Hierarchy (`<h1>` - `<h6>`) Rules
- **H1 Tag**:
  - Exactly **ONE H1 tag per page**, surrounding the main post title.
  - Surround H1 in proper HTML tags and place the focus keyword **as close to the beginning as possible**.
- **H2 - H6 Subheading Rule**:
  - **ABOUT 80% OF H2 - H6 SUBHEADINGS SHOULD CONTAIN YOUR KEYWORD**.
  - Place related keywords **AS EARLY AS POSSIBLE** in H2 and H3 subheadings.
  - Make sure all headlines are grammatically correct and logically structure the document.

### D. URL Structure Rules
- **Length**: Short, 100% readable URLs (maximum **75 characters**).
- **Formatting**: Lowercase letters, hyphen-separated (`-`). **Replace underscores (`_`) with hyphens**.
- **Stop Words**: **DO NOT use filler/stop words like `"is"` or `"the"` in URLs**.
- **Uniqueness**: Include focus keywords in URL slug; do not repeat keywords within the same URL.

---

## 3. Editorial Content & Formatting Best Practices

- **The First 100 - 150 Words Rule**:
  - **Google puts more weight on the first 100 to 150 words of a page**.
  - Place focus keywords, core thesis, and primary answers in the first 100-150 words. First paragraphs must state the most important ideas.
- **Word Count & Content Depth**:
  - Comprehensive longform content (**over 1,000 words**) ranks higher, but search intent, relevance, and content quality take precedence over length alone.
- **Robots & Humor Rule**:
  - **DO NOT USE PUNS OR WORDPLAY**. Search engine Spiders are automated robots that scan keywords; they do not understand humor.
- **Formatting & Readability**:
  - Break text up into smaller paragraphs/chunks.
  - Use bulleted lists for scannability.
  - Use **bold text** to highlight key points. Prioritize visible content.
  - Fix all spelling and grammar errors. Good titles/meta descriptions cannot compensate for poor content.
- **Research & Evergreen Content**:
  - Research/expert content (statistics, data, industry studies, infographics, white papers, surveys) ranks higher because external sites link to it as a reference.
  - Use evergreen content for multi-year value. Delete old, outdated, or duplicate content.
  - Create embeddable visual content (infographics, charts) with a link back to your site. Encourage blog comments and community engagement.

---

## 4. Image SEO Checklist & Parameters

1. **File Compression**: Compress image sizes to **under 100KB** (using tools like the WordPress plugin Smush) while maintaining visual quality.
2. **File Format Selection**:
   - Save larger photographic images as **`.JPEG`** (instead of `.TIFF`).
   - Save graphic assets as **`.PNG`** to preserve background transparency.
   - Use **`.SVG`** for logos, icons, and vector graphics.
3. **Pre-Upload Resizing**: Resize images to display dimensions **BEFORE uploading** to optimize load speed.
4. **Image Titles**: Use descriptive image titles in **LOWERCASE**.
5. **Alt Tags (`alt="..."`)**:
   - **MUST NOT exceed 65 characters with spaces**.
   - Must contain focus keywords/phrase describing the image accurately.
   - Avoid over-saturating alt text with keywords (no stuffing).
6. **Captions & Extensions**: Always use captions with images. Audit alt tags using browser tools like *Web Developer Extension*.
7. **Social Attributes**: Include OpenGraph (`og:image`) and Twitter Card (`twitter:image`) attributes for rich previews.

---

## 5. Internal & External Linking Rules

### Internal Linking Rules
- Use keywords and key phrases as anchor text (NEVER use generic text like `"click here"`).
- Internal links signal to Google which pages are most important—pages with the highest number of internal links carry the most weight.
- **Related Posts**: Include 2 to 3 links to related posts on your site, linked tags to related content, and links to broader category pages.
- **Competitor Linking Rule**: **Linking to competitor pages covering a similar topic is NOT encouraged**—you cannot outrank a competitor when linking directly to them.

### External Linking Rules
- Include **2 to 4 outbound links every 1,000 words** pointing to authoritative, reputable sources.
- **Target Window**: Set outbound links to open in a new browser window (`target="_blank"`) so users can easily return to your site.
- **HTML Element**: ALWAYS use standard HTML **`<a>`** tags for links—**NEVER use JavaScript handlers**.
- **NoFollow Tags**: Remove unnecessary `"nofollow"` HTML tags on standard content links unless sponsored.

### Video SEO Rules
- Include descriptive text surrounding embedded videos (title, description, captions, tags) detailing what the video is about to enable search engine indexing.

---

## 6. Real-World Practitioner Field Notes: On-Page Hacks & Content Graph

> [!TIP]
> **Internal Link Anchor Variety**: Over-optimizing exact-match keyword anchor text across every internal link triggers Google spam filters. Use natural, descriptive anchor phrases that act as a "guiding thread" for the user.

> [!IMPORTANT]
> **GSC "High-Impression, Low-Click" Fix**: Filter Google Search Console for queries with high impressions but low CTR. High impressions mean the page ranks near the top; low clicks mean the title tag or opening 100 words fail to answer user intent. Rewrite the title tag and add a direct 50-word answer block at the top to instantly capture clicks.

> [!NOTE]
> **Audit Before Deleting Content**: Do not mass-delete decaying pages. Deleting pages can destroy underlying topical authority. First check if traffic dropped due to competitor quality vs SERP feature shifts (AI Overviews or Reddit ranking above organic links).
