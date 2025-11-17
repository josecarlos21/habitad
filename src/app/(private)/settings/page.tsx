import { EmptyState } from "@/components/app/empty-state";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Ajustes</h1>
            
            <EmptyState
                icon={SettingsIcon}
                title="Ajustes en construcción"
                description="Esta sección estará disponible próximamente para que puedas personalizar tu experiencia."
            />
        </main>
    );
}
