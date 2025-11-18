
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Calendar, CheckCircle, QrCode, Wrench } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { announcements, bookings, invoices, tickets, amenities } from "@/lib/mocks";
import type { Invoice, Ticket, Booking, Announcement } from "@/lib/types";

function NextPaymentCard({ invoice, isLoading }: { invoice: Invoice | undefined, isLoading: boolean }) {
  const { user } = useUser();
  
  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-1/3 mb-2" />
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
      <Card className="lg:col-span-2 flex flex-col items-center justify-center text-center p-8">
        <CardHeader>
          <CardTitle>¡Felicidades, {user?.name.split(' ')[0]}!</CardTitle>
          <CardDescription>Estás al corriente con tus pagos.</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <Button asChild variant="outline">
            <Link href="/pagos">Ver Historial de Pagos</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="lg:col-span-2 bg-gradient-to-tr from-primary/10 to-primary/20 text-primary-foreground shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary">Tu Próximo Pago</CardTitle>
        <CardDescription className="text-foreground/80">{invoice.concept}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-foreground">${invoice.amount.toLocaleString('es-MX')}</p>
        <p className="text-sm text-muted-foreground">Vence el {format(new Date(invoice.dueDate), "dd 'de' MMMM", { locale: es })}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/pagos">Pagar Ahora <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function QuickAccessCard({isLoading}: {isLoading: boolean}) {
    if (isLoading) {
        return (
             <Card>
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent className="flex flex-col items-center gap-2">
                    <Skeleton className="w-24 h-24 rounded-md" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
        )
    }
  return (
    <Card className="flex flex-col justify-center items-center text-center">
      <CardHeader>
        <CardTitle>Acceso Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <QrCode className="w-24 h-24 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Muestra este QR en la entrada</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href="/visitantes">Generar Pase de Visita</Link>
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
  emptyState
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
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {link && !isLoading && <Link href={link.href} className="text-sm text-primary hover:underline">{link.label}</Link>}
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
                emptyState || <p className="text-sm text-muted-foreground text-center py-4">No hay información disponible.</p>
            )}
          </CardContent>
          {footer && !isLoading && <CardFooter>{footer}</CardFooter>}
        </Card>
    )
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const nextPayment = invoices.find(inv => inv.status === 'pending' || inv.status === 'overdue');
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const upcomingBookings = bookings.slice(0, 2);
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NextPaymentCard invoice={nextPayment} isLoading={isLoading} />
        <QuickAccessCard isLoading={isLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
            title="Avisos Recientes"
            link={{href: "/avisos", label: "Ver todos"}}
            isLoading={isLoading}
            emptyState={<p className="text-sm text-muted-foreground text-center py-4">No hay avisos recientes.</p>}
        >
            {recentAnnouncements.length > 0 ? (
                <ul className="space-y-4">
                  {recentAnnouncements.map(ann => (
                    <li key={ann.id}>
                      <Link href="/avisos" className="block hover:bg-muted p-2 rounded-md">
                        <p className="font-semibold text-sm">{ann.title}</p>
                        <p className="text-xs text-muted-foreground">{ann.body.substring(0, 70)}...</p>
                      </Link>
                    </li>
                  ))}
                </ul>
            ) : null}
        </DashboardCard>

        <DashboardCard
          title="Tickets de Mantenimiento"
          icon={Wrench}
          link={{ href: "/mantenimiento", label: "Ver todos" }}
          isLoading={isLoading}
          footer={<Button size="sm" variant="outline" className="w-full" asChild><Link href="/mantenimiento/crear">Crear Nuevo Ticket</Link></Button>}
          emptyState={<p className="text-sm text-muted-foreground text-center py-4">No tienes tickets activos.</p>}
        >
            {activeTickets.length > 0 ? (
                 <ul className="space-y-2">
                  {activeTickets.slice(0, 3).map(ticket => (
                     <li key={ticket.id} className="flex items-center justify-between hover:bg-muted p-2 rounded-md">
                       <Link href={`/mantenimiento/${ticket.id}`} className="w-full">
                        <div>
                            <p className="text-sm font-medium">{ticket.title}</p>
                            <p className="text-xs text-muted-foreground">Abierto {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}</p>
                        </div>
                        </Link>
                        <Badge variant={ticket.status === 'open' ? "destructive" : "secondary"}>{ticket.status === 'open' ? 'Abierto' : 'En Progreso'}</Badge>
                     </li>
                  ))}
                 </ul>
            ) : null}
        </DashboardCard>
        
        <DashboardCard
            title="Próximas Reservas"
            icon={Calendar}
            link={{ href: "/reservas", label: "Ver todas" }}
            isLoading={isLoading}
            emptyState={<p className="text-sm text-muted-foreground text-center py-4">No tienes próximas reservas.</p>}
        >
            {upcomingBookings.length > 0 ? (
                <ul className="space-y-2">
                    {upcomingBookings.map(booking => (
                        <li key={booking.id} className="flex items-center justify-between hover:bg-muted p-2 rounded-md">
                           <Link href="/reservas" className="w-full">
                            <div>
                                <p className="text-sm font-medium">{amenities.find(a => a.id === booking.amenityId)?.name}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(booking.slot.start), "eeee dd 'de' MMMM, h:mm a", { locale: es })}</p>
                            </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ): null}
        </DashboardCard>
      </div>
    </main>
  );
}
