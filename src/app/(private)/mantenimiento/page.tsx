
"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Wrench } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { tickets as mockTickets } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTicketSheet } from "./_components/create-ticket-sheet";

const statusMap: Record<Ticket['status'], { label: string; className: string }> = {
    open: { label: "Abierto", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50" },
    in_progress: { label: "En Progreso", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50" },
    resolved: { label: "Resuelto", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50" },
    closed: { label: "Cerrado", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50" },
};

export default function MantenimientoPage() {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setTickets(mockTickets);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleTicketCreated = (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'status' | 'unitId'>) => {
        const ticket: Ticket = {
            id: `t_${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'open',
            unitId: 'u_101',
            ...newTicket
        }
        setTickets(prev => [ticket, ...prev]);
        toast({
            title: "Ticket Enviado",
            description: "Tu solicitud de mantenimiento ha sido creada con éxito.",
        });
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Mantenimiento</h1>
                <CreateTicketSheet onTicketCreated={handleTicketCreated} />
            </div>
            
            {isLoading ? (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="flex flex-col">
                            <CardHeader>
                               <Skeleton className="h-5 w-3/4" />
                               <Skeleton className="h-4 w-1/2 mt-2" />
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-5/6" />
                                </div>
                            </CardContent>
                            <div className="p-4 pt-0">
                                <Skeleton className="h-9 w-full" />
                            </div>
                        </Card>
                    ))}
                 </div>
            ) : tickets.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket, i) => {
                        const status = statusMap[ticket.status];
                        return (
                            <Card 
                                key={ticket.id} 
                                className="flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg animate-slide-up-and-fade"
                                style={{animationDelay: `${i * 100}ms`}}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-base">{ticket.title}</CardTitle>
                                        <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                    </div>
                                    <CardDescription>
                                        #{ticket.id.split('_')[1]} &bull; Creado {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {ticket.description}
                                    </p>
                                </CardContent>
                                <div className="p-4 pt-0">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/mantenimiento/${ticket.id}`}>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Ver detalles
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Wrench}
                    title="No tienes tickets"
                    description="Crea un nuevo ticket para reportar un problema."
                    action={<CreateTicketSheet onTicketCreated={handleTicketCreated} />}
                />
            )}
        </main>
    )
}
