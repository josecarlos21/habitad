"use client";

import { mockAnnouncements } from "@/lib/mocks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Megaphone, Pin } from "lucide-react";

export function AvisosContent() {

    const sortedAnnouncements = [...mockAnnouncements].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="space-y-4">
            {sortedAnnouncements.length > 0 ? (
                sortedAnnouncements.map(announcement => (
                    <Card key={announcement.id} className={cn("overflow-hidden", announcement.pinned && "border-primary/50 bg-primary/5")}>
                        <CardHeader className="pb-4">
                             <div className="flex items-start justify-between">
                                <Badge variant="secondary" className="capitalize w-fit">
                                    <Megaphone className="w-3 h-3 mr-1.5"/>
                                    {announcement.category}
                                </Badge>
                                {announcement.pinned && (
                                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                                        <Pin className="w-3.5 h-3.5"/>
                                        <span>Fijado</span>
                                    </div>
                                )}
                            </div>
                            <CardTitle className="!mt-2">{announcement.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-3">
                                {announcement.body}
                            </p>
                        </CardContent>
                        <CardFooter>
                             <p className="text-xs text-muted-foreground">
                                Publicado el {new Date(announcement.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <div className="text-center py-12">
                     <p className="text-muted-foreground">No hay avisos para mostrar.</p>
                </div>
            )}
        </div>
    );
}
