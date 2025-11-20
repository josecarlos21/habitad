
"use client";

import React from "react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockNotifications } from "@/lib/mocks";
import type { Notification } from "@/lib/types";
import { Bell, Package, Users, Wrench, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/app/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

type NotificationCategory = 'announcement' | 'maintenance' | 'community' | 'parcels' | 'finance';

const categoryMap: Record<NotificationCategory, { icon: React.ElementType, defaultTitle: string }> = {
    announcement: { icon: Bell, defaultTitle: "Nuevo Aviso" },
    maintenance: { icon: Wrench, defaultTitle: "Actualización de Mantenimiento" },
    community: { icon: Users, defaultTitle: "Actividad de la Comunidad" },
    parcels: { icon: Package, defaultTitle: "Paquete Recibido" },
    finance: { icon: CreditCard, defaultTitle: "Notificación de Finanzas" },
};

export default function NotificacionesPage() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            // Sort by date, most recent first
            const sorted = [...mockNotifications].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setNotifications(sorted);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    };

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in">
             <div className="flex items-center gap-4 mb-6">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notificaciones</h1>
                    <p className="text-muted-foreground">Mantente al día con todo lo que sucede.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notification, i) => {
                        const category = categoryMap[notification.category as NotificationCategory];
                        const isRead = !!notification.readAt;
                        return (
                            <Card 
                                key={notification.id}
                                onClick={() => handleMarkAsRead(notification.id)}
                                className={cn(
                                    "transition-all duration-300 ease-in-out hover:shadow-soft animate-slide-up-and-fade cursor-pointer group",
                                    !isRead && "border-primary/50 bg-primary/5"
                                )}
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    {!isRead && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0"></div>
                                    )}
                                    <div className={cn("grid h-10 w-10 place-items-center rounded-lg shrink-0", !isRead ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                                        <category.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.body}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(notification.createdAt), { locale: es, addSuffix: true })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState 
                    icon={Bell}
                    title="Todo en calma"
                    description="No tienes notificaciones nuevas."
                />
            )}
        </main>
    );
}
