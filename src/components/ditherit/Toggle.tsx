"use client";
import React from "react";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      className="flex items-center justify-between bg-white dark:bg-zinc-800/90 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl h-9 px-3 mb-1.5 cursor-pointer select-none transition-colors"
    >
      <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
        {label}
      </span>

      <div
        className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${
          value ? "bg-zinc-900 dark:bg-zinc-100" : "bg-zinc-200 dark:bg-zinc-700"
        }`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 ${
            value ? "left-4 bg-white dark:bg-zinc-950" : "left-0.5 bg-zinc-400 dark:bg-zinc-400"
          }`}
        />
      </div>
    </div>
  );
}
