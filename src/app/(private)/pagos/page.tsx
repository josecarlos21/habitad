
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { invoices } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import React from "react";

const statusMap: Record<Invoice['status'], { label: string; icon: React.ElementType; className: string }> = {
    paid: { label: "Pagado", icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
    pending: { label: "Pendiente", icon: Clock, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" },
    overdue: { label: "Vencido", icon: Clock, className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
};

export default function PagosPage() {
    const [invoiceList, setInvoiceList] = React.useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setInvoiceList(invoices);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const dueInvoices: Invoice[] = invoiceList.filter(i => i.status === 'pending' || i.status === 'overdue');
    const paidInvoices: Invoice[] = invoiceList.filter(i => i.status === 'paid');

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Pagos</h1>
            <Tabs defaultValue="due">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="due">Adeudos</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>
                <TabsContent value="due">
                    <Card>
                        <CardHeader>
                            <CardTitle>Adeudos Pendientes</CardTitle>
                            <CardDescription>Aquí puedes ver y pagar tus cuotas pendientes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InvoiceTable invoices={dueInvoices} isLoading={isLoading} />
                             {!isLoading && dueInvoices.length === 0 && <p className="text-center text-muted-foreground p-8">¡Felicidades! No tienes adeudos pendientes.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history">
                    <Card>
                         <CardHeader>
                            <CardTitle>Historial de Pagos</CardTitle>
                            <CardDescription>Consulta tus pagos realizados anteriormente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InvoiceTable invoices={paidInvoices} isLoading={isLoading} />
                            {!isLoading && paidInvoices.length === 0 && <p className="text-center text-muted-foreground p-8">Aún no has realizado ningún pago.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}

function InvoiceTable({ invoices, isLoading }: { invoices: Invoice[], isLoading: boolean }) {
    const { toast } = useToast();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex animate-pulse items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 w-2/3 rounded bg-muted"></div>
                            <div className="h-4 w-1/3 rounded bg-muted"></div>
                        </div>
                        <div className="h-8 w-20 rounded-md bg-muted"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (invoices.length === 0) return null;

    const handleActionClick = (invoice: Invoice) => {
        if(invoice.status === 'paid') {
            toast({ title: "Función no disponible", description: "La visualización de recibos estará disponible próximamente." });
        } else {
             toast({ title: "Procesando Pago...", description: `Se procesará el pago para ${invoice.concept}.` });
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => {
                    const status = statusMap[invoice.status];
                    return (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.concept}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={status.className}>
                                    <status.icon className="mr-2 h-3 w-3"/>
                                    {status.label}
                                </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(invoice.dueDate), "dd MMM, yyyy", { locale: es })}</TableCell>
                            <TableCell className="text-right">${invoice.amount.toLocaleString('es-MX')}</TableCell>
                             <TableCell className="text-right">
                                {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                    <Button variant="ghost" size="sm" onClick={() => handleActionClick(invoice)}>
                                        Pagar <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                                {invoice.status === 'paid' && (
                                    <Button variant="link" size="sm" onClick={() => handleActionClick(invoice)}>
                                        Ver Recibo
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
