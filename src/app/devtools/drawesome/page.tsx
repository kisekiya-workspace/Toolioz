import { Metadata } from "next";
import DrawesomeClient from "./DrawesomeClient";

export const metadata: Metadata = {
  title: "Drawesome Vector Drawing Toolbar & Canvas Studio | Free Online Tool",
  description:
    "Free online vector drawing canvas with 7 realistic pens (pencil, pen, fineliner, marker, highlighter, brush, fountain pen), area eraser, and SVG / PNG export. Created by Benji Taylor under MIT License.",
  keywords: [
    "drawesome",
    "vector drawing tool",
    "svg drawing canvas",
    "online pencil sketch",
    "fountain pen calligraphy online",
    "highlighter vector online",
    "freehand svg drawing",
    "react drawing toolbar",
    "vector art creator",
    "benji taylor drawesome",
  ],
  openGraph: {
    title: "Drawesome Vector Drawing Toolbar & Canvas Studio",
    description:
      "Free online vector drawing canvas with 7 realistic pens, area subtraction eraser, and SVG/PNG export.",
    type: "website",
  },
};

export default function DrawesomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Drawesome Vector Drawing Toolbar Studio",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Free online vector drawing studio with 7 realistic pens (pencil, pen, fineliner, marker, highlighter, brush, fountain pen), area eraser, and SVG/PNG export.",
    author: {
      "@type": "Person",
      name: "Benji Taylor",
      url: "https://github.com/benjitaylor/drawesome",
    },
    license: "https://opensource.org/licenses/MIT",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DrawesomeClient />
    </>
  );
}
