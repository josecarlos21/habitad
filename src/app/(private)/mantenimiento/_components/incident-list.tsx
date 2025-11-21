
"use client";

import * as React from "react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Incident } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Tag, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCondoUser } from "@/hooks/use-condo-user";
import { EmptyState } from "@/components/app/empty-state";
import { CreateIncidentSheet } from "./create-incident-sheet";

const IncidentStatusBadge = ({ status }: { status: Incident['status'] }) => {
    const statusMap: Record<Incident['status'], { label: string; className: string }> = {
        OPEN: { label: 'Abierto', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300' },
        IN_PROGRESS: { label: 'En Progreso', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300' },
        WAITING_EXTERNAL: { label: 'En Espera', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300' },
        RESOLVED: { label: 'Resuelto', className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300' },
        CANCELLED: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400' },
    };
    const currentStatus = statusMap[status] || { label: status, className: ''};

    return (
        <Badge
            variant={'outline'}
            className={cn('capitalize', currentStatus.className)}
        >
            {currentStatus.label}
        </Badge>
    )
};

export function IncidentList() {
    const firestore = useFirestore();
    const { user } = useCondoUser();
    
    const incidentsQuery = React.useMemo(() => {
        if (!firestore || !user) return null;
        // In a real app, you would also filter by user or condo.
        // For now, we'll fetch all incidents for the condo.
        return query(
          collection(firestore, `condos/${user.condoId}/incidents`),
          orderBy("createdAt", "desc")
        );
    }, [firestore, user]);

    const { data: incidents, isLoading } = useCollection<Incident>(incidentsQuery);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/4 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                           <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-9 w-28" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (!incidents || incidents.length === 0) {
        return <EmptyState 
            icon={Wrench} 
            title="Sin Reportes" 
            description="No hay reportes de mantenimiento activos. ¡Todo parece estar en orden!"
            action={<CreateIncidentSheet />}
        />
    }

    return (
        <div className="space-y-4">
            {incidents.map((incident, i) => (
                <Card key={incident.id} className="animate-slide-up-and-fade" style={{animationDelay: `${i * 100}ms`}}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg leading-tight max-w-xs md:max-w-md">{incident.title}</CardTitle>
                            <IncidentStatusBadge status={incident.status} />
                        </div>
                        <div className="text-sm pt-1 text-muted-foreground">
                            {`#${incident.id.substring(0, 7)} • Creado ${formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true, locale: es })}`}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground truncate">
                            {incident.description}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Tag className="w-4 h-4" />
                            <span>{incident.category}</span>
                        </div>
                        <Button asChild variant="secondary" size="sm">
                            <Link href={`/mantenimiento/${incident.id}`}>
                                Ver Detalles
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
