
import PaqueteriaPageContent from "./_components/paqueteria-content";
import VisitantesPageContent from "./_components/visitantes-content";

export default function AccesosPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Accesos</h1>
            </div>
            {/* Contenido principal de la página de accesos */}
            <VisitantesPageContent />
            <PaqueteriaPageContent />
        </main>
    );
}
