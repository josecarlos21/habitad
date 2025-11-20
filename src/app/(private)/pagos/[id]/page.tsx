
"use client";

import * as React from "react";
import { mockCharges } from "@/lib/mocks";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Charge } from "@/lib/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertTriangle, ArrowLeft, CheckCircle, CreditCard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

// --- Helper Components ---

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
            className={cn('capitalize text-sm', current.className)}
        >
            {current.label}
        </Badge>
    );
}


// --- Main Page Component ---

export default function PaymentDetailPage({ params }: { params: { id: string } }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    // Simula la búsqueda de la factura. En una app real, esto sería una llamada a la API.
    const charge = mockCharges.find(inv => inv.id === params.id);

    if (!charge) {
        notFound();
    }
    const isPaid = charge.status === 'SETTLED';

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simula una llamada a una pasarela de pago
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSuccess(true);
        
        // Aquí, en una app real, se actualizaría el estado de la factura en la BD.
        charge.status = 'SETTLED';
    }

    if (isSuccess) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4 animate-fade-in">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold">¡Pago Exitoso!</h2>
                <p className="text-muted-foreground mt-2 max-w-sm">
                    Hemos recibido tu pago para "{charge.description}". Recibirás una confirmación por correo electrónico.
                </p>
                 <p className="text-4xl font-bold mt-4">${charge.amount.toLocaleString('es-MX')}</p>
                <Button asChild className="mt-8">
                    <Link href="/pagos"><ArrowLeft className="mr-2 h-4 w-4"/>Volver a Pagos</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
             <Button asChild variant="outline" size="sm">
                <Link href="/pagos"><ArrowLeft className="mr-2 h-4 w-4"/>Volver</Link>
            </Button>

            <div className="grid gap-8 md:grid-cols-3">

                <section className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Confirmación de Pago</CardTitle>
                            <CardDescription>Revisa los detalles y completa tu pago de forma segura.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePayment}>
                            <CardContent className="space-y-6">
                                 <div className="border rounded-lg p-4 space-y-4 bg-secondary/30">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold max-w-xs">{charge.description}</p>
                                        <p className="text-xl font-bold">${charge.amount.toLocaleString('es-MX')} <span className="text-sm text-muted-foreground font-normal">{charge.currency}</span></p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>ID de Cargo:</span>
                                        <span>{charge.id}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-10" required disabled={isPaid} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="expiry">Expiración</Label>
                                        <Input id="expiry" placeholder="MM/AA" required disabled={isPaid}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" required disabled={isPaid}/>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col items-stretch">
                                {isPaid ? (
                                    <div className="text-center text-green-600 font-semibold p-2 rounded-md bg-green-50">Este cargo ya ha sido pagado.</div>
                                ) : (
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Spinner size="sm" className="mr-2"/>}
                                        {isLoading ? 'Procesando Pago...' : `Pagar $${charge.amount.toLocaleString('es-MX')}`}
                                    </Button>
                                )}
                                <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground gap-1.5">
                                    <Lock className="w-3 h-3" />
                                    <span>Pagos seguros vía Stripe</span>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </section>

                <aside className="md:col-span-1">
                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle>Resumen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estado:</span>
                                <span><ChargeStatusBadge status={charge.status} dueDate={charge.dueDate} /></span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Vencimiento:</span>
                                <span className="font-medium">{format(new Date(charge.dueDate), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                            </div>
                              {new Date(charge.dueDate) < new Date() && charge.status === 'OPEN' && (
                                <div className="flex items-center gap-2 text-destructive p-2 rounded-md bg-destructive/10 border border-destructive/20">
                                    <AlertTriangle className="w-5 h-5"/>
                                    <p className="font-semibold">Este cargo está vencido.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
