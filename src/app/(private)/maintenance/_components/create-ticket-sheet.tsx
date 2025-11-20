
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, PlusCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateTicketSheetProps {
  onTicketCreated: (newTicket: any) => Promise<void>;
}

export function CreateTicketSheet({ onTicketCreated }: CreateTicketSheetProps) {
  const [title, setTitle] = React.useState("");
  const [area, setArea] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !area || !description || isLoading) return;

    setIsLoading(true);

    try {
      // Simula la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onTicketCreated({ title, area, description });
      setIsSuccess(true);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el ticket. Inténtalo de nuevo.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Resetear el estado al cerrar
        setTimeout(() => {
            setTitle("");
            setArea("");
            setDescription("");
            setIsLoading(false);
            setIsSuccess(false);
        }, 300);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Reporte
        </Button>
      </SheetTrigger>
      <SheetContent>
        {isSuccess ? (
             <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">¡Ticket Creado!</h3>
                <p className="text-muted-foreground mt-2">
                    Tu reporte ha sido enviado. Recibirás una notificación con las actualizaciones.
                </p>
                <Button className="mt-6 w-full" onClick={() => handleOpenChange(false)}>Cerrar</Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Nuevo Reporte de Mantenimiento</SheetTitle>
                    <SheetDescription>
                        Describe el problema que encontraste. Sé lo más detallado posible.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4 flex-1">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título del Reporte</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Foco quemado en pasillo"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area">Área Afectada</Label>
                        <Select onValueChange={setArea} value={area} required disabled={isLoading}>
                            <SelectTrigger id="area">
                                <SelectValue placeholder="Selecciona un área" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="areas-comunes">Áreas Comunes</SelectItem>
                                <SelectItem value="amenidades">Amenidades</SelectItem>
                                <SelectItem value="accesos">Accesos</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción Detallada</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el problema, ubicación y cualquier otro detalle relevante..."
                            required
                            disabled={isLoading}
                            rows={6}
                        />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline" disabled={isLoading}>Cancelar</Button>
                    </SheetClose>
                    <Button type="submit" disabled={!title || !area || !description || isLoading}>
                        {isLoading && <Spinner size="sm" className="mr-2"/>}
                        {isLoading ? 'Enviando...' : 'Enviar Reporte'}
                    </Button>
                </SheetFooter>
            </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
