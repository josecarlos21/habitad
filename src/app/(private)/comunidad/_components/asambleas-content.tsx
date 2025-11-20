"use client";

import { mockAssemblies } from "@/lib/mocks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Check, X, Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AsambleasContent() {

    const activeAssemblies = mockAssemblies.filter(a => a.status === 'active');
    const pastAssemblies = mockAssemblies.filter(a => a.status === 'past');

    return (
        <div className="space-y-8">
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
                                    <span>{new Date(assembly.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(assembly.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Temas a tratar:</h4>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        {assembly.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                                    </ul>
                                </div>
                                {assembly.docs && assembly.docs.length > 0 && (
                                     <div>
                                        <h4 className="font-semibold mb-2">Documentos:</h4>
                                        {assembly.docs.map(doc => (
                                            <Button key={doc.name} variant="outline" size="sm" asChild>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                    <FileText className="w-4 h-4 mr-2" />{doc.name}
                                                </a>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                                {assembly.vote && (
                                     <div className="pt-4">
                                         <Separator />
                                        <div className="mt-4 p-4 rounded-lg bg-secondary/50">
                                            <h4 className="font-semibold mb-3">Votación Abierta</h4>
                                            <p className="mb-3 text-muted-foreground">{assembly.vote.question}</p>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Button className="w-full sm:w-auto justify-start gap-2"><Check size={16}/> {assembly.vote.options[0]}</Button>
                                                <Button className="w-full sm:w-auto justify-start gap-2" variant="secondary"><X size={16}/> {assembly.vote.options[1]}</Button>
                                                <Button className="w-full sm:w-auto justify-start gap-2" variant="secondary"><Circle size={16}/> {assembly.vote.options[2]}</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                        <p className="text-sm text-muted-foreground">{new Date(assembly.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                     {assembly.docs && assembly.docs.length > 0 && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={assembly.docs[0].url} target="_blank" rel="noopener noreferrer">
                                                <FileText className="w-4 h-4 mr-2" />Ver Minuta
                                            </a>
                                        </Button>
                                     )}
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
