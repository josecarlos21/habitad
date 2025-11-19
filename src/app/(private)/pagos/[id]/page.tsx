
"use client";

import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import Link from "next/link";


export default function Page() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Detalle de Pago</h1>
            
            <EmptyState
                icon={CreditCard}
                title="Pasarela de Pagos en Construcción"
                description="La integración con la pasarela de pagos y la visualización de recibos detallados estarán disponibles próximamente."
                action={
                    <Button asChild>
                        <Link href="/pagos">Volver a Pagos</Link>
                    </Button>
                }
            />
        </main>
    );
}
