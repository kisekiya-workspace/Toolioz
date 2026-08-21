import { blog as blog1 } from './the-complete-guide-to-browser-based-financial-engineering';
import { blog as blog2 } from './the-engineering-of-client-side-web-utilities-and-privacy';
import { blog as blog3 } from './behavioral-economics-and-capital-allocation-frameworks';
import { blog as blog4 } from './the-art-and-mathematics-of-retro-dithering-and-halftone-algorithms';
import { blog as blog5 } from './the-architecture-of-zero-knowledge-browser-utilities-and-data-sovereignty';
import { blog as blog6 } from './optimizing-web-performance-webassembly-canvas-2d-and-web-workers';
import { blog as blog7 } from './the-evolution-of-web-tool-directories-and-browser-based-utility-suites';
import { blog as blog8 } from './debt-amortization-mathematics-and-mortgage-acceleration-blueprints';
import { blog as blog9 } from './free-online-financial-calculators-guide';

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
];

export function getStandaloneBlog(slug: string) {
  return standaloneBlogs.find((b) => b.slug === slug);
}
