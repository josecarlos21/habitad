
"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Megaphone } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Announcement } from "@/lib/types";
import { useCollection, useFirestore } from "@/firebase";
import { useCondoUser } from "@/hooks/use-condo-user";
import { collection, query, orderBy } from "firebase/firestore";

export function AvisosContent() {
    const firestore = useFirestore();
    const { user } = useCondoUser();

    const announcementsQuery = React.useMemo(() => {
        if (!firestore || !user) return null;
        return query(
          collection(firestore, `condos/${user.condoId}/announcements`),
          orderBy("createdAt", "desc")
        );
    }, [firestore, user]);

    const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

    return (
        <div className="pt-4 animate-fade-in">
            <p className="text-muted-foreground mb-4">Mantente informado de las últimas noticias y comunicados.</p>

            {isLoading ? (
                 <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                 </div>
            ) : announcements && announcements.length > 0 ? (
                <div className="space-y-4">
                    {announcements.map((announcement, i) => (
                        <Card 
                            key={announcement.id}
                            className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-soft animate-slide-up-and-fade hover:border-primary/20"
                            style={{animationDelay: `${i * 100}ms`}}
                        >
                            <CardHeader>
                                {announcement.pinned && <Badge className="absolute top-0 right-4 -translate-y-1/2">Importante</Badge>}
                                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                <CardDescription>
                                    Publicado {formatDistanceToNow(new Date(announcement.createdAt), { locale: es, addSuffix: true })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{announcement.body}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Megaphone}
                    title="Sin Avisos"
                    description="No hay avisos publicados por la administración."
                />
            )}
        </div>
    );
}
