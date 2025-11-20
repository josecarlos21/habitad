
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockAmenities } from '@/lib/mocks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Amenity } from '@/lib/types';


export default function ReservasPageContent() {
    return (
        <div className="pt-4 animate-fade-in">
             <p className="text-muted-foreground mb-4">Reserva los espacios comunes para tus eventos y actividades.</p>
             
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockAmenities.map((amenity: Amenity, i) => (
                    <Card key={amenity.id} className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-soft animate-slide-up-and-fade" style={{animationDelay: `${i * 100}ms`}}>
                        <div className="relative h-48 w-full">
                           <Image 
                             src={amenity.image}
                             alt={amenity.name}
                             fill
                             style={{ objectFit: 'cover' }}
                           />
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
        </div>
    );
}
