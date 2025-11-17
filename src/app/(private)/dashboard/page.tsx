"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  CreditCard,
  MessageSquarePlus,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Invoice, Ticket, Booking, Announcement, Amenity, VisitorPass } from "@/lib/types";
import {
  fetchAnnouncements,
  fetchAmenities,
  fetchBookings,
  fetchInvoices,
  fetchTickets,
  fetchVisitorPasses,
} from "@/services/mock-api";

type DialogType = "pay" | "ticket" | "visitor" | null;

function NextPaymentCard({
  invoice,
  isLoading,
  onPay,
}: {
  invoice: Invoice | undefined;
  isLoading: boolean;
  onPay: () => void;
}) {
  const { session } = useSession();

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-10 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  if (!invoice) {
    return (
      <Card className="lg:col-span-2 flex flex-col items-center justify-center p-8 text-center">
        <CardHeader>
          <CardTitle>¡Felicidades, {session.user?.name.split(" ")[0] ?? "residente"}!</CardTitle>
          <CardDescription>Estás al corriente con tus pagos.</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <Button asChild variant="outline">
            <Link href="/pagos">Ver historial de pagos</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 bg-gradient-to-tr from-primary/90 to-primary text-primary-foreground shadow-lg">
      <CardHeader>
        <CardTitle>Tu próximo pago</CardTitle>
        <CardDescription className="text-primary-foreground/80">{invoice.concept}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-4xl font-bold">${invoice.amount.toLocaleString("es-MX")}</p>
        <p className="text-sm">Vence el {format(new Date(invoice.dueDate), "dd 'de' MMMM", { locale: es })}</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" onClick={onPay}>
          Pagar ahora <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function QuickAccessCard({
  isLoading,
  onGenerate,
  unitLabel,
}: {
  isLoading: boolean;
  onGenerate: () => void;
  unitLabel?: string;
}) {
  const code = useMemo(() => {
    if (!unitLabel) return "HBCN-0000";
    return `${unitLabel.replace("-", "")}-${new Date().getHours()}${new Date().getMinutes()}`;
  }, [unitLabel]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <Skeleton className="h-24 w-24 rounded-md" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <CardHeader className="space-y-1">
        <CardTitle>Acceso rápido</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {unitLabel ? `Unidad ${unitLabel}` : "Selecciona tu unidad principal"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <QrCode className="h-24 w-24 text-muted-foreground" />
        <p className="text-xs font-mono tracking-widest text-muted-foreground">{code}</p>
        <p className="text-sm text-muted-foreground">Muestra este código al guardia.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onGenerate}>
          Generar pase de visita
        </Button>
      </CardFooter>
    </Card>
  );
}

function DashboardCard({
  title,
  link,
  icon: Icon,
  children,
  isLoading,
  footer,
  emptyState,
}: {
  title: string;
  link?: { href: string; label: string };
  icon?: React.ElementType;
  children: React.ReactNode;
  isLoading: boolean;
  footer?: React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  const hasContent = React.Children.count(children) > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {link && !isLoading && (
          <Link href={link.href} className="text-sm text-primary hover:underline">
            {link.label}
          </Link>
        )}
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
        ) : hasContent ? (
          children
        ) : (
          emptyState || (
            <p className="py-4 text-center text-sm text-muted-foreground">No hay información disponible.</p>
          )
        )}
      </CardContent>
      {footer && !isLoading && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export default function DashboardPage() {
  const { session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [amenityList, setAmenityList] = useState<Amenity[]>([]);
  const [visitorPassList, setVisitorPassList] = useState<VisitorPass[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const [inv, tic, book, ann, amenitiesData, visitorData] = await Promise.all([
        fetchInvoices(),
        fetchTickets(),
        fetchBookings(),
        fetchAnnouncements(),
        fetchAmenities(),
        fetchVisitorPasses(),
      ]);
      if (isMounted) {
        setInvoiceList(inv);
        setTicketList(tic);
        setBookingList(book);
        setAnnouncementList(ann);
        setAmenityList(amenitiesData);
        setVisitorPassList(visitorData);
        setIsLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const nextPayment = invoiceList.find((inv) => inv.status === "pending" || inv.status === "overdue");
  const dueInvoices = invoiceList.filter((inv) => inv.status === "pending" || inv.status === "overdue");
  const totalDue = dueInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const activeTickets = ticketList.filter((t) => t.status === "open" || t.status === "in_progress");
  const upcomingBookings = bookingList.slice(0, 2);
  const recentAnnouncements = announcementList.slice(0, 3);
  const now = new Date();
  const activeVisitorPasses = visitorPassList.filter(
    (pass) => new Date(pass.validFrom) <= now && new Date(pass.validTo) >= now
  );
  const lastVisitorGenerated =
    visitorPassList.length > 0 ? new Date(visitorPassList[0].validFrom) : null;

  const greeting = session.user ? session.user.name.split(" ")[0] : "residente";

  const handlePayment = () => {
    toast({
      title: "Pago registrado",
      description: nextPayment
        ? `Aplicamos tu pago de ${nextPayment.concept}. Recibirás un comprobante en tu correo.`
        : "No tienes adeudos al día de hoy.",
    });
  };

  const handleTicket = (payload: { title: string }) => {
    toast({
      title: "Ticket enviado",
      description: `Notificamos a mantenimiento sobre "${payload.title}". Te mantendremos al tanto.`,
    });
  };

  const handleVisitor = (payload: { visitorName: string }) => {
    toast({
      title: "Pase generado",
      description: `Compartimos el QR para ${payload.visitorName}.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title={`Hola, ${greeting}`}
        description="Aquí tienes todo lo importante de tu condominio en un mismo lugar."
        helpText="Datos demostrativos. Algunas acciones muestran experiencias simuladas."
        actions={
          <>
            <Button asChild variant="ghost">
              <Link href="/pagos">Ver estado de cuenta</Link>
            </Button>
            <Button onClick={() => setActiveDialog("ticket")} className="gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              Nuevo ticket
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Saldo pendiente"
          description="Adeudos y cuotas extras"
          value={!isLoading ? `$${totalDue.toLocaleString("es-MX")}` : undefined}
          trendLabel={dueInvoices.length > 0 ? `${dueInvoices.length} factura(s)` : "Todo pagado"}
          icon={CreditCard}
          isLoading={isLoading}
          footer={
            <span>
              Próximo vencimiento:{" "}
              {nextPayment ? format(new Date(nextPayment.dueDate), "dd MMM", { locale: es }) : "N/A"}
            </span>
          }
        />
        <StatCard
          title="Tickets activos"
          description="Reportes en proceso"
          value={!isLoading ? activeTickets.length : undefined}
          trendLabel="Mantenimiento monitoreando"
          icon={Wrench}
          isLoading={isLoading}
          footer={<span>{activeTickets[0] ? activeTickets[0].title : "Sin reportes"}</span>}
        />
        <StatCard
          title="Visitas programadas"
          description="Pases vigentes hoy"
          value={!isLoading ? activeVisitorPasses.length : undefined}
          trendLabel="QR listo para recepción"
          icon={UserCheck}
          isLoading={isLoading}
          footer={
            <span>
              {lastVisitorGenerated
                ? `Último pase creado ${formatDistanceToNow(lastVisitorGenerated, { locale: es, addSuffix: true })}`
                : "Aún no generas pases"}
            </span>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <NextPaymentCard invoice={nextPayment} isLoading={isLoading} onPay={() => setActiveDialog("pay")} />
        <QuickAccessCard
          isLoading={isLoading}
          onGenerate={() => setActiveDialog("visitor")}
          unitLabel={session.user?.units?.[0] ? `${session.user.units[0].tower}-${session.user.units[0].number}` : undefined}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Acciones rápidas
            </CardTitle>
            <CardDescription>Resuelve lo más urgente sin salir del tablero.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-between" onClick={() => setActiveDialog("pay")}>
              Pagar cuota <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-between" onClick={() => setActiveDialog("ticket")}>
              Reportar mantenimiento <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-between" onClick={() => setActiveDialog("visitor")}>
              Generar pase visitante <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Seguridad al día
            </CardTitle>
            <CardDescription>
              {activeVisitorPasses.length > 0
                ? `${activeVisitorPasses.length} visita(s) con acceso programado`
                : "Sin accesos programados."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Recuerda compartir el QR por canales seguros.</p>
            <p>Los pases expiran automáticamente al terminar su vigencia.</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Próximos eventos</CardTitle>
            <CardDescription>Reserva amenidades y participa en actividades.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBookings.slice(0, 2).map((booking) => (
              <div key={booking.id} className="text-sm">
                <p className="font-semibold">
                  {amenityList.find((a) => a.id === booking.amenityId)?.name ?? "Amenidad"}
                </p>
                <p className="text-muted-foreground">
                  {format(new Date(booking.slot.start), "dd MMM, HH:mm", { locale: es })}
                </p>
              </div>
            ))}
            {upcomingBookings.length === 0 && <p className="text-sm text-muted-foreground">No hay reservas.</p>}
          </CardContent>
          <CardFooter>
            <Button variant="secondary" asChild className="w-full">
              <Link href="/reservas">Reservar amenidad</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Avisos recientes"
          link={{ href: "/avisos", label: "Ver todos" }}
          isLoading={isLoading}
          emptyState={<p className="py-4 text-center text-sm text-muted-foreground">No hay avisos recientes.</p>}
        >
          {recentAnnouncements.length > 0 ? (
            <ul className="space-y-4">
              {recentAnnouncements.map((ann) => (
                <li key={ann.id}>
                  <p className="text-sm font-semibold">{ann.title}</p>
                  <p className="text-xs text-muted-foreground">{ann.body.substring(0, 70)}...</p>
                </li>
              ))}
            </ul>
          ) : null}
        </DashboardCard>

        <DashboardCard
          title="Tickets de mantenimiento"
          icon={Wrench}
          link={{ href: "/mantenimiento", label: "Ver todos" }}
          isLoading={isLoading}
          footer={
            <Button size="sm" variant="outline" className="w-full" onClick={() => setActiveDialog("ticket")}>
              Crear nuevo ticket
            </Button>
          }
          emptyState={<p className="py-4 text-center text-sm text-muted-foreground">No tienes tickets activos.</p>}
        >
          {activeTickets.length > 0 ? (
            <ul className="space-y-2">
              {activeTickets.slice(0, 3).map((ticket) => (
                <li key={ticket.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Abierto {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant={ticket.status === "open" ? "destructive" : "secondary"}>
                    {ticket.status === "open" ? "Abierto" : "En progreso"}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </DashboardCard>

        <DashboardCard
          title="Próximas reservas"
          icon={Calendar}
          link={{ href: "/reservas", label: "Ver todas" }}
          isLoading={isLoading}
          emptyState={<p className="py-4 text-center text-sm text-muted-foreground">No tienes próximas reservas.</p>}
        >
          {upcomingBookings.length > 0 ? (
            <ul className="space-y-2">
              {upcomingBookings.map((booking) => (
                <li key={booking.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {amenityList.find((a) => a.id === booking.amenityId)?.name ?? "Amenidad"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.slot.start), "eeee dd 'de' MMMM, h:mm a", { locale: es })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </DashboardCard>
      </div>

      <PayDialog
        open={activeDialog === "pay"}
        onOpenChange={(open) => setActiveDialog(open ? "pay" : null)}
        invoice={nextPayment}
        onConfirm={() => {
          handlePayment();
          setActiveDialog(null);
        }}
      />
      <MaintenanceDialog
        open={activeDialog === "ticket"}
        onOpenChange={(open) => setActiveDialog(open ? "ticket" : null)}
        onSubmit={(payload) => {
          handleTicket(payload);
          setActiveDialog(null);
        }}
      />
      <VisitorDialog
        open={activeDialog === "visitor"}
        onOpenChange={(open) => setActiveDialog(open ? "visitor" : null)}
        onSubmit={(payload) => {
          handleVisitor(payload);
          setActiveDialog(null);
        }}
      />
    </main>
  );
}

function PayDialog({
  open,
  onOpenChange,
  invoice,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | undefined;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagar cuota</DialogTitle>
          <DialogDescription>Confirma el pago del siguiente adeudo.</DialogDescription>
        </DialogHeader>
        {invoice ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Concepto</p>
              <p className="font-semibold">{invoice.concept}</p>
              <p className="text-sm text-muted-foreground">
                Vence el {format(new Date(invoice.dueDate), "dd MMM yyyy", { locale: es })}
              </p>
              <p className="mt-2 text-2xl font-bold">${invoice.amount.toLocaleString("es-MX")}</p>
            </div>
            <Button className="w-full" onClick={onConfirm}>
              Confirmar pago demo
            </Button>
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">No tienes adeudos pendientes.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MaintenanceDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { title: string; description: string }) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const payload = {
              title: String(formData.get("title") || ""),
              description: String(formData.get("description") || ""),
            };
            onSubmit(payload);
          }}
        >
          <DialogHeader>
            <DialogTitle>Nuevo ticket</DialogTitle>
            <DialogDescription>Describe el problema para notificar al equipo de mantenimiento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" placeholder="Fuga en lavabo del baño" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" placeholder="Comparte más detalles..." required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Enviar ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function VisitorDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { visitorName: string; validUntil: string }) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const payload = {
              visitorName: String(formData.get("visitorName") || ""),
              validUntil: String(formData.get("validUntil") || ""),
            };
            onSubmit(payload);
          }}
        >
          <DialogHeader>
            <DialogTitle>Generar pase</DialogTitle>
            <DialogDescription>Ingresa los datos del visitante.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="visitorName">Nombre del visitante</Label>
              <Input id="visitorName" name="visitorName" placeholder="Andrea Torres" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Válido hasta</Label>
              <Input id="validUntil" name="validUntil" type="datetime-local" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Generar y compartir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
