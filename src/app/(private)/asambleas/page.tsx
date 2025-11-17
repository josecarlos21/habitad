
"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, FileText, Vote as VoteIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EmptyState } from "@/components/app/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

const mockAssemblies = [
    {
        id: "asm_1",
        title: "Asamblea General Ordinaria Noviembre 2025",
        date: "2025-11-28T19:00:00Z",
        status: "active",
        topics: ["Presupuesto 2026", "Elección de comité de vigilancia", "Mantenimiento de áreas comunes"],
        docs: [{ name: "Convocatoria Oficial", url: "#" }, { name: "Propuesta Presupuesto 2026", url: "#" }],
        vote: {
            id: "vote_1",
            question: "¿Aprueba el presupuesto presentado para el año 2026?",
            options: ["Sí, apruebo", "No, rechazo", "Me abstengo"],
            status: "open",
        }
    },
    {
        id: "asm_2",
        title: "Asamblea Extraordinaria - Proyecto Alberca",
        date: "2025-08-15T18:00:00Z",
        status: "past",
        topics: ["Presentación y votación de la propuesta para remodelar la alberca."],
        docs: [{ name: "Minuta de la Asamblea", url: "#" }],
    },
     {
        id: "asm_3",
        title: "Asamblea General Ordinaria 2024",
        date: "2024-11-30T19:00:00Z",
        status: "past",
        topics: ["Resultados 2024", "Presupuesto 2025"],
        docs: [{ name: "Minuta de la Asamblea", url: "#" }],
    }
];


function VotingCard({ vote, assemblyTitle }: { vote: any, assemblyTitle: string }) {
    const { toast } = useToast();
    const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
    const [isVoted, setIsVoted] = React.useState(false);

    const handleSubmitVote = () => {
        if (selectedOption) {
            setIsVoted(true);
            toast({
                title: "Voto Emitido",
                description: `Tu voto para la asamblea "${assemblyTitle}" ha sido registrado.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor, selecciona una opción para votar.",
            });
        }
    };
    
    if (isVoted) {
        return (
             <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-300">¡Gracias por votar!</CardTitle>
                    <CardDescription className="text-green-700 dark:text-green-400">Tu participación es importante para la comunidad.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle><VoteIcon className="inline-block mr-2" /> Votación en Curso</CardTitle>
                <CardDescription>{vote.question}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup onValueChange={setSelectedOption} className="gap-4">
                    {vote.options.map((option: string) => (
                        <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="font-normal">{option}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <div className="p-6 pt-0">
                <Button onClick={handleSubmitVote} className="w-full">Emitir Voto</Button>
            </div>
        </Card>
    )
}

export default function AsambleasPage() {
    const [assemblies, setAssemblies] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

     React.useEffect(() => {
        const timer = setTimeout(() => {
            setAssemblies(mockAssemblies);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const activeAssembly = assemblies.find(a => a.status === 'active');
    const pastAssemblies = assemblies.filter(a => a.status === 'past');

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Asambleas y Votaciones</h1>

            {isLoading ? (
                <div className="space-y-6">
                    <Card>
                        <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                        <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                    </Card>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : activeAssembly ? (
                <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                        <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge>Asamblea Activa</Badge>
                                        <CardTitle className="mt-2">{activeAssembly.title}</CardTitle>
                                        <CardDescription>{format(new Date(activeAssembly.date), "EEEE dd 'de' MMMM, yyyy 'a las' HH:mm 'hrs'", { locale: es })}</CardDescription>
                                    </div>
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-semibold mb-2">Temas a tratar:</h4>
                                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                    {activeAssembly.topics.map(topic => <li key={topic}>{topic}</li>)}
                                </ul>

                                <h4 className="font-semibold mt-6 mb-2">Documentos Adjuntos:</h4>
                                <div className="space-y-2">
                                    {activeAssembly.docs.map(doc => (
                                        <a key={doc.name} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                            <FileText className="h-4 w-4" />
                                            {doc.name}
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                     <div>
                        {activeAssembly.vote && <VotingCard vote={activeAssembly.vote} assemblyTitle={activeAssembly.title} />}
                    </div>
                </div>
            ) : (
                 <EmptyState
                    icon={Users}
                    title="No hay asambleas próximas"
                    description="Se te notificará cuando se convoque una nueva asamblea."
                />
            )}
            
            {!isLoading && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Historial de Asambleas</h2>
                    {pastAssemblies.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {pastAssemblies.map(assembly => (
                                <AccordionItem value={assembly.id} key={assembly.id}>
                                    <AccordionTrigger>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-semibold">{assembly.title}</span>
                                            <span className="text-sm text-muted-foreground">{format(new Date(assembly.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">{assembly.topics.join(' ')}</p>
                                            <a href={assembly.docs[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                                                <FileText className="h-4 w-4" />
                                                Ver minuta de la asamblea
                                            </a>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <p className="text-sm text-muted-foreground">No hay asambleas pasadas registradas.</p>
                    )}
                </div>
            )}
        </main>
    );
}
