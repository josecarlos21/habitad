
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Calendar, CheckCircle, QrCode, Wrench, Bell, Ticket, CreditCard, Package } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { announcements, bookings, invoices, tickets, amenities, visitorPasses, parcels } from "@/lib/mocks";
import type { Invoice, Ticket, Booking, Announcement, VisitorPass, Parcel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// Helper to combine and sort all relevant items into a single feed
const createActivityFeed = ({ announcements, tickets, bookings, visitorPasses, parcels }: { announcements: Announcement[], tickets: Ticket[], bookings: Booking[], visitorPasses: VisitorPass[], parcels: Parcel[] }) => {
    const announcementItems = announcements.map(item => ({ ...item, type: 'announcement', date: item.createdAt }));
    const ticketItems = tickets.map(item => ({ ...item, type: 'ticket', date: item.createdAt }));
    const bookingItems = bookings.map(item => ({ ...item, type: 'booking', date: item.slot.start }));
    const visitorPassItems = visitorPasses.map(item => ({ ...item, type: 'visitor_pass', date: item.validFrom }));
    const parcelItems = parcels.filter(p => p.status === 'at_guard').map(item => ({ ...item, type: 'parcel', date: item.arrivedAt }));


    const allItems = [...announcementItems, ...ticketItems, ...bookingItems, ...visitorPassItems, ...parcelItems];
    
    // Sort by date, most recent first
    return allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Map item types to their respective icons and links
const itemTypeDetails: Record<string, { icon: React.ElementType, link: string | ((id: string) => string), tab?: string }> = {
    announcement: { icon: Bell, link: "/comunidad", tab: "avisos" },
    ticket: { icon: Wrench, link: (id: string) => `/mantenimiento/${id}` },
    booking: { icon: Calendar, link: "/servicios", tab: "reservas" },
    payment: { icon: CreditCard, link: "/pagos" },
    visitor_pass: { icon: QrCode, link: "/accesos", tab: "visitantes" },
    parcel: { icon: Package, link: "/accesos", tab: "paqueteria" },
};


function PrimaryAction({ invoice, ticket, isLoading }: { invoice?: Invoice, ticket?: Ticket, isLoading: boolean }) {
    const { user } = useUser();

    if (isLoading) {
        return <Skeleton className="h-24 w-full" />;
    }

    // Priority: Overdue/Pending payment > Open ticket
    let item: {
        type: 'payment' | 'ticket',
        title: string,
        description: string,
        link: string,
        Icon: React.ElementType,
    } | null = null;
    
    if (invoice) {
        item = {
            type: 'payment',
            title: invoice.concept,
            description: `Vence el ${format(new Date(invoice.dueDate), "dd 'de' MMMM", { locale: es })} - $${invoice.amount.toLocaleString('es-MX')}`,
            link: itemTypeDetails.payment.link as string,
            Icon: itemTypeDetails.payment.icon,
        }
    } else if (ticket) {
         item = {
            type: 'ticket',
            title: ticket.title,
            description: `Abierto ${formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}`,
            link: (itemTypeDetails.ticket.link as (id: string) => string)(ticket.id),
            Icon: itemTypeDetails.ticket.icon,
        }
    }


    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight mb-4">Hola, {user?.name.split(' ')[0]}</h2>
            {item ? (
                 <Link href={item.link} className="block">
                     <Card className="bg-gradient-to-tr from-primary/10 via-card to-card text-foreground transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/40 hover:scale-[1.02]">
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                                <item.Icon className="h-6 w-6"/>
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base text-primary">Acción Requerida</CardTitle>
                                <p className="font-semibold">{item.title}</p>
                                <CardDescription>{item.description}</CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                    </Card>
                 </Link>
            ) : (
                <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
                    <CardHeader className="p-0">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <CardTitle>¡Todo en orden!</CardTitle>
                        <CardDescription>No tienes acciones pendientes por ahora.</CardDescription>
                    </CardHeader>
                </Card>
            )}
        </section>
    )
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const nextPayment = invoices.find(inv => inv.status === 'pending' || inv.status === 'overdue');
  const activeTicket = tickets.find(t => t.status === 'open' || t.status === 'in_progress');
  const activityFeed = createActivityFeed({announcements, tickets, bookings, visitorPasses, parcels});

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in">
       <PrimaryAction invoice={nextPayment} ticket={activeTicket} isLoading={isLoading} />
       
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                 <h2 className="text-lg font-semibold tracking-tight">Actividad Reciente</h2>
                 <Button variant="ghost" size="sm" asChild>
                    <Link href="/accesos">
                        <QrCode className="mr-2"/>
                        Acceso/Visitas
                    </Link>
                 </Button>
            </div>
            
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
            ) : (
                 <div className="flow-root">
                     <ul className="-mb-4">
                         {activityFeed.slice(0, 5).map((item: any, i) => {
                             const details = itemTypeDetails[item.type];
                             if (!details) return null;

                            const Icon = details.icon;
                            let link = typeof details.link === 'function' ? details.link(item.id) : details.link;
                            if (details.tab) {
                                link = `${link}?tab=${details.tab}`;
                            }

                             return (
                                 <li key={`${item.type}-${item.id}`} className="animate-slide-up-and-fade" style={{animationDelay: `${i * 100}ms`}}>
                                     <Link href={link} className="block p-4 hover:bg-muted/50 rounded-lg">
                                        <div className="relative pb-4">
                                            {i !== activityFeed.slice(0, 5).length - 1 && (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true"></span>
                                            )}
                                            <div className="relative flex items-start space-x-3">
                                                <div>
                                                    <div className="relative px-1">
                                                        <div className="grid h-8 w-8 place-items-center rounded-full bg-muted ring-4 ring-background">
                                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1 py-1.5">
                                                    <div className="text-sm">
                                                        {item.type === 'announcement' && <p className="font-semibold">{item.title}</p>}
                                                        {item.type === 'ticket' && <p className="font-semibold">{item.title}</p>}
                                                        {item.type === 'booking' && <p className="font-semibold">Reserva: {amenities.find(a => a.id === item.amenityId)?.name}</p>}
                                                        {item.type === 'visitor_pass' && <p className="font-semibold">Pase para: {item.visitorName}</p>}
                                                        {item.type === 'parcel' && <p className="font-semibold">Paquete de {item.carrier}</p>}
                                                        
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.type === 'announcement' && `Publicado ${formatDistanceToNow(new Date(item.date), { locale: es, addSuffix: true })}`}
                                                            {item.type === 'ticket' && `Creado ${formatDistanceToNow(new Date(item.date), { locale: es, addSuffix: true })}`}
                                                            {item.type === 'booking' && `${format(new Date(item.date), "eeee dd 'a las' h:mm a", { locale: es })}`}
                                                            {item.type === 'visitor_pass' && `Generado ${formatDistanceToNow(new Date(item.date), { locale: es, addSuffix: true })}`}
                                                            {item.type === 'parcel' && `Recibido ${formatDistanceToNow(new Date(item.date), { locale: es, addSuffix: true })}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                {item.type === 'ticket' && <Badge variant="outline">{item.status === 'open' ? 'Abierto' : 'En Progreso'}</Badge>}
                                                {item.type === 'booking' && <Badge variant="secondary">Confirmada</Badge>}
                                                {item.type === 'visitor_pass' && <Badge variant="secondary">Activo</Badge>}
                                                {item.type === 'parcel' && <Badge variant="outline" className="border-blue-300/50 bg-blue-100 text-blue-800">En conserjería</Badge>}
                                            </div>
                                        </div>
                                     </Link>
                                 </li>
                             )
                         })}
                     </ul>
                 </div>
            )}
        </section>

    </main>
  );
}

    

    