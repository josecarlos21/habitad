
"use client";

import * as React from "react";
import type { Charge } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore } from "@/firebase";
import { useCondoUser } from "@/hooks/use-condo-user";
import { collection, query, where, orderBy } from "firebase/firestore";

export function PendingPayments() {
    const firestore = useFirestore();
    const { user } = useCondoUser();
    
    const pendingChargesQuery = React.useMemo(() => {
        if (!firestore || !user || !user.units || user.units.length === 0) return null;
        
        const userUnitIds = user.units.map(u => u.id);
        if (userUnitIds.length === 0) return null;

        return query(
          collection(firestore, `condos/${user.condoId}/charges`),
          where("unitId", "in", userUnitIds),
          where("status", "in", ["OPEN", "PARTIALLY_PAID"]),
          orderBy("dueDate", "asc")
        );
    }, [firestore, user]);

    const { data: pendingCharges, isLoading } = useCollection<Charge>(pendingChargesQuery);


    if (isLoading) {
        return (
             <section>
                <h2 className="text-xl font-semibold mb-4">Pagos Pendientes</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </section>
        )
    }

    if (!pendingCharges || pendingCharges.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-semibold mb-4">Pagos Pendientes</h2>
                 <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
                    <CardHeader className="p-0">
                        <Wallet className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <CardTitle>¡Estás al día!</CardTitle>
                        <CardDescription>No tienes ningún pago pendiente.</CardDescription>
                    </CardHeader>
                </Card>
            </section>
        );
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
