/**
 * SVG & PNG Serialization
 * Based on drawesome by Benji Taylor (MIT License)
 */
import {
  dotRadius,
  eraseLayers,
  polylinePath,
  strokePath,
  watercolorBlooms,
} from "./geometry";
import { PEN_BY_ID } from "./pens";
import type { Stroke } from "./types";

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function watercolorFilterMarkup(id: string, seed: number, size: number): string {
  return (
    `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="${seed}" result="paper"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="paper" scale="${Math.max(3, size * 0.16)}" xChannelSelector="R" yChannelSelector="G" result="rough"/>` +
    `<feGaussianBlur in="rough" stdDeviation="${Math.max(0.35, size * 0.018)}"/>` +
    `</filter>`
  );
}

function strokeMarkup(stroke: Stroke, index: number): string {
  if (stroke.pen === "watercolor") {
    const filterId = `wc${index}`;
    const centerline = polylinePath(stroke.points);
    const blooms = watercolorBlooms(stroke.points, stroke.size)
      .map(
        (bloom) =>
          `<circle cx="${bloom.x}" cy="${bloom.y}" r="${bloom.radius}"` +
          ` fill="${esc(stroke.color)}" fill-opacity="${stroke.opacity * bloom.opacity}"/>`
      )
      .join("");
    const washes = [
      { width: 1.5, opacity: 0.16 },
      { width: 1.02, opacity: 0.3 },
      { width: 0.58, opacity: 0.2 },
    ]
      .map((wash) => {
        return (
          `<path d="${centerline}" fill="none" stroke="${esc(stroke.color)}"` +
          ` stroke-width="${stroke.size * wash.width}" stroke-linecap="round"` +
          ` stroke-linejoin="round" stroke-opacity="${stroke.opacity * wash.opacity}"/>`
        );
      })
      .join("");

    if (centerline && stroke.points.length > 1) {
      return (
        watercolorFilterMarkup(filterId, (index % 97) + 1, stroke.size) +
        `<g filter="url(#${filterId})">${blooms}${washes}</g>`
      );
    }

    if (stroke.points.length) {
      const [x, y] = stroke.points[0];
      return (
        `<circle cx="${x}" cy="${y}" r="${dotRadius(stroke.size)}"` +
        ` fill="${esc(stroke.color)}" fill-opacity="${stroke.opacity * 0.7}"/>`
      );
    }
    return "";
  }

  const style =
    PEN_BY_ID[stroke.pen].blend === "multiply"
      ? ` style="mix-blend-mode:multiply"`
      : "";
  const paint = `fill="${esc(stroke.color)}" fill-opacity="${stroke.opacity}"${style}`;

  const d = strokePath(
    stroke.pen,
    stroke.size,
    stroke.points,
    true,
    stroke.shape
  );
  if (d) return `<path d="${d}" ${paint}/>`;

  if (stroke.points.length) {
    const [x, y] = stroke.points[0];
    return `<circle cx="${x}" cy="${y}" r="${dotRadius(stroke.size)}" ${paint}/>`;
  }
  return "";
}

function backgroundMarkup(
  background: string | null,
  width: number,
  height: number
): string {
  if (!background || background === "transparent") return "";
  return `<rect width="${width}" height="${height}" fill="${esc(background)}"/>`;
}

export function toSvg(
  strokes: Stroke[],
  width: number,
  height: number,
  background: string | null
): string {
  const layers = eraseLayers(strokes);

  const body = layers
    .map((layer, i) => {
      const ink = layer.ink
        .map((n) => strokeMarkup(strokes[n], n))
        .filter(Boolean)
        .join("");
      if (!ink) return "";
      if (!layer.erasers.length) return ink;

      const id = `e${i}`;
      const cuts = layer.erasers
        .map((n) => {
          const s = strokes[n];
          return (
            `<path d="${polylinePath(s.points)}" stroke="#000" stroke-width="${s.size}"` +
            ` stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
          );
        })
        .join("");

      return (
        `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">` +
        `<rect width="${width}" height="${height}" fill="#fff"/>${cuts}</mask>` +
        `<g mask="url(#${id})">${ink}</g>`
      );
    })
    .join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    backgroundMarkup(background, width, height) +
    body +
    `</svg>`
  );
}

export async function toPng(
  strokes: Stroke[],
  width: number,
  height: number,
  background: string | null,
  scale = 2
): Promise<Blob> {
  const svg = toSvg(strokes, width, height, background);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not rasterise the drawing"));
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D context");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not encode the PNG")),
      "image/png"
    );
  });
}
