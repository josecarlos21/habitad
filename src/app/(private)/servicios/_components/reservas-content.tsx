
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Amenity } from '@/lib/types';
import { useCollection, useFirestore } from '@/firebase';
import { useCondoUser } from '@/hooks/use-condo-user';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/app/empty-state';

function AmenityCardSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardFooter className="mt-auto">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}

export default function ReservasPageContent() {
    const firestore = useFirestore();
    const { user } = useCondoUser();

    const amenitiesQuery = React.useMemo(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `condos/${user.condoId}/amenities`));
    }, [firestore, user]);

    const { data: amenities, isLoading } = useCollection<Amenity>(amenitiesQuery);

    return (
        <div className="pt-4 animate-fade-in">
             <p className="text-muted-foreground mb-4">Reserva los espacios comunes para tus eventos y actividades.</p>
             
             {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => <AmenityCardSkeleton key={i} />)}
                </div>
             ) : amenities && amenities.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {amenities.map((amenity, i) => (
                        <Card key={amenity.id} className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-soft animate-slide-up-and-fade" style={{animationDelay: `${i * 100}ms`}}>
                            <div className="relative h-48 w-full bg-muted">
                                {amenity.image ? (
                                    <Image 
                                        src={amenity.image}
                                        alt={amenity.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <ImageOff className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {amenity.requiresApproval && (
                                    <Badge variant="warning" className="absolute top-3 right-3">Requiere Aprobación</Badge>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle>{amenity.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{amenity.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto">
                                <Button asChild className="w-full">
                                    <Link href="#">
                                        Ver Disponibilidad
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             ) : (
                <EmptyState 
                    icon={Building}
                    title="No hay amenidades"
                    description="La administración no ha registrado áreas comunes para reservar."
                />
             )}
        </div>
    );
}
