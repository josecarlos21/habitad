
"use client";

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvisosContent } from "./_components/avisos-content";
import { AsambleasContent } from "./_components/asambleas-content";

function ComunidadContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    return (
        <Tabs defaultValue={tab || "avisos"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="avisos">Avisos</TabsTrigger>
                <TabsTrigger value="asambleas">Asambleas</TabsTrigger>
            </TabsList>
            <TabsContent value="avisos">
                <AvisosContent />
            </TabsContent>
            <TabsContent value="asambleas">
                <AsambleasContent />
            </TabsContent>
        </Tabs>
    );
}

export default function ComunidadPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Comunidad</h1>
            <Suspense fallback={<div>Cargando...</div>}>
                <ComunidadContent />
            </Suspense>
        </main>
    );
}
