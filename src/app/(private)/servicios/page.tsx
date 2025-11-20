
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservasPageContent from "./_components/reservas-content";
import MantenimientoPageContent from "./_components/mantenimiento-content";

function ServiciosContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const handleTabChange = (value: string) => {
        router.replace(`/servicios?tab=${value}`, { scroll: false });
    };
    
    return (
        <Tabs 
            value={tab || "reservas"} 
            className="w-full" 
            onValueChange={handleTabChange}
            activationMode="automatic"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reservas">Reservar Amenidades</TabsTrigger>
                <TabsTrigger value="mantenimiento">Tickets de Mantenimiento</TabsTrigger>
            </TabsList>
            <TabsContent value="reservas">
                <ReservasPageContent />
            </TabsContent>
            <TabsContent value="mantenimiento">
                <MantenimientoPageContent />
            </TabsContent>
        </Tabs>
    );
}

export default function ServiciosPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Servicios y Reportes</h1>
            <Suspense fallback={<div>Cargando...</div>}>
                <ServiciosContent />
            </Suspense>
        </main>
    );
}
