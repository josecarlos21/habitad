"use client";

import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { visitorPasses } from "@/lib/mocks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PlusCircle, QrCode, UserPlus } from "lucide-react";

function GeneratePassSheet() {
    return (
         <Sheet>
            <SheetTrigger asChild>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generar Pase
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Generar Pase de Visitante</SheetTitle>
                    <SheetDescription>
                        Completa los datos para generar un código QR para tu visitante.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="visitor-name">Nombre del Visitante</Label>
                        <Input id="visitor-name" placeholder="Ej: Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="validity">Validez del Pase</Label>
                        <Input id="validity" type="datetime-local" />
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit">Generar y Compartir</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default function VisitantesPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Visitantes</h1>
                <GeneratePassSheet />
            </div>
            
            {visitorPasses.length > 0 ? (
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
                    action={<GeneratePassSheet />}
                 />
            )}
        </main>
    )
}
