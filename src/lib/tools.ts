import {
  TrendingUp,
  HomeIcon,
  Landmark,
  PiggyBank,
  Briefcase,
  Percent,
  CreditCard,
  Banknote,
  Car,
  Wallet,
  FileText,
  Binary,
  Code,
  FileSearch,
  Coins,
  Hash,
  ImagePlus,
  Key,
  Clock,
  SearchCode,
  Link as LinkIcon,
  Asterisk,
  LayoutDashboard,
  Palette,
  Target,
  Terminal,
  TrendingDown,
  UserRound,
  type LucideIcon
} from 'lucide-react';

export type Category = 'finance' | 'devtools' | 'pdftools' | 'biodata';

export interface Tool {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  color: string;
  category: Category;
  isTrending?: boolean;
}

export const TOOLS: Tool[] = [
  // Finance Tools
  {
    id: 'compound-interest',
    title: 'Compound Interest',
    desc: 'Calculate how your money grows over time with interest compounding.',
    icon: TrendingUp,
    href: '/finance/compound-interest',
    color: '#3b82f6',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'mortgage-calculator',
    title: 'Mortgage Calc',
    desc: 'Estimate your monthly mortgage payments and total interest.',
    icon: HomeIcon,
    href: '/finance/mortgage-calculator',
    color: '#0ea5e9',
    category: 'finance'
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator',
    desc: 'Measure the profitability of an investment quickly.',
    icon: Briefcase,
    href: '/finance/roi-calculator',
    color: '#10b981',
    category: 'finance'
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    desc: 'Wealth generation through systematic monthly investments.',
    icon: Percent,
    href: '/finance/sip-calculator',
    color: '#2563eb',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'lumpsum-calculator',
    title: 'Lumpsum Calculator',
    desc: 'Project how a one-time investment can grow with compounding.',
    icon: Coins,
    href: '/finance/lumpsum-calculator',
    color: '#0f766e',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'gst-calculator',
    title: 'GST/Tax Calc',
    desc: 'Calculate tax amounts and total costs in seconds.',
    icon: CreditCard,
    href: '/finance/gst-calculator',
    color: '#475569',
    category: 'finance'
  },
  {
    id: 'fd-calculator',
    title: 'Fixed Deposit',
    desc: 'Guaranteed returns on your lump sum bank deposits.',
    icon: Banknote,
    href: '/finance/fd-calculator',
    color: '#0369a1',
    category: 'finance'
  },
  {
    id: 'savings-goal',
    title: 'Savings Goal',
    desc: 'Find out how much you need to save each month to hit your target.',
    icon: PiggyBank,
    href: '/finance/savings-goal',
    color: '#f59e0b',
    category: 'finance'
  },
  {
    id: 'retirement-corpus',
    title: 'Retirement Corpus',
    desc: 'Estimate the corpus you need to retire comfortably after inflation.',
    icon: Target,
    href: '/finance/retirement-corpus',
    color: '#d97706',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'inflation-calculator',
    title: 'Inflation Calc',
    desc: 'See how inflation affects the purchasing power of your money.',
    icon: Landmark,
    href: '/finance/inflation-calculator',
    color: '#ef4444',
    category: 'finance'
  },
  {
    id: 'loan-prepayment',
    title: 'Loan Prepayment',
    desc: 'See how extra EMI payments shorten your loan and save interest.',
    icon: TrendingDown,
    href: '/finance/loan-prepayment',
    color: '#dc2626',
    category: 'finance',
    isTrending: true
  },
  {
    id: 'car-loan',
    title: 'Car Loan EMI',
    desc: 'Calculate monthly installments for your dream vehicle.',
    icon: Car,
    href: '/finance/car-loan',
    color: '#06b6d4',
    category: 'finance'
  },
  {
    id: 'income-tax',
    title: 'Income Tax',
    desc: 'Professional Old vs New regime tax comparison & planning.',
    icon: Wallet,
    href: '/finance/income-tax',
    color: '#2563eb',
    category: 'finance',
    isTrending: true
  },

  // Dev Tools
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    desc: 'Prettify, validate, and minify your JSON data instantly.',
    icon: Code,
    href: '/devtools/json-formatter',
    color: '#f59e0b',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'base64-converter',
    title: 'Base64 Converter',
    desc: 'Encode and decode strings to and from Base64 format.',
    icon: Binary,
    href: '/devtools/base64-converter',
    color: '#3b82f6',
    category: 'devtools'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    desc: 'Decode, verify and inspect JSON Web Tokens securely.',
    icon: Key,
    href: '/devtools/jwt-decoder',
    color: '#f43f5e',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'cron-generator',
    title: 'Cron Generator',
    desc: 'Generate, parse and explain cron expression schedules.',
    icon: Clock,
    href: '/devtools/cron-generator',
    color: '#0d9488',
    category: 'devtools'
  },
  {
    id: 'regex-tester',
    title: 'RegExp Tester',
    desc: 'Test and debug Regular Expressions with live highlighting.',
    icon: SearchCode,
    href: '/devtools/regex-tester',
    color: '#10b981',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder',
    desc: 'Encode and decode URLs or URI components instantly.',
    icon: LinkIcon,
    href: '/devtools/url-encoder',
    color: '#3b82f6',
    category: 'devtools'
  },
  {
    id: 'bcrypt-generator',
    title: 'Bcrypt Generator',
    desc: 'Generate and verify Bcrypt password hashes securely.',
    icon: Asterisk,
    href: '/devtools/bcrypt-generator',
    color: '#f59e0b',
    category: 'devtools'
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    desc: 'Generate SHA hashes for text or files using Web Crypto APIs.',
    icon: Hash,
    href: '/devtools/hash-generator',
    color: '#16a34a',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'curl-converter',
    title: 'cURL Converter',
    desc: 'Convert cURL commands into Fetch, Axios, and Python snippets.',
    icon: Terminal,
    href: '/devtools/curl-converter',
    color: '#1d4ed8',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    desc: 'Convert Unix seconds, milliseconds, and date strings instantly.',
    icon: Clock,
    href: '/devtools/timestamp-converter',
    color: '#d97706',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'json-diff',
    title: 'JSON Diff Checker',
    desc: 'Compare two JSON payloads and inspect exact field-level changes.',
    icon: SearchCode,
    href: '/devtools/json-diff',
    color: '#0f766e',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'layout-generator',
    title: 'Layout Generator',
    desc: 'Visually build and test CSS Flexbox and Grid layouts.',
    icon: LayoutDashboard,
    href: '/devtools/layout-generator',
    color: '#0ea5e9',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    desc: 'Generate secure v4 UUIDs in bulk effortlessly.',
    icon: Hash,
    href: '/devtools/uuid-generator',
    color: '#10b981',
    category: 'devtools'
  },
  {
    id: 'color-converter',
    title: 'Color Format Suite',
    desc: 'Convert seamlessly between HEX, RGB, HSL and CMYK.',
    icon: Palette,
    href: '/devtools/color-converter',
    color: '#2563eb',
    category: 'devtools',
    isTrending: true
  },
  {
    id: 'biodata-generator',
    title: 'Biodata Generator',
    desc: 'Create marriage biodata PDFs with religion-based and modern templates.',
    icon: UserRound,
    href: '/biodata/biodata-generator',
    color: '#db2777',
    category: 'biodata',
    isTrending: true
  },

  // PDF Tools (Mocks)
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    desc: 'Combine multiple PDF files into one single document.',
    icon: FileText,
    href: '/pdftools/merge-pdf',
    color: '#ef4444',
    category: 'pdftools',
    isTrending: true
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    desc: 'Convert your PDF pages into high-quality JPG or PNG images.',
    icon: FileSearch,
    href: '/pdftools/pdf-to-image',
    color: '#0ea5e9',
    category: 'pdftools'
  },

  {
    id: 'image-compressor',
    title: 'Image Compressor',
    desc: 'Reduce image file size for web while maintaining visual quality.',
    icon: ImagePlus,
    href: '/pdftools/image-compressor',
    color: '#3b82f6',
    category: 'pdftools',
    isTrending: true
  },
  {
    id: 'resume-generator',
    title: 'ATS Resume Generator',
    desc: 'Create polished resumes with a live LaTeX editor and text-based PDF export.',
    icon: Briefcase,
    href: '/pdftools/resume-generator',
    color: '#111827',
    category: 'pdftools',
    isTrending: true
  }
];

export const CATEGORIES = [
  {
    id: 'finance',
    title: 'Finance Tools',
    desc: 'Calculators for tax, investments, and personal finance.',
    color: '#3b82f6',
    icon: Landmark
  },
  {
    id: 'devtools',
    title: 'Developer Tools',
    desc: 'Utilities for coding, formatting, and data conversion.',
    color: '#f59e0b',
    icon: Code
  },
  {
    id: 'pdftools',
    title: 'PDF Utilities',
    desc: 'Simple tools to merge, split, and compress PDF files.',
    color: '#ef4444',
    icon: FileText
  },
  {
    id: 'biodata',
    title: 'Biodata Tools',
    desc: 'Marriage biodata builders with cultural, traditional, and modern layouts.',
    color: '#db2777',
    icon: UserRound
  }
];
