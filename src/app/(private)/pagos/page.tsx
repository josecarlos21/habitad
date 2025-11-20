
import { PaymentsHistory } from "./_components/payments-history";
import { PendingPayments } from "./_components/pending-payments";

export default function PagosPage() {

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold">Pagos</h1>
                <p className="text-muted-foreground">Consulta tu historial de pagos y gestiona tus cuotas pendientes.</p>
            </header>

            <main className="space-y-8 animate-fade-in">
                <PendingPayments />
                <PaymentsHistory />
            </main>

        </div>
    );
}
