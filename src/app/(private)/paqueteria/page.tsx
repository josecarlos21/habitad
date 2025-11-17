"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Box, Package, PackageCheck, Scan, Truck } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Parcel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchParcels } from "@/services/mock-api";

const statusMap: Record<
  Parcel["status"],
  { label: string; icon: React.ElementType; className: string; tone: "info" | "success" }
> = {
  at_guard: {
    label: "En conserjería",
    icon: Package,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    tone: "info",
  },
  picked_up: {
    label: "Recogido",
    icon: PackageCheck,
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    tone: "success",
  },
};

export default function PaqueteriaPage() {
  const { toast } = useToast();
  const [parcels, setParcels] = React.useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedParcel, setSelectedParcel] = React.useState<Parcel | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const loadParcels = async () => {
      setIsLoading(true);
      const data = await fetchParcels();
      if (isMounted) {
        setParcels(data);
        setIsLoading(false);
      }
    };
    loadParcels();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = React.useMemo(() => {
    const enGuardia = parcels.filter((parcel) => parcel.status === "at_guard").length;
    const entregados = parcels.filter((parcel) => parcel.status === "picked_up").length;
    return { enGuardia, entregados };
  }, [parcels]);

  const filteredParcels = React.useMemo(() => {
    return parcels.filter(
      (parcel) =>
        parcel.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parcels, searchTerm]);

  const confirmPickup = (parcel: Parcel) => {
    setParcels((prev) =>
      prev.map((item) => (item.id === parcel.id ? { ...item, status: "picked_up" } : item))
    );
    toast({
      title: "Entrega registrada",
      description: `Marcamos como entregado el paquete ${parcel.trackingNumber}.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Paquetería"
        description="Revisa envíos en conserjería y confirma entregas."
        actions={
          <Button variant="ghost" className="gap-2" onClick={() => setSelectedParcel(filteredParcels[0] ?? null)}>
            <Scan className="h-4 w-4" />
            Registrar entrega
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="En conserjería"
          description="Listos para entregar"
          value={!isLoading ? stats.enGuardia : undefined}
          icon={Package}
          isLoading={isLoading}
        />
        <StatCard
          title="Entregados"
          description="Últimos 30 días"
          value={!isLoading ? stats.entregados : undefined}
          icon={PackageCheck}
          isLoading={isLoading}
        />
        <StatCard
          title="Próximo arribo"
          description="Estimado demo"
          value={!isLoading ? "Hoy 18:00" : undefined}
          icon={Truck}
          isLoading={isLoading}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Buscar paquete</CardTitle>
          <CardDescription>Usa el tracking o transportista.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Ej. Amazon, DHL, AMZ123"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </CardContent>
      </Card>

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
                  <Skeleton className="ml-auto h-6 w-24 rounded-full" />
                  <Skeleton className="ml-auto h-4 w-20" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredParcels.length > 0 ? (
        <div className="space-y-4">
          {filteredParcels.map((parcel) => {
            const status = statusMap[parcel.status];
            return (
              <Card key={parcel.id}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                    <status.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">{parcel.carrier}</h3>
                    <p className="text-sm text-muted-foreground">Tracking: {parcel.trackingNumber}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(parcel.arrivedAt), "dd MMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end gap-2">
                  {parcel.status === "at_guard" && (
                    <Button size="sm" variant="outline" onClick={() => confirmPickup(parcel)}>
                      Confirmar recogida
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setSelectedParcel(parcel)}>
                    Detalles
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Box} title="Sin paquetes" description="No hay registros con los filtros actuales." />
      )}

      <Dialog open={Boolean(selectedParcel)} onOpenChange={(open) => !open && setSelectedParcel(null)}>
        <DialogContent>
          {selectedParcel ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedParcel.carrier}</DialogTitle>
                <DialogDescription>Tracking {selectedParcel.trackingNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <span>{statusMap[selectedParcel.status].label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Arribo</span>
                  <span>{format(new Date(selectedParcel.arrivedAt), "dd MMM yyyy HH:mm", { locale: es })}</span>
                </div>
              </div>
              <DialogFooter>
                {selectedParcel.status === "at_guard" ? (
                  <Button className="w-full" onClick={() => confirmPickup(selectedParcel)}>
                    Registrar entrega
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={() => setSelectedParcel(null)}>
                    Cerrar
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
