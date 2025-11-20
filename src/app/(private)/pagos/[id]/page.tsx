
"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Download, Share2 } from 'lucide-react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useCondoUser } from '@/hooks/use-condo-user';
import type { Charge } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ChargeStatusBadge = ({ status, dueDate }: { status: Charge['status'], dueDate: string }) => {
    const isOverdue = new Date(dueDate) < new Date() && status === 'OPEN';
    
    let finalStatus: 'overdue' | Charge['status'] = status;
    if (isOverdue) finalStatus = 'overdue';

    const statusMap = {
        SETTLED: { label: 'Pagado', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        OPEN: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
        overdue: { label: 'Vencido', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
        PARTIALLY_PAID: { label: 'Parcial', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
        CANCELLED: { label: 'Cancelado', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400' },
    };
    const current = statusMap[finalStatus] || statusMap.OPEN;

    return (
        <Badge
            variant={'outline'}
            className={cn('capitalize', current.className)}
        >
            {current.label}
        </Badge>
    );
};

function PaymentDetailSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-1/3" />
                         <Separator />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                     <CardContent className="space-y-4">
                         <Skeleton className="h-5 w-full" />
                         <Skeleton className="h-5 w-2/3" />
                         <Skeleton className="h-5 w-3/4" />
                         <Skeleton className="h-10 w-full mt-4" />
                     </CardContent>
                 </Card>
            </div>
        </div>
    );
}

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const { user: condoUser, isLoading: isUserLoading } = useCondoUser();
    
    const chargeRef = React.useMemo(() => {
        if (!firestore || !condoUser) return null;
        return doc(firestore, `condos/${condoUser.condoId}/charges`, params.id);
    }, [firestore, condoUser, params.id]);

    const { data: charge, isLoading: isChargeLoading } = useDoc<Charge>(chargeRef);

    const isLoading = isUserLoading || isChargeLoading;

    if (isLoading || !charge) {
        return (
             <main className="flex flex-1 flex-col p-4 md:p-6 gap-6">
                 <header className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                        <Link href="/pagos"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <Skeleton className="h-7 w-48" />
                </header>
                <PaymentDetailSkeleton />
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 gap-6 animate-fade-in">
             <header className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/pagos">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Volver a Pagos</span>
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold">Detalle de Cargo</h1>
            </header>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{charge.description}</CardTitle>
                                    <CardDescription className="mt-1">
                                        Vence el {format(new Date(charge.dueDate), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })}
                                    </CardDescription>
                                </div>
                                <ChargeStatusBadge status={charge.status} dueDate={charge.dueDate} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold tracking-tight">
                                ${charge.amount.toLocaleString('es-MX')}
                                <span className="text-lg font-normal text-muted-foreground ml-2">{charge.currency}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Métodos de Pago</CardTitle>
                            <CardDescription>Elige una opción para liquidar tu adeudo.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            <Button size="lg" className="w-full">
                                <CreditCard className="mr-2 h-5 w-5" />
                                Pagar con Tarjeta
                            </Button>
                            
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="lg" variant="secondary" className="w-full">
                                        <Download className="mr-2 h-5 w-5" />
                                        Referencia de Pago
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Referencia para Transferencia</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Usa estos datos para pagar vía transferencia (SPEI) desde tu app bancaria.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="py-4 space-y-4 text-center">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">CLABE</p>
                                            <p className="text-xl font-mono font-semibold tracking-wider">1234 5678 9012 345678</p>
                                        </div>
                                         <div className="p-4 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">Referencia</p>
                                            <p className="text-xl font-mono font-semibold tracking-wider">{condoUser?.units[0].code}-{charge.id.substring(0,4)}</p>
                                        </div>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                        <AlertDialogAction>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Compartir
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Unidad</span>
                                <span>{condoUser?.units.find(u => u.id === charge.unitId)?.code || charge.unitId}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tipo de Cargo</span>
                                <span>{charge.type}</span>
                            </div>
                             <Separator />
                             <div className="flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>${charge.amount.toLocaleString('es-MX')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
