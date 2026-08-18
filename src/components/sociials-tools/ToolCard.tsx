import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Badge } from "@/components/sociials-ui/badge";
import { PinButton } from "@/components/sociials-tools/PinButton";

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    category: string;
    isNew?: boolean;
}

export function ToolCard({ title, description, href, icon: Icon, category, isNew }: ToolCardProps) {
    return (
        <Link href={href} className="block h-full group">
            <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card hover:bg-card/50 overflow-hidden relative">
                {/* Top Colored Bar (Optional accent like I Love PDF) - Desktop Only or subtle on mobile */}
                <div className="h-1.5 w-full bg-primary/10 group-hover:bg-primary/80 transition-colors" />

                <CardContent className="h-full p-4 md:p-6 md:pt-8 flex flex-row md:flex-col items-center gap-4 text-left md:text-center">
                    {/* Icon Circle */}
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-lg md:group-hover:scale-110">
                            <Icon className="h-6 w-6 md:h-10 md:w-10" strokeWidth={1.5} />
                        </div>
                        {isNew && (
                            <Badge className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 hover:bg-red-600 text-[9px] md:text-[10px] px-1.5 py-0 md:px-2 md:py-0.5 shadow-md animate-pulse">
                                NEW
                            </Badge>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col items-start md:items-center w-full space-y-1 md:space-y-2">
                        <div className="flex items-center justify-between w-full md:justify-center">
                            <h3 className="font-bold text-base md:text-xl text-foreground group-hover:text-primary transition-colors truncate w-full md:w-auto">
                                {title}
                            </h3>
                            {/* Category Tag (Mobile: Inline, Desktop: Bottom) */}
                            <Badge variant="secondary" className="md:hidden font-medium text-[9px] tracking-wider text-muted-foreground bg-muted ml-2 shrink-0">
                                {category}
                            </Badge>
                        </div>

                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed md:max-w-[90%]">
                            {description}
                        </p>
                    </div>

                    {/* Category Tag (Desktop: Bottom) */}
                    <div className="hidden md:block mt-6">
                        <Badge variant="secondary" className="font-medium text-[10px] tracking-wider text-muted-foreground bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {category}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
            {/* Pin Button (Desktop Only) */}
            <div className="absolute top-3 right-3 z-20 md:block hidden">
                <PinButton href={href} />
            </div>
        </Link>
    );
}
