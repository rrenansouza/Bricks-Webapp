import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: ReactNode;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = "",
  delay = 0,
}: StatsCardProps) {
  return (
    <Card 
      className={`bg-card border-border/50 slide-up ${className}`} 
      style={{ animationDelay: `${delay}ms` }}
      data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1 truncate">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">{subtitle}</div>
            )}
            {trend && (
              <p className={`text-xs mt-1 ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}% vs semana passada
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
