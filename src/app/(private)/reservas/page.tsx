
"use client";

import Image from "next/image";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { amenities } from "@/lib/mocks";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Amenity } from "@/lib/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

function BookAmenitySheet({ amenity }: { amenity: Amenity }) {
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        toast({
            title: "Reserva Confirmada",
            description: `Tu reserva para ${amenity.name} ha sido realizada con éxito.`,
        });
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Reservar
                </Button>
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>Reservar: {amenity.name}</SheetTitle>
                        <SheetDescription>
                            Selecciona una fecha y horario para tu reserva.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </div>
                    <SheetFooter>
                        <Button type="submit" disabled={!date}>Confirmar Reserva</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default function ReservasPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Reservar Amenidades</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {amenities.map((amenity: Amenity) => (
                    <Card key={amenity.id} className="overflow-hidden flex flex-col">
                        <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                <Image 
                                    src={amenity.image} 
                                    alt={amenity.name} 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    data-ai-hint="amenity lifestyle"
                                />
                            </div>
                        </CardHeader>
                        <div className="p-6 flex flex-col flex-1">
                            <CardTitle>{amenity.name}</CardTitle>
                            <CardDescription className="mt-2 flex-1">{amenity.description}</CardDescription>
                        </div>
                        <CardFooter>
                           <BookAmenitySheet amenity={amenity} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {amenities.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">No hay amenidades disponibles</h3>
                        <p className="text-sm text-muted-foreground">Contacta a la administración para más información.</p>
                    </div>
                </div>
            )}
        </main>
    );
}
