
"use client";

import { UnderConstruction } from "@/components/app/under-construction";

export default function ReservasPageContent() {
    return (
        <div className="pt-4 animate-fade-in">
             <p className="text-muted-foreground mb-4">Reserva los espacios comunes para tus eventos y actividades.</p>
             <UnderConstruction pageName="Reservas de Amenidades" />
        </div>
    );
}
