import React from 'react';
import { GitGraphState } from '@/hooks/useGitSimulation';
import { ScrollArea } from '@/components/sociials-ui/scroll-area';
import { GitCommit, GitBranch, History } from 'lucide-react';

interface GitLogProps {
    state: GitGraphState;
}

export function GitLog({ state }: GitLogProps) {
    // Reverse nodes to show newest first
    const reversedNodes = [...state.nodes].reverse();

    return (
        <div className="flex flex-col h-full bg-slate-900 border-t border-slate-800">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-950/50">
                <History size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Git Log</span>
                <span className="text-[10px] text-slate-500 font-mono ml-auto">
                    {state.nodes.length} commits
                </span>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col font-mono text-sm">
                    {reversedNodes.map((node, index) => {
                        const branch = state.branches.find(b => b.name === node.branch);
                        const color = branch?.color || '#cbd5e1';

                        return (
                            <div key={node.id} className="flex items-start gap-4 px-4 py-2 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0 group">
                                {/* Commit ID */}
                                <span className="text-blue-400 w-16 flex-shrink-0" title={node.id}>
                                    {node.id.substring(0, 7)}
                                </span>

                                {/* Message */}
                                <div className="flex-1 min-w-0">
                                    <span className="text-slate-300 truncate block group-hover:text-slate-100 transition-colors">
                                        {node.message}
                                    </span>
                                </div>

                                {/* Branch / Meta */}
                                <div className="flex items-center gap-3 flex-shrink-0 text-xs text-slate-500">
                                    {node.branch && (
                                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                            {node.branch}
                                        </span>
                                    )}
                                    {node.secondaryParentId && (
                                        <span className="text-[10px] text-slate-600 border border-slate-800 px-1 rounded">
                                            Merge
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {reversedNodes.length === 0 && (
                        <div className="p-8 text-center text-slate-500 italic text-xs">
                            No commits yet.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
