
"use client";

import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservasPageContent from "./_components/reservas-content";
import MantenimientoPageContent from "./_components/mantenimiento-content";

export default function ServiciosPage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')

    const handleTabChange = (value: string) => {
        router.push(`/servicios?tab=${value}`);
    };
    
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Servicios</h1>
            <Tabs 
                defaultValue={tab || "reservas"} 
                className="w-full" 
                onValueChange={handleTabChange}
                activationMode="manual"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reservas">Reservas</TabsTrigger>
                    <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
                </TabsList>
                <TabsContent value="reservas">
                    <ReservasPageContent />
                </TabsContent>
                <TabsContent value="mantenimiento">
                    <MantenimientoPageContent />
                </TabsContent>
            </Tabs>
        </main>
    );
}
