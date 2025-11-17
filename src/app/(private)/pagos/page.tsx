import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invoices } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";

const statusMap: Record<Invoice['status'], { label: string; icon: React.ElementType; className: string }> = {
    paid: { label: "Pagado", icon: CheckCircle, className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
    pending: { label: "Pendiente", icon: Clock, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" },
    overdue: { label: "Vencido", icon: Clock, className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
};

export default function PagosPage() {
    const dueInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue');
    const paidInvoices = invoices.filter(i => i.status === 'paid');

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
                            <InvoiceTable invoices={dueInvoices} />
                             {dueInvoices.length === 0 && <p className="text-center text-muted-foreground p-8">¡Felicidades! No tienes adeudos pendientes.</p>}
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
                            <InvoiceTable invoices={paidInvoices} />
                            {paidInvoices.length === 0 && <p className="text-center text-muted-foreground p-8">Aún no has realizado ningún pago.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}

function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
    if (invoices.length === 0) return null;

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
                                    <Button variant="ghost" size="sm">
                                        Pagar <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                                {invoice.status === 'paid' && (
                                    <Button variant="link" size="sm">
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
