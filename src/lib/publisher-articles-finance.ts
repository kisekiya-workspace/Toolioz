export type PublisherArticle = {
  path: string;
  title: string;
  lead: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  examples: Array<{ title: string; body: string }>;
  limitations: string[];
  sources: Array<{ label: string; href: string }>;
  reviewed: string;
};

function article(partial: PublisherArticle): PublisherArticle {
  return partial;
}

export const publisherArticles: PublisherArticle[] = [
  article({
    path: '/finance/sip-calculator',
    title: 'How this SIP calculator actually works',
    lead:
      'The Toolioz SIP calculator projects the future value of equal monthly contributions using a monthly compound annuity, not a promised mutual-fund return. Changing the rate by two percentage points moves a ten-year plan by lakhs of rupees, which is why every figure on the page is tied to the inputs above.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'What the number on screen is',
        paragraphs: [
          'A systematic investment plan (SIP) is a series of cash flows, usually monthly, into a mutual fund folio. The calculator does not look up live NAVs. It treats the expected annual rate as a constant and compounds it monthly. That is the same family of formula used in textbook future-value-of-an-annuity problems, with one extra (1 + i) factor so that each contribution is treated as being invested at the start of the month (annuity-due).',
          'If the monthly rate i is zero, the tool simply multiplies the monthly amount by the number of months. Otherwise it uses M = P × [((1 + i)^n − 1) / i] × (1 + i), where P is the monthly contribution, i is the annual rate divided by 12, and n is years × 12. Step-up mode rebuilds the same annuity year by year, increasing P after each 12 months.',
        ],
      },
      {
        heading: 'A worked check you can repeat by hand',
        paragraphs: [
          'Take ₹5,000 a month for 10 years at 12% a year. Then i = 0.01 and n = 120. Total invested is ₹6,00,000. The formula gives a projected value of about ₹11.62 lakh before tax, expense ratio, and exit load. Drop the rate to 10% and the same cash invested finishes near ₹10.33 lakh. The gap is not a rounding bug; it is compounding on a different i.',
          'XIRR on a real folio will differ because NAVs jump, SIPs skip months, and dividends or STP switches change cash-flow dates. Use this page to size a contribution. Use the fund house statement and an XIRR function when you need a historical rate of return.',
        ],
      },
      {
        heading: 'Tax and cost that the projection omits',
        paragraphs: [
          'Equity mutual fund units sold in India are currently taxed as short-term or long-term capital gains depending on holding period, with a stated annual LTCG exemption threshold that must be read from the Income Tax Department, not from this page. The calculator shows pre-tax corpus. Expense ratios also reduce the rate you actually earn: a 1% extra annual cost is closer to using 11% than 12% in the box above.',
          'Direct plans omit distributor commission that regular plans embed in the expense ratio. Over 15 to 20 years that gap is visible in the same formula. None of this is personalised tax advice.',
        ],
      },
    ],
    examples: [
      {
        title: '₹10,000 a month for 15 years at 12%',
        body: 'Invested capital is ₹18 lakh. The same annuity-due formula with n = 180 and i = 0.01 projects a little over ₹50 lakh before tax. A 10% annual step-up on the same starting P raises both invested capital and the ending value; the extra cash is new contributions, not free return.',
      },
    ],
    limitations: [
      'The rate is an assumption, not a fund trailing return or a guaranteed yield.',
      'Cash flows are assumed on a fixed monthly grid with no missed SIPs.',
      'Inflation, tax, load, and expense ratio are not subtracted unless you lower the rate yourself.',
    ],
    sources: [
      { label: 'Income Tax Department, India', href: 'https://www.incometax.gov.in/' },
      { label: 'AMFI, mutual fund industry data', href: 'https://www.amfiindia.com/' },
    ],
  }),
  article({
    path: '/finance/lumpsum-calculator',
    title: 'Lumpsum growth versus a monthly SIP',
    lead:
      'A lumpsum calculator compounds one opening amount. It answers "if this money stays invested at rate r for t years, what is the ending value?" It does not average rupee-cost or model later top-ups unless you run those as separate scenarios.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Formula used on this page',
        paragraphs: [
          'Ending value A = P × (1 + r)^t when compounding is annual, or A = P × (1 + r/n)^(n t) when you choose a compounding frequency n. Toolioz uses the compound-interest engine with the frequency shown in the control. A ₹2,00,000 lumpsum at 12% for 10 years compounded annually is 200000 × (1.12)^10 ≈ ₹6.21 lakh. Monthly compounding on the same nominal 12% is slightly higher because interest is added twelve times a year.',
          'That is not comparable to an SIP of ₹2,000 a month for 10 years: the SIP never had ₹2,00,000 working for the full decade. Compare equal rupees invested, or equal time, but not a lumpsum face value against a monthly debit.',
        ],
      },
      {
        heading: 'When a lumpsum projection is the right model',
        paragraphs: [
          'Use this page for a bonus, maturity proceeds, or an existing corpus you do not plan to add to. Use the SIP page if money will arrive every month. Sequence-of-returns risk is real for both; a constant r hides it. If you need a conservative plan, run 8% and 10% next to 12% and keep the lower ending value as the working number.',
        ],
      },
    ],
    examples: [
      {
        title: '₹5 lakh for 8 years at 10%, annual compounding',
        body: 'A = 500000 × (1.10)^8 ≈ ₹10.72 lakh. The same principal at 8% finishes near ₹9.26 lakh.',
      },
    ],
    limitations: [
      'No withdrawals, taxes, or expense ratios are applied unless you change r.',
      'A constant rate ignores bear-market years at the start of retirement drawdown.',
    ],
    sources: [
      { label: 'Reserve Bank of India publications', href: 'https://www.rbi.org.in/' },
    ],
  }),
  article({
    path: '/finance/compound-interest',
    title: 'Compound interest: frequency is part of the answer',
    lead:
      'Compound interest adds earned interest back to principal on a schedule. Two quotes with the same nominal annual rate are not equal if one compounds monthly and the other annually. This page makes that difference visible.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'The equation and a numeric check',
        paragraphs: [
          'A = P (1 + r/n)^(n t). P is opening principal, r is the nominal annual rate as a decimal, n is compounds per year, t is years. ₹1,00,000 at 8% for 5 years compounded annually is 100000 × (1.08)^5 ≈ ₹1,46,933. Compounded monthly, n = 12, the same inputs finish near ₹1,48,984. The extra ₹2,051 is frequency, not a second product.',
          'A one-time mutual-fund lumpsum and a bank FD use this same family of math. An FD that compounds quarterly is n = 4. Toolioz does not keep a second public page for those keywords: type the deposit rate and tenure here. Monthly additions still belong on the SIP calculator.',
        ],
      },
      {
        heading: 'Compound interest is not SIP math',
        paragraphs: [
          'This page compounds one principal. Monthly additions belong on the SIP calculator. Mixing the two formulas is a common error in informal "how much will I have" threads.',
        ],
      },
    ],
    examples: [
      {
        title: 'Rule of 72 as a sanity check',
        body: 'At 8% annual compounding, 72 / 8 ≈ 9 years to double. The exact doubling time is ln(2)/ln(1.08) ≈ 9.01 years. If the tool shows a double in 6 years at 8%, the inputs are wrong.',
      },
    ],
    limitations: [
      'Inflation is not subtracted; real purchasing power is lower than A.',
      'Fees, TDS, and premature-withdrawal penalties are issuer-specific.',
    ],
    sources: [
      { label: 'RBI, consumer education on interest', href: 'https://www.rbi.org.in/' },
    ],
  }),
  article({
    path: '/finance/income-tax',
    title: 'How the income-tax estimate is built',
    lead:
      'This calculator applies labelled Indian slab logic for a stated financial year and regime. It is a planning estimate. Notifications, cess, surcharge, and rebate sections change; the on-page date tells you which snapshot was coded.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'What you must still verify',
        paragraphs: [
          'Slab rates, the standard deduction, rebate under section 87A, and surcharge thresholds are set by statute and the Finance Act for a year. Toolioz copies those into code after a review pass. If Parliament or the CBDT later changes a figure, the official portal wins. Compare the result with the department calculator or a CA before filing.',
          'Old versus new regime is not a slogan. Deductions such as 80C, 80D, and HRA exemptions exist in the old regime and are largely unavailable in the new regime except for a short listed set. The comparison is only as good as the deduction amounts you enter. Leaving 80C at zero while claiming "old regime is worse" is a data-entry error, not tax law.',
        ],
      },
      {
        heading: 'Salary is not the same as taxable income',
        paragraphs: [
          'CTC includes employer PF, gratuity accruals, and sometimes variable pay that is taxed only when received. This page uses the income figure you type. Professional tax, employer NPS, and exempt allowances need to be reflected in that figure or in the deduction fields. Agricultural income, capital gains, and business heads are not a full ITR substitute here.',
        ],
      },
    ],
    examples: [
      {
        title: 'Rebate intuition',
        body: 'If the coded year includes a rebate that zeros tax up to a stated taxable-income cap, a salary just below that cap can show zero tax while a salary slightly above it does not. That cliff is in the statute, not a glitch. Read the rebate section on the department site for the exact cap in force.',
      },
    ],
    limitations: [
      'Not a filing engine: no AIS import, no Form 16 parser on this page.',
      'Surcharge, marginal relief, and some special rates may be simplified.',
      'State professional tax is not a full India-wide matrix.',
    ],
    sources: [
      { label: 'Income Tax Department', href: 'https://www.incometax.gov.in/' },
      { label: 'Income-tax portal help and calculators', href: 'https://eportal.incometax.gov.in/' },
    ],
  }),
  article({
    path: '/finance/gst-calculator',
    title: 'GST inclusive versus exclusive amounts',
    lead:
      'Indian GST is a tax on the taxable value at a notified rate for that supply. This page either adds GST to a base or backs GST out of a tax-inclusive total. It does not decide the HSN rate for a product.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'The two directions',
        paragraphs: [
          'Exclusive: tax = base × rate/100, total = base + tax. Inclusive: base = total / (1 + rate/100), tax = total − base. Mixing them up is how invoices disagree with payment links. A ₹1,180 tax-inclusive amount at 18% has a base of ₹1,000, not ₹1,180 × 0.18.',
          'Rates such as 5%, 12%, 18%, and 28% exist because the GST Council assigns goods and services to slabs. Using 18% on a 5% item is a classification error. Confirm the rate from the official tariff or a GST practitioner.',
        ],
      },
    ],
    examples: [
      {
        title: '₹2,500 exclusive at 18%',
        body: 'Tax = ₹450, payable = ₹2,950. The same ₹2,950 inclusive at 18% reverses to a ₹2,500 base.',
      },
    ],
    limitations: [
      'No IGST/CGST/SGST split beyond a single rate box.',
      'Composition scheme, RCM, and exemptions are not modelled.',
    ],
    sources: [
      { label: 'GST portal (CBIC / GSTN)', href: 'https://www.gst.gov.in/' },
    ],
  }),
  article({
    path: '/finance/fd-calculator',
    title: 'Fixed-deposit maturity is issuer math, not a market forecast',
    lead:
      'An FD calculator compounds a deposit at the rate the bank prints on the receipt. Toolioz uses that rate and tenure. It does not fetch live card rates or TDS.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Compounding and premature withdrawal',
        paragraphs: [
          'Many Indian banks compound quarterly on retail FDs. If the page frequency is quarterly, n = 4 in A = P (1 + r/n)^(n t). A ₹1,00,000 deposit at 7% for 5 years quarterly is about ₹1,41,478 before tax. Annual compounding at the same 7% is about ₹1,40,255. Ask the bank which convention it uses; do not assume this tool matches every product.',
          'Breaking an FD early usually applies a lower rate and sometimes a penalty. The maturity value shown here assumes the deposit runs to tenure. Senior-citizen extra rates are a bank discretionary add-on you must type into the rate box yourself.',
        ],
      },
    ],
    examples: [
      {
        title: 'TDS intuition',
        body: 'Interest above a statutory threshold in a financial year can attract TDS. The maturity figure is gross unless you lower the rate. Check the current threshold on the Income Tax Department site.',
      },
    ],
    limitations: [
      'No sweep-in, no auto-renewal, no callable vs non-callable split.',
      'Deposit insurance coverage is a separate DICGC question, not a formula output.',
    ],
    sources: [
      { label: 'RBI, banking for the public', href: 'https://www.rbi.org.in/' },
      { label: 'Income Tax Department, TDS', href: 'https://www.incometax.gov.in/' },
    ],
  }),
  article({
    path: '/finance/mortgage-calculator',
    title: 'Home-loan EMI from the amortization formula',
    lead:
      'The monthly EMI on a reducing-balance home loan is M = P × [i (1 + i)^n] / [(1 + i)^n − 1], where i is the monthly rate and n is the number of EMIs. That is what this page computes. It is not a sanction letter.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Reading the payment',
        paragraphs: [
          'Early EMIs are mostly interest; later EMIs are mostly principal. A ₹50 lakh loan at 8.5% for 20 years has i = 0.085/12 and n = 240. The EMI is about ₹43,391. Total payment is EMI × 240, and interest is that total minus ₹50 lakh. Changing tenure from 20 to 25 years lowers EMI and raises lifetime interest. That trade-off is the point of the table, not a recommendation to stretch every loan.',
          'A car loan uses the same formula with a shorter n and a different rate. Put on-road price minus down payment in P. Toolioz does not publish a second EMI page for vehicles. Floating-rate loans reprice when the lender benchmark moves; this page treats the typed rate as fixed for the full n. Extra payments belong on the loan-prepayment tool.',
        ],
      },
    ],
    examples: [
      {
        title: 'Zero-rate edge case',
        body: 'If i = 0, EMI is principal / n. The code uses that branch so a 0% test does not divide by zero.',
      },
    ],
    limitations: [
      'Processing fees, stamp duty, GST on fees, and insurance are extra cash, not inside M.',
      'Part-prepayment and offset accounts are not in this EMI.',
    ],
    sources: [
      { label: 'RBI, housing finance directions (overview)', href: 'https://www.rbi.org.in/' },
    ],
  }),
  article({
    path: '/finance/loan-prepayment',
    title: 'What prepayment changes in an amortizing loan',
    lead:
      'A prepayment reduces principal. The lender then either shortens the remaining tenure or lowers the EMI, according to the product rules. This page estimates interest saved under the model documented on the screen.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Why ₹1 extra is not linear',
        paragraphs: [
          'Interest is charged on outstanding principal. Paying ₹1 lakh in year two of a 20-year loan saves more remaining interest than the same ₹1 lakh in year eighteen, because more periods of interest were still ahead. Run both dates if you are deciding when to deploy a bonus.',
          'Some lenders levy a prepayment charge on floating or fixed products. Subtract that fee from "interest saved" before calling the prepayment a win. RBI has restricted foreclosure charges on some floating-rate individual loans; the current circular beats a blog post.',
        ],
      },
    ],
    examples: [
      {
        title: 'EMI unchanged, tenure cut',
        body: 'After a lump-sum prepayment, keeping EMI constant typically drops n. The remaining-interest figure should fall. If it does not, check that outstanding principal and remaining months were entered as of the prepayment date, not origination.',
      },
    ],
    limitations: [
      'Does not reprice a floating rate after prepayment.',
      'Does not model moratoriums or skipped EMIs.',
    ],
    sources: [
      { label: 'RBI, loan foreclosure and related FAQs', href: 'https://www.rbi.org.in/' },
    ],
  }),
  article({
    path: '/finance/car-loan',
    title: 'Car-loan EMI is the same amortization family as a mortgage',
    lead:
      'A car loan uses the same reducing-balance EMI formula as a home loan, usually with a shorter n and a different rate. On-road price minus down payment is the principal P you should type, not ex-showroom alone, unless the dealer finances only that slice.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Principal and extras',
        paragraphs: [
          'Insurance, extended warranty, and accessories added to the loan inflate P and therefore EMI. A 7-year tenure lowers EMI and can mean you still owe money after the useful life of the car. Compare total interest at 3, 5, and 7 years with the same P and rate before signing.',
          'Manufacturer subvention rates are marketing. The true cost may be a higher list price. Use the contracted IRR or the rate on the agreement, not a banner 0% EMI without reading the contract.',
        ],
      },
    ],
    examples: [
      {
        title: '₹8 lakh financed at 10% for 5 years',
        body: 'n = 60, i = 0.10/12, EMI ≈ ₹16,998. Total paid ≈ ₹10.20 lakh, of which about ₹2.20 lakh is interest.',
      },
    ],
    limitations: [
      'No balloon payment, lease, or balloon residual value.',
      'Hypothecation and foreclosure charges are contractual.',
    ],
    sources: [
      { label: 'RBI, retail lending information', href: 'https://www.rbi.org.in/' },
    ],
  }),
  article({
    path: '/finance/inflation-calculator',
    title: 'Inflation erodes a future rupee, it does not change cash today',
    lead:
      'This page applies FV = PV × (1 + π)^t. π is an assumed annual inflation rate, not the next CPI print. Use it to see purchasing power, not to forecast RBI policy.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Reading the output',
        paragraphs: [
          '₹1,00,000 today at 6% inflation for 10 years needs about ₹1,79,085 in then-rupees to buy the same basket. Equivalently, ₹1,00,000 received in 10 years is worth about ₹55,840 in rupees today at 6%. Those two views are inverses.',
          'Indian CPI series are published by MOSPI. Food and housing inflate at different speeds; a single π is a blunt instrument. For retirement, pair this page with the retirement-corpus calculator rather than inflating salary forever at 6% without a career path.',
        ],
      },
    ],
    examples: [
      {
        title: 'Education cost sketch',
        body: 'A ₹15 lakh present cost at 8% education inflation for 12 years is 1500000 × (1.08)^12 ≈ ₹37.8 lakh. That is a planning sketch, not a college fee circular.',
      },
    ],
    limitations: [
      'One rate for all goods is an approximation.',
      'Deflation and negative π are mathematically allowed but rare as a 10-year plan.',
    ],
    sources: [
      { label: 'MOSPI, CPI products', href: 'https://www.mospi.gov.in/' },
      { label: 'RBI, inflation data and publications', href: 'https://www.rbi.org.in/' },
    ],
  }),
  article({
    path: '/finance/retirement-corpus',
    title: 'Retirement corpus is a stack of assumptions',
    lead:
      'The corpus tool estimates how large a pot you need so that withdrawals can last a stated period after inflation. Small changes in withdrawal rate, inflation, and years to retirement dominate the result. Treat the output as a range, not a target you must hit to the rupee.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'What the model is doing',
        paragraphs: [
          'Typical inputs are current expenses, years to retirement, inflation, expected post-retirement return, and years in retirement. Expenses are inflated to retirement, then a present-value of an annuity (or a capitalised multiple) is applied so that withdrawals keep pace with inflation. If the on-page formula uses a different arrangement, the labelled equation wins.',
          'A 4% initial withdrawal idea from other markets is not an Indian statutory rule. Sequence-of-returns risk, medical inflation, and lack of a full social-security wage replacement make a single percentage unsafe as a promise. Run a higher expense and a lower return as a stress case.',
        ],
      },
    ],
    examples: [
      {
        title: 'Inflating current spend',
        body: '₹80,000 monthly spend at 6% for 20 years until retirement is 80000 × (1.06)^20 ≈ ₹2.57 lakh monthly in then-rupees, before you even size the corpus.',
      },
    ],
    limitations: [
      'No EPFO, NPS annuity, or rental yield is auto-imported.',
      'Longevity past the typed years is unfunded in the model.',
    ],
    sources: [
      { label: 'PFRDA / NPS Trust information', href: 'https://www.pfrda.org.in/' },
    ],
  }),
  article({
    path: '/finance/percentage-calculator',
    title: 'Percentages are a ratio, not a second number sitting beside 100',
    lead:
      'Finding P% of N multiplies N by P/100. Asking what percent X is of Y divides X by Y and multiplies by 100. Those are inverse questions. This page keeps them separate so the denominator does not swap by accident.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Why the order of X and Y matters',
        paragraphs: [
          '"36 is what percent of 240?" is (36/240)×100 = 15%. "240 is what percent of 36?" is a different question and a number over 100%. Finance uses the first form for "what share of salary is rent." Using the sale price as the base when you meant the original price is the usual discount mistake; that belongs on the percentage-change page.',
        ],
      },
    ],
    examples: [
      {
        title: '18% of 250',
        body: '(18/100)×250 = 45. Reversing: 45 is 18% of 250.',
      },
    ],
    limitations: [
      'A percentage of a percentage (interest on GST) needs two steps, not one box.',
    ],
    sources: [
      { label: 'ONS, percentages versus percentage points', href: 'https://service-manual.ons.gov.uk/content/numbers/percentages' },
    ],
  }),
  article({
    path: '/finance/percentage-change-calculator',
    title: 'Percentage change always needs the original value in the denominator',
    lead:
      'Change = ((new − original) / |original|) × 100. A rise from 80 to 100 is +25%. A fall from 100 to 80 is −20%. They are not mirrors because the base moved.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Percentage points are not percent',
        paragraphs: [
          'A tax rate moving from 20% to 25% rose 5 percentage points and rose 25% relative to 20%. Mixing those phrases misstates a Budget speech. From zero, relative percentage change is undefined; report the absolute difference instead.',
        ],
      },
    ],
    examples: [
      {
        title: 'CPI-style month change',
        body: 'The BLS method for percent change is the same ratio. Toolioz does not load CPI microdata; it only does the arithmetic on the two numbers you type.',
      },
    ],
    limitations: [
      'Not a chained index or seasonally adjusted series.',
    ],
    sources: [
      { label: 'U.S. BLS, calculating percent changes', href: 'https://www.bls.gov/cpi/factsheets/calculating-percent-changes.htm' },
    ],
  }),
];

export function getPublisherArticle(pathname: string): PublisherArticle | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  return publisherArticles.find((entry) => entry.path === path);
}
