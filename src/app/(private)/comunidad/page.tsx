
"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvisosContent } from "./_components/avisos-content";
import { AsambleasContent } from "./_components/asambleas-content";
import { Users, Megaphone } from "lucide-react";

export default function ComunidadPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'avisos';

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);
        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
             <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Comunidad</h1>
            </div>

            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-lg">
                    <TabsTrigger value="avisos">
                        <Megaphone className="mr-2 h-4 w-4" />
                        Avisos
                    </TabsTrigger>
                    <TabsTrigger value="asambleas">
                        <Users className="mr-2 h-4 w-4" />
                        Asambleas
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="avisos">
                    <AvisosContent />
                </TabsContent>
                <TabsContent value="asambleas">
                    <AsambleasContent />
                </TabsContent>
            </Tabs>
        </main>
    );
}
