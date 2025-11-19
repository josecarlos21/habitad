
"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UserPlus, QrCode, Share2, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { visitorPasses as mockVisitorPasses } from "@/lib/mocks";
import type { VisitorPass } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratePassSheet } from "./generate-pass-sheet";
import { cn } from "@/lib/utils";

export default function VisitantesPageContent() {
    const [visitorPasses, setVisitorPasses] = React.useState<VisitorPass[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setVisitorPasses(mockVisitorPasses);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handlePassGenerated = async (newPass: Omit<VisitorPass, 'id' | 'qrToken' | 'userId' | 'validFrom'>) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pass: VisitorPass = {
            id: `vp_${Date.now()}`,
            qrToken: `qr_${Date.now()}`,
            userId: 'user_1',
            validFrom: new Date().toISOString(),
            ...newPass,
        };
        setVisitorPasses(prev => [pass, ...prev]);
        // Toast is now handled inside the sheet for better feedback
    }

    return (
        <div className="pt-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">Pases de acceso para tus visitas.</p>
                <GeneratePassSheet onPassGenerated={handlePassGenerated} />
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
            ) : visitorPasses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visitorPasses.map((pass, i) => {
                        const isValid = new Date(pass.validTo) > new Date();
                        return (
                            <Card 
                                key={pass.id}
                                className={cn(
                                    "flex flex-col transition-all duration-300 ease-in-out animate-slide-up-and-fade hover:shadow-lg hover:scale-[1.02]",
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
                                    <Button variant="outline" size="sm" disabled={!isValid}>
                                        <Share2 className="mr-2 h-3.5 w-3.5"/>
                                        Compartir
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={!isValid}>
                                         <Trash2 className="mr-2 h-3.5 w-3.5"/>
                                        Cancelar
                                    </Button>
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
        </div>
    )
}
