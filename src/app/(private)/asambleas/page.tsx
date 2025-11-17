import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function AsambleasPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Asambleas y Votaciones</h1>
            
             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[50vh]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-2xl font-bold tracking-tight">No hay asambleas próximas</h3>
                    <p className="text-sm text-muted-foreground">Se te notificará cuando haya una nueva asamblea o votación.</p>
                </div>
            </div>
        </main>
    );
}
