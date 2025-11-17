
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { announcements } from "@/lib/mocks";
import type { Announcement } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bell, Calendar, Tag } from "lucide-react";
import React from "react";
import { EmptyState } from "@/components/app/empty-state";

const categoryMap: Record<Announcement['category'], { label: string; className: string }> = {
    admin: { label: "Administración", className: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300" },
    security: { label: "Seguridad", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" },
    maintenance: { label: "Mantenimiento", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" },
    event: { label: "Evento", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" },
};

export default function AvisosPage() {
    const [announcementList, setAnnouncementList] = React.useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setAnnouncementList(announcements);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Avisos</h1>
            
            {isLoading ? (
                 <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="animate-pulse">
                                    <div className="h-6 w-3/4 rounded bg-muted"></div>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="h-4 w-1/3 rounded bg-muted"></div>
                                        <div className="h-4 w-1/4 rounded bg-muted"></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 w-full rounded bg-muted"></div>
                                    <div className="h-4 w-5/6 rounded bg-muted"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            ) : announcementList.length > 0 ? (
                <div className="space-y-6">
                    {announcementList.map((announcement: Announcement) => {
                        const category = categoryMap[announcement.category];
                        return (
                            <Card key={announcement.id} className={announcement.pinned ? "border-primary" : ""}>
                                <CardHeader>
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <CardTitle>{announcement.title}</CardTitle>
                                        {announcement.pinned && <Badge>Fijado</Badge>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(announcement.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                                        <Badge variant="outline" className={`${category.className} text-xs`}><Tag className="mr-1.5 h-3 w-3" />{category.label}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{announcement.body}</p>
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
        </main>
    )
}
