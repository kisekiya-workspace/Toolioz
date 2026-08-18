
import React, { useMemo } from 'react';
import cronParser from 'cron-parser';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';

interface CronVisualizerProps {
    cronExpression: string;
}

export function CronVisualizer({ cronExpression }: CronVisualizerProps) {
    const nextRuns = useMemo(() => {
        if (!cronExpression) return [];
        try {
            const interval = cronParser.parse(cronExpression);
            // Get next 5 runs
            const runs = [];
            for (let i = 0; i < 5; i++) {
                runs.push(interval.next().toDate());
            }
            return runs;
        } catch (e) {
            return [];
        }
    }, [cronExpression]);

    if (nextRuns.length === 0) return null;

    return (
        <div className="w-full space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Execution Times</h3>
            <div className="relative border-l-2 border-primary/20 ml-2 space-y-8 py-2">
                {nextRuns.map((date, i) => (
                    <div key={i} className="relative pl-6">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${i === 0 ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`} />

                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                            <div className={`font-mono text-lg ${i === 0 ? 'text-primary font-bold' : 'text-foreground'}`}>
                                {format(date, 'yyyy-MM-dd HH:mm:ss')}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                {i === 0 ? (
                                    <span className="flex items-center gap-1 text-primary"><Clock size={14} /> Next Run</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {format(date, 'EEEE')}</span>
                                )}
                            </div>
                        </div>
                        {i === 0 && (
                            <div className="mt-2 text-xs text-primary/80 bg-primary/10 inline-block px-2 py-1 rounded">
                                Run imminent
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
