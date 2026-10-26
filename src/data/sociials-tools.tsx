import {
    Calculator, Image as ImageIcon, FileText, Settings2, Hash, ArrowRightLeft,
    Search, QrCode, Watch, AlignLeft, Palette, Cat, TrendingUp, DollarSign, Activity, Music,
    Calendar, Globe, Percent, FileCode, Link, ScanBarcode, IndianRupee, LucideIcon,
    Clock, Square, Smile, Table, GitCompare, Youtube, Instagram, Share2, Shield, Scissors
} from "lucide-react";

export interface Tool {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    category: string;
    popular?: boolean;
}

export const TOOLS: Tool[] = [
    // Social
    {
        title: "Tweet Generator",
        description: "Create realistic fake tweet screenshots.",
        href: "/tools/tweet-generator",
        icon: Share2,
        category: "Social",
        popular: true
    },
    {
        title: "Instagram Bio Generator",
        description: "Creates styled text for an Instagram bio.",
        href: "/tools/instagram-bio-generator",
        icon: Instagram,
        category: "Social",
        popular: true
    },
    {
        title: "Split Image in 3",
        description: "Crop a 16:9 photo into 3 equal parts for X and Instagram.",
        href: "/design/split-image-in-3",
        icon: Scissors,
        category: "Social",
        popular: true
    },

    // Finance
    {
        title: "SIP Calculator",
        description: "Compounds a monthly amount. ₹5,000 for 10 years at 12% finishes near ₹11.6 lakh.",
        href: "/tools/sip-calculator",
        icon: TrendingUp,
        category: "Finance",
        popular: true
    },
    {
        title: "EMI Calculator",
        description: "Monthly principal-and-interest payment. Tax and insurance are not included.",
        href: "/tools/emi-calculator",
        icon: DollarSign,
        category: "Finance"
    },
    {
        title: "GST Calculator",
        description: "Exclusive and inclusive GST. ₹1,000 at 18% exclusive is ₹1,180.",
        href: "/tools/gst-calculator",
        icon: DollarSign,
        category: "Finance",
        popular: true
    },
    {
        title: "Income Tax Calculator",
        description: "Compares Indian old and new regimes. The 2026 new-regime rebate is ₹12,00,000.",
        href: "/tools/income-tax-calculator",
        icon: IndianRupee,
        category: "Finance"
    },
    {
        title: "Salary Breakup",
        description: "Visualize in-hand salary vs deductions.",
        href: "/tools/salary-breakup-calculator",
        icon: IndianRupee,
        category: "Finance"
    },
    {
        title: "Loan Eligibility",
        description: "Check maximum loan capacity.",
        href: "/tools/loan-eligibility-calculator",
        icon: IndianRupee,
        category: "Finance"
    },
    {
        title: "Compound Interest",
        description: "Compounds one principal daily, monthly, quarterly, or yearly. No recurring deposits.",
        href: "/tools/compound-interest-calculator",
        icon: TrendingUp,
        category: "Finance"
    },

    // Health
    {
        title: "BMI Calculator",
        description: "Track body mass index and health metrics.",
        href: "/tools/bmi-calculator",
        icon: Activity,
        category: "Health",
        popular: true
    },

    // Media
    {
        title: "Image Compressor",
        description: "Reads a JPEG, PNG, or WebP and saves a JPEG.",
        href: "/tools/image-compressor",
        icon: ImageIcon,
        category: "Media",
        popular: true
    },
    {
        title: "Audio Converter",
        description: "Loads FFmpeg from unpkg, then converts the selected audio format in the page. The file is not uploaded.",
        href: "/tools/audio-converter",
        icon: Music,
        category: "Media"
    },
    {
        title: "Image Converter",
        description: "Draws an image on a canvas and saves PNG, JPEG, or WebP. The file is not uploaded.",
        href: "/tools/image-converter",
        icon: ImageIcon,
        category: "Media"
    },
    {
        title: "Image Resizer",
        description: "Resize images to specific dimensions.",
        href: "/tools/image-resizer",
        icon: ImageIcon,
        category: "Media",
        popular: true
    },

    // PDF
    {
        title: "Image to PDF",
        description: "Places images into a PDF with pdf-lib in the browser.",
        href: "/tools/image-to-pdf",
        icon: FileText,
        category: "PDF",
        popular: true
    },
    {
        title: "PDF Merger",
        description: "Combines PDFs with pdf-lib in the browser.",
        href: "/tools/pdf-merger",
        icon: FileText,
        category: "PDF"
    },
    {
        title: "PDF Splitter",
        description: "Copies selected PDF pages with pdf-lib in the browser.",
        href: "/tools/pdf-splitter",
        icon: FileText,
        category: "PDF"
    },
    {
        title: "PDF to Image",
        description: "Renders up to 30 PDF pages as PNG or JPEG.",
        href: "/tools/pdf-to-image",
        icon: ImageIcon,
        category: "PDF"
    },

    // Math & Essentials
    {
        title: "Scientific Calculator",
        description: "Standard and scientific math operations.",
        href: "/tools/calculator",
        icon: Calculator,
        category: "Math"
    },
    {
        title: "Percentage Calculator",
        description: "Finds P% of a number, or what percent one number is of another.",
        href: "/tools/percentage-calculator",
        icon: Percent,
        category: "Math"
    },
    {
        title: "Age Calculator",
        description: "Age in years, months, and days from a date of birth and today's local date.",
        href: "/tools/age-calculator",
        icon: Calendar,
        category: "Utility",
        popular: true
    },
    {
        title: "Stopwatch & Timer",
        description: "Precision chronograph with laps.",
        href: "/tools/stopwatch",
        icon: Watch,
        category: "Time"
    },
    {
        title: "Time Zone Converter",
        description: "Convert dates across time zones.",
        href: "/tools/time-zone-converter",
        icon: Globe,
        category: "Utility"
    },
    {
        title: "Unit Converter",
        description: "Converts length, mass, temperature, or data within one category.",
        href: "/tools/unit-converter",
        icon: ArrowRightLeft,
        category: "Utility",
        popular: true
    },
    {
        title: "QR Code Generator",
        description: "Create customizable QR codes.",
        href: "/tools/qr-generator",
        icon: QrCode,
        category: "Utility",
        popular: true
    },

    // Developer
    {
        title: "JSON Formatter",
        description: "Pretty-prints JSON with 2 or 4 spaces, minifies it, and can emit YAML or TypeScript.",
        href: "/tools/json-formatter",
        icon: FileText,
        category: "Developer",
        popular: true
    },
    {
        title: "UUID Generator",
        description: "Creates version 4 UUIDs with crypto.randomUUID.",
        href: "/tools/uuid-generator",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "Base64 Converter",
        description: "Encodes and decodes Base64. It is not encryption.",
        href: "/tools/base64-converter",
        icon: ArrowRightLeft,
        category: "Developer"
    },
    {
        title: "URL Encoder",
        description: "Encodes and decodes with encodeURIComponent.",
        href: "/tools/url-converter",
        icon: Link,
        category: "Developer"
    },
    {
        title: "Snowflake Parser",
        description: "Shifts a Discord snowflake 22 bits and adds the 2015 Discord epoch. The id is not sent to Discord.",
        href: "/tools/snowflakes",
        icon: Cat,
        category: "Developer"
    },
    {
        title: "CSS Minifier",
        description: "Compress CSS to reduce file size.",
        href: "/tools/css-minifier",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "JS Minifier",
        description: "Minify and clean JavaScript code.",
        href: "/tools/js-minifier",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "HTML Minifier",
        description: "Optimize HTML structure.",
        href: "/tools/html-minifier",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "Regex Tester",
        description: "Tests a JavaScript regular expression and lists matches.",
        href: "/tools/regex-tester",
        icon: Search,
        category: "Developer"
    },
    {
        title: "Barcode Generator",
        description: "Create custom barcodes (EAN, UPC, etc).",
        href: "/tools/barcode-generator",
        icon: ScanBarcode,
        category: "Developer"
    },
    {
        title: "SQL Query Generator",
        description: "Visually build SQL queries.",
        href: "/tools/sql-query-generator",
        icon: Table, // Using Table icon for SQL related
        category: "Developer",
        popular: true
    },
    {
        title: "SQL Formatter",
        description: "Beautify and debug SQL queries.",
        href: "/tools/sql-formatter",
        icon: Table,
        category: "Developer",
        popular: true
    },
    {
        title: "Code to Image",
        description: "Create beautiful code screenshots.",
        href: "/tools/code-to-image",
        icon: ImageIcon,
        category: "Developer",
        popular: true
    },
    {
        title: "Open Graph Preview",
        description: "Preview pages on social media.",
        href: "/tools/open-graph-preview",
        icon: Globe,
        category: "Developer",
        popular: true
    },

    // Design & Writing
    {
        title: "Gradient Generator",
        description: "Create beautiful CSS gradients.",
        href: "/tools/gradient-generator",
        icon: Palette,
        category: "Design",
        popular: true
    },
    {
        title: "Glassmorphism Generator",
        description: "Generate CSS glassmorphism effects.",
        href: "/tools/css-glassmorphism-generator",
        icon: Palette,
        category: "Design",
        popular: true
    },
    {
        title: "Flexbox Playground",
        description: "Interactively learn and test Flexbox.",
        href: "/tools/flexbox-playground",
        icon: ScanBarcode, // Using a generic icon for now, ideally 'Layout' if available
        category: "Design"
    },
    {
        title: "JWT Decoder",
        description: "Decodes a JWT header and payload. HS256 can be checked with a secret.",
        href: "/tools/jwt-decoder",
        icon: FileCode,
        category: "Security",
        popular: true
    },
    {
        title: "CSS Button Generator",
        description: "Design buttons and copy CSS code.",
        href: "/tools/css-button-generator",
        icon: Palette,
        category: "Design"
    },
    // Image Resizer moved to Media
    {
        title: "Color Converter",
        description: "Converts among hex, RGB, and HSL.",
        href: "/tools/color-converter",
        icon: Palette,
        category: "Design"
    },
    {
        title: "Lorem Ipsum",
        description: "Writes a chosen number of lorem ipsum words, sentences, or paragraphs.",
        href: "/tools/lorem-ipsum",
        icon: AlignLeft,
        category: "Writing"
    },
    {
        title: "Text Tools",
        description: "Case converter, word counter, and text cleaner.",
        href: "/tools/text-tools",
        icon: Settings2,
        category: "Writing"
    },
    {
        title: "Password Generator",
        description: "Builds a password with Math.random from the selected sets. The default length is 16.",
        href: "/tools/password-generator",
        icon: Hash,
        category: "Security",
        popular: true
    },
    {
        title: "Markdown Editor",
        description: "Write and preview Markdown in real-time.",
        href: "/tools/markdown-editor",
        icon: FileText,
        category: "Writing",
        popular: true
    },
    {
        title: "Word Counter",
        description: "Counts words, characters, sentences, paragraphs, and reading time.",
        href: "/tools/word-counter",
        icon: AlignLeft,
        category: "Writing",
        popular: true
    },
    {
        title: "Hash Generator",
        description: "Computes SHA-1, SHA-256, SHA-384, and SHA-512. MD5 is not included.",
        href: "/tools/hash-generator",
        icon: Hash,
        category: "Security"
    },
    {
        title: "Color Palette",
        description: "Generate beautiful color palettes from a base color.",
        href: "/tools/color-palette",
        icon: Palette,
        category: "Design"
    },
    {
        title: "Meta Tag Generator",
        description: "Creates title, description, and social meta tags for a page.",
        href: "/tools/meta-tag-generator",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "Timestamp Converter",
        description: "Converts Unix seconds or milliseconds to a date, and a date back to Unix time.",
        href: "/tools/timestamp-converter",
        icon: Clock,
        category: "Developer"
    },
    {
        title: "Cron Job Generator",
        description: "Builds a five-field cron expression and lists the next five runs.",
        href: "/tools/cron-job-generator",
        icon: Clock,
        category: "Developer",
        popular: true
    },
    {
        title: "Box Shadow Generator",
        description: "Design CSS box shadows with live preview.",
        href: "/tools/box-shadow-generator",
        icon: Square,
        category: "Design",
        popular: true
    },
    {
        title: "Favicon Generator",
        description: "Create favicons from emoji or text.",
        href: "/tools/favicon-generator",
        icon: Smile,
        category: "Design"
    },
    {
        title: "JSON to CSV",
        description: "Converts a headered CSV to JSON, or an array of objects to CSV.",
        href: "/tools/json-to-csv",
        icon: Table,
        category: "Developer"
    },
    {
        title: "Diff Checker",
        description: "Compare two texts and find differences.",
        href: "/tools/diff-checker",
        icon: GitCompare,
        category: "Developer"
    },
    {
        title: "GitHub Graph Simulator",
        description: "Visualize merge, rebase, and git flow.",
        href: "/tools/github-graph-simulator",
        icon: GitCompare, // Re-using GitCompare as it fits
        category: "Developer",
        popular: true
    }
];

export const CATEGORIES = [
    {
        slug: "social",
        name: "Social Media",
        description: "Tools for creators and influencers.",
        icon: Share2,
        color: "text-pink-500",
        bg: "bg-pink-50 dark:bg-pink-900/10"
    },
    {
        slug: "finance",
        name: "Finance",
        description: "Calculators for tax, loans, and investments.",
        icon: DollarSign,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/10"
    },
    {
        slug: "developer",
        name: "Developer",
        description: "Formatters, generators, and converters.",
        icon: FileCode,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/10"
    },
    {
        slug: "security",
        name: "Security",
        description: "Encryption, hashing, and password tools.",
        icon: Shield,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/10"
    },
    {
        slug: "design",
        name: "Design & Media",
        description: "Colors, images, and creative tools.",
        icon: Palette,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/10"
    },
    {
        slug: "pdf",
        name: "PDF Tools",
        description: "Merge, split, and convert PDF files.",
        icon: FileText,
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-900/10"
    },
    {
        slug: "utility",
        name: "Productivity",
        description: "Converters, math, and daily essentials.",
        icon: Settings2,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/10"
    }
];
