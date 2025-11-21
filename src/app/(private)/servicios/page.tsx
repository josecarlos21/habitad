
"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservasPageContent from "./_components/reservas-content";
import { Calendar, Wrench } from "lucide-react";

export default function ServiciosPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'reservas';

    const handleTabChange = (value: string) => {
        if (value === 'mantenimiento') {
            router.push('/mantenimiento');
            return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Servicios</h1>
            </div>

            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-lg">
                    <TabsTrigger value="reservas">
                        <Calendar className="mr-2 h-4 w-4" />
                        Reservas
                    </TabsTrigger>
                    <TabsTrigger value="mantenimiento">
                        <Wrench className="mr-2 h-4 w-4" />
                        Mantenimiento
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="reservas">
                    <ReservasPageContent />
                </TabsContent>
                 <TabsContent value="mantenimiento">
                    <div className="pt-4 text-center text-muted-foreground">
                        Redirigiendo a Mantenimiento...
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
}
