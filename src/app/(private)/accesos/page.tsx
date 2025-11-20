
"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisitantesPageContent from "./_components/visitantes-content";
import PaqueteriaPageContent from "./_components/paqueteria-content";
import { Package, UserSquare } from "lucide-react";

export default function AccesosPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'visitantes';

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.replace(`${pathname}?${params.toString()}`);
    }
    
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Accesos</h1>
            </div>

            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-lg">
                    <TabsTrigger value="visitantes">
                        <UserSquare className="mr-2 h-4 w-4" />
                        Visitantes
                    </TabsTrigger>
                    <TabsTrigger value="paqueteria">
                        <Package className="mr-2 h-4 w-4" />
                        Paquetería
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="visitantes">
                    <VisitantesPageContent />
                </TabsContent>
                <TabsContent value="paqueteria">
                    <PaqueteriaPageContent />
                </TabsContent>
            </Tabs>
        </main>
    );
}
