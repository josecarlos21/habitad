
"use client";

import Image from "next/image";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { amenities as mockAmenities } from "@/lib/mocks";
import { Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import type { Amenity } from "@/lib/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/empty-state";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function BookAmenitySheet({ amenity }: { amenity: Amenity }) {
    const { toast } = useToast();
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [isBooked, setIsBooked] = React.useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsBooked(true);
        toast({
            title: "Reserva Confirmada",
            description: `Tu reserva para ${amenity.name} ha sido realizada con éxito.`,
        });
    };
    
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset state when closing
            setTimeout(() => {
                setIsBooked(false);
                setDate(new Date());
            }, 300);
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Reservar
                </Button>
            </SheetTrigger>
            <SheetContent>
                 <SheetHeader>
                    <SheetTitle>Reservar: {amenity.name}</SheetTitle>
                    {!isBooked && (
                        <SheetDescription>
                            Selecciona una fecha y horario para tu reserva.
                        </SheetDescription>
                    )}
                </SheetHeader>
                {isBooked ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
                        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold">¡Reserva Exitosa!</h3>
                        <p className="text-muted-foreground mt-2">
                           Has reservado la amenidad <span className="font-semibold text-foreground">{amenity.name}</span> para el <span className="font-semibold text-foreground">{date ? format(date, "dd 'de' MMMM, yyyy", { locale: es }) : ''}</span>.
                        </p>
                        <Button className="mt-6 w-full" onClick={() => handleOpenChange(false)}>Cerrar</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="py-4 flex-1">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                        </div>
                        <SheetFooter>
                             <SheetClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </SheetClose>
                            <Button type="submit" disabled={!date}>Confirmar Reserva</Button>
                        </SheetFooter>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default function ReservasPage() {
    const [amenityList, setAmenityList] = React.useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

     React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setAmenityList(mockAmenities);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold tracking-tight">Reservar Amenidades</h1>
            
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="overflow-hidden flex flex-col">
                            <Skeleton className="h-48 w-full" />
                            <div className="p-6 flex flex-col flex-1">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full mt-4" />
                                <Skeleton className="h-4 w-5/6 mt-2" />
                            </div>
                            <CardFooter>
                               <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : amenityList.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {amenityList.map((amenity: Amenity, i) => (
                        <Card 
                            key={amenity.id} 
                            className="overflow-hidden flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg animate-slide-up-and-fade"
                            style={{animationDelay: `${i * 100}ms`}}
                        >
                            <CardHeader className="p-0">
                                <div className="relative h-48 w-full">
                                    <Image 
                                        src={amenity.image} 
                                        alt={amenity.name} 
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
             ) : (
                <EmptyState
                    icon={CalendarIcon}
                    title="No hay amenidades disponibles"
                    description="Contacta a la administración para más información."
                />
            )}
        </main>
    );
}
