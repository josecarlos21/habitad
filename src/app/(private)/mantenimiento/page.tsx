
"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, PlusCircle, Wrench } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { tickets as mockTickets } from "@/lib/mocks";
import type { Ticket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap: Record<Ticket['status'], { label: string; className: string }> = {
    open: { label: "Abierto", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300/50" },
    in_progress: { label: "En Progreso", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300/50" },
    resolved: { label: "Resuelto", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50" },
    closed: { label: "Cerrado", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50" },
};

function CreateTicketSheet() {
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Here you would normally handle form submission to a server
        toast({
            title: "Ticket Enviado",
            description: "Tu solicitud de mantenimiento ha sido creada con éxito.",
        });
        setOpen(false); // Close sheet after submission
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nuevo Ticket
                </Button>
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>Crear Nuevo Ticket de Mantenimiento</SheetTitle>
                        <SheetDescription>
                            Describe el problema que estás experimentando. Tu ticket será asignado al personal correspondiente.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" placeholder="Ej: Fuga de agua en el baño" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plumbing">Plomería</SelectItem>
                                    <SelectItem value="electrical">Electricidad</SelectItem>
                                    <SelectItem value="common_area">Área Común</SelectItem>
                                    <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea id="description" placeholder="Describe el problema a detalle..." required/>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button type="submit">Enviar Ticket</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default function MantenimientoPage() {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setTickets(mockTickets);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mantenimiento</h1>
                <CreateTicketSheet />
            </div>
            
            {isLoading ? (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <EmptyState
                    icon={Wrench}
                    title="No tienes tickets"
                    description="Crea un nuevo ticket para reportar un problema."
                    action={<CreateTicketSheet />}
                />
            )}
        </main>
    )
}
