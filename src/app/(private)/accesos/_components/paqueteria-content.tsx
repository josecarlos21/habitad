
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, PackageCheck, ArrowRight } from "lucide-react";
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

export default function PaqueteriaPageContent() {
    const [parcels, setParcels] = React.useState<Parcel[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setParcels(mockParcels);
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pt-4 animate-fade-in">
            <p className="text-muted-foreground mb-4">Paquetes recibidos en conserjería.</p>

            {isLoading ? (
                 <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                 </div>
            ) : parcels.length > 0 ? (
                <div className="space-y-2">
                    {parcels.map((parcel, i) => {
                        const status = statusMap[parcel.status];
                        return (
                             <Card 
                                key={parcel.id} 
                                className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-soft animate-slide-up-and-fade hover:border-primary/20 group"
                                style={{animationDelay: `${i * 100}ms`}}
                             >
                                <CardHeader className="flex-row items-center gap-4 p-4">
                                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                        <status.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold">{parcel.carrier}</h3>
                                        <p className="text-xs text-muted-foreground">Llegó el {format(new Date(parcel.arrivedAt), "dd MMM, hh:mm a", { locale: es })}</p>
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
                    icon={Package}
                    title="Sin paquetes"
                    description="No tienes paquetes pendientes de recoger."
                />
            )}
        </div>
    );
}
