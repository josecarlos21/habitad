
"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Wrench, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateIncidentSheet } from "../../mantenimiento/_components/create-incident-sheet";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCondoUser } from "@/hooks/use-condo-user";
import type { Incident } from "@/lib/types";

const statusMap: Record<Incident['status'], { label: string; className: string }> = {
    OPEN: { label: "Abierto", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50" },
    IN_PROGRESS: { label: "En Progreso", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50" },
    WAITING_EXTERNAL: { label: "En Espera", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50" },
    RESOLVED: { label: "Resuelto", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50" },
    CANCELLED: { label: "Cancelado", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300 border-gray-300/50" },
};

export default function MantenimientoPageContent() {
    const firestore = useFirestore();
    const { user } = useCondoUser();
    
    const incidentsQuery = React.useMemo(() => {
        if (!firestore || !user) return null;
        return query(
          collection(firestore, `condos/${user.condoId}/incidents`),
          orderBy("createdAt", "desc"),
          limit(5) // Show latest 5 on this tab
        );
    }, [firestore, user]);

    const { data: incidents, isLoading } = useCollection<Incident>(incidentsQuery);

    return (
        <div className="pt-4 animate-fade-in">
             <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">Reporta problemas y da seguimiento.</p>
                <CreateIncidentSheet />
            </div>
            
            {isLoading ? (
                 <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                 </div>
            ) : incidents && incidents.length > 0 ? (
                <div className="space-y-2">
                    {incidents.map((incident, i) => {
                        const status = statusMap[incident.status];
                        return (
                             <Link href={`/mantenimiento/${incident.id}`} key={incident.id} className="block group">
                                <Card 
                                    className="transition-all duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-soft group-hover:border-primary/20 animate-slide-up-and-fade"
                                    style={{animationDelay: `${i * 100}ms`}}
                                >
                                    <CardHeader className="flex-row items-center gap-4 p-4">
                                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                            <Wrench className="h-5 w-5"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm line-clamp-1">{incident.title}</p>
                                            <div className="text-xs text-muted-foreground">
                                                #{incident.id.substring(0,7)} &bull; Creado {formatDistanceToNow(new Date(incident.createdAt), { locale: es, addSuffix: true })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                           <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                           <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Wrench}
                    title="No tienes reportes"
                    description="Crea un nuevo reporte para notificar un problema."
                    action={<CreateIncidentSheet />}
                />
            )}
        </div>
    )
}
