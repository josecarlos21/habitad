
"use client";

import { Bell } from "lucide-react";
import { UnderConstruction } from "@/components/app/under-construction";


export default function NotificacionesPage() {
    
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in">
             <div className="flex items-center gap-4 mb-6">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notificaciones</h1>
                    <p className="text-muted-foreground">Mantente al día con todo lo que sucede.</p>
                </div>
            </div>

            <UnderConstruction pageName="Notificaciones" />
            
        </main>
    );
}
