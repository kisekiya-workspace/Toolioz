export const biodataKeywords = [
  'free marriage biodata maker no login',
  'marriage biodata format pdf download free',
  'hindu marriage biodata format with photo pdf',
  'muslim marriage biodata format pdf online',
  'sikh marriage biodata format with family details',
  'modern marriage biodata format for boy and girl',
  'biodata for marriage with horoscope details',
  'marriage biodata pdf download on mobile',
];

export const biodataFaqs = [
  {
    question: 'Can I make a marriage biodata PDF on mobile?',
    answer:
      'Yes. The biodata generator works in the browser on mobile and desktop, with live preview and PDF download.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No account is required. You can add your details, preview the template, and export the PDF directly.',
  },
  {
    question: 'Which biodata templates are available?',
    answer:
      'The tool includes modern, classic, minimalist, Hindu, Islamic, and Sikh biodata templates.',
  },
  {
    question: 'Is the biodata data stored online?',
    answer:
      'The biodata editor saves draft data in your browser storage for convenience. It does not need a server account to create the PDF.',
  },
];

export type BiodataPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  updated: string;
  readTime: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const biodataPosts: BiodataPost[] = [
  {
    slug: 'marriage-biodata-format-pdf-download-free',
    title: 'Marriage Biodata Format PDF Download Free: What to Include',
    description:
      'A practical guide to creating a marriage biodata format PDF with personal details, family background, education, profession, and partner preferences.',
    keywords: [
      'marriage biodata format pdf download free',
      'biodata for marriage pdf with photo',
      'marriage biodata format online no login',
    ],
    updated: 'May 2026',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Start with the details families expect first',
        body: [
          'A useful marriage biodata should be easy for parents and prospective matches to scan. Put the name, date of birth, height, religion or community, education, profession, city, and contact details in clearly labeled sections.',
          'Avoid turning the first page into a long biography. The goal is to create a neat matrimonial profile that can be shared on WhatsApp, email, or printed without losing formatting.',
        ],
      },
      {
        heading: 'Add family background without overcrowding the page',
        body: [
          'Family information is still important in most Indian matrimonial biodata formats. Include father and mother names, occupations, siblings, and current location. If the details are long, keep them in short lines so the PDF stays readable.',
          'A one-page PDF is usually best. If you need more space, put lifestyle, hobbies, and partner expectations after the key family details.',
        ],
      },
      {
        heading: 'Use PDF when you want the format to stay fixed',
        body: [
          'PDF is the safest format for sharing because the layout remains the same across phones, laptops, and printers. A biodata made in a browser preview should export exactly as seen, including borders, photo crop, and spacing.',
          'Before downloading, inspect the preview on mobile and desktop. Long names, long education entries, and multi-line sibling details are the most common places where spacing needs adjustment.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the best marriage biodata format?',
        answer:
          'The best format is one page, clearly sectioned, and includes personal details, education, profession, family background, contact details, and partner preferences.',
      },
      {
        question: 'Should marriage biodata include a photo?',
        answer:
          'A clear recent photo is commonly used and helps the biodata feel complete, but it should not overpower the personal and family details.',
      },
    ],
  },
  {
    slug: 'hindu-marriage-biodata-format-with-photo',
    title: 'Hindu Marriage Biodata Format With Photo and Horoscope Details',
    description:
      'Learn what to include in a Hindu marriage biodata format with photo, caste/community details, manglik status, birth time, and family background.',
    keywords: [
      'hindu marriage biodata format with photo',
      'hindu biodata format pdf download',
      'marriage biodata with manglik birth time',
    ],
    updated: 'May 2026',
    readTime: '4 min read',
    sections: [
      {
        heading: 'Keep horoscope details easy to find',
        body: [
          'For many Hindu families, birth date, birth time, birth place, caste or community, and manglik status are important. These details should sit in the personal section rather than being buried at the end.',
          'If horoscope matching is part of the process, clear labels help families copy the details accurately.',
        ],
      },
      {
        heading: 'Use traditional design elements with restraint',
        body: [
          'Orange, maroon, gold borders, Om symbols, and Ganeshay Namah headings can make a Hindu biodata feel culturally appropriate. The key is to keep the text readable and avoid excessive decoration.',
          'The best Hindu marriage biodata format balances tradition with clean spacing, so the page looks respectful rather than crowded.',
        ],
      },
      {
        heading: 'Do not skip profession and lifestyle details',
        body: [
          'Even in a traditional format, education, occupation, annual income, languages, hobbies, and partner expectations matter. These sections help the biodata feel current and complete.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should manglik status be included in Hindu biodata?',
        answer:
          'If your family considers horoscope matching important, include manglik status along with birth date, birth time, and birth place.',
      },
      {
        question: 'Can a Hindu biodata be modern?',
        answer:
          'Yes. Many families prefer a modern layout with traditional accents such as saffron color, gold border, or a small Om symbol.',
      },
    ],
  },
  {
    slug: 'muslim-marriage-biodata-format-pdf-online',
    title: 'Muslim Marriage Biodata Format PDF Online: Simple and Respectful Layout',
    description:
      'Create a Muslim marriage biodata format with clean sections for personal details, education, family background, values, and contact information.',
    keywords: [
      'muslim marriage biodata format pdf online',
      'islamic biodata for marriage pdf',
      'muslim bride groom biodata format',
    ],
    updated: 'May 2026',
    readTime: '4 min read',
    sections: [
      {
        heading: 'Use a clean layout for essential details',
        body: [
          'A Muslim marriage biodata should make personal details, education, occupation, family background, and contact information easy to read. Many families prefer a modest, structured layout over a heavily decorative design.',
          'If you include sect, community, or language details, keep them in the personal section with clear labels.',
        ],
      },
      {
        heading: 'Add family and values thoughtfully',
        body: [
          'Family background is often a key part of the biodata. Mention parents, occupations, siblings, city, and any values or expectations that are relevant to the match.',
          'A short “About Me” section can help the biodata feel personal while still staying formal.',
        ],
      },
      {
        heading: 'Preview before PDF download',
        body: [
          'When creating the PDF online, check that Arabic or Islamic decorative text renders correctly in the preview. If you plan to share the biodata on mobile, download and open the PDF once before sending it onward.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What should be included in Muslim marriage biodata?',
        answer:
          'Include name, age or date of birth, height, education, profession, family details, city, contact details, and partner expectations.',
      },
      {
        question: 'Can I make Muslim biodata online without login?',
        answer:
          'Yes, a browser-based biodata maker can create and export the PDF without requiring account creation.',
      },
    ],
  },
  {
    slug: 'modern-marriage-biodata-format-for-boy-and-girl',
    title: 'Modern Marriage Biodata Format for Boy and Girl: Clean One-Page Guide',
    description:
      'A modern marriage biodata format for boy and girl profiles, with layout tips for photo, career, family, hobbies, and partner preferences.',
    keywords: [
      'modern marriage biodata format for boy and girl',
      'one page marriage biodata format',
      'professional biodata for marriage pdf',
    ],
    updated: 'May 2026',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Lead with identity and profession',
        body: [
          'Modern biodata formats often start with a photo, full name, profession, city, and contact details. This makes the profile feel direct and professional.',
          'For both boy and girl biodata formats, the same structure works well: personal details, education, career, family background, about, and partner preferences.',
        ],
      },
      {
        heading: 'Keep the tone warm but concise',
        body: [
          'The “About Me” section should sound human without becoming too long. Two to four sentences about personality, values, lifestyle, and interests are enough for most biodata PDFs.',
          'Partner preferences should be respectful and specific, focusing on values, education, lifestyle, and family compatibility.',
        ],
      },
      {
        heading: 'Make it easy to share on mobile',
        body: [
          'Most marriage biodata PDFs are shared through phones. Use a PDF layout with readable font sizes, high contrast, and a single-page A4 preview so it opens cleanly on mobile screens.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is one page enough for marriage biodata?',
        answer:
          'Yes. A one-page biodata is usually easier to share and read, especially on mobile.',
      },
      {
        question: 'Can the same biodata format be used for boy and girl profiles?',
        answer:
          'Yes. The same core sections work for both. You can adjust tone, photo style, and partner preferences based on the profile.',
      },
    ],
  },
];

export function getBiodataPost(slug: string) {
  return biodataPosts.find((post) => post.slug === slug);
}
