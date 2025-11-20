
"use client";

import { useCondoUser } from "@/hooks/use-condo-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileCard() {
    const { user, isLoading } = useCondoUser();

    if (isLoading || !user) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Estos son tus datos como residente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-5 w-64" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Estos son tus datos como residente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.imageUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                            <Camera className="h-4 w-4"/>
                            <span className="sr-only">Cambiar foto</span>
                        </Button>
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                            Unidades: {user.units.map(u => u.code).join(', ')}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
