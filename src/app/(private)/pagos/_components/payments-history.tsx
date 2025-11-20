
"use client";

import * as React from "react";
import { mockCharges } from "@/lib/mocks";
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

const ChargeStatusBadge = ({ status, dueDate }: { status: Charge['status'], dueDate: string }) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'OPEN';
    const finalStatus = isOverdue ? 'overdue' : status;

    const statusMap = {
        SETTLED: { label: 'Pagado', className: 'bg-green-100 text-green-800 border-green-200' },
        OPEN: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        overdue: { label: 'Vencido', className: 'bg-red-100 text-red-800 border-red-200' },
        PARTIALLY_PAID: { label: 'Parcial', className: 'bg-blue-100 text-blue-800 border-blue-200' },
        CANCELLED: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    }
    const current = statusMap[finalStatus as keyof typeof statusMap] || statusMap.OPEN;


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
    const [charges, setCharges] = React.useState<Charge[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        // Simula la carga de datos
        const timer = setTimeout(() => {
            const sortedCharges = [...mockCharges].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
            setCharges(sortedCharges);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

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
                        ) : (
                            charges.map((charge) => (
                                <TableRow key={charge.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">{charge.description}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(charge.dueDate).toLocaleDateString('es-MX', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                                    <TableCell className="text-right">${charge.amount.toLocaleString('es-MX')}</TableCell>
                                    <TableCell className="text-center"><ChargeStatusBadge status={charge.status} dueDate={charge.dueDate} /></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}

    