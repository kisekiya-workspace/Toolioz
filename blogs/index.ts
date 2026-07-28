import { blog as blog1 } from './the-complete-guide-to-browser-based-financial-engineering';
import { blog as blog2 } from './the-engineering-of-client-side-web-utilities-and-privacy';
import { blog as blog3 } from './behavioral-economics-and-capital-allocation-frameworks';
import { blog as blog4 } from './the-art-and-mathematics-of-retro-dithering-and-halftone-algorithms';
import { blog as blog5 } from './the-architecture-of-zero-knowledge-browser-utilities-and-data-sovereignty';
import { blog as blog6 } from './optimizing-web-performance-webassembly-canvas-2d-and-web-workers';
import { blog as blog7 } from './the-evolution-of-web-tool-directories-and-browser-based-utility-suites';
import { blog as blog8 } from './debt-amortization-mathematics-and-mortgage-acceleration-blueprints';
import { blog as blog9 } from './free-online-financial-calculators-guide';
import { blog as blog10 } from './all-in-one-web-utility-tools-directory';
import { blog as blog11 } from './online-image-dither-halftone-studio-guide';
import { blog as blog12 } from './privacy-first-browser-tools-suite';
import { blog as blog13 } from './smart-financial-planning-calculator-suite';
import { blog as blog14 } from './client-side-vs-server-side-web-apps-performance-privacy';
import { blog as blog15 } from './debt-avalanche-vs-debt-snowball-payoff-strategy';
import { blog as blog16 } from './retro-pixel-graphics-dithering-web-design-guide';

export type StandaloneBlog = typeof blog1;

export const standaloneBlogs: StandaloneBlog[] = [
  blog1,
  blog2,
  blog3,
  blog4,
  blog5,
  blog6,
  blog7,
  blog8,
  blog9,
  blog10,
  blog11,
  blog12,
  blog13,
  blog14,
  blog15,
  blog16,
];

export function getStandaloneBlog(slug: string) {
  return standaloneBlogs.find((b) => b.slug === slug);
}
