import type { PublisherArticle } from '@/lib/publisher-articles-finance';

export const publisherArticlesTools: PublisherArticle[] = [
  {
    path: '/devtools/json-formatter',
    title: 'What this JSON formatter does with invalid input',
    lead:
      'The formatter pretty-prints JSON that already parses, and it reports the first syntax error when the text is not JSON. It is not a schema validator and it does not send the document to Toolioz when the page is labelled local processing.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Parse errors you will actually see',
        paragraphs: [
          'JSON requires double-quoted keys, no trailing commas, and no comments. A trailing comma after the last property is valid in JavaScript objects and invalid in JSON. Single quotes around strings fail. `undefined` is not a JSON value. The engine stops at the first violation and shows a position; fix that before looking for a second error.',
          'Huge minified files can freeze a tab because parsing is synchronous on the main thread. Split the file or use a desktop tool if the browser complains. Formatting does not prove the payload matches an API contract — that is JSON Schema, a different page.',
        ],
      },
      {
        heading: 'Privacy note',
        paragraphs: [
          'Tokens, passwords, and PII pasted here stay in the tab only if the page states local processing. The website still loads scripts and analytics. Do not paste production secrets into any website, including this one, if your policy forbids it.',
        ],
      },
    ],
    examples: [
      {
        title: 'Trailing comma',
        body: '{"ok": true,} fails. {"ok": true} parses. Remove the comma after true.',
      },
    ],
    limitations: [
      'Does not repair YAML, TOML, or JavaScript object literals automatically.',
      'Duplicate keys: JSON.parse keeps the last value; that may not be what the API author intended.',
    ],
    sources: [
      { label: 'ECMA-404 JSON Data Interchange Syntax', href: 'https://www.ecma-international.org/publications-and-standards/standards/ecma-404/' },
    ],
  },
  {
    path: '/devtools/jwt-decoder',
    title: 'Decoding a JWT is not verifying it',
    lead:
      'A JSON Web Token is three Base64URL segments: header, payload, signature. This page decodes the first two so you can read claims. It does not check the signature against a secret or JWKS, so a forged token will still “decode.”',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'How to use the output safely',
        paragraphs: [
          'Read `alg`, `iss`, `aud`, `exp`, and `sub` as claims, not as proof. If `alg` is `none`, the token has no signature. If `exp` is in the past, resource servers should reject it. Toolioz does not contact the issuer. Never paste a live access token from a production user into a public blog screenshot.',
          'Verification needs the correct key and algorithm. HS256 needs a shared secret you should not type into a random website. RS256 needs the issuer’s public key. Use your auth library in a trusted environment for that step.',
        ],
      },
    ],
    examples: [
      {
        title: 'Expiry check',
        body: 'An `exp` of 1735689600 is a Unix second timestamp. Convert it on the timestamp tool. If it is in the past, treat the token as expired regardless of a pretty-printed payload.',
      },
    ],
    limitations: [
      'No JWKS fetch, no audience check, no encrypted JWE support as a full decryptor unless the page explicitly says so.',
    ],
    sources: [
      { label: 'RFC 7519 — JSON Web Token', href: 'https://www.rfc-editor.org/rfc/rfc7519' },
    ],
  },
  {
    path: '/devtools/regex-tester',
    title: 'JavaScript regular expressions are not “all regex”',
    lead:
      'This tester runs the pattern in the browser’s JavaScript regular-expression engine. A pattern that works in PCRE, Python, or grep may fail here, and the reverse is also true.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Flags and catastrophic backtracking',
        paragraphs: [
          'Flags such as `i`, `g`, `m`, `s`, and `u` change matching. `g` finds every match; without it you see the first. Nested quantifiers on ambiguous input can lock the tab — that is catastrophic backtracking, not a freeze in Toolioz’s UI layer. Simplify the pattern or test a shorter string.',
          'Anchors `^` and `$` mean start and end of string, or of lines when `m` is set. If a pattern “works on regex101 in PCRE” and fails here, switch regex101’s flavor to ECMAScript before assuming the tester is broken.',
        ],
      },
    ],
    examples: [
      {
        title: 'Email-shaped text',
        body: 'A simple `^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$` rejects spaces. It still accepts many strings that are not deliverable mailboxes. Do not use it as a deliverability check.',
      },
    ],
    limitations: [
      'No lookbehind on engines that lack it; modern Chromium has it, older browsers may not.',
      'Not a full lexer or parser for HTML or nested CSV.',
    ],
    sources: [
      { label: 'ECMA-262 regular expressions', href: 'https://tc39.es/ecma262/' },
    ],
  },
  {
    path: '/devtools/timestamp-converter',
    title: 'Unix time is seconds, unless it is milliseconds',
    lead:
      'Unix time counts seconds since 1970-01-01T00:00:00Z, excluding leap seconds in the POSIX definition. JavaScript `Date.now()` is milliseconds. Mixing them shifts dates by a factor of 1000.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'How to tell which unit you have',
        paragraphs: [
          'A 10-digit integer near 1.7e9 is seconds in the 2020s. A 13-digit integer near 1.7e12 is milliseconds. If a converted date lands in 1970 or 56000 AD, you picked the wrong unit. The tool should expose both; if you pasted a float, check whether the API used seconds with a fractional part.',
          'Local timezone display uses the browser’s zone. Two reviewers in IST and UTC will see different clock times for the same instant. Store UTC in APIs; display local only at the edge.',
        ],
      },
    ],
    examples: [
      {
        title: '1 January 2025 00:00 UTC',
        body: 'Unix seconds 1735689600. Milliseconds 1735689600000. If you feed the seconds value into `new Date(n)` in JavaScript you get a 1970 date because Date expects ms.',
      },
    ],
    limitations: [
      'Leap seconds are not modelled.',
      'Historical timezone rule changes depend on the browser ICU data.',
    ],
    sources: [
      { label: 'IETF — date and time on the internet (RFC 3339)', href: 'https://www.rfc-editor.org/rfc/rfc3339' },
    ],
  },
  {
    path: '/devtools/uuid-generator',
    title: 'UUID versions are not interchangeable',
    lead:
      'This generator creates identifiers in the version the control selects, using the Web Crypto API where required. A UUID is unique with very high probability, not a secret and not a proof of identity.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'v4 versus v7 in practice',
        paragraphs: [
          'Version 4 is random. Version 7 (where offered) is time-ordered random, which can help database index locality. Do not parse a v4 UUID as a timestamp. Do not use UUIDs as API keys: they are guessable in bulk if the generator is weak, and they are logged everywhere.',
          'Collisions for v4 are negligible for normal app volumes. They are not a substitute for a uniqueness constraint in the database.',
        ],
      },
    ],
    examples: [
      {
        title: 'Format',
        body: 'A canonical UUID is 8-4-4-4-12 hex digits. The variant bits live in the first character of the fourth group. If that character is not in the allowed set, the string is not a RFC 4122 UUID.',
      },
    ],
    limitations: [
      'Not a ULID/KSUID converter unless a separate mode exists on the page.',
    ],
    sources: [
      { label: 'RFC 9562 — UUIDs', href: 'https://www.rfc-editor.org/rfc/rfc9562' },
    ],
  },
  {
    path: '/devtools/hash-generator',
    title: 'Hashes identify bytes; they do not encrypt them',
    lead:
      'SHA-256 and similar functions map input bytes to a fixed-size digest. The same input always yields the same digest. You cannot get the input back. That is not encryption, and it is not a password-storage recipe by itself.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Use and misuse',
        paragraphs: [
          'Hash a file to check it survived a download. Hash a string to compare equality without storing the string, understanding that rainbow tables exist for common passwords — use a password hashing scheme (Argon2, bcrypt) for credentials, not raw SHA-256.',
          'HMAC needs a key. If this page only exposes unkeyed hashes, do not treat the output as an HMAC. Encoding (Base64, hex) is not hashing.',
        ],
      },
    ],
    examples: [
      {
        title: 'Empty SHA-256',
        body: 'SHA-256 of an empty input is e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. If the tool shows something else for empty input, the implementation is wrong or it hashed a newline.',
      },
    ],
    limitations: [
      'Not a certificate fingerprint UI for TLS inspection.',
      'MD5/SHA-1 remain available in some tools only for legacy checksums; they are not collision-resistant for security.',
    ],
    sources: [
      { label: 'NIST FIPS 180-4 — Secure Hash Standard', href: 'https://csrc.nist.gov/publications/detail/fips/180/4/final' },
    ],
  },
  {
    path: '/pdftools/merge-pdf',
    title: 'Merging PDFs keeps page streams; it does not restyle them',
    lead:
      'The merge tool concatenates page trees in the order you set. Fonts and images already in each file come along. It does not unlock a password-protected file you cannot open, and it does not flatten signatures into a legal original.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Order, size, and privacy',
        paragraphs: [
          'Drop files in the sequence you want the output to read. A 200-page merge of scanned images will be large; compress afterwards if a portal cap is 2 MB. When the page is labelled local processing, file bytes are not uploaded to Toolioz. Analytics requests for the website still occur.',
          'Form fields and some annotations can behave oddly after merge depending on pdf-lib’s handling. Open the result before you file it. Digital signatures on source files generally become invalid after any rewrite.',
        ],
      },
    ],
    examples: [
      {
        title: 'Job portal pack',
        body: 'Merge resume, ID, and certificates in that order, then compress. If the portal wants one PDF under 2 MB, compression is the second step, not a different merge.',
      },
    ],
    limitations: [
      'Encrypted PDFs need the user password first.',
      'Does not OCR scanned pages.',
    ],
    sources: [
      { label: 'ISO 32000 family — PDF', href: 'https://www.iso.org/standard/63534.html' },
    ],
  },
  {
    path: '/pdftools/split-pdf',
    title: 'Splitting a PDF is a page-range operation',
    lead:
      'Split means extracting a contiguous range or every page into new files. It does not delete metadata from the unused pages unless you use a metadata tool. Source encryption still applies.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Ranges',
        paragraphs: [
          'If you need pages 3–5 of a 40-page bank statement, export that range only. Sharing the full statement when a landlord asked for three pages is a data-minimisation failure, not a PDF feature. Check the output page count before sending.',
        ],
      },
    ],
    examples: [
      {
        title: 'One page per file',
        body: 'Useful for scanning workflows that need image-per-page later. Pair with PDF-to-image if the next system wants PNG/JPEG.',
      },
    ],
    limitations: [
      'Bookmarks may not map cleanly to split files.',
    ],
    sources: [
      { label: 'ISO 32000 family — PDF', href: 'https://www.iso.org/standard/63534.html' },
    ],
  },
  {
    path: '/pdftools/image-to-pdf',
    title: 'Images become PDF pages, not searchable text',
    lead:
      'Each image becomes a page sized to the pixel dimensions and a DPI assumption. There is no OCR on this path unless a separate OCR tool is used first. A photo of a document will look like a photo of a document.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Quality and size',
        paragraphs: [
          'High-resolution phone photos create large PDFs. If a portal cap is 2 MB, resize or compress. Mixed orientations can look messy; rotate in an image editor first if the PDF page is sideways.',
        ],
      },
    ],
    examples: [
      {
        title: 'A4-ish page',
        body: 'A 2480×3508 pixel image is roughly A4 at 300 DPI. Smaller images will look pixelated if the viewer zooms.',
      },
    ],
    limitations: [
      'No automatic deskew or shadow removal.',
    ],
    sources: [
      { label: 'ISO 32000 family — PDF', href: 'https://www.iso.org/standard/63534.html' },
    ],
  },
  {
    path: '/pdftools/pdf-to-image',
    title: 'Rasterising a PDF discards vector sharpness',
    lead:
      'PDF-to-image paints each page to a bitmap at a chosen scale. Text becomes pixels. You cannot select letters in the PNG. Use this for previews, not as an archival format.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'DPI versus file size',
        paragraphs: [
          'Higher scale looks sharper and costs memory. A 40-page statement at 3× scale can exhaust a phone tab. Start at 1× or 2×. Some PDFs use blend modes or fonts that pdf.js renders differently from Adobe Acrobat; check a sample page.',
        ],
      },
    ],
    examples: [
      {
        title: 'Thumbnail sheet',
        body: 'Export page 1 at low scale for a website thumbnail. Keep the original PDF for printing.',
      },
    ],
    limitations: [
      'Optional content groups and some attachments are ignored.',
    ],
    sources: [
      { label: 'pdf.js project (Mozilla)', href: 'https://mozilla.github.io/pdf.js/' },
    ],
  },
  {
    path: '/pdftools/resume-generator',
    title: 'An ATS resume is a parseable layout, not a keyword dump',
    lead:
      'The resume builder writes a single-column, selectable-text PDF. Applicant-tracking systems that extract text from PDFs fare better with that than with text locked inside images. Keyword stuffing still looks like keyword stuffing to a human reviewer.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'What we optimise for',
        paragraphs: [
          'Standard headings, no tables for the main chronology, and real Unicode text. Some ATS products still fail on multi-column designs and icons. This builder stays narrow on purpose. It cannot guarantee a score on a vendor’s “ATS score” widget; those products are not standardised.',
          'Dates, employer names, and measurable outcomes help more than a skills cloud. Keep the file under typical 2 MB portal caps; this generator’s vector text is usually small.',
        ],
      },
    ],
    examples: [
      {
        title: 'Contact line',
        body: 'Put email and phone as text, not as a picture of a QR code only. If the parser misses contact data, the rest of the CV never gets a human.',
      },
    ],
    limitations: [
      'Not a job-board publisher or LinkedIn import.',
      'Does not auto-write achievements.',
    ],
    sources: [
      { label: 'How-to: ATS-oriented resumes on Toolioz', href: '/resume-builder' },
    ],
  },
  {
    path: '/devtools/x-hidden-image',
    title: 'Tap-to-reveal images follow X’s image rules, not a hack',
    lead:
      'This tool composites a cover frame and a hidden frame into a PNG that X (Twitter) can show as a spoiler-style image depending on current client behaviour. Platform rules change. If a post is rejected, the cause is the network’s media policy, not a Toolioz “ban.”',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'What to expect',
        paragraphs: [
          'Keep both layers within the size and aspect ratio the composer shows. Illegal, sexual, or violent content is still against X’s rules whether or not it is “hidden.” Do not use the tool to evade safety filters. Preview on a throwaway draft before a wide post.',
          'Processing is local when labelled. The PNG you download is just a file; we do not post it to X for you.',
        ],
      },
    ],
    examples: [
      {
        title: 'Aspect ratio',
        body: 'A 16:9 pair that is then letterboxed by the composer may look different in the X crop. Match the canvas the UI recommends.',
      },
    ],
    limitations: [
      'Client apps on iOS, Android, and web can render spoilers differently after an X update.',
    ],
    sources: [
      { label: 'X Help Center — media and sensitive content', href: 'https://help.x.com/en/rules-and-policies' },
    ],
  },
  {
    path: '/design/split-image-in-3',
    title: 'Splitting 16:9 into three tiles is a crop, not a new render',
    lead:
      'The tool slices one image into three panels for carousels that expect equal tiles. Pixels outside the crop rectangles are discarded. It does not upscale a small photo into print quality.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Alignment',
        paragraphs: [
          'If a face sits on a cut line, move the source or choose a different crop origin. Export all three files together so social apps do not recompress one tile more than the others. Local processing means the photo is not uploaded to Toolioz when that label is present.',
        ],
      },
    ],
    examples: [
      {
        title: '1080p source',
        body: 'A 1920×1080 image split into three vertical panels yields three 640×1080 images if the split is even and unpadded. Confirm the on-page pixel readout; padding for safe zones can change that.',
      },
    ],
    limitations: [
      'Does not add seams, captions, or platform-safe margins automatically unless shown in the UI.',
    ],
    sources: [
      { label: 'Toolioz design studio', href: '/design' },
    ],
  },
  {
    path: '/biodata/biodata-generator',
    title: 'A marriage biodata PDF is a document you still have to check',
    lead:
      'The generator fills a template from the fields you type and prints an A4 PDF. It does not verify education, income, or family details. False statements in a matrimonial document are your responsibility.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Photos and sensitive data',
        paragraphs: [
          'A photo crop that looks fine on a phone can look harsh in print. Use a modest file size so the PDF emails cleanly. Horoscope fields are optional cultural data, not an astrological computation. When the page is labelled local processing, the PDF is built in the browser. Emailing that PDF to relatives is a separate disclosure you control.',
          'Do not include Aadhaar numbers, full account numbers, or other identifiers that a matrimonial profile does not need. Data minimisation applies even to family introductions.',
        ],
      },
    ],
    examples: [
      {
        title: 'Field completeness',
        body: 'Empty height or education lines look like omissions to a reader. Either fill them or delete the label in a template that allows it — do not leave “Height:” hanging.',
      },
    ],
    limitations: [
      'Not a legal affidavit or a government KYC form.',
      'Template availability varies by community layout; read the preview.',
    ],
    sources: [
      { label: 'How to create a marriage biodata PDF', href: '/how-to/create-marriage-biodata-pdf' },
    ],
  },
];
