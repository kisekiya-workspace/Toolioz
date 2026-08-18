/**
 * Pen definition presets
 * Based on drawesome by Benji Taylor (MIT License)
 */
import type { Pen, PenId } from "./types";

const contrast = (t: number) => t * t * (3 - 2 * t);

export const PENS: Pen[] = [
  {
    id: "pencil",
    name: "Pencil",
    key: "c",
    defaultSize: 1,
    defaultOpacity: 0.85,
    options: (size) => ({
      size,
      thinning: 0.5,
      streamline: 0.5,
      simulatePressure: true,
      variance: 0.85,
    }),
  },
  {
    id: "pen",
    name: "Pen",
    key: "p",
    defaultSize: 6,
    defaultOpacity: 1,
    options: (size) => ({
      size,
      thinning: 0.5,
      streamline: 0.5,
      simulatePressure: true,
      easing: contrast,
      variance: 0.3,
    }),
  },
  {
    id: "fineliner",
    name: "Fineliner",
    key: "f",
    defaultSize: 2,
    defaultOpacity: 1,
    options: (size) => ({
      size,
      thinning: 0,
      streamline: 0.55,
      simulatePressure: false,
    }),
  },
  {
    id: "marker",
    name: "Marker",
    key: "m",
    defaultSize: 18,
    defaultOpacity: 1,
    options: (size) => ({
      size,
      thinning: 0.12,
      streamline: 0.5,
      simulatePressure: true,
      variance: 0.5,
    }),
  },
  {
    id: "highlighter",
    name: "Highlighter",
    key: "h",
    defaultSize: 28,
    defaultOpacity: 0.75,
    defaultColor: "#fff01f",
    blend: "multiply",
    options: (size) => ({
      size,
      thinning: 0,
      streamline: 0.6,
      simulatePressure: false,
      flatEnds: true,
    }),
  },
  {
    id: "brush",
    name: "Brush",
    key: "b",
    defaultSize: 14,
    defaultOpacity: 1,
    options: (size) => ({
      size,
      thinning: 0.42,
      streamline: 0.55,
      simulatePressure: true,
      openAt: 0.5,
      easing: contrast,
      taperStart: 0,
      taperEnd: size * 1.15,
      variance: 0.9,
    }),
  },
  {
    id: "watercolor",
    name: "Watercolor",
    key: "w",
    defaultSize: 34,
    defaultOpacity: 0.65,
    options: (size) => ({
      size,
      thinning: 0.24,
      streamline: 0.66,
      simulatePressure: true,
      easing: contrast,
      taperEnd: size * 0.45,
      variance: 0.7,
    }),
  },
  {
    id: "fountain",
    name: "Fountain Pen",
    key: "g",
    defaultSize: 8,
    defaultOpacity: 1,
    options: (size) => ({
      size,
      nibAngle: 45,
      nibContrast: 0.85,
      thinning: 0.1,
      streamline: 0.5,
      simulatePressure: true,
      variance: 0.45,
    }),
  },
];

export const PEN_BY_ID = Object.fromEntries(
  PENS.map((p) => [p.id, p])
) as Record<PenId, Pen>;
