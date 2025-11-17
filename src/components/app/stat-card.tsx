"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  description?: string;
  value?: string | number;
  trendLabel?: string;
  icon?: React.ElementType;
  isLoading?: boolean;
  accent?: "primary" | "neutral";
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  description,
  value,
  trendLabel,
  icon: Icon,
  isLoading,
  accent = "neutral",
  footer,
  children,
  className,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        accent === "primary" && "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className={cn("text-xs", accent === "primary" && "text-primary-foreground/80")}>{description}</CardDescription>}
        </div>
        {Icon && (
          <div className={cn("rounded-full p-2", accent === "primary" ? "bg-black/10" : "bg-muted")}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {value !== undefined && (
          <div>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trendLabel && <p className={cn("text-xs text-muted-foreground", accent === "primary" && "text-primary-foreground/80")}>{trendLabel}</p>}
          </div>
        )}
        {children}
      </CardContent>
      {footer && (
        <div
          className={cn(
            "border-t px-6 py-3 text-sm",
            accent === "primary"
              ? "border-white/20 text-primary-foreground/80"
              : "border-border text-muted-foreground"
          )}
        >
          {footer}
        </div>
      )}
    </Card>
  );
}
