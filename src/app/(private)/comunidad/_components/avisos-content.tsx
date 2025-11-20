
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnnouncements } from "@/lib/mocks";
import type { Announcement } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bell, Calendar, Tag } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const categoryMap: Record<Announcement['category'], { label: string; variant: "info" | "warning" | "destructive" | "success" }> = {
    admin: { label: "Administración", variant: "info" },
    security: { label: "Seguridad", variant: "warning" },
    maintenance: { label: "Mantenimiento", variant: "destructive" },
    event: { label: "Evento", variant: "success" },
};

export default function AvisosPageContent() {
    const [announcementList, setAnnouncementList] = React.useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setAnnouncementList(mockAnnouncements);
            setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="pt-4 animate-fade-in">
             {isLoading ? (
                 <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 rounded-md" />
                                <div className="mt-4 flex items-center gap-4">
                                    <Skeleton className="h-4 w-1/3 rounded-md" />
                                    <Skeleton className="h-4 w-1/4 rounded-md" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full rounded-md" />
                                    <Skeleton className="h-4 w-5/6 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            ) : announcementList.length > 0 ? (
                <div className="space-y-6">
                    {announcementList.map((announcement: Announcement, i) => {
                        const category = categoryMap[announcement.category];
                        return (
                            <Card 
                                key={announcement.id} 
                                className={cn(
                                    "transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-soft animate-slide-up-and-fade",
                                    announcement.pinned && "border-primary/50"
                                )}
                                style={{animationDelay: `${i * 100}ms`}}
                            >
                                <CardHeader>
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                        {announcement.pinned && <Badge>Fijado</Badge>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(announcement.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                                        <Badge variant={category.variant}><Tag className="mr-1.5 h-3 w-3" />{category.label}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-foreground/80 whitespace-pre-wrap">{announcement.body}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Bell}
                    title="Sin avisos por ahora"
                    description="Todo está tranquilo. Vuelve más tarde."
                />
            )}
        </div>
    )
}

    