"use client";

import Image from "next/image";
import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Amenity, Booking } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAmenities, fetchBookings } from "@/services/mock-api";

function BookAmenitySheet({ amenity }: { amenity: Amenity }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Reserva confirmada",
      description: `Apartamos ${amenity.name} para ti.`,
    });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Reservar
        </Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Reservar: {amenity.name}</SheetTitle>
            <SheetDescription>Selecciona una fecha y horario para tu reserva.</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
            />
            <Select defaultValue="10:00">
              <SelectTrigger>
                <SelectValue placeholder="Horario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10:00">10:00 - 12:00</SelectItem>
                <SelectItem value="12:00">12:00 - 14:00</SelectItem>
                <SelectItem value="16:00">16:00 - 18:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={!date}>
              Confirmar reserva
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

type DepositFilter = "all" | "deposit" | "nodeposit";

export default function ReservasPage() {
  const [amenityList, setAmenityList] = React.useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [depositFilter, setDepositFilter] = React.useState<DepositFilter>("all");

  React.useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const [amenitiesData] = await Promise.all([fetchAmenities()]);
      if (isMounted) {
        setAmenityList(amenitiesData);
        setIsLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const isDepositFilter = (value: string): value is DepositFilter =>
    value === "all" || value === "deposit" || value === "nodeposit";

  const handleDepositFilterChange = (value: string) => {
    if (isDepositFilter(value)) {
      setDepositFilter(value);
    }
  };

  const filteredAmenities = React.useMemo(() => {
    return amenityList.filter((amenity) => {
      const matchesText = amenity.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDeposit =
        depositFilter === "all"
          ? true
          : depositFilter === "deposit"
            ? amenity.requiresDeposit
            : !amenity.requiresDeposit;
      return matchesText && matchesDeposit;
    });
  }, [amenityList, searchTerm, depositFilter]);

  const [bookingList, setBookingList] = React.useState<Booking[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    const loadBookings = async () => {
      const data = await fetchBookings();
      if (isMounted) {
        setBookingList(data);
      }
    };
    loadBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingBookings: Booking[] = React.useMemo(() => bookingList.slice(0, 3), [bookingList]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Amenidades"
        description="Reserva espacios comunes y revisa tus próximas actividades."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Amenidades disponibles"
          description="Con reserva activa"
          value={!isLoading ? amenityList.length : undefined}
          icon={CalendarIcon}
          isLoading={isLoading}
        />
        <StatCard
          title="Con depósito"
          description="Requieren garantía"
          value={!isLoading ? amenityList.filter((a) => a.requiresDeposit).length : undefined}
          icon={CalendarIcon}
          isLoading={isLoading}
        />
        <StatCard
          title="Próximas reservas"
          description="Tus eventos"
          value={upcomingBookings.length}
          icon={CalendarIcon}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Busca una amenidad</CardTitle>
          <CardDescription>Filtra por nombre o tipo de garantía.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Ej. salón, alberca"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select value={depositFilter} onValueChange={handleDepositFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="deposit">Requieren depósito</SelectItem>
              <SelectItem value="nodeposit">Sin depósito</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="flex flex-1 flex-col p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredAmenities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAmenities.map((amenity: Amenity) => (
            <Card key={amenity.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={amenity.image}
                    alt={amenity.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </CardHeader>
              <div className="flex flex-1 flex-col p-6">
                <CardTitle>{amenity.name}</CardTitle>
                <CardDescription className="mt-2 flex-1">{amenity.description}</CardDescription>
                {amenity.requiresDeposit && (
                  <p className="mt-3 text-sm text-primary font-semibold">
                    Depósito: ${amenity.depositAmount}
                  </p>
                )}
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
          description="Ajusta el filtro o contacta a la administración."
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Próximas reservas</CardTitle>
          <CardDescription>Consulta tus eventos confirmados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">
                    {amenityList.find((a) => a.id === booking.amenityId)?.name ?? "Amenidad"}
                  </p>
                  <p className="text-muted-foreground">
                    {format(new Date(booking.slot.start), "dd MMM yyyy, HH:mm", { locale: es })}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Ver detalles
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Aún no tienes reservas programadas.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
