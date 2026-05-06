'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { RelatedTools } from '@/components/ui/RelatedTools';

type GridArea = {
  id: string; // internal tracking ID
  name: string; // semantic dev name e.g. "header", "sidebar"
  colStart: number;
  rowStart: number;
  colEnd: number;
  rowEnd: number;
};

export default function LayoutGeneratorClient({
  title = 'Advanced CSS Grid Builder',
  color,
}: {
  title?: string;
  color?: string;
}) {
  const [columns, setColumns] = useState(5);
  const [rows, setRows] = useState(5);
  const [colDefs, setColDefs] = useState<string[]>([]);
  const [rowDefs, setRowDefs] = useState<string[]>([]);
  const [gap, setGap] = useState(8);
  const [areas, setAreas] = useState<GridArea[]>([]);
  const [nextId, setNextId] = useState(1);

  // Initialize/Update definitions when count changes
  useEffect(() => {
    setColDefs(prev => {
      const next = [...prev];
      if (next.length < columns) {
        for (let i = next.length; i < columns; i++) next.push('1fr');
      } else if (next.length > columns) {
        return next.slice(0, columns);
      }
      return next;
    });
  }, [columns]);

  useEffect(() => {
    setRowDefs(prev => {
      const next = [...prev];
      if (next.length < rows) {
        for (let i = next.length; i < rows; i++) next.push('minmax(60px, auto)');
      } else if (next.length > rows) {
        return next.slice(0, rows);
      }
      return next;
    });
  }, [rows]);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('toolioz_layout_state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setColumns(data.columns);
        setRows(data.rows);
        setGap(data.gap);
        setAreas(data.areas);
        setNextId(data.nextId);
        if (data.colDefs) setColDefs(data.colDefs);
        if (data.rowDefs) setRowDefs(data.rowDefs);
      } catch (e) {
        console.error("Failed to load layout state", e);
      }
    }
  }, []);

  useEffect(() => {
    const state = { columns, rows, gap, areas, nextId, colDefs, rowDefs };
    localStorage.setItem('toolioz_layout_state', JSON.stringify(state));
  }, [columns, rows, gap, areas, nextId, colDefs, rowDefs]);
  
  // Dragging state
  const [activeDrag, setActiveDrag] = useState<{ id: string, newColEnd: number, newRowEnd: number } | null>(null);

  // Clamp areas when columns or rows decrease to prevent ghost columns extending the grid
  useEffect(() => {
    setAreas(prev => prev.map(a => {
      let changed = false;
      let newColEnd = a.colEnd;
      let newRowEnd = a.rowEnd;
      let newColStart = a.colStart;
      let newRowStart = a.rowStart;
      
      if (newColEnd > columns + 1) { newColEnd = columns + 1; changed = true; }
      if (newColStart > columns) { newColStart = columns; changed = true; }
      
      if (newRowEnd > rows + 1) { newRowEnd = rows + 1; changed = true; }
      if (newRowStart > rows) { newRowStart = rows; changed = true; }
      
      return changed ? { ...a, colStart: newColStart, colEnd: newColEnd, rowStart: newRowStart, rowEnd: newRowEnd } : a;
    }).filter(a => a.colStart < a.colEnd && a.rowStart < a.rowEnd));
  }, [columns, rows]);
  
  const handleCreateArea = (col: number, row: number) => {
    // Prevent creating if an area completely covers this single cell (optional, but good UX)
    const isCovered = areas.some(a => 
      col >= a.colStart && col < a.colEnd && 
      row >= a.rowStart && row < a.rowEnd
    );
    if (isCovered) return;

    setAreas(prev => [...prev, {
      id: nextId.toString(),
      name: `box-${nextId}`, // default generated semantic name
      colStart: col,
      rowStart: row,
      colEnd: col + 1,
      rowEnd: row + 1
    }]);
    setNextId(prev => prev + 1);
  };

  const handleDeleteArea = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAreas(prev => prev.filter(a => a.id !== id));
  };

  const handleRenameArea = (id: string, newName: string) => {
    setAreas(prev => prev.map(a => a.id === id ? { ...a, name: newName.replace(/[^a-zA-Z0-9_-]/g, '') } : a));
  };

  const resetGrid = () => {
    setAreas([]);
    setNextId(1);
  };

  const startResize = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Capture pointer to handle aggressive drags
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const area = areas.find(a => a.id === id);
    if (!area) return;
    
    let currentNewColEnd = area.colEnd;
    let currentNewRowEnd = area.rowEnd;

    setActiveDrag({ id, newColEnd: currentNewColEnd, newRowEnd: currentNewRowEnd });

    const onMove = (moveEvent: PointerEvent) => {
      const elements = document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY);
      const trackElement = elements.find(el => (el as HTMLElement).dataset?.col) as HTMLElement | undefined;

      if (trackElement && trackElement.dataset.col && trackElement.dataset.row) {
        const c = parseInt(trackElement.dataset.col);
        const r = parseInt(trackElement.dataset.row);
        currentNewColEnd = Math.max(area.colStart + 1, c + 1);
        currentNewRowEnd = Math.max(area.rowStart + 1, r + 1);
        
        setActiveDrag({ id, newColEnd: currentNewColEnd, newRowEnd: currentNewRowEnd });
      }
    };

    const onUp = (upEvent: PointerEvent) => {
      (upEvent.target as HTMLElement).releasePointerCapture?.(upEvent.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      
      setAreas(prev => prev.map(a => 
        a.id === id ? { ...a, colEnd: currentNewColEnd, rowEnd: currentNewRowEnd } : a
      ));
      setActiveDrag(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };


  // Number spinner components matching screenshot specs
  const NumberInput = ({ label, value, setter }: { label: string, value: number, setter: (v: number) => void }) => (
    <div className="flex flex-col items-center gap-2">
      <label className="text-[0.85rem] font-medium uppercase tracking-widest text-[var(--text-secondary)]">{label}</label>
      <div className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 transition-colors focus-within:border-[var(--primary)]">
        <input 
          type="number" 
          className="w-[25px] appearance-none border-none bg-transparent text-center text-[1.1rem] font-semibold text-[var(--text-primary)] outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none" 
          value={value} 
          onChange={(e) => setter(Number(e.target.value) || 1)}
          min={1} max={20}
        />
        <div className="flex cursor-pointer flex-col rounded-sm bg-transparent p-0.5">
          <ChevronUp size={12} color="#1a1b1e" onClick={() => setter(Math.min(value + 1, 20))} />
          <ChevronDown size={12} color="#1a1b1e" onClick={() => setter(Math.max(value - 1, 1))} />
        </div>
      </div>
    </div>
  );

  // Generate code panels
  const [showCode, setShowCode] = useState<'html' | 'css' | null>(null);

  const generateHTML = () => {
    let html = `<!-- Responsive CSS Grid Layout -->\n`;
    html += `<section class="grid-layout" id="main-grid-layout">\n`;
    areas.forEach((a) => {
      const safeName = a.name.toLowerCase() || `item-${a.id}`;
      html += `  <article class="grid-item ${safeName}-area" id="${safeName}">\n`;
      html += `    <!-- ${a.name} Content -->\n`;
      html += `  </article>\n`;
    });
    html += `</section>`;
    return html;
  };

  const generateCSS = () => {
    let css = `/* --- Grid Container Setup --- */\n`;
    css += `.grid-layout {\n`;
    css += `  display: grid;\n`;
    css += `  grid-template-columns: ${colDefs.join(' ')};\n`;
    css += `  grid-template-rows: ${rowDefs.join(' ')};\n`;
    css += `  gap: ${gap}px;\n`;
    css += `}\n\n`;
    
    css += `/* --- Base Grid Item Styles --- */\n`;
    css += `.grid-item {\n`;
    css += `  background: rgba(255, 255, 255, 0.05);\n`;
    css += `  border: 1px solid rgba(255, 255, 255, 0.1);\n`;
    css += `  border-radius: 8px;\n`;
    css += `  padding: 1rem;\n`;
    css += `}\n\n`;

    css += `/* --- Grid Placement & Overlapping Controls --- */\n`;
    areas.forEach((a, index) => {
      const safeName = a.name.toLowerCase() || `item-${a.id}`;
      css += `.${safeName}-area {\n`;
      css += `  grid-column: ${a.colStart} / ${a.colEnd};\n`;
      css += `  grid-row: ${a.rowStart} / ${a.rowEnd};\n`;
      css += `  z-index: ${10 + index}; /* Determines stack order on overlap */\n`;
      css += `}\n\n`;
    });

    css += `/* --- Mobile Responsive Fallback --- */\n`;
    css += `@media (max-width: 768px) {\n`;
    css += `  .grid-layout {\n`;
    css += `    display: flex;\n`;
    css += `    flex-direction: column;\n`;
    css += `  }\n`;
    areas.forEach((a) => {
      const safeName = a.name.toLowerCase() || `item-${a.id}`;
      css += `  .${safeName}-area {\n`;
      css += `    /* Reset grid placements for mobile */\n`;
      css += `    grid-column: auto;\n`;
      css += `    grid-row: auto;\n`;
      css += `  }\n`;
    });
    css += `}\n`;
    
    return css;
  };

  // Build tracks
  const tracks = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= columns; c++) {
      tracks.push({ c, r });
    }
  }

  const containerStyle = {
    // For the UI, we visualize 1fr as roughly 100px and auto as 100px to maintain editability
    gridTemplateColumns: colDefs.map(d => d.includes('fr') || d === 'auto' ? '100px' : d).join(' '),
    gridTemplateRows: rowDefs.map(d => d.includes('fr') || d === 'auto' ? '60px' : d).join(' '),
    gap: `${gap}px`
  };

  const updateColDef = (index: number, val: string) => {
    setColDefs(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const updateRowDef = (index: number, val: string) => {
    setRowDefs(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center overflow-x-hidden px-5 py-10 md:py-[40px]">
        {/* SEO Semantic Header Structure */}
        <header className="mb-10 max-w-[700px] text-center">
          <h1
            className="mb-4 text-[2rem] md:text-[2.5rem] font-extrabold tracking-tight text-[var(--text-primary)]"
            id="layout-generator-title"
            style={color ? { color } : undefined}
          >
            {title}
          </h1>
          <p className="text-[1rem] md:text-[1.1rem] leading-relaxed text-[var(--text-secondary)]" id="layout-generator-desc">
            Construct semantic, pixel-perfect CSS Grid layouts with overlapping hierarchy control. Drag tracks visually and export robust, responsive HTML5 templates in seconds.
          </p>
        </header>

        {/* Top Controls */}
        <section className="mb-6 md:mb-10 flex w-full flex-wrap justify-center gap-4 md:gap-[30px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4 md:px-10 md:py-6 shadow-[var(--shadow-md)]" aria-labelledby="grid-settings">
          <NumberInput label="Columns" value={columns} setter={setColumns} />
          <NumberInput label="Rows" value={rows} setter={setRows} />
          <NumberInput label="Gap(px)" value={gap} setter={setGap} />
        </section>

        {/* Track Editors */}
        <div className="flex w-full flex-col items-center overflow-x-auto py-5 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
          <div className="mb-2.5 ml-[38px] md:ml-[42px] grid w-max" style={{ gridTemplateColumns: containerStyle.gridTemplateColumns, gap: containerStyle.gap }}>
            {colDefs.map((def, i) => (
              <input key={`col-def-${i}`} className="h-full w-full min-w-[30px] rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-0.5 text-center text-[0.75rem] font-medium text-[var(--text-primary)] transition-all focus:border-[var(--primary)] focus:bg-[var(--bg-primary)] focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] focus:outline-none" value={def} onChange={(e) => updateColDef(i, e.target.value)} title={`Column ${i+1}`} />
            ))}
          </div>
          
          <div className="flex w-max gap-1.5 md:gap-2.5">
            <div className="grid w-[28px] md:w-[32px]" style={{ gridTemplateRows: containerStyle.gridTemplateRows, gap: containerStyle.gap }}>
              {rowDefs.map((def, i) => (
                <input key={`row-def-${i}`} className="h-full w-full min-w-[30px] rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-0.5 text-center text-[0.75rem] font-medium text-[var(--text-primary)] transition-all focus:border-[var(--primary)] focus:bg-[var(--bg-primary)] focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] focus:outline-none" value={def} onChange={(e) => updateRowDef(i, e.target.value)} title={`Row ${i+1}`} />
              ))}
            </div>

            {/* CSS Grid Canvas */}
            <div className="relative grid w-max select-none" style={containerStyle}>
              {tracks.map((cell, idx) => (
                <div 
                  key={`track-${idx}`}
                  data-col={cell.c}
                  data-row={cell.r}
                  className="flex cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--border)] bg-transparent text-[1.2rem] font-light text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:bg-[rgba(37,99,235,0.05)] hover:text-[var(--primary)]"
                  style={{ gridColumn: `${cell.c} / ${cell.c + 1}`, gridRow: `${cell.r} / ${cell.r + 1}` }}
                  onClick={() => handleCreateArea(cell.c, cell.r)}
                >
                  +
                </div>
              ))}

              {areas.map(area => (
                <div 
                  key={`area-${area.id}`}
                  className={`group relative z-10 flex items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border-2 border-[var(--primary)] bg-[var(--glass)] text-[1.25rem] font-semibold text-[var(--text-primary)] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.2)] backdrop-blur-[12px] ${activeDrag ? 'pointer-events-none' : ''}`}
                  id={`visual-area-${area.id}`}
                  style={{ 
                    gridColumn: `${area.colStart} / ${area.colEnd}`, 
                    gridRow: `${area.rowStart} / ${area.rowEnd}` 
                  }}
                >
                  <input 
                    type="text"
                    className={`w-[90%] min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap border-none border-b border-dashed border-b-transparent bg-transparent text-center text-[clamp(0.8rem,1.2vw,1.1rem)] font-semibold text-[var(--text-primary)] transition-colors focus:border-b-[var(--primary)] focus:outline-none placeholder:font-normal placeholder:text-[var(--text-secondary)] placeholder:opacity-50 ${activeDrag ? 'pointer-events-none' : 'pointer-events-auto'}`}
                    value={area.name}
                    onChange={(e) => handleRenameArea(area.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="class-name"
                    aria-label="Grid Area CSS Class Name"
                  />
                  <div 
                    className="absolute right-0 top-0 z-20 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-bl-[var(--radius-sm)] rounded-tr-[4px] bg-[#ef4444] text-[0.7rem] text-white transition-colors hover:bg-[#dc2626]" 
                    onClick={(e) => handleDeleteArea(e, area.id)}
                    aria-label="Delete Area"
                    role="button"
                    tabIndex={0}
                  >
                    <X size={12} />
                  </div>
                  <div 
                    className="absolute bottom-0 right-0 z-20 h-[20px] w-[20px] cursor-se-resize after:absolute after:bottom-[6px] after:right-[6px] after:h-[10px] after:w-[10px] after:rounded-br-[3px] after:border-b-3 after:border-r-3 after:border-[var(--primary)] after:transition-opacity after:duration-200 group-hover:after:border-[var(--primary-hover)]" 
                    onPointerDown={(e) => startResize(e, area.id)} 
                  />
                </div>
              ))}

              {activeDrag && (
                <div 
                  className="pointer-events-none relative z-0 rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--primary)] bg-[rgba(37,99,235,0.1)]"
                  style={{
                    gridColumn: `${areas.find(a => a.id === activeDrag.id)?.colStart} / ${activeDrag.newColEnd}`,
                    gridRow: `${areas.find(a => a.id === activeDrag.id)?.rowStart} / ${activeDrag.newRowEnd}`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex w-full justify-center px-2">
           <button className="cursor-pointer rounded-[var(--radius-xl)] border border-[var(--border)] bg-transparent px-6 py-2 text-[0.9rem] font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]" onClick={resetGrid}>Reset</button>
        </div>

        <div className="mt-[30px] md:mt-[50px] flex w-full flex-wrap justify-center gap-3">
          <button className="w-full sm:w-auto cursor-pointer rounded-[var(--radius-sm)] border-none bg-[var(--primary)] px-8 py-3 text-[1rem] font-semibold text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:-translate-y-[1px] hover:bg-[var(--primary-hover)] active:translate-y-[1px]" onClick={() => setShowCode(showCode === 'html' ? null : 'html')}>Copy HTML</button>
          <button className="w-full sm:w-auto cursor-pointer rounded-[var(--radius-sm)] border-none bg-[var(--primary)] px-8 py-3 text-[1rem] font-semibold text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:-translate-y-[1px] hover:bg-[var(--primary-hover)] active:translate-y-[1px]" onClick={() => setShowCode(showCode === 'css' ? null : 'css')}>Copy CSS</button>
        </div>

        {showCode && (
          <div className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.7)] p-4 backdrop-blur-[4px]" onClick={() => setShowCode(null)}>
            <div className="relative max-h-[90vh] w-[min(700px,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
              <button className="absolute right-[15px] top-[15px] flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]" onClick={() => setShowCode(null)}>
                 <X size={20} />
              </button>
              <pre className="max-h-[calc(90vh-90px)] max-w-full overflow-auto whitespace-pre rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] p-5 font-mono text-[0.95rem] leading-relaxed text-[var(--text-primary)]">
                {showCode === 'html' ? generateHTML() : generateCSS()}
              </pre>
            </div>
          </div>
        )}

        <RelatedTools currentToolId="layout-generator" categoryId="devtools" />
      </main>
      <Footer />
    </div>
  );
}
