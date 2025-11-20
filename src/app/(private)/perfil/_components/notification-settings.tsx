"use client";

import * as React from "react";
import { mockNotificationPrefs } from "@/lib/mocks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { NotificationPref } from "@/lib/types";


export function NotificationSettings() {
    const { toast } = useToast();
    const [prefs, setPrefs] = React.useState<NotificationPref>(mockNotificationPrefs);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleChannelChange = (channel: 'push' | 'email', value: boolean) => {
        setPrefs(current => ({ ...current, channels: { ...current.channels, [channel]: value } }));
    };

    const handleCategoryChange = (category: keyof NotificationPref['categories'], value: boolean) => {
        setPrefs(current => ({ ...current, categories: { ...current.categories, [category]: value } }));
    };
    
    const handleSave = () => {
        setIsSaving(true);
        console.log("Saving preferences:", prefs);
        // Simular llamada a la API
        setTimeout(() => {
            setIsSaving(false);
            toast({
                title: "Preferencias Guardadas",
                description: "Tus ajustes de notificación han sido actualizados.",
            });
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferencias de Notificación</CardTitle>
                <CardDescription>Elige cómo y sobre qué quieres que te notifiquemos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Canales de Notificación */}
                <div className="space-y-4">
                    <h4 className="font-medium">Canales</h4>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                            <span>Notificaciones Push</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Recibe alertas instantáneas en tu dispositivo.
                            </span>
                        </Label>
                        <Switch id="push-notifications" checked={prefs.channels.push} onCheckedChange={(value) => handleChannelChange('push', value)} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                            <span>Correo Electrónico</span>
                             <span className="font-normal leading-snug text-muted-foreground">
                                Recibe un resumen y notificaciones importantes por email.
                            </span>
                        </Label>
                        <Switch id="email-notifications" checked={prefs.channels.email} onCheckedChange={(value) => handleChannelChange('email', value)} />
                    </div>
                </div>

                <Separator/>

                {/* Categorías de Notificación */}
                <div className="space-y-4">
                     <h4 className="font-medium">Categorías</h4>
                    <p className="text-sm text-muted-foreground">Activa o desactiva las notificaciones para cada tipo de evento.</p>

                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cat-finance">Finanzas y Pagos</Label>
                            <Switch id="cat-finance" checked={prefs.categories.finance} onCheckedChange={(value) => handleCategoryChange('finance', value)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cat-security">Seguridad y Accesos</Label>
                            <Switch id="cat-security" checked={prefs.categories.security} onCheckedChange={(value) => handleCategoryChange('security', value)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cat-bookings">Reservas de Amenidades</Label>
                            <Switch id="cat-bookings" checked={prefs.categories.bookings} onCheckedChange={(value) => handleCategoryChange('bookings', value)} />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="cat-maintenance">Mantenimiento</Label>
                            <Switch id="cat-maintenance" checked={prefs.categories.maintenance} onCheckedChange={(value) => handleCategoryChange('maintenance', value)} />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="cat-community">Comunidad</Label>
                            <Switch id="cat-community" checked={prefs.categories.community} onCheckedChange={(value) => handleCategoryChange('community', value)} />
                        </div>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</Button>
            </CardFooter>
        </Card>
    );
}
