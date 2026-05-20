export type DevToolsBlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  updated: string;
  updatedIso: string;
  readTime: string;
  toolLabel: string;
  toolHref: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  sources: Array<{
    label: string;
    href: string;
  }>;
};

export const devtoolsBlogPosts: DevToolsBlogPost[] = [
  {
    slug: 'json-formatter-online-validate-pretty-print-parse-errors',
    title: 'JSON Formatter Online: How to Validate, Pretty-Print, and Fix Parse Errors',
    description:
      'A practical guide to formatting JSON, spotting syntax mistakes, and understanding why JSON.parse fails.',
    keywords: [
      'json formatter online',
      'json validator online',
      'pretty print json',
      'json parse error unexpected token',
      'format json in browser',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-13',
    readTime: '5 min read',
    toolLabel: 'Open JSON Formatter',
    toolHref: '/devtools/json-formatter',
    sections: [
      {
        heading: 'Why formatting JSON is the fastest way to catch a bug',
        body: [
          'JSON is strict by design. A missing comma, a trailing comma, or a single quote where double quotes are expected can stop parsing immediately. Pretty-printing makes those mistakes visible before you spend time debugging the wrong layer.',
          'A formatter also helps when a payload comes from logs, a webhook, or a copied API response. Once the structure is indented, nested objects and arrays are much easier to scan.',
        ],
      },
      {
        heading: 'JSON.parse and JSON.stringify are the two sides of the workflow',
        body: [
          'MDN documents JSON.parse as the method that turns a JSON string into a JavaScript value. JSON.stringify does the reverse by serializing a value back into JSON text. Together they explain most format and validate workflows.',
          'If parsing fails, the problem is usually the source text, not the formatter. That is why a good JSON tool should show the error quickly and keep the output area empty until the input becomes valid again.',
        ],
      },
      {
        heading: 'Pretty-print for debugging, minify for transport',
        body: [
          'Indentation is ideal while you are reading, comparing, or explaining a payload. Minified JSON is better when you are sending data across the wire and want the smallest possible representation.',
          'For API work, it helps to switch between both views. Human-readable formatting improves debugging, while compact JSON is useful when you want to verify the exact string that gets sent in a request body.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why does JSON.parse fail on text that looks valid?',
        answer:
          'JSON has stricter syntax than JavaScript objects. Common failures include trailing commas, single quotes, unquoted keys, and malformed escape sequences.',
      },
      {
        question: 'Should JSON contain comments?',
        answer:
          'Standard JSON does not allow comments. If you need comments, keep them outside the payload or use a format designed for configuration files instead.',
      },
      {
        question: 'What is the difference between JSON and a JavaScript object?',
        answer:
          'A JavaScript object is a runtime value, while JSON is text. JSON is a data interchange format that must follow a fixed syntax before it can be parsed.',
      },
    ],
    sources: [
      {
        label: 'MDN: JSON.parse()',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse',
      },
      {
        label: 'MDN: JSON.stringify()',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify',
      },
      {
        label: 'MDN: JSON',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON',
      },
    ],
  },
  {
    slug: 'curl-to-fetch-converter-browser-api-examples',
    title: 'cURL to Fetch Converter: Turn API Examples into Browser Code',
    description:
      'Use cURL as a source of truth, then translate it into Fetch-ready JavaScript for browser apps and modern tooling.',
    keywords: [
      'curl to fetch converter',
      'convert curl to javascript fetch',
      'curl command to fetch',
      'api request converter',
      'curl to axios',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-13',
    readTime: '6 min read',
    toolLabel: 'Open cURL Converter',
    toolHref: '/devtools/curl-converter',
    sections: [
      {
        heading: 'Why cURL is still the easiest API example to trust',
        body: [
          'cURL examples are common in documentation because they capture the request method, headers, body, and authentication in one compact command. That makes them a useful source when you want to rebuild the request in JavaScript.',
          'The official curl documentation explains the command-line client and its options. Once you understand the request pieces, the translation into Fetch becomes much easier.',
        ],
      },
      {
        heading: 'What usually converts cleanly',
        body: [
          'Method, URL, headers, query parameters, and JSON bodies usually map directly into a Fetch request. Those are the parts most developers care about first when moving from shell examples to browser code.',
          'More advanced flags need extra attention. Multipart uploads, shell escaping, file input, redirects, and auth helpers can all change how the final JavaScript should be written.',
        ],
      },
      {
        heading: 'Fetch is similar, but not identical',
        body: [
          'The Fetch API is promise-based and is designed for browser and modern runtime environments. It does not behave exactly like curl, especially when it comes to error handling and CORS.',
          'A converter is best treated as a strong starting point. After conversion, you should still check headers, credential mode, request body encoding, and whether the target environment is a browser, Node.js, or a serverless runtime.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can every cURL command be converted perfectly?',
        answer:
          'Not perfectly. Simple requests convert well, but multipart uploads, shell quoting, redirects, and tool-specific flags often need manual review.',
      },
      {
        question: 'Why does Fetch code look different from cURL?',
        answer:
          'Fetch is an API, so it uses objects and promises instead of shell syntax. The request is the same idea, but the shape of the code is different.',
      },
      {
        question: 'Is Fetch always the right output for a cURL command?',
        answer:
          'Fetch is a good output for browser code and modern JavaScript runtimes, but some teams may still prefer Axios or another client depending on their stack.',
      },
    ],
    sources: [
      {
        label: 'curl: Command line tool and library',
        href: 'https://curl.se/docs/',
      },
      {
        label: 'curl: man page',
        href: 'https://curl.se/docs/manpage.html',
      },
      {
        label: 'MDN: Fetch API',
        href: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
      },
    ],
  },
  {
    slug: 'jwt-decoder-header-payload-signature-explained',
    title: 'JWT Decoder: Read Header and Payload Without Verifying the Signature',
    description:
      'Learn what a JWT contains, why it is Base64URL-encoded, and when decoding is not the same as verifying.',
    keywords: [
      'jwt decoder',
      'decode jwt token',
      'jwt payload decoder',
      'inspect json web token',
      'base64url jwt',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-13',
    readTime: '5 min read',
    toolLabel: 'Open JWT Decoder',
    toolHref: '/devtools/jwt-decoder',
    sections: [
      {
        heading: 'A JWT has three parts separated by dots',
        body: [
          'A JSON Web Token is usually written as header.payload.signature. The header describes the algorithm, the payload carries claims, and the signature protects the token from tampering.',
          'Because the header and payload are encoded with Base64URL, they can be read after decoding even when the signature cannot be checked locally.',
        ],
      },
      {
        heading: 'Decoding helps with debugging, not with trust',
        body: [
          'JWT decoding is useful when you want to inspect values like iss, aud, exp, sub, or role during development. It can help you understand why an API rejected a request or why a session expired.',
          'What decoding does not do is prove that the token is genuine. You still need signature verification with the correct secret or public key before treating the claims as trusted.',
        ],
      },
      {
        heading: 'Why Base64URL matters',
        body: [
          'JWTs use Base64URL instead of plain Base64 so they can travel safely in URLs and HTTP headers. That format replaces a few characters and removes padding differences that would otherwise create compatibility problems.',
          'A decoder should therefore handle the token structure carefully, extract the three sections, and display the decoded header and payload without pretending that a successful decode means the token is valid.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does decoding a JWT verify the signature?',
        answer:
          'No. Decoding only reveals the header and payload. Verification requires checking the signature against the correct key material.',
      },
      {
        question: 'Can anyone read a JWT?',
        answer:
          'Yes, if the token is accessible. JWT payloads are encoded, not encrypted, so they can be decoded by anyone who has the token string.',
      },
      {
        question: 'Why is my token missing the signature section?',
        answer:
          'Some tokens are unsigned or malformed. A proper JWT usually has three segments, so a missing part is a sign that the string should be investigated.',
      },
    ],
    sources: [
      {
        label: 'RFC 7519: JSON Web Token (JWT)',
        href: 'https://www.rfc-editor.org/rfc/rfc7519',
      },
      {
        label: 'RFC 7515: JSON Web Signature (JWS)',
        href: 'https://www.rfc-editor.org/rfc/rfc7515',
      },
      {
        label: 'MDN: Base64',
        href: 'https://developer.mozilla.org/en-US/docs/Glossary/Base64',
      },
    ],
  },
  {
    slug: 'unix-timestamp-converter-seconds-milliseconds-local-time',
    title: 'Unix Timestamp Converter: Seconds, Milliseconds, and Time Zones',
    description:
      'Convert Unix time to a readable date or turn a date string back into epoch seconds and milliseconds.',
    keywords: [
      'unix timestamp converter',
      'epoch time converter',
      'timestamp to date',
      'convert unix time to local time',
      'timestamp milliseconds to date',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-13',
    readTime: '5 min read',
    toolLabel: 'Open Timestamp Converter',
    toolHref: '/devtools/timestamp-converter',
    sections: [
      {
        heading: 'Seconds and milliseconds are not interchangeable',
        body: [
          'Unix timestamps are often stored in seconds, but JavaScript date APIs typically work in milliseconds. That difference is the most common reason a timestamp looks wildly wrong when it is pasted into a converter.',
          'MDN documents Date.now() as returning the current time in milliseconds since the epoch. If a source system gives you seconds, you usually need to multiply by 1,000 before creating a JavaScript Date.',
        ],
      },
      {
        heading: 'The same instant can display differently in different time zones',
        body: [
          'A timestamp represents a single instant, but the display format depends on locale and time zone. An ISO string in UTC can look different from a local browser rendering even though both refer to the same moment.',
          'That is why a good timestamp tool should show more than one view: UTC, ISO 8601, and the local browser representation. Comparing those outputs makes it much easier to spot time zone mistakes.',
        ],
      },
      {
        heading: 'Watch out for parsing surprises',
        body: [
          'Date.parse and the Date constructor accept many string shapes, but not all date strings are equally safe. ISO 8601 is usually the cleanest format to work with when precision matters.',
          'If a log entry, webhook, or API response is off by a few hours, the issue is often a timezone interpretation problem rather than a bad timestamp value.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How can I tell whether a timestamp is seconds or milliseconds?',
        answer:
          'A quick clue is length. Ten digits usually means seconds, while thirteen digits usually means milliseconds. The safest answer is to check the source system documentation.',
      },
      {
        question: 'Why does the same timestamp look different on different computers?',
        answer:
          "Because the local display uses each computer's time zone and locale settings. The underlying instant is the same, but the visible clock time changes.",
      },
      {
        question: 'Is ISO 8601 a better format than a raw Unix timestamp?',
        answer:
          'ISO 8601 is often easier to read and less ambiguous for humans, while Unix timestamps are compact and convenient for storage, logging, and calculations.',
      },
    ],
    sources: [
      {
        label: 'MDN: Date',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
      },
      {
        label: 'MDN: Date.now()',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now',
      },
      {
        label: 'MDN: Date.parse()',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse',
      },
    ],
  },
  {
    slug: 'regex-tester-greedy-lazy-backtracking',
    title: 'Regex Tester: How to Debug Greedy Matches, Lazy Quantifiers, and Backtracking',
    description:
      'A practical regular-expression guide for building safer patterns and understanding why a match behaves the way it does.',
    keywords: [
      'regex tester online',
      'regular expression tester',
      'greedy vs lazy regex',
      'regex backtracking',
      'javascript regex guide',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-13',
    readTime: '6 min read',
    toolLabel: 'Open RegExp Tester',
    toolHref: '/devtools/regex-tester',
    sections: [
      {
        heading: 'Start with anchors before you chase advanced features',
        body: [
          'Many regex bugs happen because the pattern is too loose. Anchors such as ^ and $ immediately narrow the match range and make it easier to see whether the pattern is behaving as intended.',
          'The MDN regular expressions guide is a good reminder that character classes, groups, and quantifiers all interact. Testing one piece at a time usually produces cleaner patterns than jumping straight to a complex one-liner.',
        ],
      },
      {
        heading: 'Greedy and lazy quantifiers often explain the weird result',
        body: [
          'Greedy quantifiers try to consume as much text as possible, while lazy quantifiers stop earlier. If a match looks too broad, switching between those two modes can instantly reveal why the pattern behaves that way.',
          'When you test against multiple sample strings, you can see where the expression overreaches and where it needs a tighter boundary, a more specific class, or a non-capturing group.',
        ],
      },
      {
        heading: 'Backtracking is a performance issue as much as a correctness issue',
        body: [
          'Nested optional groups and repeated wildcards can trigger heavy backtracking. That is why a regex may look fine on short text and then become slow on a longer input.',
          'A tester is useful because it lets you shorten the feedback loop. You can try the same pattern against a few realistic examples, simplify the capture structure, and confirm whether the change makes the match safer.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between greedy and lazy regex matches?',
        answer:
          'Greedy matches consume as much text as possible, while lazy matches consume as little as needed to satisfy the pattern.',
      },
      {
        question: 'Why does my regex match too much text?',
        answer:
          'The pattern may be too broad, missing anchors, or using a greedy quantifier where a narrower expression would be safer.',
      },
      {
        question: 'Can a regex slow down a page?',
        answer:
          'Yes. A poorly structured expression can cause heavy backtracking, especially when applied to long inputs or untrusted text.',
      },
    ],
    sources: [
      {
        label: 'MDN: Regular expressions',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
      },
      {
        label: 'MDN: RegExp',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp',
      },
    ],
  },
  {
    slug: 'base64-encode-decode-online-guide',
    title: 'Base64 Encode and Decode Online: When Developers Need It',
    description:
      'Learn what Base64 is, how to encode and decode strings safely in the browser, and common mistakes with UTF-8 and file uploads.',
    keywords: [
      'base64 encode online',
      'base64 decode online',
      'base64 converter',
      'encode string to base64',
      'decode base64 to text',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-20',
    readTime: '5 min read',
    toolLabel: 'Open Base64 Converter',
    toolHref: '/devtools/base64-converter',
    sections: [
      {
        heading: 'Base64 is encoding, not encryption',
        body: [
          'Base64 turns binary data into ASCII-safe text. Anyone can decode it, so never treat Base64 as security—use it for transport and embedding only.',
          'APIs often return Base64 for small images, certificates, or tokens in JSON payloads.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why does UTF-8 text break after decode?',
        answer:
          'Ensure the encoder and decoder use the same character set. Our tool handles UTF-8 text explicitly.',
      },
    ],
    sources: [
      {
        label: 'MDN: btoa and atob',
        href: 'https://developer.mozilla.org/en-US/docs/Web/API/btoa',
      },
    ],
  },
  {
    slug: 'sha256-hash-generator-online-guide',
    title: 'SHA-256 Hash Generator Online: Verify Files and Passwords',
    description:
      'Generate SHA-256 hashes in the browser to compare file integrity, cache keys, or API signatures without sending data to a server.',
    keywords: [
      'sha256 hash generator online',
      'sha256 calculator',
      'hash text online',
      'file hash checker',
      'sha256 vs md5',
    ],
    updated: 'May 2026',
    updatedIso: '2026-05-20',
    readTime: '5 min read',
    toolLabel: 'Open Hash Generator',
    toolHref: '/devtools/hash-generator',
    sections: [
      {
        heading: 'Hashes detect changes',
        body: [
          'A hash function maps input to a fixed-length fingerprint. Even a one-character change produces a completely different SHA-256 output.',
          'Developers use hashes for cache busting, checksums, and comparing downloads to published values.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is SHA-256 still secure?',
        answer:
          'SHA-256 remains widely used for integrity checks. For password storage, use dedicated password hashes like bcrypt instead.',
      },
    ],
    sources: [
      {
        label: 'NIST: Secure Hash Standard',
        href: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
      },
    ],
  },
];

export const devtoolsBlogKeywords = Array.from(
  new Set(devtoolsBlogPosts.flatMap((post) => post.keywords)),
);

export function getDevtoolsBlogPost(slug: string) {
  return devtoolsBlogPosts.find((post) => post.slug === slug);
}
