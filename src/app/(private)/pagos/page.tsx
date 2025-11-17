"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CheckCircle, Clock, Download, Receipt } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { units as mockUnits } from "@/lib/mocks";
import type { Invoice } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchInvoices } from "@/services/mock-api";

const statusMap: Record<
  Invoice["status"],
  { label: string; icon: React.ElementType; className: string }
> = {
  paid: {
    label: "Pagado",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
  pending: {
    label: "Pendiente",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  overdue: {
    label: "Vencido",
    icon: Clock,
    className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
};

type DialogType = "pay" | "detail" | null;
type PaymentMethod = "card" | "spei" | "cash";

const unitLabelMap = mockUnits.reduce<Record<string, string>>((acc, unit) => {
  acc[unit.id] = `${unit.tower}-${unit.number}`;
  return acc;
}, {});

export default function PagosPage() {
  const { toast } = useToast();
  const [invoiceList, setInvoiceList] = React.useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [unitFilter, setUnitFilter] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dialogType, setDialogType] = React.useState<DialogType>(null);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        const loadInvoices = async () => {
            setIsLoading(true);
            const data = await fetchInvoices();
            if (isMounted) {
                setInvoiceList(data);
                setIsLoading(false);
            }
        };
        loadInvoices();
        return () => {
            isMounted = false;
        };
    }, []);

  const dueInvoices = invoiceList.filter((i) => i.status === "pending" || i.status === "overdue");
  const paidInvoices = invoiceList.filter((i) => i.status === "paid");
  const totalPending = dueInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const lastPayment =
    paidInvoices.length > 0
      ? [...paidInvoices].sort(
          (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        )[0]
      : null;

  const filterFn = (invoice: Invoice) => {
    const matchesUnit = unitFilter === "all" || invoice.unitId === unitFilter;
    const matchesSearch = invoice.concept.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUnit && matchesSearch;
  };

  const filteredDueInvoices = dueInvoices.filter(filterFn);
  const filteredPaidInvoices = paidInvoices.filter(filterFn);

  const unitOptions = React.useMemo(
    () => mockUnits.map((unit) => ({ value: unit.id, label: `${unit.tower}-${unit.number}` })),
    []
  );

  const openPaymentDialog = (invoice?: Invoice) => {
    const target = invoice ?? filteredDueInvoices[0] ?? null;
    if (!target) {
      toast({
        title: "No hay adeudos",
        description: "No encontramos facturas pendientes por pagar.",
      });
      return;
    }
    setSelectedInvoice(target);
    setDialogType("pay");
  };

  const openDetailDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogType("detail");
  };

  const handleConfirmPayment = (method: PaymentMethod) => {
    if (!selectedInvoice) return;
    setInvoiceList((prev) =>
      prev.map((invoice) =>
        invoice.id === selectedInvoice.id ? { ...invoice, status: "paid" } : invoice
      )
    );
    toast({
      title: "Pago registrado",
      description: `Procesamos ${selectedInvoice.concept} con ${method === "spei" ? "SPEI" : method === "cash" ? "pago en conserjería" : "tarjeta"}.`,
    });
    setDialogType(null);
  };

  const downloadStatement = () => {
    toast({
      title: "Descarga en progreso",
      description: "Te enviaremos el estado de cuenta a tu correo.",
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Pagos"
        description="Consulta tus adeudos y el historial de movimientos."
        actions={
          <>
            <Button variant="ghost" className="gap-2" onClick={downloadStatement}>
              <Download className="h-4 w-4" />
              Descargar estado
            </Button>
            <Button onClick={() => openPaymentDialog()} disabled={filteredDueInvoices.length === 0}>
              Registrar pago
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Adeudo total"
          description="Incluye cuotas y extras"
          value={!isLoading ? `$${totalPending.toLocaleString("es-MX")}` : undefined}
          trendLabel={filteredDueInvoices.length > 0 ? `${filteredDueInvoices.length} factura(s)` : "Sin adeudos"}
          icon={Clock}
          isLoading={isLoading}
        />
        <StatCard
          title="Pagado este año"
          description="Acumulado de comprobantes"
          value={!isLoading ? `$${paidAmount.toLocaleString("es-MX")}` : undefined}
          trendLabel={`${paidInvoices.length} recibo(s)`}
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Último pago"
          description="Fecha confirmada"
          value={!isLoading && lastPayment ? format(new Date(lastPayment.dueDate), "dd MMM", { locale: es }) : undefined}
          trendLabel={lastPayment ? lastPayment.concept : "No registrado"}
          icon={Receipt}
          isLoading={isLoading}
        />
      </div>

      <Card className="border-dashed">
        <CardHeader className="space-y-3">
          <CardTitle>Filtros rápidos</CardTitle>
          <CardDescription>Ajusta la información según la unidad o concepto.</CardDescription>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex w-full flex-col gap-2 md:max-w-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Unidad</span>
              <Select value={unitFilter} onValueChange={setUnitFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full flex-col gap-2 md:max-w-sm">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Buscar</span>
              <Input
                placeholder="Ej. mantenimiento noviembre"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="due">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="due">Adeudos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="due">
          <Card>
            <CardHeader>
              <CardTitle>Adeudos pendientes</CardTitle>
              <CardDescription>Paga tus cuotas y evita recargos.</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTable
                invoices={filteredDueInvoices}
                isLoading={isLoading}
                onPay={openPaymentDialog}
                onView={openDetailDialog}
              />
              {!isLoading && filteredDueInvoices.length === 0 && (
                <p className="p-8 text-center text-muted-foreground">
                  ¡Felicidades! No tienes adeudos pendientes.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de pagos</CardTitle>
              <CardDescription>Recibos registrados anteriormente.</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceTable
                invoices={filteredPaidInvoices}
                isLoading={isLoading}
                onPay={openPaymentDialog}
                onView={openDetailDialog}
              />
              {!isLoading && filteredPaidInvoices.length === 0 && (
                <p className="p-8 text-center text-muted-foreground">Aún no registras pagos.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InvoicePaymentDialog
        open={dialogType === "pay"}
        onOpenChange={(open) => setDialogType(open ? "pay" : null)}
        invoice={selectedInvoice}
        onConfirm={handleConfirmPayment}
      />
      <InvoiceDetailDialog
        open={dialogType === "detail"}
        onOpenChange={(open) => setDialogType(open ? "detail" : null)}
        invoice={selectedInvoice}
      />
    </main>
  );
}

function InvoiceTable({
  invoices,
  isLoading,
  onPay,
  onView,
}: {
  invoices: Invoice[];
  isLoading: boolean;
  onPay: (invoice?: Invoice) => void;
  onView: (invoice: Invoice) => void;
}) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concepto</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-5 w-16" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (invoices.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Concepto</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => {
          const status = statusMap[invoice.status];
          return (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.concept}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {unitLabelMap[invoice.unitId] ?? invoice.unitId}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={status.className}>
                  <status.icon className="mr-2 h-3 w-3" />
                  {status.label}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(invoice.dueDate), "dd MMM, yyyy", { locale: es })}</TableCell>
              <TableCell className="text-right">${invoice.amount.toLocaleString("es-MX")}</TableCell>
              <TableCell>
                <div className="flex flex-wrap justify-end gap-2">
                  {(invoice.status === "pending" || invoice.status === "overdue") && (
                    <Button variant="ghost" size="sm" onClick={() => onPay(invoice)}>
                      Pagar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="link" size="sm" onClick={() => onView(invoice)}>
                    Detalle
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function InvoicePaymentDialog({
  open,
  onOpenChange,
  invoice,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onConfirm: (method: PaymentMethod) => void;
}) {
  const [method, setMethod] = React.useState<PaymentMethod>("card");

  React.useEffect(() => {
    if (!open) {
      setMethod("card");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar pago</DialogTitle>
          <DialogDescription>Selecciona el método para registrar tu pago.</DialogDescription>
        </DialogHeader>
        {invoice ? (
          <>
            <div className="rounded-lg border p-4 text-sm">
              <p className="text-muted-foreground">Concepto</p>
              <p className="font-semibold">{invoice.concept}</p>
              <p className="text-muted-foreground">
                Vence el {format(new Date(invoice.dueDate), "dd MMM yyyy", { locale: es })}
              </p>
              <p className="mt-3 text-2xl font-bold">${invoice.amount.toLocaleString("es-MX")}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Método de pago</span>
              <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Tarjeta (débito/crédito)</SelectItem>
                  <SelectItem value="spei">Transferencia SPEI</SelectItem>
                  <SelectItem value="cash">Pago en conserjería</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={() => onConfirm(method)}>
                Registrar pago
              </Button>
            </DialogFooter>
          </>
        ) : (
          <p className="py-6 text-center text-muted-foreground">Selecciona primero una factura.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InvoiceDetailDialog({
  open,
  onOpenChange,
  invoice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle de factura</DialogTitle>
          <DialogDescription>Resumen del movimiento seleccionado.</DialogDescription>
        </DialogHeader>
        {invoice ? (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Concepto</p>
              <p className="text-base font-semibold">{invoice.concept}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Unidad</p>
                <p>{unitLabelMap[invoice.unitId] ?? invoice.unitId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monto</p>
                <p>${invoice.amount.toLocaleString("es-MX")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vencimiento</p>
                <p>{format(new Date(invoice.dueDate), "dd MMM yyyy", { locale: es })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <Badge variant="outline" className={statusMap[invoice.status].className}>
                  {statusMap[invoice.status].label}
                </Badge>
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground">
              Este es un demo; la descarga de CFDI y comprobantes estará disponible al conectar tu banco.
            </div>
            <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        ) : (
          <p className="py-6 text-center text-muted-foreground">Selecciona una factura de la lista.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
