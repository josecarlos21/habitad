
"use client";

import React from "react";
import Link from "next/link";
import { mockIncidents, mockUser } from "@/lib/mocks";
import type { Incident } from "@/lib/types";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Paperclip, Send, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap: Record<Incident['status'], { label: string; variant: "destructive" | "info" | "warning" | "success" }> = {
    OPEN: { label: "Abierto", variant: "destructive" },
    IN_PROGRESS: { label: "En Progreso", variant: "info" },
    WAITING_EXTERNAL: { label: "En Espera", variant: "info" },
    RESOLVED: { label: "Resuelto", variant: "warning" },
    CANCELLED: { label: "Cancelado", variant: "success" },
};

const mockComments = [
    { id: 'c1', author: 'Residente Conectado', avatar: mockUser.imageUrl, text: 'Adjunto una foto del goteo para que puedan ver la intensidad.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
    { id: 'c2', author: 'Administración', avatar: 'https://i.pravatar.cc/150?u=admin', text: 'Recibido. Hemos asignado al personal de mantenimiento. Deberían pasar a revisar el día de mañana.', createdAt: new Date().toISOString() },
];

function IncidentDetailSkeleton() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-7 w-48" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                        <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                         <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                         <CardContent className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-10 w-full mt-2" />
                         </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const [incident, setIncident] = React.useState<Incident | null | undefined>(undefined);
    const [isResolving, setIsResolving] = React.useState(false);

    React.useEffect(() => {
        setIsResolving(false);
        const foundIncident = mockIncidents.find((t) => t.id === params.id);
        // Simulate loading
        const timer = setTimeout(() => {
            setIncident(foundIncident || null);
        }, 500);
        return () => clearTimeout(timer);
    }, [params.id]);


    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('comment') as HTMLInputElement;
        if (input && input.value) {
            toast({
                title: "Comentario enviado",
                description: "Tu mensaje ha sido añadido al incidente.",
            });
            input.value = "";
        }
    };

    const handleResolveIncident = async () => {
        if (incident) {
            setIsResolving(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIncident(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
            toast({
                title: "Incidente Actualizado",
                description: "Has marcado el incidente como 'Resuelto'. Administración verificará la solución.",
            });
            setIsResolving(false);
        }
    };
    
    if (incident === undefined) {
        return <IncidentDetailSkeleton />;
    }

    if (incident === null) {
        notFound();
    }

    const status = statusMap[incident.status];

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/servicios?tab=mantenimiento">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Volver</span>
                    </Link>
                </Button>
                 <h1 className="text-xl font-semibold md:text-2xl">{incident.title}</h1>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                    <CardTitle className="mt-2 text-2xl sr-only">{incident.title}</CardTitle>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Incidente #{incident.id.split('_')[1]} &bull; Creado {formatDistanceToNow(new Date(incident.createdAt), { locale: es, addSuffix: true })}
                                    </div>
                                </div>
                                <Wrench className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <p className="text-foreground/80">{incident.description}</p>
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
                        <CardContent>
                            <form onSubmit={handleCommentSubmit} className="flex w-full items-center gap-2">
                                <Input name="comment" placeholder="Escribe un comentario..." />
                                 <Button variant="ghost" size="icon" type="button" aria-label="Adjuntar archivo">
                                    <Paperclip className="h-5 w-5"/>
                                </Button>
                                <Button size="icon" type="submit" aria-label="Enviar comentario">
                                    <Send className="h-5 w-5"/>
                                </Button>
                            </form>
                        </CardContent>
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
                                <span>{incident.category.charAt(0).toUpperCase() + incident.category.slice(1)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Creado por</span>
                                <span>{mockUser.name}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Unidad</span>
                                <span>{mockUser.units[0].code}</span>
                            </div>
                             <Separator />
                             <Button 
                                variant="secondary" 
                                className="w-full" 
                                onClick={handleResolveIncident} 
                                disabled={isResolving || incident.status === 'RESOLVED' || incident.status === 'CANCELLED'}
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
