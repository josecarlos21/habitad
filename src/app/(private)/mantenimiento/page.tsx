
"use client";

import { CreateIncidentSheet } from "./_components/create-incident-sheet";
import { IncidentList } from "./_components/incident-list";

export default function MaintenancePage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Mantenimiento</h1>
                 <CreateIncidentSheet />
            </div>
            
            <div className="animate-fade-in">
                 <IncidentList />
            </div>

        </main>
    );
}
