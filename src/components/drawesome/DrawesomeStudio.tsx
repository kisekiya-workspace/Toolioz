"use client";

import React, { useRef, useState, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Pencil, Download, RotateCcw, RotateCw, Trash2,
  Sliders, Palette, ArrowLeft, Code, Check, Copy,
  Sparkles, FileText, Upload, Image as ImageIcon,
  Grid, Sun, Moon, Eye, ZoomIn, ZoomOut, Maximize2
} from "lucide-react";
import { useDrawing } from "@/lib/drawesome/useDrawing";
import { PENS, PEN_BY_ID } from "@/lib/drawesome/pens";
import { SWATCHES } from "@/lib/drawesome/palette";
import { toSvg, toPng } from "@/lib/drawesome/serialize";
import { strokePath, dotRadius, polylinePath, eraseLayers } from "@/lib/drawesome/geometry";
import type { PenId, Point, Stroke, Board } from "@/lib/drawesome/types";
import { ToolIcon } from "./ToolIcon";

type ToolKind = PenId | "eraser";

function runPoints(from: Point, to: Point, pressure: number): Point[] {
  const run = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const steps = Math.max(1, Math.round(run / 3));
  const out: Point[] = [];
  for (let i = 1; i <= steps; i++) {
    const f = i / steps;
    out.push([
      from[0] + (to[0] - from[0]) * f,
      from[1] + (to[1] - from[1]) * f,
      pressure,
    ]);
  }
  return out;
}

export default function DrawesomeStudio() {
  const drawing = useDrawing();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [board, setBoard] = useState<Board>({ w: 1600, h: 1000 });
  const [background, setBackground] = useState<string>("#0f172a");
  const [activeTool, setActiveTool] = useState<ToolKind>("pen");
  const [color, setColor] = useState<string>("#38bdf8");
  const [size, setSize] = useState<number>(6);
  const [opacity, setOpacity] = useState<number>(1.0);
  const [eraserSize, setEraserSize] = useState<number>(28);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [codeModal, setCodeModal] = useState<string | null>(null);
  const [gridOverlay, setGridOverlay] = useState<boolean>(true);

  const activePointer = useRef<number | null>(null);
  const drawingNow = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const sawPen = useRef(false);
  const uid = useId().replace(/:/g, "");

  // Update board size based on container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setBoard({ w: Math.round(width), h: Math.round(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync default pen parameters on pen change
  const selectPen = (id: PenId) => {
    setActiveTool(id);
    const penDef = PEN_BY_ID[id];
    setSize(penDef.defaultSize);
    setOpacity(penDef.defaultOpacity);
    if (penDef.defaultColor) setColor(penDef.defaultColor);
  };

  const toBoardCoords = useCallback((clientX: number, clientY: number) => {
    const el = svgRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const scale = Math.min(r.width / board.w, r.height / board.h);
    const offsetX = (r.width - board.w * scale) / 2;
    const offsetY = (r.height - board.h * scale) / 2;
    return {
      x: (clientX - r.left - offsetX) / scale,
      y: (clientY - r.top - offsetY) / scale,
    };
  }, [board]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "pen") sawPen.current = true;
    if (e.pointerType === "touch" && sawPen.current) return;
    if (activePointer.current !== null) return;
    e.preventDefault();

    activePointer.current = e.pointerId;
    try { svgRef.current?.setPointerCapture(e.pointerId); } catch {}

    const { x, y } = toBoardCoords(e.clientX, e.clientY);
    drawingNow.current = true;

    const p: Point = [x, y, e.pressure || 0.5];
    pointsRef.current = [p];
    setCurrentPoints([p]);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawingNow.current || e.pointerId !== activePointer.current) return;
    const { x, y } = toBoardCoords(e.clientX, e.clientY);
    const pts = pointsRef.current;
    const pressure = e.pressure || 0.5;

    const last = pts[pts.length - 1];
    if (last && Math.hypot(x - last[0], y - last[1]) < 1.1) return;

    pointsRef.current = [...pts, [x, y, pressure]];
    setCurrentPoints(pointsRef.current);
  };

  const endGesture = (e?: React.PointerEvent) => {
    if (e && e.pointerId !== activePointer.current) return;
    activePointer.current = null;
    if (!drawingNow.current) return;
    drawingNow.current = false;

    const pts = pointsRef.current;
    pointsRef.current = [];
    setCurrentPoints([]);
    if (!pts.length) return;

    if (activeTool === "eraser") {
      drawing.commit([
        ...drawing.strokes,
        {
          id: Date.now(),
          pen: "pen",
          color: "#000",
          size: eraserSize,
          opacity: 1,
          points: pts,
          erase: true,
        },
      ]);
    } else {
      drawing.commit([
        ...drawing.strokes,
        {
          id: Date.now(),
          pen: activeTool,
          color,
          size,
          opacity,
          points: pts,
        },
      ]);
    }
  };

  // Export handlers
  const handleExportSVG = useCallback(() => {
    const svgStr = toSvg(drawing.strokes, board.w, board.h, background);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `drawesome-vector-${Date.now()}.svg`;
    a.click();
  }, [drawing.strokes, board, background]);

  const handleExportPNG = useCallback(async () => {
    try {
      const blob = await toPng(drawing.strokes, board.w, board.h, background, 2);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `drawesome-vector-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error("PNG export error:", err);
    }
  }, [drawing.strokes, board, background]);

  const handleExportJSON = useCallback(() => {
    const jsonStr = JSON.stringify(drawing.strokes, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `drawesome-strokes-${Date.now()}.json`;
    a.click();
  }, [drawing.strokes]);

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed)) {
          drawing.reset(parsed);
        }
      } catch (err) {
        alert("Invalid JSON stroke file format");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const layers = eraseLayers(drawing.strokes);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[680px] bg-slate-950 text-slate-100 font-sans border-b border-slate-800 overflow-hidden">

      {/* ═══ TOP BREADCRUMB & HEADER NAV BAR ═══ */}
      <header className="h-11 bg-slate-900/90 backdrop-blur border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 text-xs z-30">
        <div className="flex items-center gap-2 font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition flex items-center gap-1 text-slate-400">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/devtools" className="hover:text-white transition text-slate-400">
            Developer Tools
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-extrabold text-white flex items-center gap-1.5">
            Drawesome Vector Studio ✦ (by Benji Taylor)
          </span>
        </div>

        {/* Quick Canvas Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={drawing.undo}
            disabled={!drawing.canUndo}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700/80 text-slate-200 rounded-lg transition cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={drawing.redo}
            disabled={!drawing.canRedo}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700/80 text-slate-200 rounded-lg transition cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={drawing.clear}
            disabled={!drawing.strokes.length}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 disabled:opacity-40 border border-slate-700/80 text-slate-300 hover:text-rose-300 rounded-lg transition cursor-pointer"
            title="Clear Drawing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Background selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            {[
              { value: "#0f172a", label: "Dark" },
              { value: "#ffffff", label: "Light" },
              { value: "transparent", label: "Clear" },
              { value: "checker", label: "Grid" },
            ].map((bg) => (
              <button
                key={bg.value}
                onClick={() => setBackground(bg.value)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                  background === bg.value
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={handleExportSVG}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer"
          >
            <Download className="w-3 h-3" /> SVG
          </button>
          <button
            onClick={handleExportPNG}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition cursor-pointer"
          >
            <ImageIcon className="w-3 h-3 text-indigo-400" /> PNG
          </button>

          <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-[11px] rounded-lg flex items-center gap-1 cursor-pointer transition">
            <Upload className="w-3 h-3 text-slate-400" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </header>

      {/* ═══ MAIN WORKSPACE & TOOLBAR ═══ */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Floating Left/Bottom Controls Overlay */}
        <aside className="w-72 sm:w-80 bg-slate-900 border-r border-slate-800/90 flex flex-col shrink-0 overflow-y-auto z-20 custom-scrollbar p-3 space-y-4 shadow-xl">

          {/* Pen Tool Selector */}
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-2">
              Select Drawing Instrument
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PENS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPen(p.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                    activeTool === p.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                      : "bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <ToolIcon id={p.id} color={color} size={20} />
                  <div>
                    <div className="text-xs font-bold">{p.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono">Shortcut: [{p.key.toUpperCase()}]</div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setActiveTool("eraser")}
                className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                  activeTool === "eraser"
                    ? "bg-rose-600/20 border-rose-500 text-white shadow-md"
                    : "bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <ToolIcon id="eraser" color="#f43f5e" size={20} />
                <div>
                  <div className="text-xs font-bold text-rose-300">Eraser</div>
                  <div className="text-[9px] text-slate-400 font-mono">Area Cutout</div>
                </div>
              </button>
            </div>
          </div>

          {/* Size & Opacity Controls */}
          <div className="space-y-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block">
              Stroke Settings
            </span>

            {activeTool === "eraser" ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                  <span>Eraser Size</span>
                  <span className="font-mono text-indigo-400">{eraserSize}px</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={100}
                  value={eraserSize}
                  onChange={(e) => setEraserSize(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                    <span>Nib Size</span>
                    <span className="font-mono text-indigo-400">{size}px</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                    <span>Ink Opacity</span>
                    <span className="font-mono text-indigo-400">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={1.0}
                    step={0.05}
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          {/* Color Palette Swatches */}
          {activeTool !== "eraser" && (
            <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  Ink Color Palette
                </span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{color}</span>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {SWATCHES.map((sw) => (
                  <button
                    key={sw}
                    onClick={() => setColor(sw)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                      color === sw ? "border-indigo-400 scale-110 shadow-md" : "border-slate-700/60 hover:scale-105"
                    }`}
                    style={{ backgroundColor: sw }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Custom HEX:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0 overflow-hidden"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 px-2 py-1 rounded-lg w-24 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Export Code Modal Trigger */}
          <div className="pt-2">
            <button
              onClick={handleExportJSON}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Export JSON Stroke Data
            </button>
          </div>
        </aside>

        {/* Canvas Display Viewport */}
        <main
          ref={containerRef}
          className="flex-1 bg-slate-950 flex items-center justify-center overflow-hidden relative select-none p-2"
          style={{
            background:
              background === "checker"
                ? "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 0 0 / 24px 24px"
                : background === "transparent"
                ? "repeating-conic-gradient(#334155 0% 25%, #0f172a 0% 50%) 0 0 / 24px 24px"
                : background,
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${board.w} ${board.h}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endGesture}
            onPointerCancel={endGesture}
            className="w-full h-full cursor-crosshair touch-none"
          >
            {/* Eraser masks & stroke layers */}
            {layers.map((layer, i) => {
              const maskId = `mask-${uid}-${i}`;
              return (
                <g key={i}>
                  {layer.erasers.length > 0 && (
                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={board.w} height={board.h}>
                      <rect width={board.w} height={board.h} fill="#fff" />
                      {layer.erasers.map((eIdx) => {
                        const s = drawing.strokes[eIdx];
                        return (
                          <path
                            key={s.id}
                            d={polylinePath(s.points)}
                            stroke="#000"
                            strokeWidth={s.size}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        );
                      })}
                    </mask>
                  )}

                  <g mask={layer.erasers.length > 0 ? `url(#${maskId})` : undefined}>
                    {layer.ink.map((sIdx) => {
                      const s = drawing.strokes[sIdx];
                      const d = strokePath(s.pen, s.size, s.points, true, s.shape);
                      const style = PEN_BY_ID[s.pen].blend === "multiply" ? { mixBlendMode: "multiply" as const } : {};
                      if (d) {
                        return (
                          <path
                            key={s.id}
                            d={d}
                            fill={s.color}
                            fillOpacity={s.opacity}
                            style={style}
                          />
                        );
                      }
                      if (s.points.length) {
                        const [x, y] = s.points[0];
                        return (
                          <circle
                            key={s.id}
                            cx={x}
                            cy={y}
                            r={dotRadius(s.size)}
                            fill={s.color}
                            fillOpacity={s.opacity}
                            style={style}
                          />
                        );
                      }
                      return null;
                    })}
                  </g>
                </g>
              );
            })}

            {/* Current Active Live Stroke */}
            {currentPoints.length > 0 && (
              activeTool === "eraser" ? (
                <path
                  d={polylinePath(currentPoints)}
                  stroke="rgba(244, 63, 94, 0.5)"
                  strokeWidth={eraserSize}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : (
                <path
                  d={strokePath(activeTool, size, currentPoints, false)}
                  fill={color}
                  fillOpacity={opacity}
                  style={PEN_BY_ID[activeTool].blend === "multiply" ? { mixBlendMode: "multiply" } : {}}
                />
              )
            )}
          </svg>

          {drawing.strokes.length === 0 && currentPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6 space-y-3 bg-slate-950/40 backdrop-blur-[2px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-xl">
                <Pencil className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Start Drawing on Canvas</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Use your mouse, touch screen, or digital tablet stylus. Includes pressure-sensitive brush physics, calligraphy fountain nibs, and vector SVG exports.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
