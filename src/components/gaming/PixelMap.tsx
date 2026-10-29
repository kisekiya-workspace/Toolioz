'use client';

import { useEffect, useRef } from 'react';
import type { Cell2 } from '@/lib/gaming/minecraft-shapes';
import { bounds2 } from '@/lib/gaming/minecraft-shapes';

interface PixelMapProps {
  cells: Cell2[];
  label?: string;
}

export function PixelMap({ cells, label }: PixelMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const css = Math.min(640, canvas.parentElement?.clientWidth ?? 640);
    canvas.width = Math.floor(css * dpr);
    canvas.height = Math.floor(css * dpr);
    canvas.style.width = `${css}px`;
    canvas.style.height = `${css}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 0, css, css);

    if (cells.length === 0) return;

    const { minX, maxX, minZ, maxZ } = bounds2(cells);
    const cols = maxX - minX + 1;
    const rows = maxZ - minZ + 1;
    const pad = 12;
    const cell = Math.max(2, Math.floor((css - pad * 2) / Math.max(cols, rows)));
    const gridW = cols * cell;
    const gridH = rows * cell;
    const ox = (css - gridW) / 2;
    const oy = (css - gridH) / 2;
    const live = new Set(cells.map((c) => `${c.x},${c.z}`));

    ctx.fillStyle = '#1c1916';
    ctx.fillRect(ox - 4, oy - 4, gridW + 8, gridH + 8);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const px = ox + (x - minX) * cell;
        const pz = oy + (z - minZ) * cell;
        const filled = live.has(`${x},${z}`);
        if (filled) {
          ctx.fillStyle = x === 0 && z === 0 ? '#d4a017' : '#5c8f3a';
          ctx.fillRect(px, pz, cell, cell);
          ctx.strokeStyle = '#3d5f27';
          ctx.lineWidth = Math.max(1, cell * 0.08);
          ctx.strokeRect(px + 0.5, pz + 0.5, cell - 1, cell - 1);
          if (cell >= 10) {
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(px + 1, pz + 1, cell * 0.35, cell * 0.18);
          }
        } else {
          ctx.fillStyle = (x + z) % 2 === 0 ? '#1a1714' : '#161310';
          ctx.fillRect(px, pz, cell, cell);
        }
      }
    }

    if (cell >= 8) {
      ctx.strokeStyle = 'rgba(212,160,23,0.85)';
      ctx.lineWidth = 1.5;
      const cx = ox + (0 - minX) * cell + cell / 2;
      const cz = oy + (0 - minZ) * cell + cell / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 4, cz);
      ctx.lineTo(cx + 4, cz);
      ctx.moveTo(cx, cz - 4);
      ctx.lineTo(cx, cz + 4);
      ctx.stroke();
    }
  }, [cells]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141210]">
      <canvas
        ref={canvasRef}
        className="mx-auto block max-w-full"
        role="img"
        aria-label={label ?? 'Minecraft block map'}
      />
    </div>
  );
}
