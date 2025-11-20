
"use client";

import * as React from "react";
import { mockInvoices } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
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

const InvoiceStatusBadge = ({ status }: { status: Invoice['status'] }) => (
    <Badge
        variant={status === 'paid' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
        className={cn(
            'capitalize',
            status === 'paid' && 'bg-green-100 text-green-800 border-green-200',
            status === 'pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
            status === 'overdue' && 'bg-red-100 text-red-800 border-red-200',
        )}
    >
        {status === 'paid' ? 'Pagado' : status === 'pending' ? 'Pendiente' : 'Vencido'}
    </Badge>
);

export function PaymentsHistory() {
    const [invoices, setInvoices] = React.useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        // Simula la carga de datos
        const timer = setTimeout(() => {
            const sortedInvoices = [...mockInvoices].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
            setInvoices(sortedInvoices);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section>
             <h2 className="text-xl font-semibold mb-4">Historial de Cuotas</h2>
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
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate">{invoice.concept}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(invoice.dueDate).toLocaleDateString('es-MX', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                                    <TableCell className="text-right">${invoice.amount.toLocaleString('es-MX')}</TableCell>
                                    <TableCell className="text-center"><InvoiceStatusBadge status={invoice.status} /></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
