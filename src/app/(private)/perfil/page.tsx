
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { LogOut, Mail, Phone, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/empty-state";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

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
        return <ProfileSkeleton />
    }

    if (!user) {
        return (
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <h1 className="text-2xl font-bold">Mi Perfil</h1>
                 <EmptyState icon={UserIcon} title="No se pudo cargar tu perfil" description="Hubo un problema al recuperar tus datos. Por favor, intenta de nuevo."/>
            </main>
        )
    }

    const unitLabel = `${user.units[0].tower}-${user.units[0].number}`;

    return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
            <PageHeader
                title="Mi perfil"
                description="Actualiza tus datos personales, preferencias y métodos de contacto."
                actions={
                    <Button variant="ghost" className="gap-2" asChild>
                        <Link href="/settings">Ir a ajustes</Link>
                    </Button>
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Unidad principal" description="Torre - número" value={unitLabel} icon={Shield} isLoading={false}/>
                <StatCard title="Rol" description="Tipo de acceso" value={user.role === "resident" ? "Residente" : user.role} icon={UserIcon} isLoading={false}/>
                <StatCard title="Contacto" description="Correo verificado" value={user.email ?? "Pendiente"} icon={Mail} isLoading={false}/>
                <StatCard title="Teléfono" description="Usado para alertas" value={user.phone ?? "Completar"} icon={Phone} isLoading={false}/>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información personal</CardTitle>
                                <CardDescription>Mantén tus datos actualizados para que la administración pueda contactarte.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
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
                                    <Input id="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="+52 55 0000 0000"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notas de acceso</Label>
                                    <Textarea id="notes" placeholder="Ej. alergias, indicaciones especiales para visitantes"/>
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button type="submit">Guardar cambios</Button>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Preferencias de notificación</CardTitle>
                                <CardDescription>Elige cómo quieres recibir avisos y alertas.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { id: "notif-email", label: "Correo electrónico", desc: "Recibe estados de cuenta y avisos oficiales.", defaultChecked: true },
                                    { id: "notif-push", label: "Notificaciones push", desc: "Alertas inmediatas de seguridad y visitas.", defaultChecked: true },
                                    { id: "notif-sms", label: "SMS", desc: "Sólo se usará en alertas críticas.", defaultChecked: false },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <Switch id={item.id} defaultChecked={item.defaultChecked} aria-label={item.label}/>
                                    </div>
                                ))}
                            </CardContent>
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
                                    <CardDescription>{user.role === "resident" ? "Residente" : user.role}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>Unidad: {unitLabel}</p>
                            <p>Correo: {user.email}</p>
                            <p>Teléfono: {user.phone ?? "Pendiente"}</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full">
                                Actualizar foto
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Seguridad</CardTitle>
                            <CardDescription>Gestiona tus accesos y sesiones.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full">
                                Revisar dispositivos
                            </Button>
                            <Button variant="outline" className="w-full">
                                Configurar PIN temporal
                            </Button>
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

function ProfileSkeleton() {
    return (
         <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>Estos son tus datos personales. Mantenlos actualizados.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre completo</Label>
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0">
                           <Button disabled>Guardar Cambios</Button>
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-20" />
                                 </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-24" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Zona de Peligro</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-full" disabled>
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
