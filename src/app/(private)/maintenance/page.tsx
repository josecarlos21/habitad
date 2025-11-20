
import { CreateIncidentSheet } from "../mantenimiento/_components/create-ticket-sheet";
import { IncidentList } from "../mantenimiento/_components/incident-list";

export default function MaintenancePage() {

    const handleIncidentCreated = async (newIncident: any) => {
        "use server";
        // Lógica para simular la adición de un incidente
        // En un escenario real, aquí se llamaría a la API para crear el incidente
        // y luego se revalidarían los datos para actualizar la lista.
        console.log("New incident created (simulated):", newIncident);
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Mantenimiento</h1>
                 <CreateIncidentSheet onIncidentCreated={handleIncidentCreated} />
            </div>
            
            <div className="animate-fade-in">
                 <IncidentList />
            </div>

        </main>
    );
}

    