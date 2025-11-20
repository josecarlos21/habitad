
"use client";

import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvisosPageContent from "./_components/avisos-content";
import AsambleasPageContent from "./_components/asambleas-content";

export default function ComunidadPage() {
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')
    
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Comunidad</h1>
            <Tabs defaultValue={tab || "avisos"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="avisos">Avisos</TabsTrigger>
                    <TabsTrigger value="asambleas">Asambleas</TabsTrigger>
                </TabsList>
                <TabsContent value="avisos">
                    <AvisosPageContent />
                </TabsContent>
                <TabsContent value="asambleas">
                    <AsambleasPageContent />
                </TabsContent>
            </Tabs>
        </main>
    );
}
