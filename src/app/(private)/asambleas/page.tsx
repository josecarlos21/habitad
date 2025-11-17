import { EmptyState } from "@/components/app/empty-state";
import { Users } from "lucide-react";

export default function AsambleasPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Asambleas y Votaciones</h1>
            
            <EmptyState
                icon={Users}
                title="No hay asambleas próximas"
                description="Se te notificará cuando haya una nueva asamblea o votación."
            />
        </main>
    );
}
