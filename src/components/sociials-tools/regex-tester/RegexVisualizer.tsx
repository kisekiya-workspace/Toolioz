
import React, { useEffect, useRef, useState } from 'react';
import * as rr from 'railroad-diagrams';
import regexpTree from 'regexp-tree';

// Inject styles for railroad diagrams
const RAILROAD_CSS = `
svg.railroad-diagram {
    background-color: transparent; /* Changed from hsl(30,20%,95%) */
}
svg.railroad-diagram path {
    stroke-width: 2; /* Thicker lines for visibility */
    stroke: currentColor; /* Use text color */
    fill: none;
}
svg.railroad-diagram text {
    font: 12px monospace;
    text-anchor: middle;
    fill: currentColor;
}
svg.railroad-diagram .non-terminal text {
    font-style: italic;
}
svg.railroad-diagram rect {
    stroke-width: 2;
    stroke: currentColor;
    fill: transparent; /* Transparent background for rects */
}
svg.railroad-diagram path.start, svg.railroad-diagram path.end {
    fill: transparent; /* No fill for start/end markers */
    stroke: currentColor;
}
`;

interface RegexVisualizerProps {
    regexStr: string;
}

export function RegexVisualizer({ regexStr }: RegexVisualizerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous diagram
        containerRef.current.innerHTML = '';
        setError(null);

        if (!regexStr) return;

        try {
            // 1. Parse Regex to AST
            const ast = regexpTree.parse(new RegExp(regexStr));

            // 2. Transform AST to Railroad Diagram Nodes
            const diagram = buildDiagram(ast.body);

            // 3. Render
            if (diagram) {
                // railroad-diagrams creates a DIV/SVG set.
                // We wrap it in a Diagram() call which returns the SVG element.
                // Add padding (top, right, bottom, left) to prevent cutting off
                const svg = rr.Diagram(diagram).format(30, 30, 30, 30);
                containerRef.current.appendChild(svg.toSVG());
            }
        } catch (e: any) {
            // If it's a simple regex error that the parser catches
            setError(e.message || "Invalid Regex");
        }
    }, [regexStr]);

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="w-full p-6 bg-muted/20 rounded-lg overflow-x-auto custom-scrollbar">
                <style>{RAILROAD_CSS}</style>
                {error ? (
                    <div className="text-red-400 font-mono text-sm">{error}</div>
                ) : (
                    <div ref={containerRef} className="text-slate-800 dark:text-slate-200 min-w-fit" />
                )}
            </div>

            {/* Diagram Legend - Simplified */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground w-full border-t pt-4 justify-center">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full border border-current opacity-70"></span>
                    <span>Start/End</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="px-1 border border-current rounded-[2px] opacity-70 font-mono scale-90">abc</span>
                    <span>Literal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="px-1 border border-current rounded-full opacity-70 font-mono scale-90 italic">w</span>
                    <span>Char Class</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 flex items-center justify-center border border-dashed border-current rounded opacity-70 scale-90"></span>
                    <span>Group</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex flex-col text-[8px] leading-[6px] opacity-70">
                        <span>—</span>
                        <span>—</span>
                    </div>
                    <span>OR</span>
                </div>
            </div>
        </div>
    );
}

// --- Transformer Logic ---

// Helper types from regexp-tree (simplified)
type Node = any;

function buildDiagram(node: Node): any {
    if (!node) return null;

    switch (node.type) {
        case 'Disjunction': // OR (|)
            // Disjunction has left/right only? No, regexp-tree might differ.
            // Actually regexp-tree Disjunction is binary usually? Let's check docs or assume standard.
            // regexp-tree: Disjunction { left, right }
            // We need to flatten it if possible, or just nest Choices.
            return rr.Choice(0, buildDiagram(node.left), buildDiagram(node.right));

        case 'Alternative': // Sequence (concatenation)
            // Alternative { expressions: [] }
            if (node.expressions && Array.isArray(node.expressions)) {
                return rr.Sequence(...node.expressions.map(buildDiagram));
            }
            return null;

        case 'Char':
            if (node.kind === 'meta') {
                // e.g. \w, \d, .
                return rr.NonTerminal(node.value); // Usually represented generically
            }
            return rr.Terminal(node.value);

        case 'CharacterClass': // [...]
            // node.expressions list of ranges or chars.
            // If it's negative: [^...]
            const content = node.expressions.map((e: any) => {
                if (e.type === 'ClassRange') return `${e.from.value}-${e.to.value}`;
                if (e.type === 'Char') return e.value;
                return '?'; // fallback
            }).join('');

            const label = node.negative ? `[^${content}]` : `[${content}]`;
            return rr.Terminal(label);

        case 'Group':
            // capturing, non-capturing, named
            const child = buildDiagram(node.expression);
            if (node.capturing) {
                const caption = node.number ? `Group ${node.number}` : 'Group';
                // rr.Group does not exist in this library version.
                // We use a Sequence with a Comment to label it.
                return rr.Sequence(rr.Comment(caption), child);
            }
            return child; // Non-capturing just passes through

        case 'Repetition':
            // quantifier: { kind: '*', '+', '?', 'Range' }
            const subject = buildDiagram(node.expression);
            const q = node.quantifier;

            if (q.kind === '*') return rr.ZeroOrMore(subject);
            if (q.kind === '+') return rr.OneOrMore(subject);
            if (q.kind === '?') return rr.Optional(subject);
            if (q.kind === 'Range') {
                const from = q.from;
                const to = q.to;
                if (to) return rr.OneOrMore(subject, rr.Comment(`${from}..${to}`));
                return rr.OneOrMore(subject, rr.Comment(`${from}+`)); // {3,}
            }
            return subject;

        case 'Assertion':
            // ^ $ \b
            if (node.kind === '^') return rr.Terminal('Start');
            if (node.kind === '$') return rr.Terminal('End');
            if (node.kind === '\\b') return rr.Terminal('Word Boundary');
            return rr.Terminal(node.kind); // lookaheads etc?

        default:
            // Fallback for unknown nodes
            return rr.Terminal(node.type);
    }
}
