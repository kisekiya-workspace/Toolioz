
import React, { useState } from 'react';
import { GitGraphState } from '@/hooks/useGitSimulation';
import { Button } from '@/components/sociials-ui/button';
import { Input } from '@/components/sociials-ui/input';
import { Label } from '@/components/sociials-ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/sociials-ui/select';
import { GitCommit, GitBranch, GitMerge, RotateCcw, PlayCircle, ArrowRight, ArrowUpCircle } from 'lucide-react';

interface ControlsProps {
    state: GitGraphState;
    onCommit: (message: string) => void;
    onNewBranch: (name: string, baseBranch?: string) => void;
    onCheckout: (branch: string) => void;
    onMerge: (branch: string) => void;
    onRebase?: (branch: string) => void;
    onReset: () => void;
    onLoadScenario?: (scenario: 'conflict-101' | 'diverged-branches') => void;
    disabled?: boolean;
}

export function Controls({ state, onCommit, onNewBranch, onCheckout, onMerge, onRebase, onReset, onLoadScenario, disabled }: ControlsProps) {
    const [commitMsg, setCommitMsg] = useState('Update files');
    const [newBranchName, setNewBranchName] = useState('');
    const [mergeBranch, setMergeBranch] = useState('');
    const [rebaseBranch, setRebaseBranch] = useState('');
    const [sourceBranchForNewBranch, setSourceBranchForNewBranch] = useState<string>(state.currentBranch);

    // Update source branch default when current branch changes (optional UX)
    // useEffect(() => { setSourceBranchForNewBranch(state.currentBranch); }, [state.currentBranch]);

    // Filter out current branch from merge/rebase options
    const otherBranches = state.branches.filter(b => b.name !== state.currentBranch);

    return (
        <div className="flex flex-col gap-5">

            {/* Scenarios (New) */}
            <div className="flex flex-col gap-3 p-4 bg-blue-950/30 rounded-xl border border-blue-900/50 hover:border-blue-800/80 transition-colors">
                <Label className="text-blue-200 font-semibold flex items-center gap-2"><PlayCircle size={14} className="text-blue-400" /> Practice Scenarios</Label>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] font-medium border-blue-800 bg-blue-900/10 text-blue-200 hover:bg-blue-900/50 hover:text-white"
                        onClick={() => onLoadScenario?.('conflict-101')}
                        disabled={disabled}
                    >
                        Conflict 101
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] font-medium border-blue-800 bg-blue-900/10 text-blue-200 hover:bg-blue-900/50 hover:text-white"
                        onClick={() => onLoadScenario?.('diverged-branches')}
                        disabled={disabled}
                    >
                        Diverged (Rebase)
                    </Button>
                </div>
            </div>

            <div className="w-full h-px bg-slate-800/50 my-1" />

            {/* Commit */}
            <div className="flex flex-col gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                <Label className="text-slate-200 font-medium flex items-center gap-2"><GitCommit size={14} className="text-slate-400" /> Commit Changes</Label>
                <div className="space-y-2">
                    <Input
                        value={commitMsg}
                        onChange={(e) => setCommitMsg(e.target.value)}
                        placeholder="Commit message"
                        className="bg-slate-950 border-slate-700 h-9 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                        disabled={disabled}
                    />
                    <Button onClick={() => onCommit(commitMsg)} disabled={disabled} size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20">
                        Commit
                    </Button>
                </div>
            </div>

            {/* Branch */}
            <div className="flex flex-col gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                <Label className="text-slate-200 font-medium flex items-center gap-2"><GitBranch size={14} className="text-green-400" /> Create Branch</Label>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Input
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            placeholder="New Branch Name"
                            className="bg-slate-950 border-slate-700 h-9 text-sm text-slate-200 placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20"
                            disabled={disabled}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select onValueChange={setSourceBranchForNewBranch} value={sourceBranchForNewBranch} disabled={disabled}>
                            <SelectTrigger className="bg-slate-950 border-slate-700 h-9 text-sm text-slate-200 flex-1 focus:ring-green-500/20">
                                <SelectValue placeholder="From (Base Branch)" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                {state.branches.map(b => (
                                    <SelectItem key={b.name} value={b.name} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }}></span>
                                            {b.name} {b.name === state.currentBranch && <span className="text-slate-500 text-xs ml-auto">(Current)</span>}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={() => { onNewBranch(newBranchName, sourceBranchForNewBranch); setNewBranchName(''); }}
                            disabled={disabled || !newBranchName}
                            size="sm"
                            variant="secondary"
                            className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 whitespace-nowrap"
                        >
                            Create Branch
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-slate-800/50 my-1" />

            {/* Checkout */}
            <div className="flex flex-col gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                <Label className="text-slate-200 font-medium flex items-center gap-2"><ArrowRight size={14} className="text-yellow-400" /> Switch Branch</Label>
                <Select onValueChange={onCheckout} value={state.currentBranch} disabled={disabled}>
                    <SelectTrigger className="bg-slate-950 border-slate-700 h-9 text-sm text-slate-200 focus:ring-yellow-500/20">
                        <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                        {state.branches.map(b => (
                            <SelectItem key={b.name} value={b.name} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }}></span>
                                    {b.name} {b.name === state.currentBranch && <span className="text-slate-500 text-xs ml-auto">(Current)</span>}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Merge */}
            <div className="flex flex-col gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                <Label className="text-slate-200 font-medium flex items-center gap-2"><GitMerge size={14} className="text-purple-400" /> Merge Branch</Label>
                <div className="flex gap-2">
                    <Select onValueChange={setMergeBranch} disabled={disabled || otherBranches.length === 0}>
                        <SelectTrigger className="bg-slate-950 border-slate-700 h-9 text-sm text-slate-200 flex-1 focus:ring-purple-500/20">
                            <SelectValue placeholder="Merge from..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {otherBranches.map(b => (
                                <SelectItem key={b.name} value={b.name} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }}></span>
                                        {b.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => onMerge(mergeBranch)} disabled={disabled || !mergeBranch} size="sm" variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200 hover:border-purple-500/50">
                        Merge
                    </Button>
                </div>
            </div>

            {/* Rebase (New) */}
            <div className="flex flex-col gap-3 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
                <Label className="text-slate-200 font-medium flex items-center gap-2" title="Rewrites history to be linear"><ArrowUpCircle size={14} className="text-pink-400" /> Rebase (Advanced)</Label>
                <div className="flex gap-2">
                    <Select onValueChange={setRebaseBranch} disabled={disabled || otherBranches.length === 0}>
                        <SelectTrigger className="bg-slate-950 border-slate-700 h-9 text-sm text-slate-200 flex-1 focus:ring-pink-500/20">
                            <SelectValue placeholder="Rebase onto..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {otherBranches.map(b => (
                                <SelectItem key={b.name} value={b.name} className="focus:bg-slate-800 focus:text-white cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }}></span>
                                        {b.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => onRebase?.(rebaseBranch)} disabled={disabled || !rebaseBranch} size="sm" variant="outline" className="border-pink-500/30 text-pink-300 hover:bg-pink-900/20 hover:text-pink-200 hover:border-pink-500/50">
                        Rebase
                    </Button>
                </div>
            </div>

        </div>
    );
}
