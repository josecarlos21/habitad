"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  helpText?: string;
  actions?: ReactNode;
  align?: "left" | "center" | "right";
}

export function PageHeader({
  title,
  description,
  helpText,
  actions,
  align = "left",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "gap-4 border-b pb-4 md:flex md:items-center md:justify-between",
        align === "center" && "text-center md:text-left"
      )}
    >
      <div className="space-y-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Habitat</p>
          <h1 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h1>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {helpText && (
          <p className="text-xs text-muted-foreground/80">
            {helpText}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
