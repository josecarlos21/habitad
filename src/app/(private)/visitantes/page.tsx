"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock3, PlusCircle, QrCode, Send, UserPlus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { VisitorPass } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVisitorPasses } from "@/services/mock-api";

type PassStatus = "active" | "upcoming" | "expired";

function getPassStatus(pass: VisitorPass): PassStatus {
  const now = new Date();
  const from = new Date(pass.validFrom);
  const to = new Date(pass.validTo);
  if (now < from) return "upcoming";
  if (now > to) return "expired";
  return "active";
}

function GeneratePassSheet({
  onSubmit,
}: {
  onSubmit: (payload: { visitorName: string; validFrom: string; validTo: string }) => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const visitorName = String(formData.get("visitor-name") || "");
    const payload = {
      visitorName,
      validFrom: String(formData.get("valid-from") || new Date().toISOString()),
      validTo: String(formData.get("valid-to") || new Date().toISOString()),
    };
    toast({
      title: "Pase generado",
      description: `Compartimos el QR con ${visitorName}.`,
    });
    onSubmit(payload);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Generar pase
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SheetHeader>
            <SheetTitle>Generar pase de visitante</SheetTitle>
            <SheetDescription>Completa los datos para enviar el QR por correo o WhatsApp.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="visitor-name">Nombre del visitante</Label>
              <Input id="visitor-name" name="visitor-name" placeholder="Ej. Ana Torres" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitor-email">Correo</Label>
              <Input id="visitor-email" name="visitor-email" type="email" placeholder="ana@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid-from">Desde</Label>
              <Input id="valid-from" name="valid-from" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valid-to">Hasta</Label>
              <Input id="valid-to" name="valid-to" type="datetime-local" required />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" className="w-full">
              Generar y compartir
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default function VisitantesPage() {
  const { toast } = useToast();
  const [visitorPasses, setVisitorPasses] = React.useState<VisitorPass[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<"all" | PassStatus>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedPass, setSelectedPass] = React.useState<VisitorPass | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const loadPasses = async () => {
      setIsLoading(true);
      const data = await fetchVisitorPasses();
      if (isMounted) {
        setVisitorPasses(data);
        setIsLoading(false);
      }
    };
    loadPasses();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = React.useMemo(() => {
    const initial = { active: 0, upcoming: 0, expired: 0 };
    return visitorPasses.reduce((acc, pass) => {
      const status = getPassStatus(pass);
      acc[status] += 1;
      return acc;
    }, initial);
  }, [visitorPasses]);

  const isPassStatus = (value: string): value is PassStatus =>
    value === "active" || value === "upcoming" || value === "expired";

  const handleStatusChange = (value: string) => {
    if (value === "all" || isPassStatus(value)) {
      setStatusFilter(value === "all" ? "all" : value);
    }
  };

  const filteredPasses = React.useMemo(() => {
    return visitorPasses.filter((pass) => {
      const status = getPassStatus(pass);
      const matchesStatus = statusFilter === "all" || statusFilter === status;
      const matchesSearch = pass.visitorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [visitorPasses, statusFilter, searchTerm]);

  const sharePass = (pass: VisitorPass) => {
    toast({
      title: "Pase enviado",
      description: `Compartimos el QR de ${pass.visitorName}.`,
    });
  };

  const handlePassCreated = (payload: { visitorName: string; validFrom: string; validTo: string }) => {
    setVisitorPasses((prev) => [
      {
        id: `vp_demo_${Date.now()}`,
        userId: "user_1",
        visitorName: payload.visitorName,
        validFrom: payload.validFrom,
        validTo: payload.validTo,
        qrToken: `qr_demo_${Date.now()}`,
      },
      ...prev,
    ]);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Visitantes"
        description="Gestiona los accesos temporales y comparte códigos QR."
        actions={<GeneratePassSheet onSubmit={handlePassCreated} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Activos"
          description="Vigentes en este momento"
          value={!isLoading ? stats.active : undefined}
          icon={QrCode}
          isLoading={isLoading}
        />
        <StatCard
          title="Próximos"
          description="Programados para hoy"
          value={!isLoading ? stats.upcoming : undefined}
          icon={CalendarDays}
          isLoading={isLoading}
        />
        <StatCard
          title="Expirados"
          description="Pases recientes"
          value={!isLoading ? stats.expired : undefined}
          icon={Clock3}
          isLoading={isLoading}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Encuentra un pase rápidamente.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <Label>Estado</Label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label>Buscar</Label>
            <Input
              placeholder="Nombre del visitante"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPasses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPasses.map((pass) => {
            const status = getPassStatus(pass);
            return (
              <Card key={pass.id}>
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <div className="grid h-12 w-12 place-items-center rounded-lg border">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{pass.visitorName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Válido hasta {format(new Date(pass.validTo), "dd MMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                  <Badge variant={status === "active" ? "secondary" : status === "upcoming" ? "outline" : "destructive"}>
                    {status === "active" ? "Activo" : status === "upcoming" ? "Próximo" : "Expirado"}
                  </Badge>
                </CardHeader>
                <CardContent className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => sharePass(pass)}>
                    Compartir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPass(pass)}>
                    Detalles
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={UserPlus}
          title="Sin pases registrados"
          description="Genera un pase para permitir el acceso a tus visitas."
          action={<GeneratePassSheet onSubmit={handlePassCreated} />}
        />
      )}

      <Dialog open={Boolean(selectedPass)} onOpenChange={(open) => !open && setSelectedPass(null)}>
        <DialogContent>
          {selectedPass ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPass.visitorName}</DialogTitle>
                <DialogDescription>
                  Pase válido del {format(new Date(selectedPass.validFrom), "dd MMM HH:mm", { locale: es })} al{" "}
                  {format(new Date(selectedPass.validTo), "dd MMM HH:mm", { locale: es })}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <QrCode className="h-4 w-4" />
                    QR Demo
                  </div>
                  <p className="mt-2 font-mono text-lg">{selectedPass.qrToken.slice(0, 10).toUpperCase()}</p>
                </div>
                <Button className="w-full gap-2" onClick={() => sharePass(selectedPass)}>
                  <Send className="h-4 w-4" />
                  Enviar nuevamente
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
