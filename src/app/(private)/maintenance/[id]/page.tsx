
import { mockTickets } from "@/lib/mocks";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/lib/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineTitle, TimelineIcon, TimelineDescription } from "@/components/ui/timeline";
import { CheckCircle, Clock, Wrench } from "lucide-react";

// --- Helper Components ---

const TicketStatusBadge = ({ status }: { status: Ticket['status'] }) => (
    <Badge
        variant={status === 'Resuelto' ? 'default' : status === 'En Progreso' ? 'secondary' : 'destructive'}
        className={cn(
            'capitalize text-sm',
            status === 'Resuelto' && 'bg-green-100 text-green-800 border-green-200',
            status === 'En Progreso' && 'bg-blue-100 text-blue-800 border-blue-200',
            status === 'Abierto' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
        )}
    >
        {status}
    </Badge>
);

const StatusIcon = ({ status }: { status: Ticket['status'] }) => {
    switch (status) {
        case 'Resuelto':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'En Progreso':
            return <Wrench className="w-5 h-5 text-blue-500 animate-pulse" />;
        case 'Abierto':
            return <Clock className="w-5 h-5 text-yellow-500" />;
        default:
            return <Clock className="w-5 h-5" />;
    }
};

// --- Main Page Component ---

export default function TicketDetailPage({ params }: { params: { id: string } }) {

    // Simula la búsqueda del ticket en la "base de datos"
    const ticket = mockTickets.find(t => t.id === params.id);

    if (!ticket) {
        notFound(); // Muestra la página 404 si el ticket no existe
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <header>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground">Ticket #{ticket.id}</p>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{ticket.title}</h1>
                    </div>
                    <div className="flex items-center justify-start md:justify-end space-x-2 pt-1">
                         <TicketStatusBadge status={ticket.status} />
                    </div>
                </div>
            </header>

            {/* Ticket Details */}
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {/* Description Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Descripción del Problema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                        </CardContent>
                    </Card>

                    {/* History Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Actualizaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Timeline>
                                {ticket.history.map((entry, index) => (
                                    <TimelineItem key={index}>
                                        <TimelineConnector />
                                        <TimelineHeader>
                                            <TimelineIcon><StatusIcon status={entry.status} /></TimelineIcon>
                                            <TimelineTitle>{entry.status}</TimelineTitle>
                                            <p className="text-xs text-muted-foreground ml-auto">{format(new Date(entry.date), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}</p>
                                        </TimelineHeader>
                                        <TimelineDescription>
                                            {entry.comments}
                                        </TimelineDescription>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </CardContent>
                    </Card>
                </div>

                {/* Metadata Card */}
                <aside className="space-y-6 md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Prioridad:</span>
                                <span className="font-medium">{ticket.priority}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Área:</span>
                                <span className="font-medium">{ticket.area}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Creado:</span>
                                <span className="font-medium">{format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Última act.:</span>
                                <span className="font-medium">{format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}</span>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
