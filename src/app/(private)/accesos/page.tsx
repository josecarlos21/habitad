
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisitantesPageContent from "./_components/visitantes-content";
import PaqueteriaPageContent from "./_components/paqueteria-content";

function AccesosContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    return (
        <Tabs defaultValue={tab || "visitantes"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="visitantes">Visitantes</TabsTrigger>
                <TabsTrigger value="paqueteria">Paquetería</TabsTrigger>
            </TabsList>
            <TabsContent value="visitantes">
                <VisitantesPageContent />
            </TabsContent>
            <TabsContent value="paqueteria">
                <PaqueteriaPageContent />
            </TabsContent>
        </Tabs>
    );
}

export default function AccesosPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Control de Accesos</h1>
            <Suspense fallback={<div>Cargando...</div>}>
                <AccesosContent />
            </Suspense>
        </main>
    );
}
