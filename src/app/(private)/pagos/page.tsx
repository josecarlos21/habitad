
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CheckCircle, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { invoices as mockInvoices } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/app/empty-state";

const statusMap: Record<Invoice['status'], { label: string; icon: React.ElementType; variant: "success" | "warning" | "destructive" }> = {
    paid: { label: "Pagado", icon: CheckCircle, variant: "success" },
    pending: { label: "Pendiente", icon: Clock, variant: "warning" },
    overdue: { label: "Vencido", icon: Clock, variant: "destructive" },
};

export default function PagosPage() {
    const [invoiceList, setInvoiceList] = React.useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setInvoiceList(mockInvoices);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const dueInvoices: Invoice[] = invoiceList.filter(i => i.status === 'pending' || i.status === 'overdue');
    const paidInvoices: Invoice[] = invoiceList.filter(i => i.status === 'paid');

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Pagos y Adeudos</h1>

            {isLoading ? (
                <div className="space-y-8">
                    <div>
                        <Skeleton className="h-8 w-48 mb-3" />
                        <div className="space-y-2">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                     <div>
                        <Skeleton className="h-8 w-48 mb-3" />
                        <div className="space-y-2">
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                     <section className="animate-slide-up-and-fade">
                        <h2 className="text-lg font-semibold mb-3">Adeudos Pendientes</h2>
                         {dueInvoices.length > 0 ? (
                             <div className="space-y-2">
                                {dueInvoices.map((invoice, i) => <InvoiceCard key={invoice.id} invoice={invoice} animationDelay={i * 100}/>)}
                            </div>
                        ) : (
                             <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
                                <CardHeader className="p-0">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <CardTitle>¡Felicidades!</CardTitle>
                                    <CardDescription>No tienes adeudos pendientes.</CardDescription>
                                </CardHeader>
                            </Card>
                        )}
                    </section>

                    <section className="mt-8 animate-slide-up-and-fade" style={{animationDelay: '200ms'}}>
                        <h2 className="text-lg font-semibold mb-3">Historial de Pagos</h2>
                        {paidInvoices.length > 0 ? (
                            <div className="space-y-2">
                                {paidInvoices.map((invoice, i) => <InvoiceCard key={invoice.id} invoice={invoice} animationDelay={i * 100} />)}
                            </div>
                        ) : (
                           <EmptyState 
                                icon={CreditCard}
                                title="Sin historial"
                                description="Aún no has realizado ningún pago."
                           />
                        )}
                    </section>
                </>
            )}
        </main>
    );
}


function InvoiceCard({ invoice, animationDelay }: { invoice: Invoice, animationDelay: number }) {
    const { toast } = useToast();
    const status = statusMap[invoice.status];

    const handleActionClick = (invoice: Invoice) => {
        if(invoice.status === 'paid') {
            toast({ title: "Función no disponible", description: "La visualización de recibos estará disponible próximamente." });
        } else {
             toast({ title: "Procesando Pago...", description: `Se procesará el pago para ${invoice.concept}.` });
        }
    }

    const component = (
        <Card 
            className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:border-primary/20 animate-slide-up-and-fade group"
            style={{animationDelay: `${animationDelay}ms`}}
        >
            <CardHeader className="flex-row items-center gap-4 p-4">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", 
                    status.variant === 'success' && 'bg-green-500/10 text-green-500',
                    status.variant === 'warning' && 'bg-yellow-500/10 text-yellow-500',
                    status.variant === 'destructive' && 'bg-red-500/10 text-red-500',
                    )}>
                    <status.icon className="h-5 w-5"/>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{invoice.concept}</p>
                    <p className="text-xs text-muted-foreground">
                        {status.variant === 'paid' ? 'Pagado el ' : 'Vence el '} 
                        {format(new Date(invoice.dueDate), "dd MMM, yyyy", { locale: es })}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <p className="font-semibold text-lg">${invoice.amount.toLocaleString('es-MX')}</p>
                     <Badge variant={status.variant}>
                        {status.label}
                    </Badge>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
            </CardHeader>
        </Card>
    );

    return (
        <button onClick={() => handleActionClick(invoice)} className="w-full text-left">
            {component}
        </button>
    )
}
