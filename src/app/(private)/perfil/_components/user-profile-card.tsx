"use client";

import { mockUser } from "@/lib/mocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export function UserProfileCard() {
    const user = mockUser;

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
                            Unidad: {user.units.map(u => `${u.tower}-${u.number}`).join(', ')}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
