
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { ScrollArea } from '@/components/sociials-ui/scroll-area';

interface GitTerminalProps {
    logs: string[];
}

export function GitTerminal({ logs }: GitTerminalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    // Syntax highlighting helper
    const renderLogLine = (log: string) => {
        const parts = log.split(' ');
        return parts.map((part, index) => {
            let colorClass = 'text-slate-300';

            if (part === 'git') colorClass = 'text-orange-400 font-bold';
            else if (['commit', 'checkout', 'merge', 'reset', 'branch', 'add'].includes(part)) colorClass = 'text-yellow-400';
            else if (part.startsWith('"') || part.endsWith('"')) colorClass = 'text-green-300';
            else if (part.startsWith('-')) colorClass = 'text-blue-300';
            else if (part.includes('Failed') || part.includes('Error')) colorClass = 'text-red-400 font-bold';
            else if (part.includes('Success')) colorClass = 'text-green-400 font-bold';
            else if (part.startsWith('(') && part.endsWith(')')) colorClass = 'text-slate-500 italic'; // Info/Context

            return (
                <span key={index} className={colorClass}>
                    {part}{index < parts.length - 1 ? ' ' : ''}
                </span>
            );
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0f1e] border-t border-slate-800 font-mono text-sm leading-relaxed">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                <Terminal size={14} className="text-slate-400" />
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-xs">Terminal</span>
            </div>

            {/* Output Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-1.5 font-mono">
                    <div className="text-slate-500 mb-2 italic"># Welcome to Git Simulator Terminal v2.1</div>
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2 group items-start">
                            <span className="text-green-500 select-none flex-shrink-0 mt-0.5">➜</span>
                            <span className="text-blue-400 select-none flex-shrink-0 mt-0.5">~</span>
                            <span className="break-all">{renderLogLine(log)}</span>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
