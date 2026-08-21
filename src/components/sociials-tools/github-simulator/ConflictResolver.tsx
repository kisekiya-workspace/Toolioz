
import React, { useState, useEffect } from 'react';
import { ConflictData, File } from '@/hooks/useGitSimulation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/sociials-ui/card';
import { Button } from '@/components/sociials-ui/button';
import { AlertTriangle, Check, Code, ArrowDown } from 'lucide-react';
import { Textarea } from '@/components/sociials-ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface ConflictResolverProps {
    conflict: ConflictData;
    onResolve: (resolvedFiles: File[]) => void;
}

export function ConflictResolver({ conflict, onResolve }: ConflictResolverProps) {
    const [resolutions, setResolutions] = useState<Record<string, string>>({});
    const [activeFile, setActiveFile] = useState<string>(conflict.files[0]?.name || '');
    const [flashEffect, setFlashEffect] = useState<'ours' | 'theirs' | null>(null);

    useEffect(() => {
        const initResolutions: Record<string, string> = {};
        conflict.files.forEach(f => {
            initResolutions[f.name] = f.targetContent;
        });
        setResolutions(initResolutions);
        if (conflict.files.length > 0 && !activeFile) setActiveFile(conflict.files[0].name);
    }, [conflict]);

    const handleContentChange = (content: string, source?: 'ours' | 'theirs') => {
        setResolutions(prev => ({
            ...prev,
            [activeFile]: content
        }));

        if (source) {
            setFlashEffect(source);
            setTimeout(() => setFlashEffect(null), 300);
        }
    };

    const currentFileConflict = conflict.files.find(f => f.name === activeFile);

    const handleComplete = () => {
        const resolvedResult: File[] = conflict.files.map(f => ({
            name: f.name,
            content: resolutions[f.name] || f.targetContent
        }));
        onResolve(resolvedResult);
    };

    if (!currentFileConflict) return <div>Loading...</div>;

    return (
        <Card className="bg-slate-900 border-red-900/50 animate-in fade-in zoom-in-95 duration-200 w-full max-w-5xl h-[80vh] flex flex-col">
            <CardHeader className="bg-red-950/20 border-b border-red-900/30 py-4 flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-red-400 text-lg">
                            <AlertTriangle />
                            Merge Conflict
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                            Merging <span className="text-blue-300 font-mono bg-blue-900/20 px-1 rounded">{conflict.sourceBranch}</span> into <span className="text-green-300 font-mono bg-green-900/20 px-1 rounded">{conflict.targetBranch}</span>.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Conflicted Files</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                            {conflict.files.map(f => (
                                <button
                                    key={f.name}
                                    onClick={() => setActiveFile(f.name)}
                                    className={`px-3 py-1 text-xs rounded border transition-all ${activeFile === f.name
                                            ? 'bg-red-500/20 border-red-500/50 text-red-200 shadow-red-900'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
                    {/* Left: Comparison View */}
                    <div className="border-r border-slate-700 flex flex-col bg-slate-950 overflow-hidden">
                        <div className="p-2 bg-slate-900/50 border-b border-slate-800 text-xs font-mono text-slate-400 text-center flex-shrink-0">
                            Source Differences
                        </div>
                        <div className="flex-1 overflow-auto p-4 space-y-6">
                            {/* Ours */}
                            <div className={`space-y-2 transition-opacity duration-200 ${flashEffect === 'theirs' ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="flex justify-between text-xs text-green-400 font-semibold px-1 items-center">
                                    <span>Current Branch (Target)</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={`h-6 text-[10px] border-green-800 hover:bg-green-900/40 relative overflow-hidden transition-all duration-200 ${flashEffect === 'ours' ? 'bg-green-600 text-white border-green-500' : 'text-green-400'}`}
                                        onClick={() => handleContentChange(currentFileConflict.targetContent, 'ours')}
                                    >
                                        <ArrowDown size={10} className="mr-1" /> Use This Block
                                    </Button>
                                </div>
                                <div className="p-3 bg-green-950/10 border border-green-900/30 rounded text-sm font-mono text-slate-300 whitespace-pre-wrap">
                                    {currentFileConflict.targetContent}
                                </div>
                            </div>

                            {/* Theirs */}
                            <div className={`space-y-2 transition-opacity duration-200 ${flashEffect === 'ours' ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="flex justify-between text-xs text-blue-400 font-semibold px-1 items-center">
                                    <span>Incoming Branch (Source)</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className={`h-6 text-[10px] border-blue-800 hover:bg-blue-900/40 relative overflow-hidden transition-all duration-200 ${flashEffect === 'theirs' ? 'bg-blue-600 text-white border-blue-500' : 'text-blue-400'}`}
                                        onClick={() => handleContentChange(currentFileConflict.sourceContent, 'theirs')}
                                    >
                                        <ArrowDown size={10} className="mr-1" /> Use This Block
                                    </Button>
                                </div>
                                <div className="p-3 bg-blue-950/10 border border-blue-900/30 rounded text-sm font-mono text-slate-300 whitespace-pre-wrap">
                                    {currentFileConflict.sourceContent}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Final Resolution Editor */}
                    <div className="flex flex-col bg-[#1e1e1e] overflow-hidden relative">
                        <div className="p-2 bg-slate-800 border-b border-slate-700 text-xs font-mono text-slate-300 flex justify-between items-center px-4 flex-shrink-0 z-10">
                            <span className="flex items-center gap-2"><Code size={12} /> Result: {activeFile}</span>
                            <span className="text-[10px] text-slate-500">Editable Final Result</span>
                        </div>

                        {/* Flash Overlay for Feedback */}
                        <AnimatePresence>
                            {flashEffect && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.1 }}
                                    exit={{ opacity: 0 }}
                                    className={`absolute inset-0 pointer-events-none z-0 ${flashEffect === 'ours' ? 'bg-green-500' : 'bg-blue-500'}`}
                                />
                            )}
                        </AnimatePresence>

                        <div className="flex-1 relative z-0">
                            <Textarea
                                value={resolutions[activeFile] || ''}
                                onChange={(e) => handleContentChange(e.target.value)}
                                className="absolute inset-0 w-full h-full bg-transparent border-0 rounded-none resize-none focus-visible:ring-0 font-mono text-sm p-4 leading-relaxed text-slate-300"
                                placeholder="// Edit the final content here..."
                            />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="justify-between bg-slate-900 py-4 border-t border-slate-800 flex-shrink-0">
                <div className="text-xs text-slate-500">
                    Ensure the code in the right panel is syntactically correct before resolving.
                </div>
                <Button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-green-900/20"
                >
                    <Check size={16} /> Mark as Resolved
                </Button>
            </CardFooter>
        </Card>
    );
}
