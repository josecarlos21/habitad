
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Assembly } from "@/lib/types";
import { useCollection, useFirestore } from "@/firebase";
import { useCondoUser } from "@/hooks/use-condo-user";
import { collection, query, orderBy } from "firebase/firestore";
import Link from "next/link";

const statusMap: Record<Assembly['status'], { label: string; className: string }> = {
    DRAFT: { label: "Borrador", className: "bg-gray-100 text-gray-800" },
    OPEN: { label: "Abierta", className: "bg-green-100 text-green-800" },
    CLOSED: { label: "Cerrada", className: "bg-blue-100 text-blue-800" },
    ARCHIVED: { label: "Archivada", className: "bg-gray-100 text-gray-800" },
};

export function AsambleasContent() {
    const firestore = useFirestore();
    const { user } = useCondoUser();

    const assembliesQuery = React.useMemo(() => {
        if (!firestore || !user) return null;
        return query(
          collection(firestore, `condos/${user.condoId}/assemblies`),
          orderBy("scheduledAt", "desc")
        );
    }, [firestore, user]);

    const { data: assemblies, isLoading } = useCollection<Assembly>(assembliesQuery);

    return (
        <div className="pt-4 animate-fade-in">
            <p className="text-muted-foreground mb-4">Consulta las asambleas pasadas y futuras.</p>

            {isLoading ? (
                 <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                 </div>
            ) : assemblies && assemblies.length > 0 ? (
                <div className="space-y-2">
                    {assemblies.map((assembly, i) => {
                        const status = statusMap[assembly.status];
                        return (
                             <Card 
                                key={assembly.id} 
                                className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-soft animate-slide-up-and-fade hover:border-primary/20 group"
                                style={{animationDelay: `${i * 100}ms`}}
                             >
                                <CardHeader className="flex-row items-center gap-4 p-4">
                                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold">{assembly.title}</h3>
                                        <p className="text-xs text-muted-foreground">Programada para: {format(new Date(assembly.scheduledAt), "dd MMM, yyyy", { locale: es })}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Users}
                    title="Sin Asambleas"
                    description="No hay asambleas programadas o pasadas."
                />
            )}
        </div>
    );
}
