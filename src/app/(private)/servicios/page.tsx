
import ReservasPageContent from "./_components/reservas-content";
import MantenimientoPageContent from "./_components/mantenimiento-content";

export default function ServiciosPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Servicios y Reportes</h1>
            <ReservasPageContent />
            <MantenimientoPageContent />
        </main>
    );
}
