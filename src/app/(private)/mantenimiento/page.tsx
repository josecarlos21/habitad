"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Hammer, MessageSquare, PlusCircle, Search, ShieldAlert, Wrench } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Ticket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTickets } from "@/services/mock-api";

const statusMap: Record<
  Ticket["status"],
  { label: string; className: string; tone: "critical" | "warning" | "info" | "success" }
> = {
  open: {
    label: "Abierto",
    className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50",
    tone: "critical",
  },
  in_progress: {
    label: "En Proceso",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50",
    tone: "info",
  },
  resolved: {
    label: "Resuelto",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50",
    tone: "warning",
  },
  closed: {
    label: "Cerrado",
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50",
    tone: "success",
  },
};

const categoryOptions = [
  { value: "all", label: "Todas las categorías" },
  { value: "plumbing", label: "Plomería" },
  { value: "electrical", label: "Electricidad" },
  { value: "common_area", label: "Área común" },
  { value: "other", label: "Otro" },
];

function CreateTicketSheet({ onSubmit }: { onSubmit: (payload: { title: string }) => void }) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
    };
    toast({
      title: "Ticket enviado",
      description: "En breve recibirás confirmación de la administración.",
    });
    onSubmit(payload);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nuevo ticket
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SheetHeader>
            <SheetTitle>Reportar mantenimiento</SheetTitle>
            <SheetDescription>Describe el incidente y el área afectada.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" placeholder="Fuga en lavabo" required />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select name="category" defaultValue="plumbing">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.slice(1).map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" placeholder="Comparte todos los detalles…" required />
            </div>
          </div>
          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button type="submit" className="w-full">
              Enviar ticket
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              El equipo de mantenimiento recibe notificaciones automáticas.
            </p>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default function MantenimientoPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<"all" | Ticket["status"]>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | Ticket["category"]>("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;
    const loadTickets = async () => {
      setIsLoading(true);
      const data = await fetchTickets();
      if (isMounted) {
        setTickets(data);
        setIsLoading(false);
      }
    };
    loadTickets();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = React.useMemo(() => {
    return Object.keys(statusMap).reduce(
      (acc, key) => ({
        ...acc,
        [key]: tickets.filter((ticket) => ticket.status === key).length,
      }),
      {} as Record<Ticket["status"], number>
    );
  }, [tickets]);

  const isTicketStatus = (value: string): value is Ticket["status"] =>
    value === "open" || value === "in_progress" || value === "resolved" || value === "closed";

  const handleStatusChange = (value: string) => {
    if (value === "all" || isTicketStatus(value)) {
      setStatusFilter(value === "all" ? "all" : value);
    }
  };

  const isTicketCategory = (value: string): value is Ticket["category"] =>
    value === "plumbing" || value === "electrical" || value === "common_area" || value === "other";

  const handleCategoryChange = (value: string) => {
    if (value === "all" || isTicketCategory(value)) {
      setCategoryFilter(value === "all" ? "all" : value);
    }
  };

  const filteredTickets = React.useMemo(() => {
    return tickets
      .filter((ticket) => (statusFilter === "all" ? true : ticket.status === statusFilter))
      .filter((ticket) => (categoryFilter === "all" ? true : ticket.category === categoryFilter))
      .filter((ticket) => ticket.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tickets, statusFilter, categoryFilter, searchTerm]);

  const handleTicketCreated = (payload: { title: string }) => {
    toast({
      title: "Ticket registrado",
      description: `Creamos "${payload.title}" con folio virtual.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Mantenimiento"
        description="Da seguimiento a tus reportes y crea nuevas solicitudes."
        actions={<CreateTicketSheet onSubmit={handleTicketCreated} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Abiertos"
          description="Requieren atención"
          value={!isLoading ? stats.open ?? 0 : undefined}
          icon={ShieldAlert}
          isLoading={isLoading}
        />
        <StatCard
          title="En proceso"
          description="Personal asignado"
          value={!isLoading ? stats.in_progress ?? 0 : undefined}
          icon={Wrench}
          isLoading={isLoading}
        />
        <StatCard
          title="Resueltos"
          description="En espera de cierre"
          value={!isLoading ? stats.resolved ?? 0 : undefined}
          icon={Hammer}
          isLoading={isLoading}
        />
        <StatCard
          title="Cerrados"
          description="Completados"
          value={!isLoading ? stats.closed ?? 0 : undefined}
          icon={MessageSquare}
          isLoading={isLoading}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Ajusta la vista según tus necesidades.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(statusMap).map(([value, status]) => (
                  <SelectItem key={value} value={value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Buscar</Label>
            <div className="flex items-center gap-2 rounded-md border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                className="border-0 p-0 focus-visible:ring-0"
                placeholder="Ej. fuga, luz, elevador"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="grid">Mis tickets</TabsTrigger>
          <TabsTrigger value="timeline">Últimas actualizaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </CardContent>
                  <CardContent className="pb-4">
                    <Skeleton className="h-9 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Wrench}
              title="No encontramos tickets"
              description="Ajusta tus filtros o crea una nueva solicitud."
              action={<CreateTicketSheet onSubmit={handleTicketCreated} />}
            />
          )}
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Línea de tiempo</CardTitle>
              <CardDescription>Últimas actualizaciones registradas en tus tickets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-semibold">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {statusMap[ticket.status].label} • {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const status = statusMap[ticket.status];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{ticket.title}</CardTitle>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </div>
        <CardDescription>
          #{ticket.id.split("_")[1]} · Creado{" "}
          {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{ticket.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-0.5">
            {ticket.category === "common_area"
              ? "Área común"
              : ticket.category === "plumbing"
                ? "Plomería"
                : ticket.category === "electrical"
                  ? "Electricidad"
                  : "Otro"}
          </span>
        </div>
      </CardContent>
      <CardContent className="pb-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/mantenimiento/${ticket.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ver detalles
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
