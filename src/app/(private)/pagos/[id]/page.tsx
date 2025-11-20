
"use client";
import { UnderConstruction } from "@/components/app/under-construction";

export default function PaymentDetailPage({ params }: { params: { id: string } }) {

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 gap-6">
             <header>
                <h1 className="text-2xl font-bold">Detalle de Pago</h1>
                <p className="text-muted-foreground">ID del cargo: {params.id}</p>
            </header>
            <UnderConstruction pageName="Pagos" />
        </main>
    );
}
