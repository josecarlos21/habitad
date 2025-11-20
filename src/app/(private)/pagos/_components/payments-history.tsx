
"use client";

import * as React from "react";
import type { Charge } from "@/lib/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore } from "@/firebase";
import { useCondoUser } from "@/hooks/use-condo-user";
import { collection, query, where, orderBy } from "firebase/firestore";

const ChargeStatusBadge = ({ status, dueDate }: { status: Charge['status'], dueDate: string }) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'OPEN';
    
    let finalStatus: 'overdue' | Charge['status'] = status;
    if (isOverdue) finalStatus = 'overdue';

    const statusMap = {
        SETTLED: { label: 'Pagado', className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300' },
        OPEN: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300' },
        overdue: { label: 'Vencido', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300' },
        PARTIALLY_PAID: { label: 'Parcial', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300' },
        CANCELLED: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400' },
    }
    const current = statusMap[finalStatus] || statusMap.OPEN;

    return (
        <Badge
            variant={'outline'}
            className={cn('capitalize', current.className)}
        >
            {current.label}
        </Badge>
    );
}

export function PaymentsHistory() {
    const firestore = useFirestore();
    const { user } = useCondoUser();
    
    const chargesQuery = React.useMemo(() => {
        if (!firestore || !user || user.units.length === 0) return null;
        // This query should get all charges for the user's units
        const userUnitIds = user.units.map(u => u.id);
        if (userUnitIds.length === 0) return null;

        return query(
          collection(firestore, `condos/${user.condoId}/charges`),
          where("unitId", "in", userUnitIds),
          orderBy("dueDate", "desc")
        );
    }, [firestore, user]);

    const { data: charges, isLoading } = useCollection<Charge>(chargesQuery);

    return (
        <section>
             <h2 className="text-xl font-semibold mb-4">Historial de Cargos</h2>
             <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Concepto</TableHead>
                            <TableHead className="hidden md:table-cell">Fecha de Vencimiento</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : charges && charges.length > 0 ? (
                            charges.map((charge) => (
                                <TableRow key={charge.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">{charge.description}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(charge.dueDate).toLocaleDateString('es-MX', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                                    <TableCell className="text-right">${charge.amount.toLocaleString('es-MX')}</TableCell>
                                    <TableCell className="text-center"><ChargeStatusBadge status={charge.status} dueDate={charge.dueDate} /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron cargos.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
