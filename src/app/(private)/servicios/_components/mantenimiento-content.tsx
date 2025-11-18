
"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Wrench, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { tickets as mockTickets } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTicketSheet } from "../../servicios/_components/create-ticket-sheet";

const statusMap: Record<Ticket['status'], { label: string; className: string }> = {
    open: { label: "Abierto", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50" },
    in_progress: { label: "En Progreso", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50" },
    resolved: { label: "Resuelto", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50" },
    closed: { label: "Cerrado", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50" },
};

export default function MantenimientoPageContent() {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setTickets(mockTickets);
            setIsLoading(false);
        }, 300); // Reduced delay
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
        <div className="pt-4 animate-fade-in">
             <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">Reporta problemas y da seguimiento.</p>
                <CreateTicketSheet onTicketCreated={handleTicketCreated} />
            </div>
            
            {isLoading ? (
                 <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                 </div>
            ) : tickets.length > 0 ? (
                <div className="space-y-2">
                    {tickets.map((ticket, i) => {
                        const status = statusMap[ticket.status];
                        return (
                             <Link href={`/mantenimiento/${ticket.id}`} key={ticket.id} className="block group">
                                <Card 
                                    className="transition-all duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-lg group-hover:border-primary/20 animate-slide-up-and-fade"
                                    style={{animationDelay: `${i * 100}ms`}}
                                >
                                    <CardHeader className="flex-row items-center gap-4 p-4">
                                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                            <Wrench className="h-5 w-5"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm line-clamp-1">{ticket.title}</p>
                                            <CardDescription className="text-xs">
                                                #{ticket.id.split('_')[1]} &bull; Creado {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-4">
                                           <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                           <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            </Link>
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
        </div>
    )
}
