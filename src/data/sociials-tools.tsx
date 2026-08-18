import {
    Calculator, Image as ImageIcon, FileText, Settings2, Hash, ArrowRightLeft,
    Search, QrCode, Watch, AlignLeft, Palette, Cat, TrendingUp, DollarSign, Activity, Music,
    Calendar, Globe, Percent, FileCode, Link, ScanBarcode, IndianRupee, LucideIcon,
    Clock, Square, Smile, Table, GitCompare, Youtube, Instagram, Share2, Shield
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
        description: "Create stylish text for your Instagram bio.",
        href: "/tools/instagram-bio-generator",
        icon: Instagram,
        category: "Social",
        popular: true
    },

    // Finance
    {
        title: "SIP Calculator",
        description: "Visualize mutual fund returns with compound interest.",
        href: "/tools/sip-calculator",
        icon: TrendingUp,
        category: "Finance",
        popular: true
    },
    {
        title: "EMI Calculator",
        description: "Plan loan repayments with detailed precision.",
        href: "/tools/emi-calculator",
        icon: DollarSign,
        category: "Finance"
    },
    {
        title: "GST Calculator",
        description: "Inclusive/Exclusive GST calculations.",
        href: "/tools/gst-calculator",
        icon: DollarSign,
        category: "Finance",
        popular: true
    },
    {
        title: "Income Tax Calculator",
        description: "New Regime Tax Estimator (FY 24-25).",
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
        description: "Calculate SIP and Lumpsum returns.",
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
        description: "Compress PNG/JPG/WebP images locally.",
        href: "/tools/image-compressor",
        icon: ImageIcon,
        category: "Media",
        popular: true
    },
    {
        title: "Audio Converter",
        description: "Convert MP3, WAV, AAC, OGG in-browser.",
        href: "/tools/audio-converter",
        icon: Music,
        category: "Media"
    },
    {
        title: "Image Converter",
        description: "Convert images to PNG, JPG, or WebP locally.",
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
        description: "Combine multiple images into a PDF.",
        href: "/tools/image-to-pdf",
        icon: FileText,
        category: "PDF",
        popular: true
    },
    {
        title: "PDF Merger",
        description: "Combine multiple PDF files.",
        href: "/tools/pdf-merger",
        icon: FileText,
        category: "PDF"
    },
    {
        title: "PDF Splitter",
        description: "Extract pages from a PDF.",
        href: "/tools/pdf-splitter",
        icon: FileText,
        category: "PDF"
    },
    {
        title: "PDF to Image",
        description: "Convert PDF pages to PNG.",
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
        description: "X% of Y, Percentage change, etc.",
        href: "/tools/percentage-calculator",
        icon: Percent,
        category: "Math"
    },
    {
        title: "Age Calculator",
        description: "Exact age in years, months, days.",
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
        description: "Convert length, weight, temperature, and more.",
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
        description: "Validate, beautify, and minify JSON.",
        href: "/tools/json-formatter",
        icon: FileText,
        category: "Developer",
        popular: true
    },
    {
        title: "UUID Generator",
        description: "Generate random v4 UUIDs.",
        href: "/tools/uuid-generator",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "Base64 Converter",
        description: "Encode and decode Base64 strings.",
        href: "/tools/base64-converter",
        icon: ArrowRightLeft,
        category: "Developer"
    },
    {
        title: "URL Encoder",
        description: "URL Encode/Decode strings.",
        href: "/tools/url-converter",
        icon: Link,
        category: "Developer"
    },
    {
        title: "Snowflake Parser",
        description: "Extract Discord ID creation dates.",
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
        description: "Test regular expressions instantly.",
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
        description: "Decode and inspect JSON Web Tokens.",
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
        description: "Translate HEX, RGB, and HSL colors.",
        href: "/tools/color-converter",
        icon: Palette,
        category: "Design"
    },
    {
        title: "Lorem Ipsum",
        description: "Generate placeholder text for designs.",
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
        description: "Create secure, random passwords instantly.",
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
        description: "Count words, characters, sentences, and paragraphs.",
        href: "/tools/word-counter",
        icon: AlignLeft,
        category: "Writing",
        popular: true
    },
    {
        title: "Hash Generator",
        description: "Generate MD5, SHA-1, SHA-256 hashes instantly.",
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
        description: "Create SEO meta tags for your website.",
        href: "/tools/meta-tag-generator",
        icon: FileCode,
        category: "Developer"
    },
    {
        title: "Timestamp Converter",
        description: "Convert Unix timestamps to human-readable dates.",
        href: "/tools/timestamp-converter",
        icon: Clock,
        category: "Developer"
    },
    {
        title: "Cron Job Generator",
        description: "Visualize and check cron schedules.",
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
        description: "Convert JSON data to CSV format.",
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
