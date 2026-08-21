
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitGraphState } from '@/hooks/useGitSimulation';

interface GitGraphProps {
    state: GitGraphState;
}

export function GitGraph({ state }: GitGraphProps) {
    // Simple layout algorithm
    // x = branch index * spacing
    // y = time/depth * spacing

    const layoutNodes = useMemo(() => {
        // Map branches to column indices
        const branchColumns: Record<string, number> = {};
        state.branches.forEach((b, i) => {
            branchColumns[b.name] = i;
        });

        // Create a robust map of commit ID -> depth (0 is oldest)
        const depths: Record<string, number> = {};

        // Rely on array order for chronological depth
        state.nodes.forEach((node, index) => {
            depths[node.id] = index;
        });

        return state.nodes.map((node) => {
            const branchIndex = node.branch ? (branchColumns[node.branch] ?? 0) : 0;
            return {
                ...node,
                x: 60 + branchIndex * 120, // Increased spacing
                y: 60 + (depths[node.id] * 80) // Increased vertical spacing
            };
        });
    }, [state.nodes, state.branches]);

    const svgHeight = Math.max(500, (layoutNodes.length * 80) + 100);
    const svgWidth = Math.max(800, (state.branches.length * 120) + 200);

    return (
        <div className="w-full h-full overflow-auto bg-slate-950">
            <svg width={svgWidth} height={svgHeight} className="min-w-full min-h-full font-sans">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                </defs>

                {/* Draw Edges */}
                {layoutNodes.map((node) => {
                    const parent = layoutNodes.find(n => n.id === node.parentId);

                    return (
                        <React.Fragment key={`edges-${node.id}`}>
                            {/* Primary Parent */}
                            {parent && parent.x && parent.y && node.x && node.y && (
                                <motion.line
                                    key={`edge-${node.id}`}
                                    x1={parent.x}
                                    y1={parent.y}
                                    x2={node.x}
                                    y2={node.y}
                                    stroke="#475569"
                                    strokeWidth="3" // Thicker lines
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}

                            {/* Secondary Parent (Merge) */}
                            {node.secondaryParentId && (() => {
                                const secParent = layoutNodes.find(n => n.id === node.secondaryParentId);
                                if (secParent && secParent.x && secParent.y && node.x && node.y) {
                                    return (
                                        <motion.line
                                            key={`sec-edge-${node.id}`}
                                            x1={secParent.x}
                                            y1={secParent.y}
                                            x2={node.x}
                                            y2={node.y}
                                            stroke="#64748b"
                                            strokeWidth="2"
                                            strokeDasharray="6 6" // More visible dash
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                    );
                                }
                                return null;
                            })()}
                        </React.Fragment>
                    );
                })}

                {/* Draw Nodes */}
                {layoutNodes.map((node) => {
                    const branch = state.branches.find(b => b.name === node.branch);
                    const isHead = state.headId === node.id;
                    const color = branch?.color || '#cbd5e1';

                    return (
                        <motion.g
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className="cursor-pointer group" // Added group class for hover effects
                        >
                            {/* Hit area for easier hovering */}
                            <circle cx={node.x} cy={node.y} r={20} fill="transparent" />

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={9} // Larger nodes
                                fill={color}
                                stroke={isHead ? '#fff' : 'rgba(0,0,0,0.5)'}
                                strokeWidth={isHead ? 3 : 1}
                                className="z-10 relative transition-all duration-200 group-hover:r-10"
                            >
                                <title>{node.message} ({node.id})</title>
                            </circle>

                            {/* Node Label (ID) */}
                            <text
                                x={(node.x || 0) + 16}
                                y={(node.y || 0) + 5}
                                className="text-xs font-bold fill-slate-400 font-mono pointer-events-none select-none tracking-wide"
                            >
                                {node.id.substring(0, 4)}
                            </text>

                            {/* Commit Message - Always visible but faded, fully visible on hover */}
                            <text
                                x={(node.x || 0) - 15}
                                y={(node.y || 0) - 15}
                                className="text-[10px] fill-slate-500 pointer-events-none select-none opacity-60 font-medium group-hover:opacity-100 group-hover:fill-white transition-all duration-200"
                                textAnchor="end"
                            >
                                {node.message.length > 25 ? node.message.slice(0, 22) + '...' : node.message}
                            </text>
                        </motion.g>
                    );
                })}

                {/* Draw Branch Labels (at latest commit of branch) */}
                {state.branches.map(branch => {
                    const commitNode = layoutNodes.find(n => n.id === branch.commitId);
                    if (!commitNode || !commitNode.x || !commitNode.y) return null;

                    return (
                        <motion.g
                            key={`branch-label-${branch.name}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <rect
                                x={(commitNode.x) + 50}
                                y={(commitNode.y) - 12}
                                width={(branch.name.length * 8) + 16}
                                height="24"
                                rx="6"
                                fill={branch.color}
                                fillOpacity="0.15"
                                stroke={branch.color}
                                strokeWidth="1.5"
                            />
                            <text
                                x={(commitNode.x) + 58}
                                y={(commitNode.y) + 4}
                                fill={branch.color}
                                className="text-xs font-bold tracking-wide"
                            >
                                {branch.name}
                            </text>
                        </motion.g>
                    );
                })}

            </svg>
        </div>
    );
}
