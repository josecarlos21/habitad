
"use client";

import { PaymentsHistory } from "./_components/payments-history";
import { PendingPayments } from "./_components/pending-payments";

export default function PagosPage() {

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 space-y-8 animate-fade-in">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
                <p className="text-muted-foreground">Consulta tu historial de pagos y gestiona tus cuotas pendientes.</p>
            </header>

            <div className="space-y-8">
                <PendingPayments />
                <PaymentsHistory />
            </div>

        </main>
    );
}
