
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilPage() {
    const { user, isLoading } = useUser();
    const { toast } = useToast();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Perfil Actualizado",
            description: "Tus datos personales han sido guardados con éxito.",
        });
    }

    if (isLoading) {
        return (
            <main className="flex-1 p-4 md:p-8 animate-fade-in">
                <Skeleton className="h-8 w-40 mb-8" />
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-32" />
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
                 <EmptyState icon={UserIcon} title="No se pudo cargar tu perfil" description="Hubo un problema al recuperar tus datos. Por favor, intenta de nuevo."/>
            </main>
        )
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Mi Perfil</h1>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                                <CardDescription>Estos son tus datos personales. Mantenlos actualizados.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input id="name" defaultValue={user.name} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input id="email" type="email" defaultValue={user.email} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" type="tel" defaultValue={user.phone} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Guardar Cambios</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.imageUrl} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>Residente</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                <p>Unidad: {user.units[0].tower}-{user.units[0].number}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zona de Peligro</CardTitle>
                             <CardDescription>Esta acción cerrará tu sesión en este dispositivo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-full" asChild>
                                <Link href="/auth/login">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Cerrar sesión
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
