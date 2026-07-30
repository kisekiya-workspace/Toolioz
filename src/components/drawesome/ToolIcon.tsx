"use client";
/**
 * Realistic Pen & Tool Icon SVG Renderer
 * Based on drawesome by Benji Taylor (MIT License)
 */
import React, { useId } from "react";
import type { PenId } from "@/lib/drawesome/types";

export type ToolIconId = PenId | "eraser";

const W = 30;
const H = 88;
const APEX = 4;
const SHOULDER = 31;

export function ToolIcon({
  id,
  color,
  size = 30,
}: {
  id: ToolIconId;
  color: string;
  size?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const g = {
    barrel: `b-${uid}`,
    shade: `s-${uid}`,
    metal: `m-${uid}`,
    wood: `w-${uid}`,
    gold: `g-${uid}`,
    tipShade: `t-${uid}`,
    facet: `f-${uid}`,
    rubber: `r-${uid}`,
  };

  const Tool = TOOLS[id];

  return (
    <svg
      width={size}
      height={(size / W) * H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={g.shade}
          x1="0"
          x2={W}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.12" stopColor="#000" stopOpacity="0.1" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.68" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.9" stopColor="#000" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>

        <linearGradient
          id={g.metal}
          x1="0"
          x2={W}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#8c8e93" />
          <stop offset="0.15" stopColor="#d1d3d8" />
          <stop offset="0.38" stopColor="#ffffff" />
          <stop offset="0.65" stopColor="#b4b6bb" />
          <stop offset="0.88" stopColor="#6c6e73" />
          <stop offset="1" stopColor="#4a4b4e" />
        </linearGradient>

        <linearGradient
          id={g.gold}
          x1="0"
          x2={W}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#9e7b28" />
          <stop offset="0.16" stopColor="#e5c568" />
          <stop offset="0.38" stopColor="#fff6d2" />
          <stop offset="0.68" stopColor="#d4a838" />
          <stop offset="0.9" stopColor="#805e18" />
          <stop offset="1" stopColor="#573e0c" />
        </linearGradient>

        <linearGradient
          id={g.wood}
          x1="0"
          x2={W}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b8834c" />
          <stop offset="0.25" stopColor="#dfa76a" />
          <stop offset="0.5" stopColor="#f5c78e" />
          <stop offset="0.8" stopColor="#c58e52" />
          <stop offset="1" stopColor="#7a4f24" />
        </linearGradient>

        <linearGradient
          id={g.tipShade}
          x1="0"
          x2={W}
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <Tool color={color} g={g} />
    </svg>
  );
}

type Defs = Record<string, string>;

const TOOLS: Record<
  ToolIconId,
  React.FC<{ color: string; g: Defs }>
> = {
  pencil({ color, g }) {
    const lead = "#2c2d30";
    return (
      <g>
        <path d={`M${W / 2 - 3} ${SHOULDER} L${W / 2} ${APEX} L${W / 2 + 3} ${SHOULDER} Z`} fill={g.wood} />
        <path d={`M${W / 2 - 1.5} ${APEX + 10} L${W / 2} ${APEX} L${W / 2 + 1.5} ${APEX + 10} Z`} fill={lead} />
        <rect x="5" y={SHOULDER} width="20" height={H - SHOULDER} fill={color} />
        <rect x="5" y={SHOULDER} width="20" height={H - SHOULDER} fill={`url(#${g.shade})`} />
      </g>
    );
  },

  pen({ color, g }) {
    return (
      <g>
        <path d={`M10 ${SHOULDER} L${W / 2} ${APEX} L20 ${SHOULDER} Z`} fill={`url(#${g.metal})`} />
        <rect x="6" y={SHOULDER} width="18" height={H - SHOULDER} rx="3" fill={color} />
        <rect x="6" y={SHOULDER} width="18" height={H - SHOULDER} rx="3" fill={`url(#${g.shade})`} />
      </g>
    );
  },

  fineliner({ color, g }) {
    return (
      <g>
        <rect x="13.5" y={APEX} width="3" height={SHOULDER - APEX} fill="#111" />
        <path d={`M8 ${SHOULDER} L${W / 2} ${APEX + 12} L22 ${SHOULDER} Z`} fill={`url(#${g.metal})`} />
        <rect x="7" y={SHOULDER} width="16" height={H - SHOULDER} fill={color} />
        <rect x="7" y={SHOULDER} width="16" height={H - SHOULDER} fill={`url(#${g.shade})`} />
      </g>
    );
  },

  marker({ color, g }) {
    return (
      <g>
        <path d={`M9 ${APEX + 8} L12 ${APEX} L18 ${APEX} L21 ${APEX + 8} Z`} fill={color} />
        <rect x="5" y={SHOULDER} width="20" height={H - SHOULDER} rx="4" fill="#222" />
        <rect x="5" y={SHOULDER} width="20" height={H - SHOULDER} rx="4" fill={`url(#${g.shade})`} />
      </g>
    );
  },

  highlighter({ color, g }) {
    return (
      <g>
        <path d={`M7 ${APEX + 12} L11 ${APEX} L19 ${APEX + 4} L23 ${APEX + 12} Z`} fill={color} />
        <rect x="3" y={SHOULDER} width="24" height={H - SHOULDER} rx="6" fill="#1e293b" />
        <rect x="3" y={SHOULDER} width="24" height={H - SHOULDER} rx="6" fill={`url(#${g.shade})`} />
      </g>
    );
  },

  brush({ color, g }) {
    return (
      <g>
        <path d={`M10 ${SHOULDER} Q${W / 2} ${APEX + 2} ${W / 2} ${APEX} Q${W / 2} ${APEX + 2} 20 ${SHOULDER} Z`} fill={color} />
        <rect x="8" y={SHOULDER} width="14" height="10" fill={`url(#${g.metal})`} />
        <rect x="7" y={SHOULDER + 10} width="16" height={H - SHOULDER - 10} rx="2" fill="#78350f" />
        <rect x="7" y={SHOULDER + 10} width="16" height={H - SHOULDER - 10} rx="2" fill={`url(#${g.shade})`} />
      </g>
    );
  },

  fountain({ color, g }) {
    return (
      <g>
        <path d={`M9 ${SHOULDER} L${W / 2} ${APEX} L21 ${SHOULDER} Z`} fill={`url(#${g.gold})`} />
        <circle cx={W / 2} cy={APEX + 14} r="1.5" fill="#1e293b" />
        <line x1={W / 2} y1={APEX} x2={W / 2} y2={APEX + 14} stroke="#1e293b" strokeWidth="0.8" />
        <rect x="6" y={SHOULDER} width="18" height={H - SHOULDER} rx="3" fill={color} />
        <rect x="6" y={SHOULDER} width="18" height={H - SHOULDER} rx="3" fill={`url(#${g.shade})`} />
      </g>
    );
  },

  eraser({ g }) {
    return (
      <g>
        <rect x="6" y={APEX + 10} width="18" height="24" rx="2" fill="#f43f5e" />
        <rect x="6" y={APEX + 10} width="18" height="24" rx="2" fill={`url(#${g.shade})`} />
        <rect x="6" y={APEX + 34} width="18" height={H - APEX - 34} fill={`url(#${g.metal})`} />
      </g>
    );
  },
};
