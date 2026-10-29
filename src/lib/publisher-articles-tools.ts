import type { PublisherArticle } from '@/lib/publisher-articles-finance';

export const publisherArticlesTools: PublisherArticle[] = [
  {
    path: '/design/background-remover',
    title: 'How to get a useful cutout without uploading your image',
    lead: 'Toolioz’s background remover is an independently written, classical image-processing engine. It separates simple backgrounds using border colors and connected paths, then lets you erase or restore pixels yourself. It is not a trained portrait model and does not promise automatic hair extraction from arbitrary scenes.',
    reviewed: '1 October 2026',
    sections: [
      {
        heading: 'Start with the right image',
        paragraphs: [
          'Choose a JPEG, PNG, or WebP with a clearly contrasting subject and a background visible along the outer image edges. Leave some space around the subject. A plant against a plain wall or a dark bottle on a pale tabletop is easier than a person in a crowded room. The limit is 25 MB and 16 million pixels, with no side over 8192 pixels.',
          'Upload or drop the image into the preview. The initial pass runs automatically. Increase Background separation if too much backdrop remains; lower it if the subject begins disappearing, then press Recalculate. Brush edits survive recalculation. Clear edits if you want to judge a fresh automatic result.',
        ],
      },
      {
        heading: 'What the engine actually computes',
        paragraphs: [
          'The analysis image is reduced to at most 720 pixels on its longest side. Up to eight representative colors are fitted to opaque boundary samples. Each pixel receives a weighted RGB distance to that palette. A minimum-bottleneck search finds the path from the boundary whose largest color difference is smallest. Pixels reachable without crossing a high-contrast barrier are background candidates. Unlike replacing every pale pixel, this can preserve pale details enclosed inside a dark subject.',
          'Separation controls the threshold applied to those path costs. A smooth transition produces the initial alpha mask. For export, nearby analysis pixels are weighted by both their spatial distance and similarity to the source color. This reconstructs the mask at the original dimensions; it cannot recreate tiny features lost during analysis. Keep and Remove strokes act directly on the alpha mask, with joined circular brush segments. Original RGB values remain unchanged, and the new mask multiplies existing transparency rather than making transparent pixels opaque.',
        ],
      },
      {
        heading: 'Clean up, inspect, and export',
        paragraphs: [
          'Paint with Remove to clear missed background, including holes inside the subject. Paint with Keep to restore accidentally removed areas. Switch to Original if you cannot locate a missing feature, use preview zoom for closer inspection, and Undo to remove the most recent stroke. A stroke applies when you release the pointer. There is a 100-stroke limit; choose a larger brush for broad areas. Keep cannot restore transparency that was already absent in the source file.',
          'Check edges on white and dark preview backdrops. Edge softness adjusts reconstruction, not semantic recognition or blur of the source photo. The backdrop colors are inspection aids only. Download PNG always exports a transparent image at the original pixel dimensions, without a watermark. Pixels stay in this browser tab; the site still loads ordinary assets and analytics. Closing or reloading the page discards the working image and edits.',
        ],
      },
    ],
    examples: [
      { title: 'Dark bottle with a pale label on a pale background', body: 'The border palette describes the backdrop. The bottle outline blocks low-cost paths into the label, so the label can remain opaque even though its color resembles the background. A background gap inside a handle may stay opaque and should be painted with Remove.' },
      { title: 'Subject cropped against the edge', body: 'The engine assumes the boundary describes background. A sleeve or leaf that touches that boundary can be removed or influence the palette. Use Keep on the missing area, or start from a photo with more surrounding space. Do not expect the separation slider to solve a wrong boundary assumption.' },
      { title: 'Image with an already transparent border', body: 'If there are no opaque boundary samples, the engine preserves the existing alpha instead of inventing a background palette. Use Remove for residual backdrop and Keep for mistakenly removed pixels that still exist in the source.' },
    ],
    limitations: [
      'Cluttered backgrounds, foreground/background color overlap, fine hair, glass, smoke, and shadows are not reliably solved automatically. This tool is not quality-equivalent to a learned segmentation service.',
      'The border assumption can fail for full-frame portraits or edge-touching subjects. Small features can disappear in reduced-resolution analysis. Manual cleanup is a core part of the workflow.',
      'Edge color contamination is not decontaminated: RGB is preserved, so a fringe from the original backdrop can remain. High-resolution work requires browser memory and may be slow on phones.',
      'Original-size PNG refers to pixel dimensions, not preservation of EXIF, ICC profiles, camera metadata, or the original compressed file. Animated images and SVG are not supported.',
    ],
    sources: [
      { label: 'Bai and Sapiro: A Geodesic Framework for Fast Interactive Image and Video Segmentation and Matting (research)', href: 'https://conservancy.umn.edu/bitstreams/25484eba-06c3-471d-ac9f-b6a3d3c0d2dd/download' },
      { label: 'He, Sun, and Tang: Guided Image Filtering — edge-aware refinement research', href: 'https://people.csail.mit.edu/kaiming/eccv10/index.html' },
    ],
  },
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
          'Huge minified files can freeze a tab because parsing is synchronous on the main thread. Split the file or use a desktop tool if the browser complains. Formatting does not prove the payload matches an API contract. That check is JSON Schema, on a different page.',
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
      'A JSON Web Token is three Base64URL parts. This page decodes the header and payload with atob. crypto.subtle.verify checks an HS256 signature only when a secret is typed and alg is HS256. (Not expired) means exp is not earlier than now. nbf is shown in local time and is not compared. There is no JWKS fetch and no RS256 check.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'How to use the output safely',
        paragraphs: [
          'Read `alg`, `iss`, `aud`, `exp`, and `sub` as claims, not as proof, unless an HS256 check with the correct secret succeeds. If `alg` is `none`, the token has no signature. If `exp` is in the past, resource servers should reject it. Toolioz does not contact the issuer. Never paste a live access token from a production user into a public blog screenshot.',
          'HS256 needs a shared secret you should not type into a random website if your policy forbids it. RS256 needs the issuer public key; this page does not fetch JWKS. Use your auth library in a trusted environment for production verification.',
        ],
      },
    ],
    examples: [
      {
        title: 'Expiry check',
        body: 'An `exp` of 1735689600 is a Unix second timestamp. Convert it with any Unix-time converter. If it is in the past, treat the token as expired regardless of a pretty-printed payload.',
      },
    ],
    limitations: [
      'No JWKS fetch, no audience check, no encrypted JWE support as a full decryptor unless the page explicitly says so.',
    ],
    sources: [
      { label: 'RFC 7519, JSON Web Token', href: 'https://www.rfc-editor.org/rfc/rfc7519' },
    ],
  },
  {
    path: '/devtools/regex-tester',
    title: 'JavaScript regular expressions are not "all regex"',
    lead:
      'This tester runs the pattern in the browser JavaScript regular-expression engine. A pattern that works in PCRE, Python, or grep may fail here, and the reverse is also true.',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'Flags and catastrophic backtracking',
        paragraphs: [
          'Flags such as `i`, `g`, `m`, `s`, and `u` change matching. `g` finds every match. Without it you see the first. Nested quantifiers on ambiguous input can lock the tab. That is catastrophic backtracking, not a freeze in Toolioz UI. Simplify the pattern or test a shorter string.',
          'Anchors `^` and `$` mean start and end of string, or of lines when `m` is set. If a pattern "works on regex101 in PCRE" and fails here, switch regex101 flavor to ECMAScript before assuming the tester is broken.',
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
          'Local timezone display uses the browser zone. Two reviewers in IST and UTC will see different clock times for the same instant. Store UTC in APIs; display local only at the edge.',
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
      { label: 'IETF, date and time on the internet (RFC 3339)', href: 'https://www.rfc-editor.org/rfc/rfc3339' },
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
      { label: 'RFC 9562, UUIDs', href: 'https://www.rfc-editor.org/rfc/rfc9562' },
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
          'Hash a file to check it survived a download. Hash a string to compare equality without storing the string. Rainbow tables exist for common passwords, so use Argon2 or bcrypt for credentials, not raw SHA-256.',
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
      { label: 'NIST FIPS 180-4, Secure Hash Standard', href: 'https://csrc.nist.gov/publications/detail/fips/180/4/final' },
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
          'Drop files in the sequence you want the output to read. A 200-page merge of scanned images will be large. If a portal cap is 2 MB, compress the result in a dedicated PDF compressor. Toolioz does not publish one. When the page is labelled local processing, file bytes are not uploaded to Toolioz. Analytics requests for the website still occur.',
          'Need only some pages of a statement? Merge is the wrong job; extract a range in a desktop reader first. Form fields and some annotations can behave oddly after merge. Digital signatures on source files generally become invalid after any rewrite.',
        ],
      },
    ],
    examples: [
      {
        title: 'Job portal pack',
        body: 'Merge resume, ID, and certificates in that order. If the portal wants one PDF under 2 MB, compression is a second step in another program, not a different merge.',
      },
    ],
    limitations: [
      'Encrypted PDFs need the user password first.',
      'Does not OCR scanned pages.',
    ],
    sources: [
      { label: 'ISO 32000 PDF specification', href: 'https://www.iso.org/standard/63534.html' },
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
          'If you need pages 3 to 5 of a 40-page bank statement, export that range only. Sharing the full statement when a landlord asked for three pages is a data-minimisation failure, not a PDF feature. Check the output page count before sending.',
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
      { label: 'ISO 32000 PDF specification', href: 'https://www.iso.org/standard/63534.html' },
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
      { label: 'ISO 32000 PDF specification', href: 'https://www.iso.org/standard/63534.html' },
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
        heading: 'What this builder does',
        paragraphs: [
          'Standard headings, no tables for the main chronology, and real Unicode text. Some ATS products still fail on multi-column designs and icons. This builder stays narrow on purpose. It cannot guarantee a score on a vendor ATS score widget. Those products are not standardised.',
          'Dates, employer names, and measurable outcomes help more than a skills cloud. Keep the file under typical 2 MB portal caps; vector text from this generator is usually small.',
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
    title: 'Tap-to-reveal images follow X image rules, not a hack',
    lead:
      'This tool composites a cover frame and a hidden frame into a PNG that X (Twitter) can show as a spoiler-style image depending on current client behaviour. Platform rules change. If a post is rejected, the cause is the network media policy, not a Toolioz "ban."',
    reviewed: '10 September 2026',
    sections: [
      {
        heading: 'What to expect',
        paragraphs: [
          'Keep both layers within the size and aspect ratio the composer shows. Illegal, sexual, or violent content is still against X rules whether or not it is "hidden." Do not use the tool to evade safety filters. Preview on a throwaway draft before a wide post.',
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
      { label: 'X Help Center, media and sensitive content', href: 'https://help.x.com/en/rules-and-policies' },
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
    path: '/biodata',
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
        body: 'Empty height or education lines look like omissions to a reader. Fill them, or delete the label in a template that allows it. Do not leave a bare Height field.',
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
  {
    path: '/minecraft/circle-generator',
    title: 'How this Minecraft circle generator decides which blocks to place',
    lead:
      'The map is a pixel disk on a block grid. A block is included when the distance from the circle origin to that block’s center is at most half the entered diameter. Hollow rings subtract an inner disk of radius diameter/2 minus thickness. The same test in three axes builds a sphere. Nothing here reads Minecraft version data.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'Diameter, not radius',
        paragraphs: [
          'Builders usually talk in width. Diameter 16 is a 16-block-wide ring. WorldEdit //sphere and //hsphere take a radius, which is half that diameter. An odd diameter sits on one center block, drawn gold. An even diameter sits between four blocks, which is why some circles look slightly flattened on one axis at small sizes.',
          'Filled mode keeps every block whose center is inside the radius. Thickness is ignored then. A thickness of 1 on a hollow circle is the usual wall. Thickness 2 is a walkable ring for a pixel-art track.',
        ],
      },
      {
        heading: 'Spheres as stacked circles',
        paragraphs: [
          'Each Y layer of a sphere is itself a circle whose radius shrinks toward the poles. The layer control shows that slice so a dome can be built floor by floor in survival. Block count is the full 3D set, not the visible layer. Java and Bedrock share the same integer block grid, so the map matches both editions.',
        ],
      },
    ],
    examples: [
      {
        title: 'Diameter 1 and 3',
        body: 'Diameter 1 is a single block. Diameter 3 filled is a 3×3 square because every block center is within 1.5 of the origin. Hollow thickness 1 at diameter 3 is the eight-block ring around the center.',
      },
      {
        title: 'WorldEdit radius',
        body: 'A diameter-20 sphere on this page corresponds to //sphere <block> 10 at the same center. The generator does not run WorldEdit; it only prints the matching radius.',
      },
    ],
    limitations: [
      'Ellipses, ovals, and rotated circles are not generated.',
      'Sphere diameter is capped at 64 blocks so the layer map stays usable in the browser.',
      'Setblock command dumps are not emitted; copy coordinates or ASCII instead.',
    ],
    sources: [
      { label: 'WorldEdit generation commands', href: 'https://worldedit.enginehub.org/en/latest/usage/generation/' },
      { label: 'Minecraft Wiki, coordinates', href: 'https://minecraft.wiki/w/Coordinates' },
    ],
  },
  {
    path: '/minecraft/nether-portal-calculator',
    title: 'Nether portal linking is an 8:1 scale plus a search radius',
    lead:
      'Java Edition divides Overworld X and Z by eight, or multiplies Nether X and Z by eight, and copies Y. Integer division truncates toward zero, including for negative coordinates. After the conversion, the game reuses a portal if one already sits inside 16 blocks in the Nether or 128 blocks in the Overworld.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'Why a nearby extra portal steals the link',
        paragraphs: [
          'The converted point is a search center, not a unique address. If another portal is already inside the destination radius, that portal is used. Fast-travel highways fail when a second base portal sits too close in the Nether. Delete or move the extra frame, or place the intended pair at the exact converted coordinates and light the destination first.',
          'Y is not scaled. A portal at Overworld Y 80 still prefers Nether Y 80, which is often solid netherrack. Carve a room at that Y or accept that the game may create the return portal at a nearby air pocket and then fail to line up on the way back.',
        ],
      },
    ],
    examples: [
      {
        title: 'Overworld 800, 64, −1200',
        body: 'trunc(800/8) = 100 and trunc(−1200/8) = −150. The matching Nether point is 100, 64, −150. Flooring −150.0 is the same here; the difference appears on coordinates that do not divide evenly, such as −17 → −2, not −3.',
      },
    ],
    limitations: [
      'Bedrock search and portal-spawn rules differ slightly; radii listed are Java Edition.',
      'Chunk loading, portal cooldown, and entity width are not modeled.',
    ],
    sources: [
      { label: 'Minecraft Wiki, Nether portal', href: 'https://minecraft.wiki/w/Nether_portal' },
    ],
  },
  {
    path: '/minecraft/shulker-box-calculator',
    title: 'Shulker box capacity is 27 slots times stack size',
    lead:
      'A shulker box is a 27-slot chest that keeps its contents when broken. Vanilla Minecraft does not allow a shulker box inside another shulker box. Storage planning is slots × stack size × number of boxes. Stack 64, 16, and 1 cover almost every survival item.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'Chests of boxes',
        paragraphs: [
          'A double chest holds 54 shulker boxes. At 64-stack items that is 93,312 items. An ender chest holds 27 boxes (46,656 items). A player inventory of 36 slots plus an offhand box is 63,936 items at stack 64. Bundles and datapack stack components can differ and are not counted here.',
        ],
      },
    ],
    examples: [
      {
        title: '1,000 ender pearls',
        body: 'Pearls stack to 16, so one box holds 432. 1,000 pearls need three boxes (1,296 capacity) with 296 empty pearl slots left over.',
      },
    ],
    limitations: [
      'Shulker nesting is not vanilla and is not modeled.',
      'Bundle occupancy and component-modified stacks are omitted.',
    ],
    sources: [
      { label: 'Minecraft Wiki, Shulker Box', href: 'https://minecraft.wiki/w/Shulker_Box' },
    ],
  },
  {
    path: '/gaming/mouse-sensitivity-converter',
    title: 'Hipfire conversion is a yaw ratio, not a copied sensitivity number',
    lead:
      'Each FPS stores a yaw constant: degrees turned per mouse count at sensitivity 1. Matching turn speed is source sensitivity × (source yaw / destination yaw) × (source DPI / destination DPI). eDPI is sensitivity × DPI and is only comparable inside one yaw. cm/360 is the figure that should match across games.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'Why CS2 to Valorant sens is about 0.314',
        paragraphs: [
          'CS2 and CS:GO use Source m_yaw 0.022. Valorant uses 0.07. 0.022 / 0.07 ≈ 0.314286. CS2 1.5 at 800 DPI is Valorant 0.47143 at 800 DPI, eDPI 1,200, about 34.6 cm per 360°. Pair pages lock one ratio so a search such as CS2 to Valorant sens lands on a worked example instead of a generic two-dropdown tool.',
          'Apex hipfire uses the same 0.022 yaw as CS2, so Apex 1.0 matches CS2 1.0. Apex ADS optics are extra sliders. Overwatch 2 and modern Call of Duty hipfire use 0.0066. Fortnite uses 0.005555…. Rainbow Six Siege uses 0.00572958. Those constants are engine yaw, not a patch note.',
        ],
      },
    ],
    examples: [
      {
        title: 'Same cm/360, different numbers',
        body: 'Valorant 0.5 at 800 DPI is CS2 1.59091 at 800 DPI. Both are about 32.7 cm/360. The larger CS2 number is the smaller yaw, not a faster swipe.',
      },
    ],
    limitations: [
      'ADS, zoom, relative aim, and scoped ratios are not converted.',
      'FOV and aspect-ratio differences can still make two matched cm/360 settings feel slightly unlike.',
    ],
    sources: [
      { label: 'Valve Developer Community, CS:GO cvars (m_yaw)', href: 'https://developer.valvesoftware.com/wiki/List_of_CS:GO_Cvars' },
    ],
  },
  {
    path: '/pokemon/type-weakness-calculator',
    title: 'Dual-type weakness multiplies two independent type matchups',
    lead:
      'Each attacking type is looked up against both defending types on the Generation 6 chart, then multiplied. 2 × 2 is a 4× weakness. 2 × ½ cancels to 1×. A 0 on either type is an immunity. Fairy was added in X and Y in 2013. The 18×18 attacking matrix has been stable since then.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'What this page does not apply',
        paragraphs: [
          'Abilities such as Levitate, Flash Fire, or Thick Fat change a matchup after the type chart. Terastallization replaces the defensive typing for a turn. Those effects are not multiplied in. The tool answers “what does the type chart say about this pairing,” which is the usual weakness-search intent, and still prints the full Pokemon type chart for chart queries.',
        ],
      },
    ],
    examples: [
      {
        title: 'Fire / Flying',
        body: 'Rock is 2× versus Fire and 2× versus Flying, so Rock is 4×. Electric is 2× versus Flying and 1× versus Fire, so Electric is 2×. Ground is 0 versus Flying, so Ground is immune even though it is 2× versus Fire.',
      },
    ],
    limitations: [
      'Abilities, items, weather, and Terastallization are omitted.',
      'Inverse battles and type-changing moves are omitted.',
    ],
    sources: [
      { label: 'Bulbapedia, Type', href: 'https://bulbapedia.bulbagarden.net/wiki/Type' },
    ],
  },
  {
    path: '/dnd/dice-roller',
    title: '5e dice notation is keep, drop, and a modifier after the faces',
    lead:
      '1d20+5 rolls one twenty-sided die and adds five. Advantage is 2d20kh1. Disadvantage is 2d20kl1. Ability scores are 4d6kh3. Faces are drawn with crypto.getRandomValues. The grammar does not depend on a monster-manual revision.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'Encounter XP is a different page',
        paragraphs: [
          'Difficulty budgets live on the 5e encounter calculator and use the 2014 Dungeon Master’s Guide table. Mixing XP into a dice roller would hide both jobs. Roll damage and checks here; rate the fight there.',
        ],
      },
    ],
    examples: [
      {
        title: 'Fireball 8d6+0',
        body: 'Eight six-sided dice, no keep suffix, no modifier. The total is the sum of all eight faces. A save for half is a later division the roller does not apply.',
      },
    ],
    limitations: [
      'Rerolls such as Great Weapon Fighting are not a keep suffix; roll and replace manually.',
      'Exploding dice and FATE dice are not parsed.',
    ],
    sources: [
      { label: 'D&D Beyond, rolling a d20', href: 'https://www.dndbeyond.com/sources/dnd/basic-rules-2014/the-game' },
    ],
  },
  {
    path: '/dnd/5e-encounter-calculator',
    title: '2014 encounter ratings compare adjusted XP with a party budget',
    lead:
      'Each character level has Easy, Medium, Hard, and Deadly XP in the 2014 Dungeon Master’s Guide. Monster XP is summed from challenge rating, then multiplied by a count factor. A party of one or two steps that factor up; six or more steps it down. Award raw XP, not adjusted XP, after the fight.',
    reviewed: '29 October 2026',
    sections: [
      {
        heading: 'Why 2014, not 2024',
        paragraphs: [
          'The 2024 rules use a different encounter-building method. This page keeps the 2014 table because those numbers are frozen and still match most published 5e adventures. Mixing both methods on one form would make the band unreadable. Enter challenge rating and count; named stat blocks are unnecessary.',
        ],
      },
    ],
    examples: [
      {
        title: 'Four 5th-level characters versus two CR 2 and one CR 5',
        body: 'Party Deadly budget is 4 × 1,100 = 4,400. Raw XP is 2 × 450 + 1,800 = 2,700. Three monsters use ×2, so adjusted XP is 5,400, which is beyond the Deadly line for that table.',
      },
    ],
    limitations: [
      'Terrain, legendary actions, and action economy beyond the count multiplier are not scored.',
      'The 2024 encounter method is not implemented.',
    ],
    sources: [
      { label: 'D&D Beyond, Systems Reference Document', href: 'https://www.dndbeyond.com/resources/1781-systems-reference-document-srd' },
    ],
  },
];
