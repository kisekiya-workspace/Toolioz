# Percentage calculator SEO research

Research date: 2026-08-14

## Decision summary

The expansion uses four pages with distinct jobs instead of many near-duplicate percentage pages. This protects the site from keyword cannibalization and gives each URL a clear search intent.

| Page | Primary long-tail target | Supporting query family | Intent | Relative opportunity |
| --- | --- | --- | --- | --- |
| `/finance/percentage-calculator` | percentage calculator with steps | what percent is x of y calculator; percentage of a number calculator | General calculation | Medium; broad parent term, differentiated by two modes and visible steps |
| `/finance/percentage-change-calculator` | percentage increase decrease calculator with steps | percentage change from old to new value; salary percentage increase calculator | Change analysis | Medium; crowded topic, but step-first and zero-base guidance add useful depth |
| `/finance/reverse-percentage-calculator` | reverse percentage calculator original value | find original price after discount calculator; work backwards percentage calculator | Recover starting value | Higher; more specific task and fewer general finance domains in the result set |
| `/finance/discount-calculator-after-tax` | discount calculator after tax | sale price calculator with tax; price after discount and GST calculator | Purchase decision | Higher; compound “discount + tax” intent is narrower than a generic discount calculator |

“Relative opportunity” is a qualitative estimate based on query specificity, SERP composition, and the ability to satisfy a distinct job. It is not a keyword-volume or keyword-difficulty score. Those metrics require first-party Search Console data or a paid keyword database.

## SERP findings applied to the implementation

- Search results consistently reward calculators that show the substituted formula and steps, not only the answer.
- “What is P% of N?” and “X is what percent of Y?” can share one canonical page because both express basic percentage relationships.
- Percentage change needs a dedicated page because its denominator is the original value and its edge case at an original value of zero differs from basic percentage math.
- Reverse percentage has its own intent: users know the final amount and rate but not the original. Adding the same percentage back is a common error, so the page includes a forward check.
- Discount-after-tax searches need a staged breakdown: savings, reduced subtotal, tax amount, then final price. The tax field remains optional because rules vary by jurisdiction.

## On-page map

Each route has one H1, an answer-first summary, a unique title and description, worked examples, common mistakes, FAQs, internal links, and stacked WebApplication, HowTo, BreadcrumbList, and FAQPage structured data. All core copy is server-rendered and each calculator is linked from the finance hub and XML sitemap through the central tool registry.

## Validation plan after publishing

1. Submit the four URLs in Google Search Console and confirm rendered HTML and schema.
2. Track impressions by exact query family for 6–8 weeks.
3. If one page earns impressions but weak clicks, refine its title and opening answer using the real query language.
4. If two pages appear for the same query, adjust internal anchors and page copy to reinforce their distinct intent.
5. Add dedicated salary-hike or GST-discount pages only after Search Console data proves meaningful demand, avoiding speculative thin pages.

## Research references

- U.S. Bureau of Labor Statistics, “Calculating percent changes”: https://www.bls.gov/cpi/factsheets/calculating-percent-changes.htm
- Office for National Statistics, “Percentages and percentage points”: https://service-manual.ons.gov.uk/content/numbers/percentages
- Search-result review conducted for the four primary query families listed above on 2026-08-14.
