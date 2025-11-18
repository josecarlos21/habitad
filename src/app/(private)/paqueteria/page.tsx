
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, PackageCheck } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { parcels as mockParcels } from "@/lib/mocks";
import type { Parcel } from "@/lib/types";

const statusMap: Record<Parcel['status'], { label: string; icon: React.ElementType; className: string }> = {
    at_guard: { label: "En conserjería", icon: Package, className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
    picked_up: { label: "Recogido", icon: PackageCheck, className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
};

export default function PaqueteriaPage() {
    const [parcels, setParcels] = React.useState<Parcel[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setParcels(mockParcels);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Paquetería</h1>
            
            {isLoading ? (
                 <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className="text-right space-y-2">
                                    <Skeleton className="h-6 w-24 ml-auto rounded-full" />
                                    <Skeleton className="h-4 w-20 ml-auto" />
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                 </div>
            ) : parcels.length > 0 ? (
                <div className="space-y-4">
                    {parcels.map((parcel, i) => {
                        const status = statusMap[parcel.status];
                        return (
                             <Card 
                                key={parcel.id} 
                                className="transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg animate-slide-up-and-fade"
                                style={{animationDelay: `${i * 100}ms`}}
                             >
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                                        <status.icon className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold">{parcel.carrier}</h3>
                                        <p className="text-sm text-muted-foreground">Tracking: {parcel.trackingNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(parcel.arrivedAt), "dd MMM, hh:mm a", { locale: es })}
                                        </p>
                                    </div>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Package}
                    title="Sin paquetes"
                    description="No tienes paquetes pendientes de recoger."
                />
            )}
        </main>
    );
}
