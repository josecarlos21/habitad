"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/use-user";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
    const { user } = useUser();

    if (!user) {
        return <div>Cargando perfil...</div>;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
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
                                <Input id="name" defaultValue={user.name} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input id="email" type="email" defaultValue={user.email} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" type="tel" defaultValue={user.phone} />
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0">
                           <Button>Guardar Cambios</Button>
                        </div>
                    </Card>
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
