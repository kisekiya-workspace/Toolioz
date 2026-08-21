import React, { useState, useEffect } from 'react';
import { File } from '@/hooks/useGitSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/sociials-ui/card';
import { ScrollArea } from '@/components/sociials-ui/scroll-area';
import { FileCode, Save, Plus, Trash2, FilePlus, Code } from 'lucide-react';
import { Button } from '@/components/sociials-ui/button';
import { Label } from '@/components/sociials-ui/label';

// Editor imports
import Editor from 'react-simple-code-editor';
// @ts-ignore
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-dark.css'; // Or custom style

interface FileExplorerProps {
    files: File[];
    onFileChange: (newFiles: File[]) => void;
    disabled?: boolean;
}

export function FileExplorer({ files: initialFiles, onFileChange, disabled }: FileExplorerProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(initialFiles[0]?.name || null);
    const [code, setCode] = useState('');

    // 1. Sync local code state when selection or files change
    useEffect(() => {
        const file = initialFiles.find(f => f.name === selectedFile);
        if (file) {
            setCode(file.content);
        } else if (initialFiles.length > 0) {
            // Fallback if selected file was deleted
            setSelectedFile(initialFiles[0].name);
        } else {
            setSelectedFile(null);
            setCode('');
        }
    }, [selectedFile, initialFiles]);

    const handleCreateFile = () => {
        const name = window.prompt("Enter file name (e.g., utils.js):");
        if (!name) return;
        if (initialFiles.some(f => f.name === name)) {
            alert("File already exists!");
            return;
        }
        const newFile: File = { name, content: '// New file' };
        onFileChange([...initialFiles, newFile]);
        setSelectedFile(name);
    };

    const handleDeleteFile = (name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete ${name}?`)) {
            const newFiles = initialFiles.filter(f => f.name !== name);
            onFileChange(newFiles);
        }
    };

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (selectedFile) {
            onFileChange(initialFiles.map(f =>
                f.name === selectedFile ? { ...f, content: newCode } : f
            ));
        }
    };

    const highlight = (code: string) => {
        return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    };

    return (
        <Card className="bg-slate-950 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-slate-800 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Code size={16} className="text-blue-400" />
                    Editor
                </CardTitle>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-slate-400 hover:text-green-400 hover:bg-slate-900"
                    onClick={handleCreateFile}
                    disabled={disabled}
                    title="New File"
                >
                    <Plus size={16} />
                </Button>
            </CardHeader>
            <div className="flex flex-1 overflow-hidden">
                {/* File List */}
                <div className="w-40 border-r border-slate-800 bg-slate-900/30 flex flex-col">
                    <ScrollArea className="flex-1">
                        <div className="p-2 flex flex-col gap-1">
                            {initialFiles.map(file => (
                                <div
                                    key={file.name}
                                    onClick={() => setSelectedFile(file.name)}
                                    className={`group flex justify-between items-center px-3 py-2 text-xs rounded-md transition-all cursor-pointer ${selectedFile === file.name
                                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                                        }`}
                                >
                                    <span className="truncate flex-1">{file.name}</span>
                                    <button
                                        onClick={(e) => handleDeleteFile(file.name, e)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                                        disabled={disabled}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {initialFiles.length === 0 && (
                                <div className="text-center p-4 text-xs text-slate-600 italic">
                                    No files
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
                    {/* Custom scrollbar for editor if needed */}
                    {selectedFile ? (
                        <div className="flex-1 overflow-auto custom-scrollbar font-mono text-sm">
                            <Editor
                                value={code}
                                onValueChange={handleCodeChange}
                                highlight={highlight}
                                padding={20}
                                style={{
                                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                                    fontSize: 14,
                                    minHeight: '100%',
                                    color: '#d4d4d4', // VS Code default text color
                                }}
                                textareaClassName="focus:outline-none"
                                disabled={disabled}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-2">
                            <FilePlus size={48} className="opacity-20" />
                            <p className="text-sm">Select or create a file to edit</p>
                        </div>
                    )}

                    {/* Simple footer */}
                    <div className="h-6 bg-blue-950/20 border-t border-slate-800 flex items-center px-4 justify-end">
                        <span className="text-[10px] text-slate-500 font-mono">
                            {selectedFile ? `${code.length} chars` : 'No file'}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
