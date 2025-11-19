
"use client";

import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
    const router = useRouter();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <EmptyState
                icon={Wrench}
                title="Funcionalidad en Construcción"
                description="Esta sección estará disponible próximamente. Estamos trabajando para traértela lo antes posible."
                action={
                    <Button onClick={() => router.back()}>
                        Volver
                    </Button>
                }
            />
        </main>
    );
}
