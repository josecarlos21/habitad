"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bell, Calendar, Tag } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Announcement } from "@/lib/types";
import { EmptyState } from "@/components/app/empty-state";
import { fetchAnnouncements } from "@/services/mock-api";

const categoryMap: Record<
  Announcement["category"],
  { label: string; className: string }
> = {
  admin: {
    label: "Administración",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  },
  security: {
    label: "Seguridad",
    className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
  maintenance: {
    label: "Mantenimiento",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  event: {
    label: "Evento",
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
};

export default function AvisosPage() {
  const [announcementList, setAnnouncementList] = React.useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | Announcement["category"]>("all");
  const [searchTerm, setSearchTerm] = React.useState("");

  const isAnnouncementCategory = (value: string): value is Announcement["category"] => {
    return value === "admin" || value === "security" || value === "maintenance" || value === "event";
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setCategoryFilter("all");
      return;
    }
    if (isAnnouncementCategory(value)) {
      setCategoryFilter(value);
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    const loadAnnouncements = async () => {
      setIsLoading(true);
      const data = await fetchAnnouncements();
      if (isMounted) {
        setAnnouncementList(data);
        setIsLoading(false);
      }
    };
    loadAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  const pinned = announcementList.filter((announcement) => announcement.pinned);

  const filteredAnnouncements = React.useMemo(() => {
    return announcementList.filter((announcement) => {
      const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.body.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [announcementList, categoryFilter, searchTerm]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader title="Avisos" description="Mantente al día con las comunicaciones de tu condominio." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Avisos totales"
          description="Última semana"
          value={!isLoading ? announcementList.length : undefined}
          icon={Bell}
          isLoading={isLoading}
        />
        <StatCard
          title="Fijados"
          description="Información prioritaria"
          value={pinned.length}
          icon={Bell}
        />
        <StatCard
          title="Eventos"
          description="Actividades comunitarias"
          value={!isLoading ? announcementList.filter((a) => a.category === "event").length : undefined}
          icon={Calendar}
          isLoading={isLoading}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Filtrar avisos</CardTitle>
          <CardDescription>Busca por categoría o palabras clave.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(categoryMap).map(([key, category]) => (
                <SelectItem key={key} value={key}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Buscar por título o contenido"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 w-3/4 rounded bg-muted" />
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-4 w-1/3 rounded bg-muted" />
                    <div className="h-4 w-1/4 rounded bg-muted" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-5/6 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="space-y-6">
          {pinned.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Fijados</h2>
              <div className="mt-3 space-y-4">
                {pinned.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            </div>
          )}
          <div className="space-y-4">
            {filteredAnnouncements
              .filter((announcement) => !announcement.pinned)
              .map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={Bell} title="Sin avisos" description="No hay comunicaciones con los filtros aplicados." />
      )}
    </main>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const category = categoryMap[announcement.category];
  return (
    <Card className={announcement.pinned ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle>{announcement.title}</CardTitle>
          {announcement.pinned && <Badge>Fijado</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> {format(new Date(announcement.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
          </span>
          <Badge variant="outline" className={`${category.className} text-xs`}>
            <Tag className="mr-1.5 h-3 w-3" />
            {category.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{announcement.body}</p>
      </CardContent>
    </Card>
  );
}
