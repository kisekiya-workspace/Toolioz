"use client";
import React, { useRef, useCallback } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
  decimals?: number;
  displayValue?: string;
}

const DOT_COUNT = 5;

export default function Slider({
  label, value, min, max, step = 1, onChange, unit = "", decimals = 0, displayValue
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const display = displayValue ?? (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString());

  const clamp = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let v = min + ratio * (max - min);
    if (step) v = Math.round(v / step) * step;
    v = Math.max(min, Math.min(max, v));
    return decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.round(v);
  }, [value, min, max, step, decimals]);

  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    onChange(clamp(e.clientX));
  }, [clamp, onChange]);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    onChange(clamp(e.clientX));
  }, [clamp, onChange]);

  const onUp = useCallback(() => { dragging.current = false; }, []);

  const thumbPct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div
      ref={trackRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 rounded-xl h-9 mb-1.5 cursor-ew-resize flex items-center overflow-hidden select-none transition-colors group shadow-inner"
    >
      {/* Decorative Track Dots */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-between px-3">
        {Array.from({ length: DOT_COUNT }).map((_, i) => (
          <span key={i} className="block w-1 h-1 rounded-full bg-slate-700/50" />
        ))}
      </div>

      {/* Dynamic Progress Fill */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-indigo-600/30 group-hover:bg-indigo-600/40 rounded-xl pointer-events-none z-10 transition-all"
        style={{ width: `${thumbPct}%` }}
      >
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-indigo-400 shadow-sm" />
      </div>

      {/* Label and Value Text */}
      <span className="absolute left-3 pointer-events-none z-20 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </span>

      <span className="absolute right-3 pointer-events-none z-20 text-[11px] font-mono font-bold text-indigo-300">
        {display}{unit}
      </span>
    </div>
  );
}
