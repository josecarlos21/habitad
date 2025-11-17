"use client";

import React from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  CalendarClock,
  LogOut,
  Mail,
  Phone,
  QrCode,
  Shield,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { fetchAmenities, fetchBookings, fetchTickets, fetchVisitorPasses } from "@/services/mock-api";

type TimelineTone = "accent" | "primary" | "warning" | "success";

type TimelineItem = {
  id: string;
  timestamp: string;
  label: string;
  description: string;
  meta: string;
  icon: React.ElementType;
  tone: TimelineTone;
};

type SummarySnapshot = {
  activePasses: number;
  upcomingBookings: number;
  openTickets: number;
};

type PrivacyPrefs = {
  showContact: boolean;
  shareCommittee: boolean;
  autoApproveRecurring: boolean;
};

const timelineToneClasses: Record<TimelineTone, string> = {
  accent: "border-secondary/40 bg-secondary/10 text-secondary-foreground",
  primary: "border-primary/40 bg-primary/10 text-primary",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const defaultPrivacyPrefs: PrivacyPrefs = {
  showContact: true,
  shareCommittee: false,
  autoApproveRecurring: true,
};

const privacyOptions: Array<{
  key: keyof PrivacyPrefs;
  id: string;
  label: string;
  description: string;
}> = [
  {
    key: "showContact",
    id: "privacy-contact",
    label: "Compartir datos de contacto",
    description: "Muestra tu correo y teléfono a la comunidad para coordinar entregas o actividades.",
  },
  {
    key: "shareCommittee",
    id: "privacy-committee",
    label: "Compartir actividad con el comité",
    description: "Autoriza que el comité de vigilancia consulte tus pases y reservas para acelerar autorizaciones.",
  },
  {
    key: "autoApproveRecurring",
    id: "privacy-auto",
    label: "Preautorizar visitas recurrentes",
    description: "Habilita accesos automáticos a proveedores con registro previo (limpieza, servicio técnico).",
  },
];

const notificationChannels = [
  { id: "notif-email", label: "Correo electrónico", desc: "Estados de cuenta y avisos oficiales.", defaultChecked: true },
  { id: "notif-push", label: "Push en la app", desc: "Alertas inmediatas de seguridad y visitas.", defaultChecked: true },
  { id: "notif-sms", label: "SMS", desc: "Solo se usa para incidentes críticos.", defaultChecked: false },
] as const;

const notificationCategories = [
  { id: "cat-finance", label: "Finanzas", desc: "Pagos, facturas, recordatorios", defaultChecked: true },
  { id: "cat-security", label: "Seguridad", desc: "Alertas, accesos, reportes", defaultChecked: true },
  { id: "cat-maintenance", label: "Mantenimiento", desc: "Tickets y seguimiento", defaultChecked: true },
  { id: "cat-community", label: "Comunidad", desc: "Eventos, asambleas, anuncios", defaultChecked: false },
] as const;

export default function PerfilPage() {
  const { user, isLoading } = useUser();
  const { session } = useSession();
  const { toast } = useToast();

  const [privacyPrefs, setPrivacyPrefs] = React.useState<PrivacyPrefs>(defaultPrivacyPrefs);
  const [summary, setSummary] = React.useState<SummarySnapshot | null>(null);
  const [timeline, setTimeline] = React.useState<TimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = React.useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil actualizado",
      description: "Tus datos personales han sido guardados con éxito.",
    });
  };

  const handleCredentialDownload = () => {
    toast({
      title: "Descarga preparada",
      description: "Tu credencial digital llegará a tu correo en los próximos segundos.",
    });
  };

  React.useEffect(() => {
    if (!user) return;
    let mounted = true;

    const loadContext = async () => {
      setTimelineLoading(true);
      try {
        const [passes, bookingsData, ticketsData, amenitiesData] = await Promise.all([
          fetchVisitorPasses(),
          fetchBookings(),
          fetchTickets(),
          fetchAmenities(),
        ]);

        if (!mounted) return;

        const now = new Date();
        const activePasses = passes.filter((pass) => new Date(pass.validTo) >= now).length;
        const upcomingBookings = bookingsData.filter((booking) => new Date(booking.slot.start) >= now).length;
        const openTickets = ticketsData.filter((ticket) => ticket.status === "open" || ticket.status === "in_progress").length;

        setSummary({ activePasses, upcomingBookings, openTickets });

        const amenityLookup = new Map(amenitiesData.map((amenity) => [amenity.id, amenity.name]));

        const activity: TimelineItem[] = [
          ...passes.map((pass) => ({
            id: `pass-${pass.id}`,
            timestamp: pass.validFrom,
            label: `Pase para ${pass.visitorName}`,
            description: `Vigente hasta ${format(new Date(pass.validTo), "dd MMM, HH:mm", { locale: es })}`,
            meta: new Date(pass.validTo) >= now ? "Visita activa" : "Visita concluida",
            icon: QrCode,
            tone: new Date(pass.validTo) >= now ? "accent" : "warning",
          })),
          ...bookingsData.map((booking) => ({
            id: `booking-${booking.id}`,
            timestamp: booking.slot.start,
            label: `Reserva ${amenityLookup.get(booking.amenityId) ?? "amenidad"}`,
            description: `${format(new Date(booking.slot.start), "dd MMMM HH:mm", { locale: es })} · ${format(
              new Date(booking.slot.end),
              "HH:mm",
              { locale: es }
            )}`,
            meta: booking.status === "confirmed" ? "Confirmada" : "Cancelada",
            icon: CalendarClock,
            tone: booking.status === "confirmed" ? "primary" : "warning",
          })),
          ...ticketsData.map((ticket) => ({
            id: `ticket-${ticket.id}`,
            timestamp: ticket.createdAt,
            label: ticket.title,
            description: `Categoría: ${ticket.category === "common_area" ? "Área común" : ticket.category === "plumbing" ? "Plomería" : ticket.category === "electrical" ? "Eléctrico" : "General"}`,
            meta: ticket.status === "resolved" || ticket.status === "closed" ? "Resuelto" : "Seguimiento",
            icon: Wrench,
            tone: ticket.status === "resolved" || ticket.status === "closed" ? "success" : "warning",
          })),
        ]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 6);

        setTimeline(activity);
      } catch (error) {
        console.error("Perfil: no se pudieron cargar los datos relacionados", error);
        toast({
          variant: "destructive",
          title: "No pudimos sincronizar la información",
          description: "Verifica tu conexión e intenta de nuevo.",
        });
      } finally {
        if (mounted) {
          setTimelineLoading(false);
        }
      }
    };

    loadContext();
    return () => {
      mounted = false;
    };
  }, [toast, user]);

  const handlePrivacyChange = (key: keyof PrivacyPrefs, nextValue: boolean) => {
    setPrivacyPrefs((prev) => ({ ...prev, [key]: nextValue }));
    const label = privacyOptions.find((option) => option.key === key)?.label ?? "Preferencia";
    toast({
      title: "Preferencia actualizada",
      description: `${label} ${nextValue ? "activada" : "desactivada"}.`,
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <EmptyState
          icon={UserIcon}
          title="No se pudo cargar tu perfil"
          description="Hubo un problema al recuperar tus datos. Por favor, intenta de nuevo."
        />
      </main>
    );
  }

  const unitLabel = `${user.units[0].tower}-${user.units[0].number}`;
  const lastUpdateLabel = session.lastLogin
    ? formatDistanceToNow(new Date(session.lastLogin), { addSuffix: true, locale: es })
    : "Sin registro reciente";

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Mi perfil"
        description="Actualiza tus datos personales, preferencias y métodos de contacto para la administración."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2 border-[3px]" onClick={handleCredentialDownload}>
              <Sparkles className="h-4 w-4" />
              Descargar credencial
            </Button>
            <Button className="gap-2" asChild>
              <Link href="/settings">Ir a ajustes</Link>
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden border-[3px] bg-gradient-to-br from-white via-white to-[#ECF3FF] shadow-[0px_20px_60px_rgba(15,16,20,0.12)]">
        <div className="h-2 bg-gradient-to-r from-[#22D3EE] via-[#6366F1] to-[#F472B6]" />
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full border-[3px] border-black/10 p-1">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Identidad Habitat</p>
                <h2 className="text-3xl font-semibold">{user.name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-[2px]">
                    Unidad {unitLabel}
                  </Badge>
                  <Badge variant="secondary" className="border-[2px]">
                    {user.role === "resident" ? "Residente activo" : user.role}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" className="gap-2" asChild>
                <Link href="/visitantes">
                  <QrCode className="h-4 w-4" />
                  Compartir pase QR
                </Link>
              </Button>
              <Button variant="ghost" className="gap-2 border-[3px] border-black/10 bg-white/80" asChild>
                <Link href="/settings?tab=seguridad">
                  <ShieldCheck className="h-4 w-4" />
                  Validar identidad
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Correo principal",
                value: user.email ?? "Pendiente",
                icon: Mail,
              },
              {
                label: "Teléfono",
                value: user.phone ?? "Completar",
                icon: Phone,
              },
              {
                label: "Última actualización",
                value: lastUpdateLabel,
                icon: ShieldCheck,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-black/10 bg-white/80 p-4 text-sm">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-dashed border-black/20 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-widest">Pases vigentes</p>
              {summary ? (
                <p className="text-2xl font-semibold text-foreground">{summary.activePasses}</p>
              ) : (
                <Skeleton className="mt-2 h-6 w-16" />
              )}
            </div>
            <div className="rounded-2xl border border-dashed border-black/20 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-widest">Reservas próximas</p>
              {summary ? (
                <p className="text-2xl font-semibold text-foreground">{summary.upcomingBookings}</p>
              ) : (
                <Skeleton className="mt-2 h-6 w-16" />
              )}
            </div>
            <div className="rounded-2xl border border-dashed border-black/20 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-widest">Tickets abiertos</p>
              {summary ? (
                <p className="text-2xl font-semibold text-foreground">{summary.openTickets}</p>
              ) : (
                <Skeleton className="mt-2 h-6 w-16" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Unidad principal"
          description="Torre - número"
          value={unitLabel}
          icon={Shield}
          className="border-[3px]"
        />
        <StatCard
          title="Correo verificado"
          description="Usado para notificaciones"
          value={user.email ?? "Pendiente"}
          icon={Mail}
          trendLabel={user.phone ? `Teléfono: ${user.phone}` : "Agrega tu teléfono"}
          className="border-[3px]"
        />
        <StatCard
          title="Reservas activas"
          description="Próximas 48 h"
          value={summary?.upcomingBookings ?? 0}
          icon={Calendar}
          isLoading={!summary}
          className="border-[3px]"
        />
        <StatCard
          title="Tickets abiertos"
          description="Mantenimiento"
          value={summary?.openTickets ?? 0}
          icon={Wrench}
          isLoading={!summary}
          className="border-[3px]"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-[3px]">
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Estos datos se comparten con la administración y seguridad.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" defaultValue={user.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Rol/Ocupación</Label>
                  <Input id="profession" placeholder="Ej. Diseñadora UX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" defaultValue={user.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="+52 55 0000 0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altContact">Contacto alterno</Label>
                  <Input id="altContact" type="tel" placeholder="Familiar o persona de confianza" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección de correspondencia</Label>
                  <Input id="address" placeholder="Calle, número interior, colonia" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notas de acceso</Label>
                  <Textarea id="notes" placeholder="Ej. alergias, indicaciones especiales para visitantes" />
                </div>
              </CardContent>
              <div className="flex flex-col gap-3 p-6 pt-0 sm:flex-row sm:justify-end">
                <Button type="submit" className="gap-2">
                  Guardar cambios
                </Button>
              </div>
            </Card>
          </form>

          <Card className="border-[3px]">
            <CardHeader>
              <CardTitle>Preferencias de notificación</CardTitle>
              <CardDescription>Define los canales y categorías que quieres recibir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Canales</p>
                {notificationChannels.map((channel) => (
                  <div key={channel.id} className="flex items-start justify-between gap-4 rounded-2xl border p-4">
                    <div>
                      <p className="font-medium">{channel.label}</p>
                      <p className="text-sm text-muted-foreground">{channel.desc}</p>
                    </div>
                    <Switch id={channel.id} defaultChecked={channel.defaultChecked} aria-label={channel.label} />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Categorías</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {notificationCategories.map((category) => (
                    <div key={category.id} className="rounded-2xl border border-dashed p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{category.label}</p>
                          <p className="text-xs text-muted-foreground">{category.desc}</p>
                        </div>
                        <Switch id={category.id} defaultChecked={category.defaultChecked} aria-label={category.label} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[3px]">
            <CardHeader>
              <CardTitle>Privacidad y accesos</CardTitle>
              <CardDescription>Controla qué información compartes y cómo se aprueban tus visitantes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-dashed p-4"
                >
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                    <Switch
                      id={option.id}
                      checked={privacyPrefs[option.key]}
                      onCheckedChange={(checked) => handlePrivacyChange(option.key, checked)}
                      aria-label={option.label}
                    />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[3px]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>Unidad {unitLabel}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-[2px]">
                  Perfil verificado
                </Badge>
                {summary && (
                  <Badge variant="outline" className="border-[2px]">
                    {summary.activePasses} pases activos
                  </Badge>
                )}
              </div>
              <dl className="space-y-1 text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <dt>Correo:</dt>
                  <dd className="text-foreground">{user.email ?? "Pendiente"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Teléfono:</dt>
                  <dd className="text-foreground">{user.phone ?? "Pendiente"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Último acceso:</dt>
                  <dd className="text-foreground">{lastUpdateLabel}</dd>
                </div>
              </dl>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Actualizar foto
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[3px]">
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>Visitas, reservas y tickets asociados a tu unidad.</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-2xl" />
                  ))}
                </div>
              ) : timeline.length ? (
                <ol className="space-y-4">
                  {timeline.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "rounded-full border-[3px] p-2",
                          timelineToneClasses[item.tone]
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 border-b border-dashed pb-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground sm:text-base">{item.label}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <Badge variant="outline" className="mt-2 border-[2px] text-xs">
                          {item.meta}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="Sin actividad"
                  description="Aún no registras reservas, pases o tickets recientes."
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-[3px]">
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Gestiona tus dispositivos y accesos rápidos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "device-1", label: "iPhone 15 Pro · Habitat", meta: "Sesión actual · CDMX", current: true },
                { id: "device-2", label: "MacBook Pro 14”", meta: "Último acceso ayer · Oficina", current: false },
              ].map((device) => (
                <div key={device.id} className="flex items-center justify-between gap-4 rounded-2xl border p-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{device.label}</p>
                    <p className="text-muted-foreground">{device.meta}</p>
                  </div>
                  {device.current ? (
                    <Badge variant="secondary" className="border-[2px]">
                      Activa
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Cerrar
                    </Button>
                  )}
                </div>
              ))}
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="w-full">
                  Revisar dispositivos
                </Button>
                <Button variant="outline" className="w-full">
                  Configurar PIN temporal
                </Button>
              </div>
              <Button variant="destructive" className="w-full" asChild>
                <Link href="/auth/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="md:col-span-2">
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Skeleton className="h-10 w-40" />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
