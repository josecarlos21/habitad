"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockFaqs } from "@/lib/mocks";
import type { FaqItem } from "@/lib/types";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 animate-fade-in">
             <div className="flex items-center gap-4 mb-6">
                <HelpCircle className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Preguntas Frecuentes (FAQ)</h1>
                    <p className="text-muted-foreground">Encuentra respuestas a las dudas más comunes.</p>
                </div>
            </div>
            
             <div className="max-w-4xl mx-auto w-full">
                 <Accordion type="single" collapsible className="w-full space-y-4">
                    {mockFaqs.map((faq: FaqItem, i) => (
                        <AccordionItem 
                            value={`item-${i}`} 
                            key={i}
                            className="border rounded-lg bg-card transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg animate-slide-up-and-fade"
                            style={{animationDelay: `${i * 100}ms`}}
                        >
                            <AccordionTrigger className="p-6 text-left hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="px-6 pb-6 pt-0">
                                    <p className="text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
             </div>
        </main>
    )
}
