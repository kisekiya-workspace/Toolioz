import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { PinButton } from "@/components/sociials-tools/PinButton";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
  isNew?: boolean;
}

export function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  category,
  isNew,
}: ToolCardProps) {
  return (
    <div className="relative group h-full">
      <Link href={href} className="block h-full">
        <Card hoverable className="h-full border-border/80 bg-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 transition-transform duration-200 group-hover:scale-105">
                <Icon size={20} strokeWidth={2} />
              </div>
              {isNew && (
                <Badge variant="destructive" size="sm" className="font-mono text-[9px]">
                  NEW
                </Badge>
              )}
            </div>

            <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-blue-600 mb-1 truncate">
              {title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <Badge variant="mono" size="sm">
              {category}
            </Badge>
            <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-0.5">
              Open <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Card>
      </Link>

      <div className="absolute top-3 right-3 z-10 hidden md:block">
        <PinButton href={href} />
      </div>
    </div>
  );
}
