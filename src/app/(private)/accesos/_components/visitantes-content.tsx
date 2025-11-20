
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserPlus, QrCode, Share2, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { VisitorPass } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratePassSheet } from "./generate-pass-sheet";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore } from "@/firebase";
import { useCondoUser } from "@/hooks/use-condo-user";
import { collection, query, where, orderBy } from "firebase/firestore";
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
import { deleteVisitorPass } from "../_services/delete-visitor-pass-service";
import { Spinner } from "@/components/ui/spinner";

export default function VisitantesPageContent() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useCondoUser();
    const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

    const passesQuery = React.useMemo(() => {
        if (!firestore || !user) return null;
        return query(
          collection(firestore, `condos/${user.condoId}/visitor-passes`),
          where("userId", "==", user.userId),
          orderBy("createdAt", "desc")
        );
    }, [firestore, user]);

    const { data: visitorPasses, isLoading } = useCollection<VisitorPass>(passesQuery);

    const handleShare = async (pass: VisitorPass) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Acceso para ${pass.visitorName}`,
                    text: `¡Hola! Te comparto el acceso para tu visita al condominio. Es válido hasta ${format(new Date(pass.validTo), "dd/MMM hh:mm a", { locale: es })}.`,
                    url: window.location.href, // En una app real, sería una URL pública para el pase
                });
            } catch (error) {
                console.error("Error al compartir", error);
                toast({
                    variant: "destructive",
                    title: "Error al compartir",
                    description: "No se pudo compartir el pase. Inténtalo de nuevo.",
                });
            }
        } else {
             toast({
                title: "Función no soportada",
                description: "Tu navegador no soporta la función de compartir.",
            });
        }
    };

    const handleDelete = async (passId: string) => {
        setIsDeleting(passId);
        try {
            await deleteVisitorPass(passId);
            toast({
                title: "Pase Cancelado",
                description: "El pase de visitante ha sido eliminado.",
            });
        } catch (error) {
            console.error("Error al eliminar el pase", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cancelar el pase. Inténtalo de nuevo.",
            });
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="pt-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">Pases de acceso para tus visitas.</p>
                <GeneratePassSheet />
            </div>
            
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex-row items-start gap-4 space-y-0">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </CardHeader>
                            <CardContent className="flex justify-end gap-2">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : visitorPasses && visitorPasses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visitorPasses.map((pass, i) => {
                        const isValid = new Date(pass.validTo) > new Date();
                        return (
                            <Card 
                                key={pass.id}
                                className={cn(
                                    "flex flex-col transition-all duration-300 ease-in-out animate-slide-up-and-fade hover:shadow-soft hover:scale-[1.02]",
                                    !isValid && "opacity-60 grayscale"
                                )}
                                style={{animationDelay: `${i * 100}ms`}}
                            >
                                <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
                                    <div className={cn("grid h-16 w-16 place-items-center rounded-lg", isValid ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                                      <QrCode className="h-10 w-10" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{pass.visitorName}</h3>
                                      <p className="text-sm text-muted-foreground">
                                          Válido hasta {format(new Date(pass.validTo), "hh:mm a", { locale: es })}
                                      </p>
                                    </div>
                                    <Badge variant={isValid ? "success" : "secondary"}>
                                        {isValid ? "Activo" : "Expirado"}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex justify-end gap-2 pt-4 border-t mt-auto">
                                    <Button variant="outline" size="sm" onClick={() => handleShare(pass)} disabled={!isValid}>
                                        <Share2 className="mr-2 h-3.5 w-3.5"/>
                                        Compartir
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={!isValid || isDeleting === pass.id}>
                                                 {isDeleting === pass.id ? <Spinner size="sm" className="mr-2"/> : <Trash2 className="mr-2 h-3.5 w-3.5"/>}
                                                Cancelar
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Se cancelará permanentemente el pase de acceso para <span className="font-bold">{pass.visitorName}</span>.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Volver</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(pass.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                                    Sí, cancelar pase
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={UserPlus}
                    title="Sin pases de visitante"
                    description="Genera un pase para permitir el acceso a tus visitas."
                    action={<GeneratePassSheet />}
                 />
            )}
        </div>
    )
}
