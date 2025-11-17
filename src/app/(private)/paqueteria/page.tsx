import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parcels } from "@/lib/mocks";
import type { Parcel } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, PackageCheck, Truck } from "lucide-react";

const statusMap: Record<Parcel['status'], { label: string; icon: React.ElementType; className: string }> = {
    at_guard: { label: "En conserjería", icon: Package, className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" },
    picked_up: { label: "Recogido", icon: PackageCheck, className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
};

export default function PaqueteriaPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Paquetería</h1>
            
            {parcels.length > 0 ? (
                <div className="space-y-4">
                    {parcels.map(parcel => {
                        const status = statusMap[parcel.status];
                        return (
                             <Card key={parcel.id}>
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                                        <status.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base font-semibold">{parcel.carrier}</CardTitle>
                                        <CardDescription>Tracking: {parcel.trackingNumber}</CardDescription>
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
                 <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[50vh]">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-2xl font-bold tracking-tight">Sin paquetes</h3>
                        <p className="text-sm text-muted-foreground">No tienes paquetes pendientes de recoger.</p>
                    </div>
                </div>
            )}
        </main>
    );
}
