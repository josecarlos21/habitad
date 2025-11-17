
"use client";

import React from "react";
import Link from "next/link";
import { user as mockUser } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Paperclip, Send, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/page-header";
import { fetchTicketById } from "@/services/mock-api";

const statusMap: Record<Ticket['status'], { label: string; className: string }> = {
    open: { label: "Abierto", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50" },
    in_progress: { label: "En Progreso", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50" },
    resolved: { label: "Resuelto", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50" },
    closed: { label: "Cerrado", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50" },
};

const mockComments = [
    { id: 'c1', author: 'Residente Conectado', avatar: mockUser.imageUrl, text: 'Adjunto una foto del goteo para que puedan ver la intensidad.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
    { id: 'c2', author: 'Administración', avatar: 'https://i.pravatar.cc/150?u=admin', text: 'Recibido. Hemos asignado al personal de mantenimiento. Deberían pasar a revisar el día de mañana.', createdAt: new Date().toISOString() },
];

export default function TicketDetailPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const [ticket, setTicket] = React.useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        const loadTicket = async () => {
            setIsLoading(true);
            const data = await fetchTicketById(params.id);
            if (isMounted) {
                setTicket(data);
                setIsLoading(false);
            }
        };
        loadTicket();
        return () => {
            isMounted = false;
        };
    }, [params.id]);


    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('comment') as HTMLInputElement;
        if (input && input.value) {
            toast({
                title: "Comentario enviado",
                description: "Tu mensaje ha sido añadido al ticket.",
            });
            input.value = "";
        }
    };
    
    if (isLoading) {
        return (
             <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-24" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                     <div>
                        <Skeleton className="h-[250px] w-full" />
                    </div>
                </div>
            </main>
        )
    }

    if (!ticket) {
        notFound();
    }

    const status = statusMap[ticket.status];

    return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
            <PageHeader
                title={ticket.title}
                description={`Ticket #${ticket.id.split('_')[1]} · ${formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}`}
                actions={
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/mantenimiento">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                }
            />
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <Badge variant="outline" className={status.className}>{status.label}</Badge>
                                    <CardTitle className="mt-2 text-2xl">{ticket.title}</CardTitle>
                                    <CardDescription>
                                        Ticket #{ticket.id.split('_')[1]} &bull; Creado {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}
                                    </CardDescription>
                                </div>
                                <Wrench className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <p className="text-foreground/80">{ticket.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Comentarios</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {mockComments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={comment.avatar} />
                                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-baseline justify-between">
                                            <p className="font-semibold">{comment.author}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(comment.createdAt), { locale: es, addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-muted/50 rounded-lg mt-1">
                                            <p className="text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <form onSubmit={handleCommentSubmit} className="flex w-full items-center gap-2">
                                <Input name="comment" placeholder="Escribe un comentario..." />
                                 <Button variant="ghost" size="icon" type="button" aria-label="Adjuntar archivo">
                                    <Paperclip className="h-5 w-5"/>
                                </Button>
                                <Button size="icon" type="submit" aria-label="Enviar comentario">
                                    <Send className="h-5 w-5"/>
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Categoría</span>
                                <span>{ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Creado por</span>
                                <span>{mockUser.name}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Unidad</span>
                                <span>{mockUser.units[0].tower}-{mockUser.units[0].number}</span>
                            </div>
                             <Separator />
                             <Button variant="secondary" className="w-full">Marcar como Resuelto</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Línea de tiempo</CardTitle>
                            <CardDescription>Seguimiento rápido del ticket.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {[
                                { label: "Ticket creado", time: ticket.createdAt },
                                { label: "Asignado a mantenimiento", time: ticket.createdAt },
                                { label: "Visita programada", time: new Date().setDate(new Date().getDate() + 1) },
                            ].map((event, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                                    <div>
                                        <p className="font-medium">{event.label}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(event.time), "dd MMM yyyy, HH:mm", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </main>
    );
}
