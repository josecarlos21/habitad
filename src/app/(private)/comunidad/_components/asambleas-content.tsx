"use client";

import { mockAssemblies } from "@/lib/mocks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Check, X, Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AsambleasContent() {

    const activeAssemblies = mockAssemblies.filter(a => a.status === 'OPEN');
    const pastAssemblies = mockAssemblies.filter(a => a.status === 'ARCHIVED');

    return (
        <div className="space-y-8 pt-4">
            {/* Active Assemblies */}
            <section>
                <h3 className="text-lg font-semibold mb-3">Asambleas Activas</h3>
                {activeAssemblies.length > 0 ? (
                    activeAssemblies.map(assembly => (
                        <Card key={assembly.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{assembly.title}</CardTitle>
                                    <Badge variant="secondary">Próxima</Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground pt-1">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{new Date(assembly.scheduledAt).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(assembly.scheduledAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {assembly.description && <p className="text-muted-foreground">{assembly.description}</p>}
                                {/* Topics and Docs are not in the new model for the main assembly object */}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                     <p className="text-sm text-muted-foreground text-center py-4">No hay asambleas activas.</p>
                )}
            </section>

            {/* Past Assemblies */}
            <section>
                <h3 className="text-lg font-semibold mb-3">Historial de Asambleas</h3>
                 {pastAssemblies.length > 0 ? (
                    <div className="space-y-3">
                        {pastAssemblies.map(assembly => (
                            <Card key={assembly.id} className="bg-muted/30">
                                <CardHeader className="flex-row items-center justify-between py-4">
                                    <div>
                                        <CardTitle className="text-base">{assembly.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{new Date(assembly.scheduledAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href="#" target="_blank" rel="noopener noreferrer">
                                            <FileText className="w-4 h-4 mr-2" />Ver Minuta
                                        </a>
                                    </Button>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                 ) : (
                     <p className="text-sm text-muted-foreground">No hay historial de asambleas.</p>
                 )}
            </section>
        </div>
    );
}
