
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { invoices as mockInvoices } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap: Record<Invoice['status'], { label: string; icon: React.ElementType; className: string }> = {
    paid: { label: "Pagado", icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
    pending: { label: "Pendiente", icon: Clock, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" },
    overdue: { label: "Vencido", icon: Clock, className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
};

export default function PagosPage() {
    const [invoiceList, setInvoiceList] = React.useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setInvoiceList(mockInvoices);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const dueInvoices: Invoice[] = invoiceList.filter(i => i.status === 'pending' || i.status === 'overdue');
    const paidInvoices: Invoice[] = invoiceList.filter(i => i.status === 'paid');

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
            <Tabs defaultValue="due">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="due">Adeudos</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>
                <TabsContent value="due" className="animate-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle>Adeudos Pendientes</CardTitle>
                            <CardDescription>Aquí puedes ver y pagar tus cuotas pendientes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <InvoiceTableSkeleton />
                            ) : dueInvoices.length > 0 ? (
                                <InvoiceTable invoices={dueInvoices} />
                            ) : (
                                <p className="text-center text-muted-foreground p-8">¡Felicidades! No tienes adeudos pendientes.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history" className="animate-fade-in">
                    <Card>
                         <CardHeader>
                            <CardTitle>Historial de Pagos</CardTitle>
                            <CardDescription>Consulta tus pagos realizados anteriormente.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? (
                                <InvoiceTableSkeleton />
                            ) : paidInvoices.length > 0 ? (
                                <InvoiceTable invoices={paidInvoices} />
                            ) : (
                                <p className="text-center text-muted-foreground p-8">Aún no has realizado ningún pago.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}

function InvoiceTableSkeleton() {
    return (
        <div className="overflow-x-auto">
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
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function InvoiceTable({ invoices }: { invoices: Invoice[]}) {
    const { toast } = useToast();

    if (invoices.length === 0) return null;

    const handleActionClick = (invoice: Invoice) => {
        if(invoice.status === 'paid') {
            toast({ title: "Función no disponible", description: "La visualización de recibos estará disponible próximamente." });
        } else {
             toast({ title: "Procesando Pago...", description: `Se procesará el pago para ${invoice.concept}.` });
        }
    }

    return (
        <div className="overflow-x-auto">
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
                    {invoices.map((invoice, i) => {
                        const status = statusMap[invoice.status];
                        return (
                            <TableRow key={invoice.id} className="animate-slide-up-and-fade" style={{animationDelay: `${i * 100}ms`}}>
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
        </div>
    );
}
