import { Button } from "@/components/ui/button";
import React from "react";

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-16">
            <div className="flex flex-col items-center gap-2 text-center max-w-md">
                <Icon className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight mt-4">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
                {action && <div className="mt-4">{action}</div>}
            </div>
        </div>
    );
}
