import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { visitorPasses } from "@/lib/mocks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PlusCircle, QrCode, UserPlus } from "lucide-react";

export default function VisitantesPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Visitantes</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generar Pase
                </Button>
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
                                      <CardTitle>{pass.visitorName}</CardTitle>
                                      <CardDescription>
                                          Válido hasta {format(new Date(pass.validTo), "hh:mm a", { locale: es })}
                                      </CardDescription>
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
                 <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[50vh]">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <UserPlus className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-2xl font-bold tracking-tight">Sin pases de visitante</h3>
                        <p className="text-sm text-muted-foreground">Genera un pase para permitir el acceso a tus visitas.</p>
                         <Button className="mt-4">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Generar Pase
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}
