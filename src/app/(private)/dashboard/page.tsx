
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Calendar, CheckCircle, QrCode, Wrench, Bell, Users, CreditCard, Package } from "lucide-react";
import { useCondoUser } from "@/hooks/use-condo-user";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Charge, Incident, AmenityBooking, Announcement, VisitorPass, Parcel, Assembly } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";

// Helper to combine and sort all relevant items into a single feed
const createActivityFeed = ({ announcements, incidents, bookings, visitorPasses, parcels, assemblies }: { announcements: Announcement[] | null, incidents: Incident[] | null, bookings: AmenityBooking[] | null, visitorPasses: VisitorPass[] | null, parcels: Parcel[] | null, assemblies: Assembly[] | null }) => {
    const announcementItems = announcements?.map(item => ({ ...item, type: 'announcement', date: item.createdAt, title: item.title, description: `Publicado ${formatDistanceToNow(new Date(item.createdAt), { locale: es, addSuffix: true })}` })) || [];
    const incidentItems = incidents?.map(item => ({ ...item, type: 'incident', date: item.createdAt, title: item.title, description: `Creado ${formatDistanceToNow(new Date(item.createdAt), { locale: es, addSuffix: true })}` })) || [];
    const bookingItems = bookings?.map(item => ({ ...item, type: 'booking', date: item.start, title: `Reserva: ${item.amenityId}`, description: format(new Date(item.start), "eeee dd 'a las' h:mm a", { locale: es }) })) || [];
    const visitorPassItems = visitorPasses?.map(item => ({ ...item, type: 'visitor_pass', date: item.validFrom, title: `Pase para: ${item.visitorName}`, description: `Generado ${formatDistanceToNow(new Date(item.validFrom), { locale: es, addSuffix: true })}` })) || [];
    const parcelItems = parcels?.filter(p => p.status === 'at_guard').map(item => ({ ...item, type: 'parcel', date: item.arrivedAt, title: `Paquete de ${item.carrier}`, description: `Recibido ${formatDistanceToNow(new Date(item.arrivedAt), { locale: es, addSuffix: true })}` })) || [];
    const assemblyItems = assemblies?.filter(a => a.status === 'OPEN').map(item => ({ ...item, type: 'assembly', date: item.scheduledAt, title: item.title, description: `Próximo ${format(new Date(item.scheduledAt), "eeee dd 'de' MMMM", { locale: es })}` })) || [];


    const allItems = [...announcementItems, ...incidentItems, ...bookingItems, ...visitorPassItems, ...parcelItems, ...assemblyItems];
    
    // Sort by date, most recent first
    return allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Map item types to their respective icons and links
const itemTypeDetails: Record<string, { icon: React.ElementType, link: string | ((id: string) => string), tab?: string, badge?: (item: any) => React.ReactNode }> = {
    announcement: { icon: Bell, link: "/comunidad", tab: "avisos" },
    incident: { icon: Wrench, link: (id: string) => `/mantenimiento/${id}`, badge: (item) => <Badge variant={item.status === 'OPEN' ? 'destructive' : 'info'}>{item.status === 'OPEN' ? 'Abierto' : 'En Progreso'}</Badge> },
    booking: { icon: Calendar, link: "/servicios", tab: "reservas", badge: () => <Badge variant="secondary">Confirmada</Badge> },
    payment: { icon: CreditCard, link: "/pagos" },
    visitor_pass: { icon: QrCode, link: "/accesos", tab: "visitantes", badge: () => <Badge variant="success">Activo</Badge> },
    parcel: { icon: Package, link: "/accesos", tab: "paqueteria", badge: () => <Badge variant="info">En conserjería</Badge> },
    assembly: { icon: Users, link: "/comunidad", tab: "asambleas", badge: () => <Badge variant="warning">Activa</Badge> },
};


function PrimaryAction({ charge, incident, isLoading }: { charge?: Charge, incident?: Incident, isLoading: boolean }) {
    const { user } = useCondoUser();

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="flex-row items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardHeader>
            </Card>
        );
    }

    // Priority: Overdue/Pending payment > Open incident
    let item: {
        type: 'payment' | 'incident',
        title: string,
        description: string,
        link: string,
        Icon: React.ElementType,
    } | null = null;
    
    if (charge) {
        item = {
            type: 'payment',
            title: charge.description,
            description: `Vence el ${format(new Date(charge.dueDate), "dd 'de' MMMM", { locale: es })} - $${charge.amount.toLocaleString('es-MX')}`,
            link: `/pagos/${charge.id}`,
            Icon: itemTypeDetails.payment.icon,
        }
    } else if (incident) {
         item = {
            type: 'incident',
            title: incident.title,
            description: `Abierto ${formatDistanceToNow(new Date(incident.createdAt), { locale: es, addSuffix: true })}`,
            link: (itemTypeDetails.incident.link as (id: string) => string)(incident.id),
            Icon: itemTypeDetails.incident.icon,
        }
    }


    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight mb-4">Hola, {user?.name.split(' ')[0]}</h2>
            {item ? (
                 <Link href={item.link} className="block group">
                     <Card className="bg-gradient-to-tr from-primary/10 via-card to-card text-foreground transition-all duration-300 ease-in-out group-hover:shadow-soft group-hover:border-primary/40 group-hover:scale-[1.02]">
                        <CardHeader className="flex-row items-center gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                                <item.Icon className="h-6 w-6"/>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-primary">Acción Requerida</p>
                                <CardTitle className="text-base">{item.title}</CardTitle>
                                <CardDescription>{item.description}</CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
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
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useCondoUser();

    // Fetch all required data using our hooks
    const incidentsQuery = useMemo(() => !firestore || !user ? null : query(collection(firestore, `condos/${user.condoId}/incidents`), where('status', 'in', ['OPEN', 'IN_PROGRESS']), orderBy('createdAt', 'desc'), limit(5)), [firestore, user]);
    const chargesQuery = useMemo(() => !firestore || !user ? null : query(collection(firestore, `condos/${user.condoId}/charges`), where('status', 'in', ['OPEN', 'PARTIALLY_PAID']), orderBy('dueDate', 'asc')), [firestore, user]);
    const passesQuery = useMemo(() => !firestore || !user ? null : query(collection(firestore, `condos/${user.condoId}/visitor-passes`), where('userId', '==', user.userId), orderBy('validFrom', 'desc'), limit(5)), [firestore, user]);
    const parcelsQuery = useMemo(() => {
        if (!firestore || !user || user.units.length === 0) return null;
        return query(collection(firestore, `condos/${user.condoId}/parcels`), where('unitId', 'in', user.units.map(u=>u.id)), orderBy('arrivedAt', 'desc'), limit(5));
    }, [firestore, user]);
    const announcementsQuery = useMemo(() => !firestore || !user ? null : query(collection(firestore, `condos/${user.condoId}/announcements`), orderBy('createdAt', 'desc'), limit(5)), [firestore, user]);
    const assembliesQuery = useMemo(() => !firestore || !user ? null : query(collection(firestore, `condos/${user.condoId}/assemblies`), orderBy('scheduledAt', 'desc'), limit(5)), [firestore, user]);
    // Bookings are not yet implemented in this version
    // const bookingsQuery = ...

    const { data: incidents, isLoading: isIncidentsLoading } = useCollection<Incident>(incidentsQuery);
    const { data: charges, isLoading: isChargesLoading } = useCollection<Charge>(chargesQuery);
    const { data: visitorPasses, isLoading: isPassesLoading } = useCollection<VisitorPass>(passesQuery);
    const { data: parcels, isLoading: isParcelsLoading } = useCollection<Parcel>(parcelsQuery);
    const { data: announcements, isLoading: isAnnouncementsLoading } = useCollection<Announcement>(announcementsQuery);
    const { data: assemblies, isLoading: isAssembliesLoading } = useCollection<Assembly>(assembliesQuery);

    const isLoading = isUserLoading || isIncidentsLoading || isChargesLoading || isPassesLoading || isParcelsLoading || isAnnouncementsLoading || isAssembliesLoading;

    const nextPayment = charges?.[0];
    const activeIncident = incidents?.[0];
    const activityFeed = createActivityFeed({ announcements, incidents, bookings: null, visitorPasses, parcels, assemblies });

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in">
           <PrimaryAction charge={nextPayment} incident={activeIncident} isLoading={isLoading} />
       
            <section className="space-y-2">
                <div className="flex items-center justify-between">
                     <h2 className="text-lg font-semibold tracking-tight">Actividad Reciente</h2>
                     <Button variant="ghost" size="sm" asChild>
                        <Link href="/accesos">
                            <QrCode className="mr-2 h-4 w-4"/>
                            Acceso/Visitas
                        </Link>
                     </Button>
                </div>
            
                {isLoading ? (
                    <div className="space-y-2 pt-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                    </div>
                ) : (
                     <div className="space-y-2">
                         {activityFeed.slice(0, 5).map((item: any, i) => {
                             const details = itemTypeDetails[item.type];
                             if (!details) return null;

                            const Icon = details.icon;
                            let link = typeof details.link === 'function' ? details.link(item.id) : details.link;
                            if (details.tab) {
                                link = `${link}?tab=${details.tab}`;
                            }

                             return (
                                 <Link href={link} key={`${item.type}-${item.id}`} className="block group">
                                    <Card 
                                        className="transition-all duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-soft group-hover:border-primary/20 animate-slide-up-and-fade" 
                                        style={{animationDelay: `${i * 100}ms`}}
                                    >
                                        <CardHeader className="flex-row items-center gap-4 p-4">
                                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5"/>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                              {details.badge && details.badge(item)}
                                              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                             )
                         })}
                     </div>
                )}
            </section>
        </main>
    );
}

    