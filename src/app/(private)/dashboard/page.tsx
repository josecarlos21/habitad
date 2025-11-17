import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Calendar, Package, QrCode, Wrench } from "lucide-react";
import { announcements, bookings, invoices, tickets, amenities } from "@/lib/mocks";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardPage() {
  const nextPayment = invoices.find(inv => inv.status === 'pending' || inv.status === 'overdue');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nextPayment && (
          <Card className="lg:col-span-2 bg-gradient-to-tr from-primary/90 to-primary text-primary-foreground shadow-lg">
            <CardHeader>
              <CardTitle>Tu Próximo Pago</CardTitle>
              <CardDescription className="text-primary-foreground/80">{nextPayment.concept}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${nextPayment.amount.toLocaleString('es-MX')}</p>
              <p className="text-sm">Vence el {format(new Date(nextPayment.dueDate), "dd 'de' MMMM", { locale: es })}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary">
                <Link href="/pagos">Pagar Ahora <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card className="flex flex-col justify-center items-center text-center">
            <CardHeader>
                <CardTitle>Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
                <QrCode className="w-24 h-24 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Muestra este QR en la entrada</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline">Generar Pase de Visita</Button>
            </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos Recientes</CardTitle>
            <Link href="/avisos" className="text-sm text-primary hover:underline">Ver todos</Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {announcements.slice(0, 3).map(ann => (
                <li key={ann.id}>
                    <p className="font-semibold text-sm">{ann.title}</p>
                    <p className="text-xs text-muted-foreground">{ann.body.substring(0, 70)}...</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets de Mantenimiento</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <ul className="space-y-2">
              {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').slice(0, 3).map(ticket => (
                 <li key={ticket.id} className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground">Abierto {formatDistanceToNow(new Date(ticket.createdAt), { locale: es, addSuffix: true })}</p>
                    </div>
                    <Badge variant={ticket.status === 'open' ? "destructive" : "secondary"}>{ticket.status === 'open' ? 'Abierto' : 'En Progreso'}</Badge>
                 </li>
              ))}
             </ul>
             {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tienes tickets activos.</p>
             )}
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" className="w-full">Crear Nuevo Ticket</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
                {bookings.slice(0, 2).map(booking => (
                    <li key={booking.id} className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{amenities.find(a => a.id === booking.amenityId)?.name}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(booking.slot.start), "eeee dd 'de' MMMM, h:mm a", { locale: es })}</p>
                        </div>
                    </li>
                ))}
            </ul>
             {bookings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tienes próximas reservas.</p>
             )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
