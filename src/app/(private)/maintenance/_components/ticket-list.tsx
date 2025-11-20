
"use client";

import * as React from "react";
import Link from "next/link";
import { mockTickets } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const TicketStatusBadge = ({ status }: { status: Ticket['status'] }) => {
    const statusMap = {
        closed: { label: 'Cerrado', className: 'bg-green-100 text-green-800 border-green-200' },
        resolved: { label: 'Resuelto', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        in_progress: { label: 'En Progreso', className: 'bg-blue-100 text-blue-800 border-blue-200' },
        open: { label: 'Abierto', className: 'bg-red-100 text-red-800 border-red-200' },
    };
    const currentStatus = statusMap[status] || { label: status, className: ''};

    return (
        <Badge
            variant={'outline'}
            className={cn('capitalize', currentStatus.className)}
        >
            {currentStatus.label}
        </Badge>
    )
};

export function TicketList() {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        // Simula la carga de datos desde una API
        const timer = setTimeout(() => {
            // Ordenamos los tickets para mostrar los más recientes primero
            const sortedTickets = [...mockTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTickets(sortedTickets);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/4 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                           <Skeleton className="h-5 w-24" />
                           <Skeleton className="h-9 w-28" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <Card key={ticket.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg leading-tight max-w-xs md:max-w-md">{ticket.title}</CardTitle>
                            <TicketStatusBadge status={ticket.status} />
                        </div>
                        <div className="text-sm pt-1 text-muted-foreground">
                            {`#${ticket.id.split('_')[1]} • Creado ${formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: es })}`}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground truncate">
                            {ticket.description}
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Tag className="w-4 h-4" />
                            <span>{ticket.category}</span>
                        </div>
                        <Button asChild variant="secondary" size="sm">
                            <Link href={`/mantenimiento/${ticket.id}`}>
                                Ver Detalles
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

    