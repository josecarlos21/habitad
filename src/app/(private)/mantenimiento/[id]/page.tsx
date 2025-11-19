
"use client";

import React from "react";
import Link from "next/link";
import { tickets as mockTickets, user as mockUser } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { notFound, useRouter } from "next/navigation";
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
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap: Record<Ticket['status'], { label: string; variant: "destructive" | "info" | "warning" | "success" }> = {
    open: { label: "Abierto", variant: "destructive" },
    in_progress: { label: "En Progreso", variant: "info" },
    resolved: { label: "Resuelto", variant: "warning" },
    closed: { label: "Cerrado", variant: "success" },
};

const mockComments = [
    { id: 'c1', author: 'Residente Conectado', avatar: mockUser.imageUrl, text: 'Adjunto una foto del goteo para que puedan ver la intensidad.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
    { id: 'c2', author: 'Administración', avatar: 'https://i.pravatar.cc/150?u=admin', text: 'Recibido. Hemos asignado al personal de mantenimiento. Deberían pasar a revisar el día de mañana.', createdAt: new Date().toISOString() },
];

function TicketDetailSkeleton() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
            </div>
        </main>
    )
}


export default function TicketDetailPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const [ticket, setTicket] = React.useState<Ticket | null | undefined>(undefined);
    const [isResolving, setIsResolving] = React.useState(false);

    React.useEffect(() => {
        setTicket(undefined);
        const timer = setTimeout(() => {
            const foundTicket = mockTickets.find((t) => t.id === params.id);
            setTicket(foundTicket || null);
        }, 1000);
        return () => clearTimeout(timer);
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

    const handleResolveTicket = async () => {
        if (ticket) {
            setIsResolving(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setTicket(prev => prev ? { ...prev, status: 'resolved' } : null);
            toast({
                title: "Ticket Actualizado",
                description: "Has marcado el ticket como 'Resuelto'. Administración verificará la solución.",
            });
            setIsResolving(false);
        }
    };
    
    if (ticket === undefined) {
        return <TicketDetailSkeleton />;
    }

    if (ticket === null) {
        notFound();
    }

    const status = statusMap[ticket.status];

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/servicios?tab=mantenimiento">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Volver</span>
                    </Link>
                </Button>
                 <h1 className="text-xl font-semibold md:text-2xl">{ticket.title}</h1>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                    <CardTitle className="mt-2 text-2xl sr-only">{ticket.title}</CardTitle>
                                    <CardDescription className="mt-2">
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
                                 <Button variant="ghost" size="icon" type="button" aria-label="Adjuntar archivo" onClick={() => router.push('/maintenance')}>
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
                             <Button 
                                variant="secondary" 
                                className="w-full" 
                                onClick={handleResolveTicket} 
                                disabled={isResolving || ticket.status === 'resolved' || ticket.status === 'closed'}
                            >
                                {isResolving && <Spinner size="sm" className="mr-2" />}
                                {isResolving ? 'Actualizando...' : 'Marcar como Resuelto'}
                             </Button>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </main>
    );
}
