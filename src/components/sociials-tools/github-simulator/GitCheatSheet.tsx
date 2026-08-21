import React, { useState } from 'react';
import { Button } from '@/components/sociials-ui/button';
import { CircleHelp, GitCommit, GitBranch, GitMerge, RotateCcw, X } from 'lucide-react';

export function GitCheatSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="text-slate-400 hover:text-white"
                title="Git Cheat Sheet"
            >
                <CircleHelp size={20} />
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-slate-900 border border-slate-800 text-slate-200 w-full max-w-3xl rounded-xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xl font-bold text-white">
                                <CircleHelp className="text-blue-500" /> Git Cheat Sheet
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </Button>
                        </div>
                        <p className="text-slate-400 mb-6 text-sm">
                            Learn the core concepts of Git by interacting with the simulator.
                        </p>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-2 font-semibold text-blue-400">
                                    <GitCommit size={16} /> Commit
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    A snapshot of your project at a specific point in time. Think of it like a "Save Point" in a game. You can always go back to it.
                                </p>
                                <code className="block text-[10px] bg-slate-900 p-2 rounded font-mono text-slate-500 border border-slate-800/50">
                                    git commit -m "active effects implemented"
                                </code>
                            </div>

                            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-2 font-semibold text-green-400">
                                    <GitBranch size={16} /> Branch
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    A parallel version of your project. Use branches to work on features without messing up the main code.
                                </p>
                                <code className="block text-[10px] bg-slate-900 p-2 rounded font-mono text-slate-500 border border-slate-800/50">
                                    git checkout -b new-feature
                                </code>
                            </div>

                            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-2 font-semibold text-purple-400">
                                    <GitMerge size={16} /> Merge
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Combining changes from one branch into another. This is where "Conflicts" often happen if both changed the same file!
                                </p>
                                <code className="block text-[10px] bg-slate-900 p-2 rounded font-mono text-slate-500 border border-slate-800/50">
                                    git merge feature-branch
                                </code>
                            </div>

                            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-2 font-semibold text-red-400">
                                    <RotateCcw size={16} /> Reset
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Moves your "HEAD" (view) to an earlier commit.
                                    <br /><span className="text-red-400/80">Warning:</span> In real Git, hard resets can lose work!
                                </p>
                                <code className="block text-[10px] bg-slate-900 p-2 rounded font-mono text-slate-500 border border-slate-800/50">
                                    git reset --hard HEAD~1
                                </code>
                            </div>
                        </div>

                        <div className="mt-6 p-3 bg-blue-950/20 border border-blue-900/30 rounded text-xs text-blue-300 flex gap-2">
                            <span className="font-bold bg-blue-900/40 px-1 rounded uppercase text-[10px] tracking-wider h-fit py-0.5">Pro Tip</span>
                            <span>Try creating a conflict! Edit the same file in two different branches and try to merge them. You'll activate the Conflict Resolver.</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
