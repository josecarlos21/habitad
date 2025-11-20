
"use client";

import { HardHat } from "lucide-react";

interface UnderConstructionProps {
    pageName: string;
}

export function UnderConstruction({ pageName }: UnderConstructionProps) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm my-8 py-16 animate-fade-in">
            <div className="flex flex-col items-center gap-2 text-center max-w-md">
                <HardHat className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight mt-4">Página en Construcción</h3>
                <p className="text-sm text-muted-foreground">
                    El módulo de <span className="font-semibold text-foreground">{pageName}</span> está actualmente en desarrollo.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    ¡Vuelve pronto para ver las novedades!
                </p>
            </div>
        </div>
    );
}
