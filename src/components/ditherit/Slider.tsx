"use client";
import React, { useId } from "react";
interface SliderProps {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; unit?: string; decimals?: number; displayValue?: string;
}
export default function Slider({ label, value, min, max, step = 1, onChange, unit = "", decimals = 0, displayValue }: SliderProps) {
  const id = useId();
  const display = displayValue ?? (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString());
  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-3 mb-1.5 text-xs">
        <label htmlFor={id} className="text-zinc-700 dark:text-zinc-300">{label}</label>
        <output htmlFor={id} className="font-mono tabular-nums text-zinc-950 dark:text-zinc-100">{display}{unit}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} aria-valuetext={`${display}${unit}`}
        className="block w-full h-5 accent-zinc-900 dark:accent-zinc-100 cursor-pointer" />
    </div>
  );
}
