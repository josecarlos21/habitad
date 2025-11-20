
"use client";

import * as React from "react";
import { mockInvoices } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingPayments() {
    const [pendingInvoices, setPendingInvoices] = React.useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        // Simula la carga de datos
        const timer = setTimeout(() => {
            const filtered = mockInvoices.filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
                                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            setPendingInvoices(filtered);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Skeleton className="h-40 w-full" />;
    }

    if (pendingInvoices.length === 0) {
        return null; // No mostrar nada si no hay pendientes
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Pagos Pendientes</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {pendingInvoices.map(invoice => (
                    <Card key={invoice.id} className={invoice.status === 'overdue' ? 'border-destructive' : ''}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{invoice.concept}</CardTitle>
                                {invoice.status === 'overdue' && (
                                    <div className="flex items-center gap-1.5 text-destructive text-sm font-semibold">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Vencido</span>
                                    </div>
                                )}
                            </div>
                            <CardDescription>Vence el {new Date(invoice.dueDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${invoice.amount.toLocaleString('es-MX')} <span className="text-sm font-normal text-muted-foreground">{invoice.currency}</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/pagos/${invoice.id}`}>
                                    Realizar Pago
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}
