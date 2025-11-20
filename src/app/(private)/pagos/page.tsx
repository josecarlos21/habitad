
import { UnderConstruction } from "@/components/app/under-construction";

export default function PagosPage() {

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-bold">Pagos</h1>
                <p className="text-muted-foreground">Consulta tu historial de pagos y gestiona tus cuotas pendientes.</p>
            </header>

            <div className="animate-fade-in">
                <UnderConstruction pageName="Pagos" />
            </div>

        </main>
    );
}
