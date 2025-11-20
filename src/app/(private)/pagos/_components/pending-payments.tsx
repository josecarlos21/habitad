
"use client";

import * as React from "react";
import { mockCharges } from "@/lib/mocks";
import type { Charge } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingPayments() {
    const [pendingCharges, setPendingCharges] = React.useState<Charge[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        // Simula la carga de datos
        const timer = setTimeout(() => {
            const filtered = mockCharges.filter(charge => charge.status === 'OPEN' || charge.status === 'PARTIALLY_PAID')
                                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            setPendingCharges(filtered);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Skeleton className="h-40 w-full" />;
    }

    if (pendingCharges.length === 0) {
        return null; // No mostrar nada si no hay pendientes
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Pagos Pendientes</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {pendingCharges.map(charge => {
                    const isOverdue = new Date(charge.dueDate) < new Date();
                    return (
                    <Card key={charge.id} className={isOverdue ? 'border-destructive' : ''}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{charge.description}</CardTitle>
                                {isOverdue && (
                                    <div className="flex items-center gap-1.5 text-destructive text-sm font-semibold">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Vencido</span>
                                    </div>
                                )}
                            </div>
                            <CardDescription>Vence el {new Date(charge.dueDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${charge.amount.toLocaleString('es-MX')} <span className="text-sm font-normal text-muted-foreground">{charge.currency}</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/pagos/${charge.id}`}>
                                    Realizar Pago
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )})}
            </div>
        </section>
    );
}

    