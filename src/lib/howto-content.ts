import { ADSENSE_NOINDEX_HOWTO_SLUGS } from '@/lib/adsense-catalog';

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToPost {
  slug: string;
  directUrl: string;
  title: string;
  description: string;
  keywords: string[];
  updated: string;
  updatedIso: string;
  readTime: string;
  toolLabel: string;
  toolHref: string;
  totalTime?: string;
  steps: HowToStep[];
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  sources?: Array<{
    label: string;
    href: string;
  }>;
}

export const howToPosts: HowToPost[] = [
  {
    slug: 'compress-pdf-under-2mb',
    directUrl: '/how-to/compress-pdf-under-2mb',
    title: 'Compress a PDF under 2 MB',
    description:
      'Explains why a PDF stays large and which pages on Toolioz do not compress files to a 2 MB cap.',
    keywords: [
      'how to compress pdf under 2mb',
      'how to shrink pdf file size free',
      'compress pdf for email submission',
      'reduce pdf size under 2mb online',
      'how to optimize pdf file size without blur',
      'client side pdf compressor privacy',
    ],
    updated: 'July 2026',
    updatedIso: '2026-07-25',
    readTime: '8 min read',
    toolLabel: 'Open PDF tools',
    toolHref: '/pdftools',
    totalTime: 'PT3M',
    steps: [
      {
        name: 'Start from a merged or exported PDF',
        text: 'Toolioz does not publish a PDF compressor. After you merge files or export images to PDF, open a dedicated compressor you trust if a portal requires a size cap such as 2 MB.',
      },
      {
        name: 'There is no compress-PDF control',
        text: 'Toolioz does not have a Standard or Maximum compression profile, a 150 DPI setting, or a button that guarantees a file under 2 MB.',
      },
      {
        name: 'Image compressor output is JPEG',
        text: 'The image compressor accepts JPEG, PNG, or WebP and saves a JPEG. It does not rewrite a PDF.',
      },
      {
        name: 'Merge does not shrink the file to a cap',
        text: 'PDF merge copies pages with pdf-lib. It does not downsample images to a 2 MB limit.',
      },
    ],
    sections: [
      {
        heading: 'Why PDF Files Swell Beyond 10MB: The Anatomy of PDF Bloat',
        body: [
          'Portable Document Format (PDF) files are designed to preserve exact document fidelity across operating systems. However, this flexibility often leads to massive file bloat when documents are scanned or exported from desktop publishing software without optimization.',
          'The primary cause of oversized PDFs is uncompressed high-resolution bitmap images. When a multi-page document is scanned at 300 DPI or 600 DPI, each page can generate an uncompressed image stream taking 3MB to 8MB of memory. Multiplying this across a 10-page application results in a 30MB+ document that fails email server caps.',
          'Additional bloat is caused by embedded font subsets (where full font files are embedded multiple times for different document chapters), uncompressed color profiles (ICC profiles), and legacy edit histories or XML metadata tags left behind by software like Adobe Acrobat or Photoshop.',
        ],
      },
      {
        heading: 'Understanding Image Downsampling vs. Vector Text Preservation',
        body: [
          'The key to compressing a PDF file under 2MB without making text blurry lies in distinguishing between raster images and vector text paths.',
          'Toolioz does not resample PDF images to 150 DPI or 96 DPI. The image compressor saves a JPEG from a JPEG, PNG, or WebP. PDF merge copies pages and does not apply a 2 MB cap.',
          'Toolioz does not convert PDF color spaces from CMYK to RGB, and it does not apply Flate compression to reach a size cap.',
        ],
      },
      {
        heading: 'Why Client-Side In-Browser Compression is Essential for Privacy',
        body: [
          'Many PDF compression websites upload files to their servers. Bank statements, tax documents, passport scans, and medical records should not go there if you need them to stay on the device. Toolioz does not publish a compressor. Use software you already trust for size caps.',
          'Toolioz does not ship a WebAssembly PDF compressor. Merge, split, and image-to-PDF run in the browser with pdf-lib, and those files are not uploaded by those tools. None of them guarantee a file under 2 MB.',
        ],
      },
      {
        heading: 'Optimizing PDFs for Government, College & Employment Portals',
        body: [
          'Online application portals for universities, visa applications, and government recruitment boards frequently enforce strict file upload constraints (e.g., maximum 2MB per attachment). Uploading an oversized file triggers immediate form rejection or silent failure.',
          'Before submitting your compressed PDF, perform a quick quality check: open the file in a browser or PDF reader, zoom in to 150% on text areas to ensure crisp legibility, and verify that all scanned signature lines and official stamps remain clearly visible.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Toolioz compress a PDF without blurring the text?',
        answer:
          'No. There is no PDF compression control. Text sharpness after compression is not something this site measures.',
      },
      {
        question: 'How do I compress a PDF under 2MB on mobile devices (iPhone / Android)?',
        answer:
          'Use a dedicated PDF compressor on your phone or computer after the file exists. Toolioz merge and image-to-PDF pages do not shrink file size to a 2 MB cap.',
      },
      {
        question: 'Can a password-protected PDF be compressed here?',
        answer:
          'No. Toolioz does not compress PDFs, locked or unlocked.',
      },
      {
        question: 'Does this site offer lossy and lossless PDF compression?',
        answer:
          'No. Those modes are not on Toolioz. The image compressor writes a JPEG. PDF merge copies pages.',
      },
      {
        question: 'Why is there no smaller PDF after using Toolioz?',
        answer:
          'Merge and image-to-PDF do not target a smaller file. A size cap has to be handled in other software.',
      },
    ],
    sources: [
      {
        label: 'ISO 32000-2: PDF 2.0 Architectural Specification',
        href: 'https://www.iso.org/standard/63534.html',
      },
    ],
  },

  {
    slug: 'calculate-sip-returns',
    directUrl: '/how-to/calculate-sip-returns',
    title: 'Calculate SIP returns step by step',
    description:
      'Shows the monthly SIP future-value formula, a step-up example, and the difference between SIP and a lumpsum.',
    keywords: [
      'how to calculate sip returns',
      'sip calculation formula step by step',
      'how sip compounding works',
      'calculate monthly mutual fund investment',
      'sip wealth projection guide',
      'xirr vs cagr mutual fund return calculation',
    ],
    updated: 'July 2026',
    updatedIso: '2026-07-25',
    readTime: '9 min read',
    toolLabel: 'Open SIP Calculator',
    toolHref: '/finance/sip-calculator',
    totalTime: 'PT4M',
    steps: [
      {
        name: 'Define Your Monthly Contribution Amount (P)',
        text: 'Determine the fixed cash amount you will invest automatically on a monthly basis (e.g., $200, $500, or ₹10,000) based on your disposable salary income.',
      },
      {
        name: 'Set Your Target Annual Return Rate (r)',
        text: 'Input your expected annual growth rate based on historical asset class benchmarks (e.g., 12% p.a. for broad market equity index funds).',
      },
      {
        name: 'Select Investment Horizon in Years (t)',
        text: 'Specify how many years you intend to stay invested (e.g., 10, 15, or 20 years). Longer timeframes allow compounding to produce exponential wealth curve acceleration.',
      },
      {
        name: 'Compute Future Value Corpus & Analyze Net Gain',
        text: 'Use the Toolioz SIP Calculator to instantly compute your total principal outlay versus total estimated compound returns earned.',
      },
    ],
    sections: [
      {
        heading: 'The Mathematical Formula Behind SIP Compound Returns',
        body: [
          'Calculating compounding returns on regular monthly contributions requires an annuity future value formula rather than a simple lump sum interest equation.',
          'The exact mathematical formula for calculating Future Value (FV) of a Systematic Investment Plan is:',
          'FV = P × [ { (1 + i)^n - 1 } / i ] × (1 + i)',
          'Where P represents the monthly installment amount, i represents the periodic monthly interest rate (Annual Return Rate ÷ 12 ÷ 100), and n represents the total number of monthly payments made over the duration (Tenure in Years × 12).',
          'For example: If you invest ₹10,000 every month for 15 years (n = 180 months) at an expected annual return of 12% (i = 0.12 ÷ 12 = 0.01 per month):',
          '• Total Principal Outlay = ₹10,000 × 180 = ₹18,000,000 (18 Lakhs)',
          '• Estimated Future Value Corpus = ₹50,45,760 (50.45 Lakhs)',
          '• Total Compound Interest Earned = ₹32,45,760 (32.45 Lakhs)',
        ],
      },
      {
        heading: 'Understanding XIRR vs. CAGR: Measuring Actual Mutual Fund Growth',
        body: [
          'When evaluating mutual fund performance statements, investors often get confused between CAGR (Compound Annual Growth Rate) and XIRR (Extended Internal Rate of Return).',
          'CAGR measures point-to-point annual growth on a single lump sum payment made at the beginning of a period. It assumes no cash entered or exited the investment mid-way.',
          'XIRR is the standard metric for SIP investments because cash flows occur at multiple distinct dates over time. XIRR calculates the exact internal discount rate at which the net present value of all monthly cash outflows equals the current value of the mutual fund portfolio.',
        ],
      },
      {
        heading: 'The Power of Step-Up SIP: Expanding Corpus with Salary Raises',
        body: [
          'A flat SIP keeps your monthly contribution constant for 15 or 20 years. However, as your annual salary rises with career progression, your investment capability increases.',
          'A Step-Up SIP increases your monthly contribution by a set percentage, for example 10%, once every year. Increasing a ₹10,000 monthly SIP by 10% annually over 15 years at 12% return expands the projected corpus from about ₹50.4 lakh to over ₹88.2 lakh. The extra ending value comes mostly from extra contributions after each raise.',
        ],
      },
      {
        heading: 'Taxation Considerations: Post-Tax Net Return Calculation',
        body: [
          'When planning long-term wealth goals, always factor in capital gains taxation rules applicable to equity and debt mutual funds.',
          'In India, Long-Term Capital Gains (LTCG) on equity funds held over 1 year are taxed at 12.5% on profits exceeding ₹1.25 Lakhs per financial year. Short-Term Capital Gains (STCG) on equity funds held under 1 year are taxed at 20%. Subtracting expected tax obligations ensures your retirement projections remain realistic. Confirm both rates and the exemption threshold on the Income Tax Department website before you treat a spreadsheet as post-tax income.',
        ],
      },
      {
        heading: 'Mistakes this calculator will not catch for you',
        body: [
          'Entering a 12% expected return because “equity always does 12%” is a hope, not a dataset. Rolling ten-year Nifty or category returns have spent long stretches below that line. Run 8% and 10% as working cases.',
          'Ignoring expense ratio is the same as typing too high a rate. A 1% extra annual cost on a 20-year SIP is a large rupee gap in the same annuity formula.',
          'Comparing a ₹5,000 SIP for 20 years to a ₹5,000 lumpsum for 20 years as if they invested the same money is invalid: the SIP only finishes depositing in month 240.',
          'Using the Toolioz figure as a mutual-fund “guaranteed maturity” would be a misreading of both SEBI product rules and this page. Mutual funds are mark-to-market.',
        ],
      },
      {
        heading: 'How Toolioz checks the SIP function',
        body: [
          'The implementation lives in calculateSIP in the site’s formula module. For a zero rate it returns monthly amount times months. For a positive rate it uses the annuity-due closed form. A spot check used on 10 September 2026: ₹5,000 a month, 12% a year, 10 years → invested ₹6,00,000, projected value about ₹11.62 lakh. If a future code change disagrees with that closed form, treat it as a bug and email support@toolioz.com with the inputs.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does the SIP page decide between a SIP and a lumpsum?',
        answer:
          'No. The SIP page compounds a monthly amount. The lumpsum page compounds one deposit monthly. Neither page models a bull market or rupee-cost averaging.',
      },
      {
        question: 'What if a month is skipped?',
        answer:
          'The calculator assumes every month in the term is paid. A skipped installment is not modeled.',
      },
      {
        question: 'Does this SIP calculator use rupee-cost averaging?',
        answer:
          'No. Every installment compounds at the same monthly rate. Unit prices are not simulated.',
      },
      {
        question: 'Does the SIP calculator pause a mutual-fund debit?',
        answer:
          'No. It compounds the monthly amount that is typed in. It does not talk to a fund house or cancel a debit.',
      },
    ],
    sources: [
      {
        label: 'SEC Investor.gov: Compound Interest & Annuity Guide',
        href: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
      },
    ],
  },

  {
    slug: 'decode-jwt-token',
    directUrl: '/how-to/decode-jwt-token',
    title: 'Decode and inspect a JWT',
    description:
      'Explains the three JWT parts, what decoding shows, and why an HS256 check needs the shared secret.',
    keywords: [
      'how to decode jwt token',
      'how to check jwt expiration online',
      'inspect jwt payload claims',
      'jwt debugger online free',
      'verify jwt signature algorithm',
      'jwt security best practices hs256 vs rs256',
    ],
    updated: 'July 2026',
    updatedIso: '2026-07-25',
    readTime: '8 min read',
    toolLabel: 'Open JWT Decoder',
    toolHref: '/devtools/jwt-decoder',
    totalTime: 'PT3M',
    steps: [
      {
        name: 'Copy the JWT string',
        text: 'A JWT is three base64url parts separated by dots. Copy that string from the Authorization header, storage, or the callback URL.',
      },
      {
        name: 'Paste it into the decoder',
        text: 'The header and payload are decoded in the page. The token is not uploaded. The site still loads ordinary assets.',
      },
      {
        name: 'Read the header and claims',
        text: 'The header shows alg. The payload shows claims such as sub, iss, and exp. The payload is encoded, not encrypted.',
      },
      {
        name: 'Check exp and, for HS256, a secret',
        text: 'exp is compared with the current time and labelled Expired or Valid. A typed secret can check an HS256 signature. RS256 is not checked.',
      },
    ],
    sections: [
      {
        heading: 'Anatomy of a JSON Web Token (RFC 7519 Specification)',
        body: [
          'A JSON Web Token (JWT) is an open standard (RFC 7519) for securely transmitting information between client and server as a JSON object. A valid JWT string consists of three distinct parts separated by dots (`.`):',
          '1. Header: Specifies token metadata, including the signing algorithm used (e.g., `{"alg": "HS256", "typ": "JWT"}`).',
          '2. Payload: Contains claims about an entity (typically the user) and additional session data (e.g., `{"sub": "1234567890", "name": "Jane Doe", "admin": true, "exp": 1774483200}`).',
          '3. Signature: A cryptographic hash created by taking the Base64URL-encoded header, Base64URL-encoded payload, and signing them with a secret key or private key.',
        ],
      },
      {
        heading: 'Why Base64URL Encoding Is NOT Encryption',
        body: [
          'A common misconception among developer beginners is assuming that JWT tokens encrypt user payload data. They do not.',
          'Base64URL encoding is a reversible representation format that converts binary data into URL-safe ASCII characters. Anyone who intercepts a JWT string can decode its contents in seconds using standard browser APIs (`atob`). Never store sensitive information such as plain text passwords, credit card numbers, or social security details inside unencrypted JWT payloads.',
        ],
      },
      {
        heading: 'Common JWT Vulnerabilities: Algorithm Confusion & None Attacks',
        body: [
          'Security flaws in JWT implementations often arise from improper signature verification logic on backend authentication servers:',
          '• The "alg": "none" Exploit: Early JWT parsing libraries allowed tokens to bypass verification if an attacker set the header `"alg": "none"`. Modern JWT verification middleware must explicitly require a valid algorithm whitelist.',
          '• Algorithm Confusion Attack (RS256 vs. HS256): If a backend expects an asymmetric RS256 signature (which verifies using a public key) but accepts an HS256 token signed with the server public key as a symmetric HMAC secret, an attacker can forge valid admin tokens.',
        ],
      },
      {
        heading: 'Where to Store Tokens: HttpOnly Cookies vs. LocalStorage',
        body: [
          'Storing JWT session tokens in browser `localStorage` or `sessionStorage` leaves them vulnerable to Cross-Site Scripting (XSS) attacks. If an attacker injects a malicious script, they can read `localStorage.getItem("token")` and exfiltrate credentials.',
          'The recommended production architecture is storing authentication JWTs inside `SameSite=Strict`, `HttpOnly`, `Secure` HTTP cookies, which prevents JavaScript code from accessing token storage.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I decode a JWT token if I do not know the secret key?',
        answer:
          'Yes. The header and payload are only Base64URL text. Checking or changing the signature requires the key.',
      },
      {
        question: 'What is the `exp` claim in a JWT payload?',
        answer:
          'The `exp` (expiration time) claim identifies the Unix epoch timestamp after which the token must not be accepted for authentication processing.',
      },
      {
        question: 'What is the difference between HS256 and RS256?',
        answer:
          'HS256 is a symmetric algorithm using a single shared secret key for signing and verifying tokens. RS256 is an asymmetric algorithm using a private key to sign tokens and a public key to verify signatures.',
      },
      {
        question: 'Is my secret key transmitted over the internet when using Toolioz JWT Decoder?',
        answer:
          'No. Parsing and an HS256 check run in the browser. The secret is not sent on the network.',
      },
    ],
    sources: [
      {
        label: 'RFC 7519: JSON Web Token (JWT) Standard',
        href: 'https://datatracker.ietf.org/doc/html/rfc7519',
      },
    ],
  },

  {
    slug: 'format-json-and-fix-errors',
    directUrl: '/how-to/format-json-and-fix-errors',
    title: 'Format JSON and fix parse errors',
    description:
      'Explains JSON.parse failures such as trailing commas and single quotes, and what formatting does not change.',
    keywords: [
      'how to format json online',
      'how to fix json parse error',
      'prettify json string online',
      'validate json syntax free',
      'json parse error unexpected token',
      'json formatting standards ecma 404',
    ],
    updated: 'July 2026',
    updatedIso: '2026-07-25',
    readTime: '7 min read',
    toolLabel: 'Open JSON Formatter',
    toolHref: '/devtools/json-formatter',
    totalTime: 'PT3M',
    steps: [
      {
        name: 'Copy Raw or Minified JSON Output',
        text: 'Copy the unformatted JSON payload string from your API response, server log file, browser developer tools console, or database export.',
      },
      {
        name: 'Paste Text into the Interactive Code Editor',
        text: 'Paste the string into the input panel of the Toolioz JSON Formatter. Real-time syntax validation evaluates code structure instantly as you type.',
      },
      {
        name: 'Run Prettify & Select Indentation Level',
        text: 'Click "Format / Prettify". Choose 2-space or 4-space indentation to convert minified single-line text into a readable hierarchical object tree.',
      },
      {
        name: 'Fix Highlighted Syntax Errors & Export Code',
        text: 'If a syntax error exists, inspect line and column error indicators (e.g., unexpected trailing commas or missing double quotes). Copy formatted JSON with one click.',
      },
    ],
    sections: [
      {
        heading: 'The ECMA-404 JSON Standard Specification',
        body: [
          'JavaScript Object Notation (JSON) is a lightweight, text-based data interchange format defined by ECMA-404 and RFC 8259 specifications. Because of its language independence, JSON is the default format for REST APIs, GraphQL responses, and modern configuration files.',
          'However, JSON imposes strict syntax rules that are significantly less forgiving than standard JavaScript object literals. A single missing quote or misplaced comma invalidates the entire document, causing `JSON.parse()` method calls to throw fatal runtime exceptions.',
        ],
      },
      {
        heading: 'Top 5 Most Common `JSON.parse` Syntax Crashes and Fixes',
        body: [
          '1. Trailing Commas in Arrays or Objects: Standard JSON forbids commas after the final key-value pair or array element (e.g., `{"name": "Alice",}`). Fix: Delete the trailing comma.',
          '2. Single Quotes Instead of Double Quotes: JavaScript allows single quotes (`\'key\'`), but the JSON specification strictly requires double quotes (`"key"`). Fix: Replace all single quotes with double quotes.',
          '3. Unquoted Object Keys: In JavaScript code, `{key: "value"}` is valid, but JSON demands quoted keys (`{"key": "value"}`). Fix: Enclose all object property keys in double quotes.',
          '4. Unescaped Control Characters and Newlines: Raw line breaks inside string values cause parse errors. Fix: Escape newlines using `\\n` or backslashes.',
          '5. NaN, Infinity, and Undefined Values: JSON does not support `undefined`, `NaN`, or `Infinity`. Fix: Convert `undefined` keys to `null` or remove them before serialization.',
        ],
      },
      {
        heading: 'Pretty-Printing for Debugging vs. Minification for Transport',
        body: [
          'During local development and log inspection, pretty-printing JSON with 2-space or 4-space indentation makes complex nested data structures scan-friendly for software engineers.',
          'Conversely, in production network communications, minification strips out all non-essential whitespace characters and line breaks. Minifying a 500KB JSON payload can reduce payload transfer sizes by 20% to 30%, speeding up API latency.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why does `JSON.parse()` throw an "Unexpected token" error?',
        answer:
          'This error occurs when the parser hits a character that violates JSON grammar. Common cases are a single quote, a missing comma between properties, or HTML returned instead of JSON.',
      },
      {
        question: 'Does formatting JSON alter key-value data contents?',
        answer:
          'No. Prettifying or minifying only adjusts non-semantic whitespace and indentation. All strings, numbers, booleans, and nested object hierarchies remain unchanged.',
      },
      {
        question: 'How do I handle large 50MB JSON files without crashing the browser?',
        answer:
          'Formatting runs on the page thread in the browser. A multi-megabyte file can make the tab pause until parsing finishes. Splitting the file is the practical limit.',
      },
    ],
    sources: [
      {
        label: 'ECMA-404: The JSON Data Interchange Syntax',
        href: 'https://www.ecma-international.org/publications-and-standards/standards/ecma-404/',
      },
    ],
  },

  {
    slug: 'create-marriage-biodata-pdf',
    directUrl: '/how-to/create-marriage-biodata-pdf',
    title: 'Create a marriage biodata PDF',
    description:
      'Lists the usual biodata sections and how the Toolioz form saves locally and downloads an A4 PDF.',
    keywords: [
      'how to create marriage biodata pdf',
      'marriage biodata maker mobile phone',
      'create marriage biodata online free',
      'biodata for marriage with photo guide',
      'marriage profile layout and formatting tips',
      'matrimonial biodata format for boy and girl',
    ],
    updated: 'July 2026',
    updatedIso: '2026-07-25',
    readTime: '8 min read',
    toolLabel: 'Open Biodata Generator',
    toolHref: '/biodata',
    totalTime: 'PT4M',
    steps: [
      {
        name: 'Select Your Preferred Template Style',
        text: 'Open the Toolioz Biodata Generator in your smartphone or desktop browser. Select from premium design presets: Modern Split, Classic Centered, Minimalist, Hindu Traditional, Islamic Elegant, or Sikh Heritage.',
      },
      {
        name: 'Fill In Core Personal & Professional Details',
        text: 'Enter personal information (Full Name, Date of Birth, Height, Complexion), educational qualifications, current job designation, salary details, and office location.',
      },
      {
        name: 'Add Family Background & Optional Horoscope Info',
        text: 'Fill in family background details (Parents’ names, occupations, native place, siblings) and optional astrological details (Rashi, Nakshatra, Gotra, Manglik status).',
      },
      {
        name: 'Upload Photo, Live Preview & Export PDF',
        text: 'Upload a clean portrait photo, review the live A4 preview card to verify alignment and typography margins, and tap "Download PDF" for instant high-res vector output.',
      },
    ],
    sections: [
      {
        heading: 'The 5 Essential Sections Every Marriage Biodata Must Have',
        body: [
          'A matrimonial biodata is a formal introduction document shared between families during marriage discussions. Organizing your details clearly makes a strong first impression:',
          '1. Personal Overview: Full Name, Date & Time of Birth, Height, Religion/Caste, and Current Residential Address.',
          '2. Education & Profession: Highest Degree earned (e.g., B.Tech, MBA, MD), College/University Name, Current Employer, Designation, and City.',
          '3. Family Details: Father’s Name & Profession, Mother’s Name & Profession, Siblings (Married/Unmarried count), and Family Values/Type (Nuclear/Joint).',
          '4. Astrological / Horoscope Details (Optional): Birth Time, Birth Place, Rashi, Nakshatra, Gotra, and Manglik status.',
          '5. Contact Information: Primary Phone Numbers, WhatsApp Contact, Email ID, and Residence Location.',
        ],
      },
      {
        heading: 'Design, Margins, and Typography Etiquette',
        body: [
          'Visual presentation reflects care and attention to detail. Keep font sizes consistent across sections (11pt to 13pt for body text; 16pt to 18pt for section headers).',
          'Maintain generous page padding so content does not look crammed near page borders. Using a dedicated A4 layout ensures your exported PDF prints cleanly on standard printer paper without awkward page overflow cuts.',
        ],
      },
      {
        heading: 'Writing Partner Expectations: Positive & Welcoming Tone',
        body: [
          'When summarizing expectations for a prospective partner, describe shared values, lifestyle preferences, and educational background positively.',
          'Avoid rigid financial or physical demands. Expressing openness and mutual respect sets a warm, inviting tone for prospective families reading your profile.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should I include a photograph on my marriage biodata?',
        answer:
          'A recent, well-lit headshot on a plain background is the usual portrait. A photo is optional.',
      },
      {
        question: 'Can I generate a marriage biodata PDF on mobile without creating an account?',
        answer:
          'Yes. The form, preview, and PDF download do not require an account.',
      },
      {
        question: 'Is my personal information saved on external servers?',
        answer:
          'The form is saved in the browser’s local storage on that device. It is not uploaded, and the PDF is built in the browser.',
      },
    ],
  },

  {
    slug: 'reduce-home-loan-interest',
    directUrl: '/how-to/reduce-home-loan-interest',
    title: 'Reduce home-loan interest with prepayment',
    description:
      'Explains how an extra principal payment cuts later interest and shortens a home-loan term.',
    keywords: [
      'how to reduce home loan interest',
      'home loan prepayment calculator guide',
      'should i prepay home loan early',
      'reduce home loan tenure vs emi',
      'home loan interest savings formula',
      'partial prepayment mortgage strategy',
    ],
    updated: 'July 2026',
    updatedIso: '2026-07-25',
    readTime: '9 min read',
    toolLabel: 'Open Loan Prepayment Calculator',
    toolHref: '/finance/loan-prepayment',
    totalTime: 'PT4M',
    steps: [
      {
        name: 'Inspect Your Loan Amortization Schedule',
        text: 'Review your outstanding principal balance, current floating interest rate, remaining tenure in months, and current EMI amount from your bank statement.',
      },
      {
        name: 'Determine Your Annual Surplus Prepayment Capability',
        text: 'Assess how much extra annual cash flow (e.g., annual work bonuses, tax refunds, or savings surplus) you can dedicate to lump-sum prepayment.',
      },
      {
        name: 'Select Tenure Reduction vs. EMI Reduction Strategy',
        text: 'Input prepayment numbers into the Toolioz Loan Prepayment Calculator. Choose "Tenure Reduction" to maximize net interest compound savings.',
      },
      {
        name: 'Execute Partial Prepayment with Your Lenders',
        text: 'Submit partial prepayment instructions to your mortgage lender or bank, ensuring the payment is credited directly toward reducing outstanding principal.',
      },
    ],
    sections: [
      {
        heading: 'The Mechanics of Amortization: Front-Loaded Interest Burden',
        body: [
          'During the first 5 to 10 years of a 20-year home loan, up to 70% to 80% of your monthly Equated Monthly Installment (EMI) goes toward paying interest charges, while only a small fraction pays down the principal balance.',
          'Making a partial prepayment early in your loan tenure directly reduces the principal balance upon which future interest compound calculations are based, resulting in massive cumulative interest savings.',
        ],
      },
      {
        heading: 'Tenure Reduction vs. EMI Reduction: Which Yields Higher Savings?',
        body: [
          'When you make a partial prepayment, banks offer two choices: keep tenure constant and lower your monthly EMI, or keep monthly EMI constant and shorten your loan tenure.',
          'Choosing Tenure Reduction yields significantly higher interest savings. Keeping your EMI payment constant while principal shrinks accelerates compound interest savings, effectively cutting years off your mortgage.',
        ],
      },
      {
        heading: 'Prepayment Penalties & Tax Deduction Realities',
        body: [
          'The prepayment calculator does not subtract a lender penalty and does not apply Section 24(b). Whether a bank charges a fee is not checked on the page.',
          'The income-tax page and the prepayment page do not share inputs. A split between a loan payment and an investment is not calculated.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does the prepayment calculator choose an early lump sum?',
        answer:
          'No. It adds the same extra amount every month from the first month and keeps the EMI. A later lump sum is not compared.',
      },
      {
        question: 'Does the prepayment calculator report a credit score?',
        answer:
          'No. It reports interest saved and months removed. A credit-score change is not calculated.',
      },
    ],
    sources: [
      {
        label: 'RBI: Directives on Home Loan Floating Rate Prepayment Penalties',
        href: 'https://www.rbi.org.in/commonman/English/Scripts/FAQs.aspx',
      },
    ],
  },
];

export const indexedHowToPosts = howToPosts.filter((post) => !ADSENSE_NOINDEX_HOWTO_SLUGS.has(post.slug));

export function getHowToPost(slug: string) {
  return howToPosts.find((post) => post.slug === slug || post.directUrl === `/${slug}` || post.directUrl === slug);
}
