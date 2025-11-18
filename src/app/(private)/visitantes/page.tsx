
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserPlus, QrCode } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { visitorPasses as mockVisitorPasses } from "@/lib/mocks";
import type { VisitorPass } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratePassSheet } from "./_components/generate-pass-sheet";

export default function VisitantesPage() {
    const [visitorPasses, setVisitorPasses] = React.useState<VisitorPass[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setVisitorPasses(mockVisitorPasses);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handlePassGenerated = (newPass: Omit<VisitorPass, 'id' | 'qrToken' | 'userId' | 'validFrom'>) => {
        const pass: VisitorPass = {
            id: `vp_${Date.now()}`,
            qrToken: `qr_${Date.now()}`,
            userId: 'user_1',
            validFrom: new Date().toISOString(),
            ...newPass,
        };
        setVisitorPasses(prev => [pass, ...prev]);
        toast({
            title: "Pase Generado",
            description: "El pase de visitante ha sido creado y compartido.",
        });
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Visitantes</h1>
                <GeneratePassSheet onPassGenerated={handlePassGenerated} />
            </div>
            
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                                <Skeleton className="h-9 w-28" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : visitorPasses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {visitorPasses.map(pass => {
                        const isValid = new Date(pass.validTo) > new Date();
                        return (
                            <Card key={pass.id}>
                                <CardHeader className="flex-row items-start gap-4 space-y-0">
                                    <div className="grid h-12 w-12 place-items-center rounded-lg border">
                                      <QrCode className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-semibold">{pass.visitorName}</h3>
                                      <p className="text-sm text-muted-foreground">
                                          Válido hasta {format(new Date(pass.validTo), "hh:mm a", { locale: es })}
                                      </p>
                                    </div>
                                    <Badge variant={isValid ? "secondary" : "outline"}>
                                        {isValid ? "Activo" : "Expirado"}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">Compartir</Button>
                                    <Button variant="ghost" size="sm">Ver detalles</Button>
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
                    action={<GeneratePassSheet onPassGenerated={handlePassGenerated} />}
                 />
            )}
        </main>
    )
}
