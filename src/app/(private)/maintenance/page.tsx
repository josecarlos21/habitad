
import { CreateTicketSheet } from "./_components/create-ticket-sheet";
import { TicketList } from "./_components/ticket-list";

export default function MaintenancePage() {

    // En el futuro, este estado se manejaría con una llamada a la API
    // y se pasaría a los componentes hijos.
    // Por ahora, los datos mock se importan directamente en TicketList.

    const handleTicketCreated = async (newTicket: any) => {
        "use server";
        // Lógica para simular la adición de un ticket
        // En un escenario real, aquí se llamaría a la API para crear el ticket
        // y luego se revalidarían los datos para actualizar la lista.
        console.log("New ticket created (simulated):", newTicket);
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Mantenimiento</h1>
                    <p className="text-muted-foreground">Historial de tus solicitudes de mantenimiento.</p>
                </div>
                <CreateTicketSheet onTicketCreated={handleTicketCreated} />
            </header>
            
            <div className="animate-fade-in">
                 <TicketList />
            </div>

        </div>
    );
}
