import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tickets } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

const statusMap: Record<Ticket['status'], { label: string; className: string }> = {
    open: { label: "Abierto", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50" },
    in_progress: { label: "En Progreso", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50" },
    resolved: { label: "Resuelto", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50" },
    closed: { label: "Cerrado", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50" },
};

export default function MantenimientoPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mantenimiento</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Ticket
                </Button>
            </div>
            
            {tickets.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map(ticket => {
                        const status = statusMap[ticket.status];
                        return (
                            <Card key={ticket.id} className="flex flex-col">
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
                                    <Button variant="outline" className="w-full asChild">
                                        <Link href="#">
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
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">No tienes tickets</h3>
                        <p className="text-sm text-muted-foreground">Crea un nuevo ticket para reportar un problema.</p>
                        <Button className="mt-4">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Crear Ticket
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}
